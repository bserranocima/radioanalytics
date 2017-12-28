//Require Mongoose
var mongoose = require('mongoose');
var Monitor = require('icecast-monitor');
var moment = require('moment');

//Define a schema
var Schema = mongoose.Schema;
var SourceSchema = {};
var SourceSchema = new Schema({
    mount: String,
    _listeners: Number,
    date: { type: Date, default: Date.now }
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
    var sources_list = [];

    return new Promise((resolve, reject) => {

        monitor.createStatsXmlStream('/admin/listmounts?with_listeners', function (err, xmlStream) {
            if (err) reject(err);

            var xmlParser = new Monitor.XmlStreamParser();

            xmlParser.on('error', function (err) {
                reject(err);
            });

            xmlParser.on('source', function (source) {
                sources_list.push(source);
            });

            // Finish event is being piped from xmlStream 
            xmlParser.on('finish', function () {
                resolve(sources_list);
            });

            if( typeof xmlStream == 'undefined' )
                return reject('No sources get from server');

            xmlStream.pipe(xmlParser);
        });
    });

}

exports.get_source_remote_data = function (params, mount) {
    var monitor = getICInstance(params);

    return new Promise((resolve, reject) => {
        monitor.createStatsXmlStream('/admin/stats?mount=/' + mount, function (err, xmlStream) {
            if (err) reject(err);

            var xmlParser = new Monitor.XmlStreamParser();

            xmlParser.on('error', function (err) {
                console.log('error', err);
                reject(error);
            });

            xmlParser.on('source', function (source) {
                resolve(source);
            });

            if(typeof xmlStream == 'undefined' )
                return reject('XMLStream failed');

            xmlStream.pipe(xmlParser);
        });
    });
}

exports.getLastMinutesListeners = function (mountPoint, minutes, fields) {

    var query = SourceModel.find({
        date: { // 60 minutes ago (from now)
            $gte: new Date(Date.now() - (1000 * 60 * minutes))
        },

        mount: {
            $eq: '/' + mountPoint
        }
    });

    query.select(fields);
    query.limit(3600);

    return new Promise((resolve, reject) => {
        query.exec(function (err, results) {
            if (err) reject(err);

            resolve(results);
        })
    });
}

exports.getDayListeners = function (mountPoint, date, fields) {

    var currentDate = moment(date).startOf('date').toDate();
    var nextDate = moment(date).startOf('date').add(1, 'd').toDate();

    return new Promise((resolve, reject) => {
        SourceModel.aggregate([
            // Match on range
            {
                "$match": {
                    "date": {
                        "$gte": currentDate,
                        "$lt": nextDate
                    },

                    "mount": {
                        "$eq": '/' + mountPoint
                    }
                }
            },
            // Then group on just the rolled up date
            {
                "$project": {
                    "day": { '$dateToString': { 'format': "%Y-%m-%d", 'date': "$date" } },
                    "listeners": "$_listeners"
                }
            },
            {
                "$group": {
                    "_id": '$day',
                    "count": { "$sum": 1 },
                    "listeners": { "$avg": "$listeners" }
                }
            },

        ], function (err, results) {
            if (err) reject(err);

            resolve(results);
        });
    });
}

exports.getWeekListeners = function (mountPoint, fields) {

    var startDate = moment().startOf('week').toDate();
    var endDate = moment().endOf('week').toDate();

    return new Promise((resolve, reject) => {
        SourceModel.aggregate([
            // Match on range
            {
                "$match": {
                    "date": {
                        "$gte": startDate,
                        "$lt": endDate
                    },

                    "mount": {
                        "$eq": '/' + mountPoint
                    }
                }
            },
            {
                "$project": {
                    "day": { '$dateToString': { 'format': "%Y-%m-%d", 'date': "$date" } },
                    "listeners": "$_listeners"
                }
            },
            // Then group on just the rolled up date
            {
                "$group": {
                    "_id": "$day",
                    "count": { "$sum": 1 },
                    "listeners": { "$avg": "$listeners" }
                }
            }
        ], function (err, results) {
            if (err) reject(err);

            resolve(results);
        });
    });
}

exports.getMonthListeners = function (mountPoint, fields) {

    var startDate = moment().startOf('month').toDate();
    var endDate = moment().endOf('month').toDate();

    return new Promise((resolve, reject) => {
        SourceModel.aggregate([
            // Match on range
            {
                "$match": {
                    "date": {
                        "$gte": startDate,
                        "$lt": endDate
                    },

                    "mount": {
                        "$eq": '/' + mountPoint
                    }
                }
            },
            {
                "$project": {
                    "day": { '$dateToString': { 'format': "%Y-%m-%d", 'date': "$date" } },
                    "listeners": "$_listeners"
                }
            },
            // Then group on just the rolled up date
            {
                "$group": {
                    "_id": "$day",
                    "count": { "$sum": 1 },
                    "listeners": { "$avg": "$listeners" }
                }
            }
        ], function (err, results) {
            if (err) reject(err);

            resolve(results);
        });
    });
}


exports.save_source = function (params) {

    var source_instance = new SourceModel({
        mount: params.mount,
        _listeners: params.listeners
    });
    
    source_instance.save(function (err) {
        if (err) console.log(err);
    });
}


exports.SourceModel;