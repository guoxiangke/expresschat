var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/test', function(req, res, next) {
  // res.send('respond with a rooms');
  //http://stackoverflow.com/questions/25463423/res-sendfile-absolute-path
  res.sendFile('chatroom.html', { root: path.join(__dirname, '../public') });

  var io = res.io;
 // Chatroom
  users = [];
  connections = [];
  io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected',connections.length);

    //Disconnect
    socket.on('disconnect',function(data){
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected',connections.length);

      if(!socket.username) return;
      users.splice(users.indexOf(socket.username), 1);
      updateUsernames();
    })

    // when the client emits 'new message', this listens and executes
    socket.on('send message', function (data) {
      // we tell the client to execute 'new message'
      io.sockets.emit('new message', {//socket.broadcast.emit
        username: socket.username,
        message: data
      });
    });

    socket.on('user join', function (data,callback) {
      console.log('new user join');
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    function updateUsernames(){
      // socket.emit('get users',users);//Update only current session!
      io.sockets.emit('users update',users);//update all!
      // socket.broadcast.emit('get users',users);//update except current session!
    }
    //TODO: 用户正在输入！
    // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

    // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });
    });
  });

module.exports = router;
