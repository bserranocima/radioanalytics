const express = require('express');
const router = express.Router();
var logs_controller = require('../controllers/logsController');
var monitor_controller = require('../controllers/monitorController');
var source_controller = require('../controllers/sourceController'); 

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

// Get logs
router.get('/logs/:type', logs_controller.logs_get);

// Collect sources without storing them in a memory
router.get('/monitor/listeners/hour', monitor_controller.monitor_get_last_hour_data);
router.get('/monitor/listeners/day/:date', monitor_controller.monitor_get_day_data);
router.get('/monitor/listeners/week', monitor_controller.monitor_get_week_data);
router.get('/monitor/listeners/month', monitor_controller.monitor_get_month_data);


// Collect mount points
router.get('/source/:mount/listeners/hour', source_controller.source_get_last_hour_data );
router.get('/source/:mount/listeners/day/:date', source_controller.source_get_day_data);
router.get('/source/:mount/listeners/week', source_controller.source_get_week_data);
router.get('/source/:mount/listeners/month', source_controller.source_get_month_data);

module.exports = router;