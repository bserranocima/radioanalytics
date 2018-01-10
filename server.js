// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash')
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

/**
 * DATABASE
 */
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/radiodb';
mongoose.connect(mongoDB, {
    useMongoClient: true
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


/**
 * APP EXPRESS
 */

// Initialize app express
const app = express();

// Parsers for POST data
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// use sessions for tracking logins
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', saveUninitialized: false, resave: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Init passport
require('./server/config/passport')(passport); // pass passport for configuration

// Get our API routes
const api = require('./server/routes/api');
require('./server/routes/auth')(app, passport);

// Set our api routes
app.use('/api', api);


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', socket => {
    console.log('Client connected');
});


// Start schedules
var monitor_schedule = require('./server/schedules/monitor')(io);
var source_schedule = require('./server/schedules/source')(io);
app.set('socketio', io);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));