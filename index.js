//importing express, and morgan (for logging)
const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');
const app = express();

app.use(bodyParser.json());
//for serving static files
app.use(express.static('public'));

app.use(morgan('common'));

let users = [
  {id:'0', name: 'Sailesh', username: 'sailesh-mahat', password: '', email: '', birthday: '', favorites: ['']}
];

let directors = [
  {name: 'Martin Scorsese ', bio: '', birthyear: '', deathyear: ''},
  {name: 'Steven Spielberg', bio: '', birthyear: '', deathyear: ''},
  {name: 'Stanley Kubrick', bio: '', birthyear: '', deathyear: ''},
  {name: 'Alfred Hitchcock', bio: '', birthyear: '', deathyear: ''},
  {name: 'Clint Eastwood', bio: '', birthyear: '', deathyear: ''},
  {name: 'Tim Burton', bio: '', birthyear: '', deathyear: ''},
  {name: 'Peter Jackson', bio: '', birthyear: '', deathyear: ''},
];

let genres = [
  { name: 'Action', description: 'An action movie is similar to adventure, and the protagonist usually takes a risky turn, which leads to desperate situations (including explosions, fight scenes, daring escapes, etc.)'},
  { name: 'Comedy', description: 'Comedy is a genre that tells about a series of funny, or comical events, intended to make the audience laugh. It is a very open genre, and thus crosses over with many other genres on a frequent basis.'},
  { name: 'Drama', description: 'Drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone'}
];

let movies = [ {
    id: '0',
    title : 'Spider-Man: Far From Home',
    Descrition: '',
    Genre: 'Action',
    ImageURL: '',
    director : 'Jon Watts',
    actors : 'Tom Holland, Samuel L. Jackson'
},
{
    id: '1',
    title : 'Toy Story 4',
    Descrition: '',
    Genre: 'Animation',
    ImageURL: '',
    director : 'Josh Cooley',
    actors : 'Tom Hanks, Tim Allen'
},
{
    id: '2',
    title : 'Yesterday',
    Descrition: '',
    Genre: 'Comedy',
    ImageURL: '',
    director : 'Danny Boyle',
    actors : 'Himesh Patel, Lily James'
},
{
    id: '3',
    title : 'Annabelle Comes Home',
    Descrition: '',
    Genre: 'Horror',
    ImageURL: '',
    director : 'Gary Dauberman',
    actors : 'Vera Farmiga, Patrick Wilson'
},
{
    id: '4',
    title : 'Aladdin',
    Descrition: '',
    Genre: 'Fantasy',
    ImageURL: '',
    director : 'Guy Ritchie',
    actors : 'Will Smith, Mena Massoud'
},
{
    id: '5',
    title : 'Midsommar',
    Descrition: '',
    Genre: 'Horror',
    ImageURL: '',
    director : 'Ari Aster',
    actors : 'Florence Pugh, Jack Reynor'
},
{
    id: '6',
    title : 'The Secret Life of Pets 2',
    Descrition: '',
    Genre: 'Animation',
    ImageURL: '',
    director : 'Chris Renaud',
    actors : 'Patton Oswalt, Kevin Hart'
},
{
    id: '7',
    title : 'Men In Black: International',
    Descrition: '',
    Genre: 'Action',
    ImageURL: '',
    director : 'F. Gary Gary',
    actors : 'Chris Hemsworth, Tessa Thompson'
},
{
    id: '8',
    title : 'Avengers: Endgame',
    Descrition: '',
    Genre: 'Action',
    ImageURL: '',
    director : 'Anthony Russo',
    actors : 'Robert Downey Jr., Chris Evans'
},
{
    id: '9',
    title : 'Rocketman',
    Descrition: '',
    Genre: 'Biography',
    ImageURL: '',
    director : 'Dexter Fletcher',
    actors : 'Taron Egerton, Jamie Bell'
}
]


// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to my MyFlix!')
});
//Returns a JSON object containing data about all movies
app.get('/movies', function(req, res) {
  res.json(movies)
});
//Return data about a single movie by title
app.get('/movies/:title',  (req, res) => {
  res.json(movies.find( (movie) => {
    return movie.title === req.params.title
  }));
});
//Returns a JSON object containing data about all genres
app.get('/genres', function(req, res) {
  res.json(genres)
});
//Returns data about a genre by name
app.get('/genres/:name',  (req, res) => {
  res.json(genres.find( (genre) => {
    return genre.name === req.params.name
  }));
});
//Returns a JSON object containing data about all directors
app.get('/directors', function(req, res) {
  res.json(directors)
});
//Returns data about a director by name
app.get('/directors/:name', (req, res) => {
  res.json(directors.find( (director) => {
    return director.name === req.params.name
  }));
});
//list of all users for test needs
app.get('/users',  (req, res) => {
    res.json(users);
});
//Adds a user (new user register)
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});
//Updates a user info
app.put('/users/:id', (req, res) =>
{
  let user = users.find( (user) => {
    return user.id === req.params.id
  });
  let newUserInfo = req.body;

  if (user && newUserInfo) {
    //preserve the user ID
    newUserInfo.id = user.id;
    //preserve the user favorites
    newUserInfo.favorites = user.favorites;
    //merge old info and new info
    Object.assign(user, newUserInfo);
    //merge user with update info into the list of users
    users = users.map((user) => (user.id === newUserInfo.id) ? newUserInfo : user);
    res.status(201).send(user);
  } else if (!newUserInfo.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  }
});
//Adds movies to favorites
app.post('/users/:id/:movie_id', (req, res) => {
  let user = users.find((user) => {
    return user.id === req.params.id
  })
  let movie = movies.find((movie) => {
    return movie.id === req.params.movie_id
  });
  if (user && movie) {
    user.favorites = [...new Set([...user.favorites, req.params.movie_id])];
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with id ' + req.params.movie_id + ' was not found.');
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  }
});
//Delete a movie from favorites
app.delete('/users/:id/:movie_id', (req, res) => {
  let user = users.find((user) => {
    return user.id === req.params.id
  });
  let movie = movies.find((movie) => {
    return movie.id === req.params.movie_id
  });

   if (user && movie) {
    user.favorites = user.favorites.filter((movie_id) => {
      return movie_id !== req.params.movie_id
    });
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with id ' + req.params.movie_id + ' was not found.');
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  }
});
//Deregistering as a user
app.delete('/users/:id', (req, res) => {
  let user = users.find((user) => {
    return user.id === req.params.id
  });
  if (user) {
    users = users.filter( function (obj) {
      return obj.id !== req.params.id
    });
    res.status(201).send('User ' + user.name + ' with id ' + req.params.id + ' was deleted.');
  }
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
