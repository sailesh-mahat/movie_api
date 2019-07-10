//importing express, and morgan (for logging)
const express = require('express'),
      morgan = require('morgan');
const app = express();
//for serving static files
app.use(express.static('public'));

app.use(morgan('common'));

let topMovies = [ {
    title : 'Spider-Man: Far From Home',
    director : 'Jon Watts',
    actors : 'Tom Holland, Samuel L. Jackson'
},
{
    title : 'Toy Story 4',
    director : 'Josh Cooley',
    actors : 'Tom Hanks, Tim Allen'
},
{
    title : 'Yesterday',
    director : 'Danny Boyle',
    actors : 'Himesh Patel, Lily James'
},
{
    title : 'Annabelle Comes Home',
    director : 'Gary Dauberman',
    actors : 'Vera Farmiga, Patrick Wilson'
},
{
    title : 'Aladdin',
    director : 'Guy Ritchie',
    actors : 'Will Smith, Mena Massoud'
},
{
    title : 'Midsommar',
    director : 'Ari Aster',
    actors : 'Florence Pugh, Jack Reynor'
},
{
    title : 'The Secret Life of Pets 2',
    director : 'Chris Renaud',
    actors : 'Patton Oswalt, Kevin Hart'
},
{
    title : 'Men In Black: International',
    director : 'F. Gary Gary',
    actors : 'Chris Hemsworth, Tessa Thompson'
},
{
    title : 'Avengers: Endgame',
    director : 'Anthony Russo',
    actors : 'Robert Downey Jr., Chris Evans'
},
{
    title : 'FRocketman',
    director : 'Dexter Fletcher',
    actors : 'Taron Egerton, Jamie Bell'
}
]


// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to my MyFlix!')
});

app.get('/movies', function(req, res) {
  res.json(topMovies)
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
