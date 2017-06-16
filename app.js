var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var rooms = require('./routes/rooms');
var liverooms = require('./routes/liverooms');
// var chatrooms = require('./routes/chatrooms');
var intercom = require('./routes/intercom');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(function(req, res, next){
  res.io = io;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/room', rooms);//visited by room/roomId: http://localhost:3000/room/2017001
app.use('/live', liverooms);//visited by room/roomId: http://localhost:3000/live/2017001
// app.use('/chatrooms', chatrooms);//某公司的 http://localhost:3000/a/namespace/rooid
app.use('/a', intercom);//某公司的livechat.com/room/companyId/roomId

app.use(express.static('public'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
module.exports = {app: app, server: server};
