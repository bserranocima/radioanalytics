var schedule = require('node-schedule');
var source_controller = require('../controllers/sourceController');

module.exports = function (io) {

    io.on('connection', socket => {
        socket.on('icsource', function (mount) {
            var j = schedule.scheduleJob('*/1 * * * * *', function (fireDate) {
                source_controller.source_realtime_data(io, mount);
            });
        
            return j;
        });
    });

}