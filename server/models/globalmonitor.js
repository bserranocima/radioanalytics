//Require Mongoose
var mongoose = require('mongoose');
var moment = require('moment');

//Define a schema
var Schema = mongoose.Schema;
var GlobalMonitorSchema = {};
var GlobalMonitorSchema = new Schema({
    _listeners: Number,
    date: { type: Date, default: Date.now }
});

// Compile model from schema
var GlobalMonitorModel = mongoose.model('GlobalMonitorModel', GlobalMonitorSchema);



exports.save_listeners_connections = function (params) {

    var g_monitor_instance = new GlobalMonitorModel({
        _listeners: params.listeners
    });

    return new Promise((resolve, reject) => {
        g_monitor_instance.save(function (err) {
            if (err) reject(err);

            resolve(this);
        });
    });
}

exports.getLastMinutesListeners = function (minutes, fields) {
    
    var query = GlobalMonitorModel.find({
        date: { // 60 minutes ago (from now)
            $gte: new Date(Date.now() - (1000 * 60 * minutes))
        }
    });

    query.select(fields);
    query.limit(3600);

    return new Promise((resolve, reject) => {
        query.exec(function (err, counts) {
            if (err) reject(err);

            resolve(counts);
        })
    });
}

exports.getDayListeners = function (date, fields) {
    
    var currentDate = moment(currentDate).startOf('date').toDate();
    var nextDate = moment().startOf('date').add(1, 'd').toDate();

    return new Promise((resolve, reject) => {
        GlobalMonitorModel.aggregate([
            // Match on range
            {
                "$match": {
                    "date": {
                        "$gte": currentDate,
                        "$lt": nextDate
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
    
        ], function(err, results){
            if(err) reject(err);

            resolve(results);
        });
    });
}

exports.getWeekListeners = function (date, fields) {

    var startDate = moment().startOf('week').toDate();
    var endDate = moment().endOf('week').toDate();

    console.log(startDate);
    console.log(endDate);

    return new Promise((resolve, reject) => {
        GlobalMonitorModel.aggregate([
            // Match on range
            {
                "$match": {
                    "date": {
                        "$gte": startDate,
                        "$lt": endDate
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


exports.getMonthListeners = function (date, fields) {

    var startDate = moment().startOf('month').toDate();
    var endDate = moment().endOf('month').toDate();

    console.log(startDate);
    console.log(endDate);

    return new Promise((resolve, reject) => {
        GlobalMonitorModel.aggregate([
            // Match on range
            {
                "$match": {
                    "date": {
                        "$gte": startDate,
                        "$lt": endDate
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


exports.GlobalMonitorModel;