const {Sequelize, Run, LocationPoint} = require('../Sequelize/models');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const { getPolylineCode, generatePolylineResponse } = require('../utilities/runUtils');


const getPolylineResponse = async (run, lastupdate) =>{  
  lastupdate = lastupdate && new Date(lastupdate);

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

  if (!run.polyline || !run.polyline_updated_at || polyline_updated_at.getTime() !== lastLocationPoint.time.getTime()) {
    console.log('Update polyline');
    // if polyline code in our DB is not up-to-date
    const [polylineCode, updatedAt, startCoordinate] = await getPolylineCode(locationPoints);

    run.polyline = polylineCode;
    run.polyline_updated_at = updatedAt;
    await run.save();

    return generatePolylineResponse(polylineCode, updatedAt, currentCoordinate, startCoordinate);
  } else if (!lastupdate || run.polyline_updated_at.getTime() >= lastupdate.getTime()) {
    console.log('Use saved polyline');
    // if our DB is up-to-date, but the client is not
    const startCoordinate = {
      latitude: locationPoints[0].latitude,
      longitude: locationPoints[0].longitude,
    };

    return generatePolylineResponse(run.polyline, lastLocationPoint.time, currentCoordinate, startCoordinate);
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

      console.log('-- Params --')
      console.log('longitude', longitude, 'latitude', latitude, 'time', time);
      console.log('----')
      

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
      let { lastupdate } = req.query;

      const run = await Run.findByPk(run_id, lastupdate);
    
      const responseJSON = await getPolylineResponse(run, lastupdate);

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
      let { lastupdate } = req.query;      
      
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

      const responseJSON = await getPolylineResponse(run, lastupdate);

      res.json(responseJSON);
      next();
    } catch (err) {
      next(err);
    }
  },

}

module.exports = RunController;