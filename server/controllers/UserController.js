const { User } = require('../Sequelize/models');

const UserController = {

  async create(req, res, next) {
    try {
      const { email, first_name, last_name } = req.body;
      let parsedEmail = email.trim().toLowerCase();

      if (!parsedEmail) {
        throw new Error("Invalid email")
      }

      let parsedFirstName = first_name.trim();
      let parsedLastName = last_name.trim();
      if (!first_name.trim() || !last_name) {
        throw new Error("Invalid name")
      }

      const user = await User.create({
        email: parsedEmail,
        first_name: parsedFirstName,
        last_name: parsedLastName,
      });

      res.json({ user_id: user.id });
      next();
    } catch (err) {
      next(err);
    }
  },

  async getByEmail(req, res, next){
    try{
      const user = await User.findOne({ where: {
        email: req.body.email.trim().toLowerCase() 
      }});

      const userId = user ? user.id : null;

      res.json({user_id: userId});
      next();
    } catch (err) {
      next(err);
    }
  },

}

module.exports = UserController;