var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const { Server } = require("socket.io");

var indexRouter = require('./routes/index');
var shopRouter = require('./routes/shop');

const Participant = require('./models/participant');
const Shop = require('./models/shop');

var app = express();
require('dotenv').config();
//
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/shop', shopRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

/**
 * Module dependencies.
 */


var debug = require('debug')('multiple-participant-shopping:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const io = new Server(server);

app.set('io', io);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

mongoose.connect(process.env.DATABASE_URL);
app.set("admin_code", process.env.ADMIN_ACTION_URL_CODE)
const database = mongoose.connection

database.on('error', (error) => {
	console.log(error)
})

database.once('connected', () => {
	console.log('Database Connected');
})



io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	var joined = false;

	setTimeout(() => {
		if (!joined)
			socket.disconnect(true);

	}, "5000")

	socket.on('join_shop', async (msg) => {
		console.log('user msg sent:' + msg);
		const arr = msg.split('/')
		var shopid = arr[2];
		var pid = arr[3];

		if (!mongoose.isValidObjectId(shopid) || !mongoose.isValidObjectId(pid))
			return socket.disconnect(true);

		var shop = await Shop.findById(shopid).exec();
		if (!shop)
			return socket.disconnect(true);

		var participant = await Participant.findOne({ shop_id: shop._id.toString(), _id: pid })

		if (!participant)
			return socket.disconnect(true);

		socket.join(shopid)
		joined = true;
		console.log('user joined to shop: ' + shopid);
	});
});
