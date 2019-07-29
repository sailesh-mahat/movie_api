//importing express, and morgan (for logging)
const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js'),
      passport = require('passport');
      require('./passport');
const validator = require('express-validator');
const cors = require('cors');



const app = express();
//for serving static files
app.use(express.static('public'));

app.use(cors());
app.use(validator());

const Movies = Models.Movie;
const Users = Models.User;
// allows Mongoose to connect to the database thus integrating it with the REST API
mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

app.use(bodyParser.json());

app.use(morgan('common'));

var auth = require('./auth')(app);


/*var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));*/


//using mongoose logic

//Returns a JSON object containing data about all users
app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {
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
app.get('/movies', passport.authenticate('jwt', { session: false }), function(req, res) {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), function(req, res) {
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
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), function (req, res) {
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
  // Validation logic here for request
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric();
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {
    return res.status(422).json({ errors: errors });
  }
  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username : req.body.Username })
  .then(function(user){
    if(user) {
      return res.status(400).send(req.body.Username + 'already exisits.');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  // Validation logic here for request
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric();
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {
    return res.status(422).json({ errors: errors });
  }
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
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
