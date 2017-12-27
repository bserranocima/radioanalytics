var source_model = require('../models/source');
var io = require('../../server');
var moment = require('moment');

var monitors = [
    {
        host: 'i3-1frt1.rcnra.4cloud.co',
        user: 'admin',
        password: 'rcn234'
    },

    {
        host: 'i2-1frt2.rcnra.4cloud.co',
        user: 'admin',
        password: 'rcn234'
    },

    {
        host: 'i2-1frt3.rcnra.4cloud.co',
        user: 'admin',
        password: 'rcn234'
    },

    {
        host: 'i2-1frt4.rcnra.4cloud.co',
        user: 'admin',
        password: 'rcn234'
    }
];


exports.source_get_last_hour_data = function (req, res) {

    var mountPoint = req.params.mount;

    console.log(mountPoint);
    

    source_model.getLastMinutesListeners(mountPoint, 60, 'mount _listeners date').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners from ' + mountPoint,
            status: 500
        });
    });
};

exports.source_get_day_data = function (req, res) {

    g_monitor_model.getDayListeners(req.params.date, '_listeners').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners of day',
            status: 500
        });
    });
};


exports.source_get_week_data = function (req, res) {

    g_monitor_model.getWeekListeners('_listeners date').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners of week',
            status: 500
        });
    });
};

exports.source_get_month_data = function (req, res) {

    g_monitor_model.getMonthListeners('_listeners date').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners of month',
            status: 500
        });
    });
};

exports.source_realtime_data = function (io, mount) {
    var source_data = {
        listeners: 0,
        date: moment()
    };
    
    var promises = [];

    monitors.forEach(monitor => {
        var promise = source_model.get_source_remote_data(monitor, mount).then((data) => {            
            source_data.listeners += data.listeners;
        })
        .catch(err => console.error(err));

        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        // Emit to client
        io.emit('icsource'+ mount, source_data);
    });
}