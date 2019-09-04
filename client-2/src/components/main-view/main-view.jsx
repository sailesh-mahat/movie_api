import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';


import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { setMovies } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import  MovieView  from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import './main-view.scss';

export class MainView extends React.Component {

constructor() {
  super();

  this.state = {
    //movies: [],
    user: null,
    profileData: null
  };
}

componentDidMount() {
  let accessToken = localStorage.getItem('token');
  if (accessToken !== null) {
    this.setState({
      user: localStorage.getItem('user')
    });
    this.getMovies(accessToken);
  }
}

getMovies(token) {
  axios.get('https://myflixapp.herokuapp.com/movies', {
    headers: { Authorization: `Bearer ${token}`}
  })
  .then(response => {
  //  this.setState({
  //    movies: response.data
  //  });
  this.props.setMovies(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}


  onLoggedIn(authData) {
    console.log(authData.user);
    this.setState({
      user: authData.user,
      profileData: authData.user
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user);
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

      //resets user state to render again
      this.setState({
        user: null
      });

      //make sure login screen appears after logging out
      window.open('/', '_self');
    }



  render() {
    const { movies, user, profileData } = this.state;

    if (!movies) return <div className="main-view"/>;


    return (
      <Router>
        <Container className='main-view' fluid='true'>
        <Button type="button" className="btn btn-light btn-sm" onClick={() => this.logOut()}>Log out</Button>
        <Link to={'/profile'}>
              <Button type="button" className="btn btn-light btn-sm">My Profile</Button>
        </Link>
          <Row>
        /*  <Route exact path="/" render={ () => {
         if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
         return movies.map(movie => (
           <Col key={movie._id} xs={12} sm={6} md={4}>
             <MovieCard key={movie._id} movie={movie} />
           </Col>
         ))}
       }/>*/
       <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return <MoviesList />;
                }}
              />
       //<Route exact path="/movies/:movieId" render={ ({match}) =>
      //  <MovieView user={profileData} movie={movies.find(movie => movie._id === match.params.movieId)}/> } />

      <Route exact path="/movies/:id" render={({ match }) => <MovieView movieId={match.params.id}/>}/>


       <Route exact path="/genres/:name" render={ ({match}) => {
          if (!movies || !movies.length) return <div className="main-view"/>;
          return <GenreView genre={movies.find(movie => movie.Genre.Name === match.params.name).Genre} />}
        }/>

        <Route path="/directors/:name" render={({ match }) => {
          if (!movies || !movies.length) return <div className="main-view"/>;
          return <DirectorView director={movies.find(movie => movie.Director.Name === match.params.name).Director}/>}
        }/>

        <Route exact path="/register" render={() =>
          <RegistrationView UserRegistered={user => this.UserRegistered(user)} />} />

        <Route exact path="/profile" render={() => <ProfileView movies={movies} user={profileData} />}/>

          </Row>
        </Container>
      </Router>
    );
  }
}

export default connect(null, { setMovies } )(MainView);
