var express = require('express');
var router = express.Router();
var path = require('path');
var roomID = 'default';


/* GET users listing. */
// 1. https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
// 2. https://segmentfault.com/a/1190000000438604 分组数据传输
// route middleware to validate :name
router.param('id', function(req, res, next, id) {
    // TOdo validation on name here
    // blah blah validation
    // log something so we know its working
    console.log('============a room quest begin!===============>>>');
    // once validation is done save the new item in the req
    req.id = id;
    var roomID = id;
    // go to the next thing
    next();
});

var users = [];//all users in all rooms /:id
var connections = [];//all connections in all rooms
router.get('/:id', function(req, res, next) {
  // res.send('respond with a rooms');
  //http://stackoverflow.com/questions/25463423/res-sendfile-absolute-path
  res.sendFile('intercom.html', { root: path.join(__dirname, '../public') });

  //https://github.com/onedesign/express-socketio-tutorial
  var io = res.io;
  var roomID = req.params.id;
  var namespace = '/livechat';

  // Chatroom
  io.of(namespace).once('connection', function(socket){
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

    //http://stackoverflow.com/questions/33373176/typeerror-io-sockets-clients-is-not-a-function
    // var usersInRoom = io.of(namespace).in(roomID).clients;
    // console.log('usersInRoom');
    // console.log(usersInRoom);
    // console.log('clientsList');
    // var clientsList = io.sockets.adapter.rooms;
    // // var numClients = clientsList.length;
    // console.log(clientsList);
    // console.log('rooms');
    // console.log(io.of(namespace).adapter.rooms);

    // socket.emit('rooms', io.of('/').adapter.rooms);

    // 一个socket是否可以同时存在于几个分组，等效于一个用户会同时在几个聊天室活跃，答案是”可以“，socket.join()添加进去就可以了。官方提供了订阅模式的示例：
    socket.on('subscribe', function(data) {
        socket.join(data.room);
        console.log('subscribe Joined room: %s', data.room);
    })

    socket.on('unsubscribe', function(data) {
        socket.leave(data.room);
        console.log('unsubscribe Left room: %s', data.room);
     })

    // when the client emits 'new message', this listens and executes
    socket.on('send message', function (data) {
      // we tell the client to execute 'new message'
      // io.sockets.emit('new message', {//socket.broadcast.emit
      // io.of(namespace).in(roomID).emit('new message', {//socket.broadcast.emit
      socket.broadcast.to(roomID).emit('new message', {
        username: socket.username,
        message: data
      });
    });

    socket.on('user join', function (data,callback) {
      callback(true);
      socket.username = data.username;
      socket.room = data.room;
      users.push(data);//{"username" : username, "room" : roomID}
      var roomuser =[];
      for(var i=0;i<users.length;i++){
        if(users[i].room == socket.room){
          roomuser.push(users[i].username );
        }
      }
      socket.roomuser = roomuser;
      console.log('new user join room:'+socket.room,roomuser);
      updateUsernames(roomuser);
    });

    function updateUsernames(roomuser){
      // socket.emit('get users',users);//Update only current session! 当前
      // io.sockets.in(roomID).emit('users update',users);//update all!  所有
      io.of(namespace).in(roomID).emit('users update',roomuser);//update all!  所有
      // socket.broadcast.to(roomID).emit('users update',users);//update except current session! 排除当前socket对应的client
      // broadcast方法允许当前socket client不在该分组内。
    }
    //TODO: 用户正在输入！
    // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.to(roomID).emit('typing', {
          username: socket.username
        });
      });

    // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.to(roomID).emit('stop typing', {
          username: socket.username
        });
      });
    });
  });

module.exports = router;
