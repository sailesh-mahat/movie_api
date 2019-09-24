import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import './movie-view.scss';	import './movie-view.scss';

function MovieView(props) {
  const { movies, movieId } = props;

    if (!movies || !movies.length) return null;

    const movie = movies.find(movie => movie._id === movieId);

  function handleSubmit(event) {
    event.preventDefault();
      axios.put(`https://myflixapp.herokuapp.com/users/${localStorage.getItem('user')}/movies/${movie._id}`, {
        Username: localStorage.getItem('user')
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      .then(response => {
        console.log(response);
        alert('Movie has been added to your Favorite List!');
      })
      .catch(event => {
        console.log('Error adding movie to list');
        alert('Something went wrong!');
      });
    };



    return (
      //<Container className="movie-view">
      <div className="movie-view">
        <div className="movie-title">
          <h1>{movie.Title}</h1>
        </div>
        <img className="movie-poster" src={movie.ImagePath} alt="movie cover" />
        <div className="movie-description">
          <h4 className="label">Description</h4>
          <div className="value">{movie.Description}</div>
        </div>
        <div className="movie-genre">
          <h4 className="label">Genre</h4>
          <div className="value">{movie.Genre.Name}</div>
        </div>
        <div className="movie-director">
          <h4 className="label">Director</h4>
          <div className="value">{movie.Director.Name}</div>
        </div>
          <Link to={'/'}>
            <Button className="view-btn" variant="dark" type="button">
                    Go Back
            </Button>
          </Link>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button className="view-btn" variant="dark" type="button">
            Genre
            </Button>
          </Link>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button className="view-btn" variant="dark" type="button">
            Director
            </Button>
          </Link>
          <Button className="view-btn" variant="success" type="button" onClick={event => handleSubmit(event)}>
            Add to favorites
          </Button>
          </div>
        //</Container>
    );
  }

export default connect(({movies}) => ({movies}))(MovieView);
