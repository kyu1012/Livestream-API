var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lvs-API');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//set schema
var Schema = mognoose.Schema;

var directorSchema = new Schema ({
  full_name: String,
  dob: String,
  favorite_camera: String,
  favorite_movies: Array
});

var Director = mongoose.model("Director", directorSchema);

module.exports = {"Director": Director};
