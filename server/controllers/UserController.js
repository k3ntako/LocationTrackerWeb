const crypto = require('crypto');
const { sequelize, User, UserAuth } = require('../Sequelize/models');

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10, 64, 'sha512').toString('hex');
}

const UserController = {

  async signup(req, res, next) {
    try {
      const { email, first_name, last_name, password } = req.body;
      let parsedEmail = email.trim().toLowerCase();

      if (!parsedEmail) {
        throw new Error("Invalid email")
      }

      let parsedFirstName = first_name.trim();
      let parsedLastName = last_name.trim();
      if (!first_name.trim() || !last_name) {
        throw new Error("Invalid name")
      }

      if(!password){
        throw new Error("No password provided");
      }

      const existingUser = await User.findOne({
        where: {email: parsedEmail},
      });      

      if (existingUser) {
        throw new Error(`User with email, ${parsedEmail}, already exists`);
      }

      const salt = crypto.randomBytes(256).toString('hex').slice(0, 255);
      const passhash = hashPassword(password, salt);

      let user;
      await sequelize.transaction(t => {
        return User.create({
          email: parsedEmail,
          first_name: parsedFirstName,
          last_name: parsedLastName,
        }, { transaction: t }).then(newUser => {
          user = newUser;
          return UserAuth.create({
            passhash: passhash,
            salt: salt,
            user,
          }, { transaction: t });
        });
      }).catch(err => {
        user = null;
        throw new Error(err);
      });

      if (!user) {
        throw new Error(`User was not created`);
      }

      res.json({ user: user.toPublicJSON() });
      next();
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let parsedEmail = email.trim().toLowerCase();

      if (!parsedEmail) {
        throw new Error("Invalid email")
      }

      const user = await User.findOne({ 
        where: { email: parsedEmail },
        include: [{
          model: UserAuth,
          as: "auth",
        }],
      });

      if (!user) {
        throw new Error("Email does not match a user on this account"); //TODO: is this a bad idea to let anyone know about account existence?
      }

      const passhash = hashPassword(password, user.auth.salt);
      if(user.auth.passhash !== passhash){
        throw new Error("Email and password do not match"); 
      }

      res.json({ user: user.toPublicJSON() });
      next();
    } catch (err) {
      next(err);
    }
  },

  async getByEmail(req, res, next){
    try{
      const email = req.body.email.trim().toLowerCase();
      const user = await User.findOne({ 
        where: { email },
     });
     
     if (!user) {
       throw new Error(`User with email, ${email}, was not found`); 
     }

      res.json({ user: user.toPublicJSON() });
      next();
    } catch (err) {
      next(err);
    }
  },

}

module.exports = UserController;