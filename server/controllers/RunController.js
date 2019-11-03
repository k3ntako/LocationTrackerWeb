const {Sequelize, Run, LocationPoint, Polyline} = require('../Sequelize/models');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const { getPolylineCode, generatePolylineResponse } = require('../utilities/runUtils');


const getPolylineResponse = async (run, after) => {  
  after = after && new Date(after);

  const locationPoints = await run.getLocationPoints({
    attributes: ["id", "latitude", "longitude", "time"],
    order: [
      ['time', 'ASC'],
    ],
  });

  const polyline_updated_at = run.polyline_updated_at;
  const lastLocationPoint = locationPoints[locationPoints.length - 1];

  const currentCoordinate = {
    latitude: lastLocationPoint.latitude,
    longitude: lastLocationPoint.longitude,
  };

  let polylines = await run.getPolylines();

  if (!polylines|| !polylines.length || !run.polyline_updated_at || polyline_updated_at.getTime() !== lastLocationPoint.time.getTime()) {
    // if polyline code in our DB is not up-to-date
    const [polylineCode, updatedAt, startCoordinate] = await getPolylineCode(locationPoints, run.polyline_updated_at);
    const orderNum = polylines.length ? polylines[polylines.length - 1].order + 1 : 0;

    await Polyline.create({
      run_id: run.id,
      code: polylineCode,
      order: orderNum,
      created_at: updatedAt,
    });

    run.polyline_updated_at = updatedAt;
    run = await run.save();

    polylines = await run.getPolylines().map(polyline => polyline.code);

    return generatePolylineResponse(polylines, updatedAt, currentCoordinate, startCoordinate);
  } else if (!after || run.polyline_updated_at.getTime() >= after.getTime()) {
    // if our DB is up-to-date, but the client is not
    const startCoordinate = {
      latitude: locationPoints[0].latitude,
      longitude: locationPoints[0].longitude,
    };

    polylines = polylines.map(polyline => polyline.code);

    return generatePolylineResponse(polylines, lastLocationPoint.time, currentCoordinate, startCoordinate);
  }else{
    return {
      changed: false,
    }
  }
}

const RunController = {

  async create(req, res, next) {
    try {
      const { name, user_id } = req.body;

      const run = await Run.create({ name, user_id });

      res.json({ run_id: run.id });
      next();
    } catch (err) {
      next(err);
    }
  },

  async start(req, res, next){
    try{
      const { name, latitude, longitude, time, user_id } = req.body;

      // All other runs will be marked as done
      const rowsUpdated = await Run.update({
        done: true,
      }, {
        where: {
          user_id: user_id,
          done: false,
        }
      });

      if (rowsUpdated[0] > 1){
        console.error(`User: ${user_id}: ${rowsUpdated[0]} runs were not finished.`); // In theory, at most only one run should be active at a time.  
      }

      const run = await Run.create({ name, user_id });

      await LocationPoint.create({
        latitude, 
        longitude, 
        time, 
        run_id: run.id,
      });

      res.json({run_id: run.id});
      next();
    } catch (err) {
      next(err);
    }
  },

  async record(req, res, next) {
    try {
      const { run_id } = req.params;
      
      if (!run_id || !uuidRegex.test(run_id)) {
        throw Error('Invalid run ID');
      }

      const run = await Run.findByPk(run_id);

      if (!run) {
        throw Error('No run with provided ID');
      }
      if (run.done) {
        throw new Error('This run is already done');
      }

      const { longitude, latitude } = req.body.location.coords;
      const time = req.body.location.timestamp;


      await LocationPoint.create({
        latitude, longitude, time, run_id,
      });

      res.json({okay: true});
      next();
    } catch (err) {
      next(err);
    }
  },

  async getRunById(req, res, next) {
    try {
      const { run_id } = req.params;
      let { after } = req.query;

      const run = await Run.findByPk(run_id, after);
    
      const responseJSON = await getPolylineResponse(run, after);

      res.json(responseJSON);
      next();
    } catch (err) {
      next(err);
    }
  },


  async finishRun(req, res, next) {
    try {
      const { run_id } = req.params;
      let run = await Run.findByPk(run_id);

      if(run.done){
        throw new Error('This run is already done.')
      }

      run.done = true;
      await run.save();

      res.json({okay: true});
      next();
    } catch (err) {
      next(err);
    }
  },

  async getUserLiveRun(req, res, next) {
    try {
      const { user_id } = req.params;
      let { after } = req.query;      
      
      const runs = await Run.findAll({
        where: {
          user_id: user_id,
          done: false,
        },
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      const run = runs[0];
      if (!run) {
        throw new Error('No live run');
      }

      const responseJSON = await getPolylineResponse(run, after);

      res.json(responseJSON);
      next();
    } catch (err) {
      next(err);
    }
  },

}

module.exports = RunController;