var request = require("request");
var models = require("../models");
var http = require('http');

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
  var callback = function(error, response, body) {
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

  request(options, callback);


  models.Director.find({ livestream_id: dirID }, function(err, info){
    console.log("this is docs from mongo query " + info)
    res.render('users', {"docs": info});
  })
}
