const {Sequelize, Run, LocationPoint} = require('../Sequelize/models');
const Op = Sequelize.Op

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

  async getRunById(req, res, next) {
    try {
      const { run_id } = req.params;
      let where = {};
      if (afterTime || afterTime === 0 ){
        where = {
          time: {
            [Op.gt]: afterTime, //returns points after the specified time
          }
        }
      }
      
      const run = await Run.findByPk(run_id, {
        include: [{ 
          model: LocationPoint, 
          as: "locationPoints",
          attributes: ["id", "latitude", "longitude", "time"],
          where: where,
        }],
      });

      res.json(run.toJSON());
      next();
    } catch (err) {
      next(err);
    }
  },

}

module.exports = RunController;