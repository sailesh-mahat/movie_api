<<<<<<< Updated upstream
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import './main-view.scss';

export class MainView extends React.Component {

constructor() {
  super();

  this.state = {
    movies: null,

    user: null,

  };
}

getMovies(token) {
      axios.get('https://myflixapp.herokuapp.com/movies', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
    // Assign the result to the state
      this.setState({
        movies: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
    }

  componentDidMount() {

    const accessToken = localStorage.getItem('token');
      if (accessToken !== null) {
        this.setState({
          user: localStorage.getItem('user')
        });
      this.getMovies(accessToken);
      }
    }




  onLoggedIn = (authData) => {

      this.setState({
        user: authData.user.Username
      });
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', authData.user.Username);
      this.getMovies(authData.token);
    }


  render() {

    const { movies, user } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view"/>;



    return (

      <Router>
          <div className="main-view">
            <Route exact path="/" render={() => movies.map(movie =>
              <MovieCard key={movie._id} movie={movie} />)} />
            <Route path="/movies/:movieId" render={({ match }) =>
            <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
           </div>
      </Router>
    );
  }
}
=======
import React from 'react';
import axios from 'axios';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './main-view.scss';
export class MainView extends React.Component {
  // Call the superclass constructor
  // so React can initialize it
  constructor(props) {
    super(props);
    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios.get('https://myflixapp.herokuapp.com/movies')
    .then(response => {
      console.log(response);
      // Assign the result to the state
      this.setState({
        movies: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  //go to movie view
  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }
  resetMainView() {
    this.setState({
      selectedMovie: null
    });
  }
  onLoggedIn(user) {
    this.setState({
      user
    });
  }
  registerUser() {
   this.setState({
     newUser: true
   });
 }

 userRegistered() {
   this.setState({
     newUser: null
   });
 }
 render() {
   // If the state isn't initialized, this will throw on runtime
   // before the data is initially loaded
   const { movies, selectedMovie, user, newUser } = this.state;
   if (!user) {
         if (newUser) return <RegistrationView userRegistered={() => this.userRegistered()} onLoggedIn={user => this.onLoggedIn(user)} />;
         else return <LoginView onLoggedIn={user => this.onLoggedIn(user)} newUser={() => this.registerUser()} userRegistered={() => this.userRegistered()} />;
       }

       if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

       // Before the movies have been loaded
       if (!movies) return <div className="main-view"/>;
       return (
         <Container className='main-view' fluid='true'>
           <Row>
             {selectedMovie
               ? <Col><MovieView returnCallback={() => this.resetMainView()} movie={selectedMovie} /></Col>
               : movies.map(movie => {
                 return (
                   <Col xl={3} sm={6} md={4} xs={12}><MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} /></Col>
                 )
               })
             }
           </Row>
         </Container>
       );// return
     } // render
   }
>>>>>>> Stashed changes
