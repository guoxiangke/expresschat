// getting-started.js
var mongoose = require('mongoose');
console.log(process.env);
mongoose.connect('mongodb://'+process.env.MONGODB_USERNAME+':'+process.env.MONGODB_PASSWORD+'@'+process.env.MONGODB_PORT_27017_TCP_ADDR+':'+process.env.MONGODB_PORT_27017_TCP_PORT+'/'+process.env.MONGODB_INSTANCE_NAME);

var db = mongoose.connection;

module.exports = db;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('we\'re connected!');


//   var kittySchema = mongoose.Schema({
//     name: String
//   });
//   var Kitten = mongoose.model('Kitten', kittySchema);

//   var silence = new Kitten({ name: 'Silence' });
//   console.log(silence.name); // 'Silence'


//   // NOTE: methods must be added to the schema before compiling it with mongoose.model()
//   kittySchema.methods.speak = function () {
//     var greeting = this.name
//       ? "Meow name is " + this.name
//       : "I don't have a name";
//     console.log(greeting);
//   }


//   var fluffy = new Kitten({ name: 'fluffy' });
//   fluffy.speak(); // "Meow name is fluffy"

//   fluffy.save(function (err, fluffy) {
//     if (err) return console.error(err);
//     fluffy.speak();
//   });

// });
