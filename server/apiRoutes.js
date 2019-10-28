const express = require('express');
let router = express.Router();


const UserController = require('./controllers/UserController');
router.route('/user').get(UserController.getByEmail);
router.route('/user/signup').post(UserController.signup);
router.route('/user/login').post(UserController.login);


const RunController = require('./controllers/RunController');
router.route('/run/:run_id').get(RunController.getRunById);
router.route('/run/start').post(RunController.start);
router.route('/run/:run_id/record').post(RunController.record);
router.route('/run/:run_id/finish').post(RunController.finishRun);


module.exports = router;
