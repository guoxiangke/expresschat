// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
  // _id: Number, //messageID
  room_id: String, //room_id:58a418b161ee8c5c19e93715
  user_id: String, //UserID:58a418b161ee8c5c19e93715
  is_admin: { type: Boolean, default: false }, //是否是管理员发送的消息？
  content: String,
  created_at:  { type: Date, default: Date.now }
  //see_by NOt seen yet?!
});

// the schema is useless so far
// we need to create a model using it
var Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;
