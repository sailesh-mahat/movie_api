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


  componentDidMount() {

    const accessToken = localStorage.getItem('token');
      if (accessToken !== null) {
        this.setState({
          user: localStorage.getItem('user')
        });
      this.getMovies(accessToken);
      }
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


    const selectedMovie = selectedMovieId ? movies.find(movie => movie._id === selectedMovieId) : null;

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
