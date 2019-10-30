const {Sequelize, Run, LocationPoint} = require('../Sequelize/models');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const { getPolylineCode } = require('../utilities/runUtils');

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
      console.log('req.body', req.body);
      
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

      const { longitude, latitude, time } = req.body;

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
      lastupdate = lastupdate && new Date(lastupdate);

      let run = await Run.findByPk(run_id);
      
      const locationPoints = await run.getLocationPoints({
        attributes: ["id", "latitude", "longitude", "time"],
        order: [
          ['time', 'ASC'],
        ],
      });

      let responseJSON = {
        changed: false,
      }

      const polyline_updated_at = run.polyline_updated_at;
      const lastLocationPoint = locationPoints[locationPoints.length - 1];      

      if (!run.polyline || !run.polyline_updated_at || polyline_updated_at.getTime() !== lastLocationPoint.time.getTime()){
        // if polyline code in our DB is not up-to-date
        const [polylineCode, updatedAt, startCoordinate, currentCoordinate] = await getPolylineCode(locationPoints);
        

        run.polyline = polylineCode;
        run.polyline_updated_at = updatedAt;
        await run.save();
        
        responseJSON.changed = true;
        responseJSON.polylineCode = polylineCode;
        responseJSON.updatedAt = updatedAt;
        responseJSON.currentCoordinate = currentCoordinate;
        responseJSON.startCoordinate = startCoordinate;
      } else if (!lastupdate || run.polyline_updated_at.getTime() >= lastupdate.getTime()){
        // if our DB is up-to-date, but the client is not
        responseJSON.changed = true;
        responseJSON.polylineCode = run.polyline;
        responseJSON.updatedAt = lastLocationPoint.time;
        responseJSON.startCoordinate = {
          latitude: locationPoints[0].latitude,
          longitude: locationPoints[0].longitude,
        };
        responseJSON.currentCoordinate = {
          latitude: lastLocationPoint.latitude,
          longitude: lastLocationPoint.longitude,
        };
      }

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

}

module.exports = RunController;