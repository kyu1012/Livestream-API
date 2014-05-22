var request = require("request");
var models = require("../models");
var async = require("async");

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.users = function(req, res){
  res.render('users');
}

exports.submit_data = function(req, res){
  var dirID = req.body.lvsID; //request livestream ID from form
  var apiURL = "https://api.new.livestream.com/accounts/" + dirID; // livestream API Get URL

  var options = {
    url: apiURL,
    'content-type': 'application/json'
  };
  var reqCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var livestream_id = dirID;
        var full_name = info.full_name;
        var dob = info.dob;
        var favorite_camera = null;
        var favorite_movies = null;

        if(info.favorite_camera){
          favorite_camera = info.favorite_camera;
        };
        if(info.favorite_movies){
          favorite_movies = info.favorite_movies;
        };

        //save information into Director schema
        var dir = new models.Director({
          'livestream_id': livestream_id,
          'full_name': full_name,
          'dob': dob,
          'favorite_camera': favorite_camera,
          'favorite_movies': favorite_movies
        });
        dir.save();
    }
  }

  async.series([
    function(callback){
      request(options, reqCallback);
      callback();
    },
    function(callback){
      models.Director.findOne({"livestream_id": dirID}, function(err, info){
        res.render('users', {"docs": info});
      });
      callback();
    }
    ],
    function(err){
    if (err) return next(err);
  })
}

exports.update_data = function(req, res){
  var movies = req.body.favMovies;
  var camera = req.body.favCamera;
  var dirName = req.body.dirName;

  models.Director.findOneAndUpdate({"full_name": dirName}, {"favorite_camera": camera, "favorite_movies": movies}, function(err, data){
    res.render('users', {"docs": data});
  })
}

exports.list_data = function(req, res){
  models.Director.find({}, function(err, list_data){
    res.render('users', {"dirs": list_data});
  })
}

