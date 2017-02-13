$( document ).ready(function() {
  var pathArray = window.location.pathname.split( '/' );
  var socket = io('/livechat');//tell Socket.IO client to connect to that namespace:
  var roomID = pathArray[2];
  socket.emit('subscribe',{"room" : roomID});
  $(window).on('beforeunload', function(){
    socket.emit('unsubscribe',{"room" : roomID});
    return '确定离开吗？';
  });

  var $messageForm  = $('#messageForm');
  var $message  = $('#message');
  var $chat  = $('#intercom-conversation-parts');

  // var $userForm = $('#userForm');
  // var $chatPage = $('#chatPage');
  // var $loginPage = $('#loginPage');
  // var $username = $('#username');
  var $users = $('#users');

  var username;
  var $typingDiv = $('#typingDiv');
  var typing = false;
  var lastTypingTime;
  var TYPING_TIMER_LENGTH = 400; // ms
  var $window = $(window);
  var $currentInput = $message.focus();
  var $inputMessage = $message;
  var $inputUsername = $username;

  //auto login with username
  if(username){
      setUsername (username);
  }
  // Sets the client's username
  function setUsername (name=false) {
    username = name?name:cleanInput($inputUsername.val().trim());
    // Tell the server your username
    socket.emit('user join', {"username" : username, "room" : roomID} , function(data){
      if(data){
        $loginPage.hide();
        $chatPage.show();
        $currentInput = $inputMessage.focus();
      }
    });
    $inputUsername.val('');
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  //use login page input username
  $userForm.submit(function(e){
    e.preventDefault();
    setUsername ();
  });

  $messageForm.submit(function(e){
    e.preventDefault();
    var new_message = cleanInput($inputMessage.val().trim());
    socket.emit('send message', new_message);
    $inputMessage.val('');
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message',function(data){
    addChatMessage(data);
  });


  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    $chat.append('<div class="well"><strong>'+data.username+':</strong>'+data.message+'</div>');
    // // Don't fade the message in if there is an 'X was typing'
    // var $typingMessages = getTypingMessages(data);
    // options = options || {};
    // if ($typingMessages.length !== 0) {
    //   options.fade = false;
    //   $typingMessages.remove();
    // }

    // var $usernameDiv = $('<span class="username"/>')
    //   .text(data.username)
    //   .css('color', getUsernameColor(data.username));
    // var $messageBodyDiv = $('<span class="messageBody">')
    //   .text(data.message);

    // var typingClass = data.typing ? 'typing' : '';
    // var $messageDiv = $('<li class="message"/>')
    //   .data('username', data.username)
    //   .addClass(typingClass)
    //   .append($usernameDiv, $messageBodyDiv);

    // addMessageElement($messageDiv, options);
  }

  //get all users
  socket.on('users update', function(data){
    console.log('users update');
    var html = '';
    for (var i = data.length - 1; i >= 0; i--) {
      html += '<li class="list-group-item">'+ data[i] +'</li>';
    }
    $users.html(html);
  });


  // Keyboard events begin
  // Updates the typing event
  function updateTyping () {
    console.log(username);
    if (username) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
        console.log('emit typing1');
      }else{
        console.log('stoptyping1');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

 // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = ' is typing';

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .addClass(typingClass).text(data.username+data.message);

    $typingDiv.html($messageDiv);
  }
  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Initialize variables
  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        // setUsername();
      }
    }
  });

  // Keyboard events end
  //TODO: reconnect with cookie name:
  //http://stackoverflow.com/questions/4432271/node-js-and-socket-io-how-to-reconnect-as-soon-as-disconnect-happens

   // Log a message
  function log (message, options) {
    console.log('LOG:'+message);
  }

});
