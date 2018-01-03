// Firstly we'll need to import the fs library
var fs = require('fs');
var moment = require('moment');

// next we'll want make our Logger object available
// to whatever file references it.
var Logger = exports.Logger = {};


// Create 3 sets of write streams for the 3 levels of logging we wish to do
// every time we get an error we'll append to our error streams, any debug message
// to our debug stream etc...
var infoStream = fs.createWriteStream(__dirname + '/../logs/info.txt');

// Notice we set the path of our log files in the first parameter of 
// fs.createWriteStream. This could easily be pulled in from a config
// file if needed.
var errorStream = fs.createWriteStream(__dirname + '/../logs/error.txt');
// createWriteStream takes in options as a second, optional parameter
// if you wanted to set the file encoding of your output file you could
// do so by setting it like so: ('logs/debug.txt' , { encoding : 'utf-8' });
var debugStream = fs.createWriteStream(__dirname + '/../logs/debug.txt');


// Finally we create 3 different functions
// each of which appends our given messages to 
// their own log files along with the current date as an
// iso string and a \n newline character
Logger.info = function (msg) {
    var message = moment().format('YYYY-MM-DD HH:mm') + " - " + msg + "\n";
    infoStream.write(message);
};

Logger.debug = function (msg) {
    var message = moment().format('YYYY-MM-DD HH:mm') + " - " + msg + "\n";
    debugStream.write(message);
};

Logger.error = function (msg) {
    var message = moment().format('YYYY-MM-DD HH:mm') + " - " + msg + "\n";
    errorStream.write(message);
};

var fs = require("fs"), json;


Logger.read = function (type) {
    return new Promise((resolve, reject) => {
        if(!type)
            return reject('Log type is not defined');
        
        var filepath = __dirname + '/../logs/' + type + '.txt';
        return readLogFileSync(filepath).then(r => resolve(r)).catch(err => reject(err));
    });
}

function readLogFileSync(filepath, encoding) {

    return new Promise((resolve, reject) => {

        if(!fs.existsSync(filepath) )
            return reject("File log doesn't exists");

        if (typeof (encoding) == 'undefined') {
            encoding = 'utf8';
        }
        var file = fs.readFileSync(filepath, encoding);
        return resolve(file);
    });

}