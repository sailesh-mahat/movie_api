import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';


import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import { setMovies, setLoggedInUser } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';
import Container from 'react-bootstrap/Container';


import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import  MovieView  from '../movie-view/movie-view';
import  DirectorView  from '../director-view/director-view';
import  GenreView  from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import './main-view.scss';

export class MainView extends React.Component {

constructor() {
  super();

  this.state = {
    user: null
  };
}

componentDidMount() {
  let accessToken = localStorage.getItem('token');
  if (accessToken !== null) {
    this.setState({
      user: localStorage.getItem('user')
    });
    this.getMovies(accessToken);
    this.getUser(accessToken);
  }
}

getMovies(token) {
  axios.get('https://myflixapp.herokuapp.com/movies', {
    headers: { Authorization: `Bearer ${token}`}
  })
  .then(response => {
  this.props.setMovies(response.data);
  localStorage.setItem('movies', JSON.stringify(response.data));

  })
  .catch(function (error) {
    console.log(error);
  });
}

// get user
  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://myflixapp.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      this.props.setLoggedInUser(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onLoggedIn(authData) {
    console.log(authData.user);
    this.setState({
      user: authData.user.Username
    });

    this.props.setLoggedInUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }


   UserRegistered(user) {
    this.setState({
      user: user
    });
  }

  //logut function for LogOut button
    logOut() {
      //clears storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('movies');

      //resets user state to render again
      this.setState({
        user: null
      });

      //make sure login screen appears after logging out
      window.open('/', '_self');
    }



  render() {

    const { user } = this.state;

    return (
      <Router>
        <Container className="main-view">
          <Button type="button" className="btn btn-light btn-sm" onClick={() => this.logOut()}>Log out</Button>
          <Link to={'/profile'}>
              <Button type="button" className="btn btn-light btn-sm">My Profile</Button>
              </Link>

            <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return <MoviesList />;
                }}
              />

            <Route exact path="/movies/:id" render={({ match }) =>
            <MovieView movieId={match.params.id}/>}/>


            <Route exact path="/genres/:name" render={({ match }) => <GenreView genreName={match.params.name}/>}/>

            <Route exact path="/directors/:name" render={({ match }) => <DirectorView directorName={match.params.name}/>}/>


            <Route exact path="/register" render={() =>
              <RegistrationView UserRegistered={user => this.UserRegistered(user)} />} />

            <Route exact path="/profile" render={() => <ProfileView />}/>


          </Container>
      </Router>
    );
  }
}

export default connect(null, { setMovies, setLoggedInUser } )(MainView);
