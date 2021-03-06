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
    selectedMovie: null,
    user: null,
    newUser: null
  };
}

  //one of the hooks available in a React component
  componentDidMount() {
    axios.get('https://myflixapp.herokuapp.com/movies')
    .then(response => {
      //Assign the result to the state
      this.setState({
        movies: response.data
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  getMainView() {
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

   UserRegistered() {
    this.setState({
      newUser: null
    });
  }

  render() {
    //if the state isn't initialized, this will throw on runtime
    //before the data is initially loaded
    const { movies, selectedMovie, user, newUser } = this.state;

    if (!user) {
      if (newUser) return <RegistrationView UserRegistered={() =>
      this.UserRegistered()} onLoggedIn={user => this.onLoggedIn(user)} />;
        else return <LoginView onLoggedIn={user =>
      this.onLoggedIn (user)} NewUser={() => this.registerUser()}
      UserRegistered={() => this.UserRegistered()} />;
    }

    //Before the movies have been loaded
    if (!movies) return <div className="main-view"/>;

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
