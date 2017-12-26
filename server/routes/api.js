const express = require('express');
const router = express.Router();
var monitor_controller = require('../controllers/monitorController'); 

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

// Collect sources without storing them in a memory
router.get('/server', monitor_controller.monitor_get_all_data);
router.get('/monitor/listeners/hour', monitor_controller.monitor_get_last_hour_data);
router.get('/monitor/listeners/day/:date', monitor_controller.monitor_get_day_data);
router.get('/monitor/listeners/week', monitor_controller.monitor_get_week_data);
router.get('/monitor/listeners/month', monitor_controller.monitor_get_month_data);

module.exports = router;