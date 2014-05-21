var request = require("request");

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

  request(apiURL, function(error, response, body){
    if(!error && response.statusCode === 200){
      console.log(body);
    }
  })
  res.redirect('/directors');
}
