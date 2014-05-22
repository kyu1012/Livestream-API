var request = require("request");
var models = require("../models");
var async = require("async");
var mongoose = require('mongoose');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.users = function(req, res){
  res.render('users');
};

exports.submit_data = function(req, res){
  var dirID = req.body.lvsID; //request livestream ID from form
  var apiURL = "https://api.new.livestream.com/accounts/" + dirID; // livestream API Get URL

  //define option parameters and callback function for request call
  var options = {
    url: apiURL,
    'content-type': 'application/json'
  };

  async.waterfall([
    function(callback){
      //run request call to get information from Livestream
      request(options, function(error, response, body){
        if (!error && response.statusCode == 200){
          var info = JSON.parse(body);
          callback(null, body);
        };
      })
    },
    function(body, callback){
      //parse data from previous callback
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

      //set new collection
      var dir = new models.Director({
        'livestream_id': livestream_id,
        'full_name': full_name,
        'dob': dob,
        'favorite_camera': favorite_camera,
        'favorite_movies': favorite_movies
      });

      //only save if account non-existant in database
      models.Director.findOne({"livestream_id": dir.livestream_id}, function(err, info){
        if(!info){
          dir.save();
        }
        callback();
      });
    },
    function(callback){
      //render the page with account info
      models.Director.findOne({"livestream_id": dirID}, function(err, info){
        var dirObj = {
          full_name: info.full_name,
          dob: info.dob,
          favorite_camera: info.favorite_camera,
          favorite_movies: info.favorite_movies
        };
        res.render('users', {"docs": dirObj});
      });
      callback();
    }
    ],
    function(err){
    if (err) return next(err);
  })
};

exports.update_data = function(req, res){
  var movies = req.body.favMovies;
  var camera = req.body.favCamera;
  var dirName = req.body.dirName;

  models.Director.findOneAndUpdate({"full_name": dirName}, {"favorite_camera": camera, "favorite_movies": movies}, function(err, data){
    res.render('users', {"docs": data});
  })
};

exports.list_data = function(req, res){
  models.Director.find({}, function(err, list_data){
    var list = [];

    for (var i = 0; i < list_data.length; i++){
      var obj = {
        full_name: list_data[i].full_name,
        dob: list_data[i].dob,
        favorite_movies: list_data[i].favorite_movies,
        favorite_camera: list_data[i].favorite_camera
      }
      list.push(obj);
    }
    res.render('users', {"dirs": list});
  })
};
