/**
* @description Index.js manages all HTTP requests
* @class Router
* @requires express, a server framework for Node.js
* @requires body-parser, a parsing middleware for node.js that is needed to read HTTP POST data which is stored in req.body
* @requires uuid, which generates user ids
* @requires mongoose, an object data modeling library (ODM) for MongoDB database
* @requires passport, authentication middleware for Node.js
* @requires cors, Express middleware that manages the CORS settings (Cross-Origin-Resource-Sharing)
* @requires validator, Express middleware that provide validators sanitizer functions
* @requires path, part of Node.js core, manages file and folder paths
*/
const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      /** @requires models.js, contains the data schema for this application */
      Models = require('./models.js'),
      passport = require('passport');
      require('./passport');
const validator = require('express-validator');
const cors = require('cors');
const path = require('path');



/** @const app encapsulate express functionality */
const app = express();
//for serving static files
app.use(express.static('public'));

app.use(cors());
app.use(validator());

/** @const Movies data schema for Movies object  */
const Movies = Models.Movie;
/** @const Users data schema for Users object  */
const Users = Models.User;
// allows Mongoose to connect to the database thus integrating it with the REST API
//mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

mongoose.connect('mongodb+srv://myflixadmin:regmisucks@cluster0-d8k8e.mongodb.net/myFlixDB?retryWrites=true&w=majority', {useNewUrlParser: true});

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

app.get('/', function (req, res) {
  res.send('Welcome to MyFlix!')
});

//Returns a JSON object containing data about all users
app.get('/users/', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
  console.error(err);
  res.status(500).send('Error: ' +err);
  });
});

// get specific user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username : req.params.Username })
  .then((user) => {
    res.status(201).json(user)
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

/**
*endpoint 1 returns a list of all movies
*endpoint URL: /movies
*GET request
*no required params
*example request:
*@function getMovies(token) {
*  axios
*    .get("https://myflixapp.herokuapp.com/movies", {
*      headers: { Authorization: `Bearer ${token}` }
*    })
*    .then(response => {
*      this.props.setMovies(response.data);
*    })
*    .catch(function(error) {
*      console.log(error);
*    });
*}
*example response:
*@param {string} _id
*@param {string}title
*@param {string}description
*@param {object} director
*@param {object} genre
*/
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


/**
*endpoint 2 allow users to register
*endpoint URL: /users
*POST request
*params required:
*@params {string} username
*@params {string} password
*@params {string} email
*@params {date} birthday
*@constant handleSubmit
*example request:
*@function handleSubmit = (e) => {
*  e.preventDefault();
*  axios.post('https://myflixapp.herokuapp.com/users', {
*      username: username,
*      email: email,
*      birthday: birthday,
*      password: password,
*      confirmPassword: confirmPassword
*  })
*  .then(response =>{
*    const data = response.data;
*    console.log(data);
*    window.location.assign('/');
*  })
*  .catch(e => {
*    console.log('error registering the user')
*  });
*}
*example response:
*@param {object} user
*@params {string} username
*@params {string} password
*@params {string} email
*@params {date} birthday
*/
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

/**
  *endpoint 6 allow users to update information
  *endpoint URL: /users/:Username
  *PUT request
  *@params {string} username
  *@params {string} password
  *@params {string} email
  *@params {date} birthday
  *example request:
  *@function handleUpdate(token) {
  *  const { user } = this.props;
  *  const { username, email, birthday, password, confirmPassword } = this.state;
  *  axios({
  *    method: "put",
  *    url: `https://myflixapp.herokuapp.com/users/${user.username}`,
  *    headers: {
  *      Authorization: `Bearer ${token}`
  *    },
  *    data: {
  *      username: username,
  *      email: email,
  *      birthday: birthday,
  *      password: password,
  *      confirmPassword: confirmPassword
  *    }
  *  })
  *    .then(response => {
  *      //const data = response.data;
  *      localStorage.removeItem("token");
  *      localStorage.removeItem("user");
  *      window.location.reload();
  *    })
  *    .catch(e => {
  *      console.log("error updating the user");
  *    });
  *}
  *example response:
  *@param {object} user
  *@params {string} username
  *@params {string} password
  *@params {string} email
  *@params {date} birthday
  */
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

/**
*endpoint 7 add a movie to users favorites
*endpoint URL: /users/:Username/movies/:movieid
*POST request
*@params {ObjectId} _id
*@params {string} user
*@function addToFavorites() {
*  const { movie} = this.props;
*  const user = localStorage.getItem("user");
*  const token = localStorage.getItem("token");
*  console.log({ token });
*  axios
*    .post(
*      `https://myflixapp.herokuapp.com/users/${user}/movies/${
*        movie._id
*      }`,
*      null,
*      { headers: { Authorization: `Bearer ${token}` } }
*    )
*    .then(res => {
*      console.log(res);
*      window.location.reload();
*    })
*    .catch(error => {
*      console.log(error);
*    });
*}
*example response:
* Json of users updated list of favorites
*/
app.put('/users/:Username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {

  console.log(req.params);


  console.log(Users.findOne({ Username : req.params.Username}))

  Users.findOneAndUpdate({ Username : req.params.Username}, { $push : {
    FavoriteMovies : req.params.movieid
  }},
  { new : true},
  (error, updatedUser) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser)
    }
  })
});

/**
*endpoint 8 delete a movie from users list of favorites
*endpoint URL: /users/:Username/movies/:movieid
*DELETE request
*@params {ObjectId} _id
*@params {string} user
*example request:
removeFavorite(id, token) {
  const { favorites } = this.props;
  const { user } = this.props;
  axios.delete(
    `https://myflixapp.herokuapp.com/users/${user.username}/movies/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log(res);
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
}
*example response:
* Json of users updated list of favorites
*/
app.delete('/users/:Username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username : req.params.Username}, { $pull : {
    FavoriteMovies : req.params.movieid
  }},
  (error, updatedUser) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser)
    }
  })
});


/**
*endpoint 9 delete a user
*endpoint URL: /users/:Username
*DELETE request
*@params {string} user
*example request:
*@function handleDelete(token) {
*  const { user } = this.props;
*  axios
*    .delete(`https://myflixapp.herokuapp.com/users/${user.username}`, {
*      headers: { Authorization: `Bearer ${token}` }
*    })
*    .then(res => {
*      localStorage.removeItem("token");
*      localStorage.removeItem("user");
*      window.location.reload();
*    })
*    .catch(error => {
*      console.log(error);
*    });
*}
*example response:
* username was deleted
*/
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


//Deploy to heroku
app.use(express.static(path.join(__dirname, 'client-2/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client-2/build/index.html'))
});
 //listen for requests
/*app.listen(8080, () =>
  console.log('Your app is listening on port 8080.')
);*/

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
