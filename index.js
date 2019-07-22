//importing express, and morgan (for logging)
const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;
// allows Mongoose to connect to the database thus integrating it with the REST API
mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

app.use(bodyParser.json());
//for serving static files
app.use(express.static('public'));

app.use(morgan('common'));


//using mongoose logic

//Returns a JSON object containing data about all users
app.get('/users', function(req, res) {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
  console.error(err);
  res.status(500).send('Error: ' +err);
  });
});
//Returns a JSON object containing data about all movies
app.get('/movies', function(req, res) {
  Movies.find()
  .then(function(movies) {
    res.status(201).json(movies)
  })
  .catch(function(err) {
  console.error(err);
  res.status(500).send('Error: ' +err);
  });
});

//Return data about a single movie by title
app.get('/movies/:Title',  function(req, res) {
  Movies.findOne({ Title : req.params.Title })
  .then(function(movie) {
    res.json(movie)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send('Error: ' +err);
  });
});

//Returns data about a genre by name
app.get('/genres/:Genre', function (req, res) {
  Movies.findOne({ 'Genre.Name' : req.params.Genre })
  .then(function(item) {
    res.json(item.Genre)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send('Error: ' +err);
  });
});


//Returns data about a director by name
app.get('/movies/directors/:Name', function (req, res) {
  Movies.findOne({'Director.Name' : req.params.Name})
  .then(function(movies) {
    res.json(movies.Director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//Adds a user (new user register)
app.post('/users', function(req, res) {
  Users.findOne({ Username : req.body.Username })
  .then(function(user){
    if(user) {
      return res.status(400).send(req.body.Username + 'already exisits.');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error) {
        console.error(error);
        res.status(500).send('Error : ' + error);
      })
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Updates a user info
app.put('/users/:Username', function (req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username },
   {$set :
   {
     Username : req.body.Username,
     Password : req.body.Password,
     Email : req.body.Email,
     Birthday : req.body.Birthday
   }},
   {new : true},//returns the updated document
   function(err, updatedUser) {
     if(err) {
       console.error(err);
       res.status(500).send('Error: ' +err);
     } else{
       res.json(updatedUser)
     }
   })
});

//Adds movies to favorites
app.post('/users/:Username/movies/:MovieID', function (req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }
  , { $push : { FavoriteMovies : req.params.MovieID }
},
  {new : true },//returns the updated document
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser)
    }
  })
});

//Delete a movie from favorites
app.delete('/users/:Username/movies/:MovieID', function (req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }
    , { $pull: { FavoriteMovies : req.params.MovieID }
},
{new : true},
function(err,updatedUser) {
  if(err) {
    console.error(err);
    res.status(500).send('Error : ' + err);
  } else {
    res.json(updatedUser)
  }
})
});

//Deregistering a user
app.delete('/users/:Username', function (req, res) {
  Users.findOneAndRemove({Username : req.params.Username})
  .then(function(user) {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//error-handling mechanism
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () =>
  console.log('Your app is listening on port 8080.')
);
