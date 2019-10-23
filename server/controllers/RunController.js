const {Run, LocationPoint} = require('../Sequelize/models');

const RunController = {

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
      const { longitude, latitude, time, run_id } = req.body;

      const locationPoint = await LocationPoint.create({
        latitude, longitude, time, run_id,
      });

      let run = await locationPoint.getRun();

      res.json({okay: true});
      next();
    } catch (err) {
      next(err);
    }
  },

}

module.exports = RunController;