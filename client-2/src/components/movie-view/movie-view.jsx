import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';


import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import './movie-view.scss';	import './movie-view.scss';

function MovieView(props) {
  const { movies, movieId } = props;

    if (!movies || movies.length) return null;

    const movie = movies.find(movie => movie._id == movieId);

    function handleSubmit(event) {

    event.preventDefault();
      console.log(this.props.user.Username);
      axios.put(`https://myflixapp.herokuapp.com/users/${this.props.user.Username}/movies/${movie._id}`, {
        Username: this.props.user.Username
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
      <div className="movie-view">
        <div className="movie-title">
          <div className="label">Title</div>
          <h1>{movie.Title}</h1>
        </div>
        <img className="movie-poster" src={movie.ImagePath} alt="movie cover" />
        <div className="movie-description">
          <div className="label">Description</div>
          <div className="value">{movie.Description}</div>
        </div>
        <div className="movie-genre">
          <div className="label">Genre</div>
          <div className="value">{movie.Genre.Name}</div>
        </div>
        <div className="movie-director">
          <div className="label">Director</div>
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
          <Button className="view-btn" variant="dark" type="button" onClick={event => this.handleSubmit(event)}>
            Add to favorites
          </Button>
        </div>
    );
  }
}
