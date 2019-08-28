import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import './movie-view.scss';	import './movie-view.scss';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  //add movie to FavoriteList
  handleSubmit(event) {
    event.preventDefault();
    console.log(this.props.user.Username);
    axios.put(`https://myflixapp.herokuapp.com/users/${this.props.user.Username}/movies/${this.props.movie._id}`, {
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


  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className="movie-view">
        <div className="movie-title">
          <h2 className="label">Title</h2>
          <p className="value">{movie.Title}</p>
        </div>
        <div className="movie-description">
          <h3 className="label">Description</h3>
          <p className="value">{movie.Description}</p>
        </div>
        <img className="movie-poster" src={movie.ImagePath} />
        <div className="movie-genre">
          <h3 className="label">Genre</h3>
          <p className="value">{movie.Genre.Name}</p>
        </div>
        <div className="movie-director">
          <h3 className="label">Director</h3>
          <p className="value">{movie.Director.Name}</p>
        </div>
          <Link to={'/'}>
            <Button variant="dark" type="button">
                    Go Back
            </Button>
          </Link>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="dark" type="button">
            Genre
            </Button>
          </Link>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="dark" type="button">
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

MovieView.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string,
        Description: PropTypes.string,
        ImagePath: PropTypes.string,
        Genre: PropTypes.shape({
            Name: PropTypes.string
        }),
        Director: PropTypes.shape({
            Name: PropTypes.string
        })
    }).isRequired,
};
