var schedule = require('node-schedule');
var monitor_controller = require('../controllers/monitorController');

module.exports = function(io){
    var j = schedule.scheduleJob('*/1 * * * * *', function (fireDate) {
        //console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
        monitor_controller.monitor_schedule_save_data(io);
        monitor_controller.monitor_broadcast_sources(io);
    });

    return j;
}