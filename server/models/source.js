//Require Mongoose
var mongoose = require('mongoose');
var Monitor = require('icecast-monitor');

//Define a schema
var Schema = mongoose.Schema;
var SourceSchema = {};
var SourceSchema = new Schema({
    name: String
});

// Compile model from schema
var SourceModel = mongoose.model('SourceModel', SourceSchema);

function getICInstance(params) {
    return new Monitor({
        host: params.host,
        user: params.user,
        password: params.password
    });
}

exports.get_sources_remote_data = function (params) {

    var monitor = getICInstance(params);

    return new Promise((resolve, reject) => {

        monitor.getSources(function (err, sources) {
            if (err) reject(err);

            resolve(sources);
        });
    });

}


exports.save_source = function (params) {

    var monitor_instance = new SourceModel({
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


exports.SourceModel;