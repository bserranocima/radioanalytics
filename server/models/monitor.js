//Require Mongoose
var mongoose = require('mongoose');
var Monitor = require('icecast-monitor');

//Define a schema
var Schema = mongoose.Schema;
var MonitorSchema = {};
var MonitorSchema = new Schema({
    host: String,
    user: String,
    password: String,
    serverId: String,
    _listeners: Number,
    date: { type: Date, default: Date.now }
});

// Compile model from schema
var MonitorModel = mongoose.model('MonitorModel', MonitorSchema);

function getICInstance(params) {
    return new Monitor({
        host: params.host,
        user: params.user,
        password: params.password
    });
}

exports.get_monitor_remote_data = function(params){

    var monitor = getICInstance(params);

    return new Promise((resolve, reject) => {

        monitor.getServerInfo(function (err, server) {
            if (err) reject(err);
            resolve(server);
        });
    });

}


exports.save_listeners_connections = function(params){
    
    var monitor_instance = new MonitorModel({
        host: params.host,
        serverId: params.serverId,
        _listeners: params.listeners
    });

    return new Promise((resolve, reject) => {
        monitor_instance.save(function (err) {
            if (err) reject(err);
            
            resolve(this);
        });
    });
}

exports.getLastMinutesListeners = function(minutes, fields){
    var query = MonitorModel.find({
        date: { // 18 minutes ago (from now)
            $gt: new Date(Date.now() - 1000 * 60 * minutes)
        }
    });

    query.select(fields);
    query.limit(60);

    return new Promise((resolve, reject) => {
        query.exec(function (err, monitors) {
            if (err) reject(err);
            
            resolve(monitors);
        })
    });
}


exports.MonitorModel;