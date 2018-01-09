const express = require('express');
const router = express.Router();
var user_controller = require('../controllers/userController');
var logs_controller = require('../controllers/logsController');
var monitor_controller = require('../controllers/monitorController');
var source_controller = require('../controllers/sourceController'); 
var passport = global.passport;

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

// Get logs
router.get('/logs/:type', logs_controller.logs_get);

// Collect sources without storing them in a memory
router.get('/monitor/listeners/hour',isAuthenticated, monitor_controller.monitor_get_last_hour_data);
router.get('/monitor/listeners/day/:date',isAuthenticated, monitor_controller.monitor_get_day_data);
router.get('/monitor/listeners/week',isAuthenticated, monitor_controller.monitor_get_week_data);
router.get('/monitor/listeners/month',isAuthenticated, monitor_controller.monitor_get_month_data);


// Collect mount points
router.get('/source/:mount/listeners/hour',isAuthenticated, source_controller.source_get_last_hour_data );
router.get('/source/:mount/listeners/day/:date',isAuthenticated, source_controller.source_get_day_data);
router.get('/source/:mount/listeners/week',isAuthenticated, source_controller.source_get_week_data);
router.get('/source/:mount/listeners/month',isAuthenticated, source_controller.source_get_month_data);


function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.isAuthenticated())
        return next();

    res.status(401).json({message: 'unauthorized'});
}


module.exports = router;