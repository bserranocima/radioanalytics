var g_monitor_model = require('../models/globalmonitor');
var monitor_model = require('../models/monitor');
var source_model = require('../models/source');
var io = require('../../server');
var moment = require('moment');
var read_statics = require('../routes/statics');

var monitors = read_statics.get_monitors('../statics/monitors.json');

var sources_list = [];

exports.monitor_get_last_hour_data = function(req, res){

    g_monitor_model.getLastMinutesListeners(60, '_listeners date').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners',
            status: 500
        });
    });
};

exports.monitor_get_day_data = function (req, res) {

    g_monitor_model.getDayListeners(req.params.date, '_listeners').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners of day',
            status: 500
        });
    });
};


exports.monitor_get_week_data = function (req, res) {

    g_monitor_model.getWeekListeners('_listeners date').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners of week',
            status: 500
        });
    });
};

exports.monitor_get_month_data = function (req, res) {

    g_monitor_model.getMonthListeners('_listeners date').then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get the listeners of month',
            status: 500
        });
    });
};

exports.monitor_schedule_save_data = function(io){
    var all_monitors_data = {
        listeners: 0,
        date: moment()
    };
    var promises = [];
    
    monitors.forEach(monitor => {
        var promise = monitor_model.get_monitor_remote_data(monitor).then((data) => {
            
            // Save to database
            return monitor_model.save_listeners_connections({
                host: monitor.host,
                serverId: data.serverId,
                listeners: data.listeners,
                date: moment()
            }).then((r) => {
                all_monitors_data.listeners += data.listeners;
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));

        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        // Emit to client
        g_monitor_model.save_listeners_connections({ listeners: all_monitors_data.listeners, date: Date.now() });
        
        io.emit('icserver', all_monitors_data);
    });
}

exports.monitor_broadcast_sources = function(io){
    let promises = [];

    monitors.forEach(monitor => {
        var promise = source_model.get_sources_remote_data(monitor).then((data) => {
            return merge_source_listeners(data);
        })
        .catch(err => console.error(err));

        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        // Emit to client
        save_sources();
        io.emit('icsources', sources_list);
        sources_list = [];
    });
}

merge_source_listeners = function(remote_sources){
    let promises = [];

    if(remote_sources.length <= 0)
        return;

    // Loop through new resources
    remote_sources.forEach(source => {
        var promise = new Promise((resolve, reject) => {
            let s = sources_list.find(x => x.mount == source.mount);
            if (!s) {
                sources_list.push(source);
                s = source;
            }

            s.listeners += source.listeners;
        });

        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        return;
    });
}

save_sources = function(){
    if (sources_list.length <= 0)
        return;

    sources_list.forEach(source => {
        source_model.save_source({
            mount: source.mount,
            listeners: source.listeners
        });
    });
};