// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  // _id: String,
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },//客服坐席！
  // is_system:{ type: Boolean, default: false },//超级管理员！uid=1;
  location: String,
  meta: {
    avatar: String
  },
  created_at:  { type: Date, default: Date.now },
  last_active_at:  { type: Date, default: Date.now },
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
