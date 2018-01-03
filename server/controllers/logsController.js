var moment = require('moment');
var logger = require('../facades/logger').Logger;


exports.logs_get = function (req, res) {
    let type = req.params.type;

    logger.read(type).then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({
            message: 'Could not get log file',
            status: 500
        });
    });
    
};