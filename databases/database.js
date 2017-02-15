// getting-started.js
var mongoose = require('mongoose');
var connect_str = 'mongodb://localhost:27017/db';
if(process.env.MONGODB_USERNAME)
  var connect_str = 'mongodb://'+process.env.MONGODB_USERNAME+':'+process.env.MONGODB_PASSWORD+'@'+process.env.MONGODB_PORT_27017_TCP_ADDR+':'+process.env.MONGODB_PORT_27017_TCP_PORT+'/'+process.env.MONGODB_INSTANCE_NAME;

mongoose.connect(connect_str);
var db = mongoose.connection;

var Chatroom = require('./eloquents/models/chatrooms');
var User = require('./eloquents/models/users');
var Message = require('./eloquents/models/messages');
var Log = require('./eloquents/models/logs');

module.exports = {
  db: db,
  mongoose: mongoose,
  Chatroom:Chatroom,
  User:User,
  Message:Message,
  Log:Log
};
