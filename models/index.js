var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lvsAPI');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//set schema
var Schema = mongoose.Schema;

var directorSchema = new Schema ({
  livestream_id: {type: Number, hidden: true},
  full_name: String,
  dob: Date,
  favorite_camera: String,
  favorite_movies: String
});

var Director = mongoose.model("Director", directorSchema);

module.exports = {"Director": Director};
