import React from 'react';
import axios from 'axios';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import './main-view.scss';

export class MainView extends React.Component {

constructor(props) {
  super(props);

  this.state = {
    movies: null,
    selectedMovieId: null,
    user: null,
    newUser: null
  };
}


  componentDidMount() {
    window.addEventListener('hashchange', this.handleNewHash, false);

             this.handleNewHash();

    const accessToken = localStorage.getItem('token');
      if (accessToken !== null) {
        this.setState({
          user: localStorage.getItem('user')
        });
      this.getMovies(accessToken);
      }
    }

  handleNewHash = () => {
          const movieId = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');

            this.setState({
              selectedMovieId: movieId[0]
          });
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

  onMovieClick(movie) {
    this.setState({
      selectedMovieId: movie._id
      });

      window.location.hash = '#' + movie._id;
    }

  getMainView() {
    this.setState({
      selectedMovie: null
    });
      window.location.hash = '#';
  }

  onLoggedIn = (authData) => {

      this.setState({
        user: authData.user.Username
      });
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', authData.user.Username);
      this.getMovies(authData.token);
    }

    registerUser() {
     this.setState({
       newUser: true
     });
    }

    UserRegistered() {
     this.setState({
       newUser: null
     });
    }


  render() {

    const { movies, selectedMovieId, user, newUser } = this.state;

    if (!user) {
      if (newUser) return <RegistrationView userRegistered={() =>
        this.userRegistered()} onLoggedIn={user => this.onLoggedIn(user)} />;
      else return <LoginView onLoggedIn={user => this.onLoggedIn(user)}
      newUser={() => this.registerUser()} userRegistered={() => this.userRegistered()} />
    }


    //Before the movies have been loaded
    if (!movies) return <div className="main-view"/>;

    const selectedMovie = selectedMovieId ? movies.find(movie => movie._id === selectedMovieId) : null;

    return (

      <Container className='main-view' fluid='true'>
        <Row>
          {selectedMovie
                ? <Col><MovieView returnCallback={() => this.getMainView()}
                movie={selectedMovie} /></Col>
                : movies.map(movie => {
                return (
                <Col xl={3} sm={6} md={4} xs={12}><MovieCard key={movie._id}
                movie={movie} onClick={movie =>
                this.onMovieClick(movie)}/></Col>
                )
              })
            }
          </Row>
      </Container>
    );
  }
}
