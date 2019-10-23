const express = require('express');
let router = express.Router();


const UserController = require('./controllers/UserController');
router.route('/user').post(UserController.create);
router.route('/user').get(UserController.getByEmail);


const RunController = require('./controllers/RunController');
router.route('/run/start').post(RunController.start);
router.route('/run/record').post(RunController.record);


module.exports = router;
