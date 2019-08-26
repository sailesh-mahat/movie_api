import React from 'react';
import { MainView } from '../main-view/main-view';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import './movie-view.scss';	import './movie-view.scss';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

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
            <Button variant="primary" type="button">
                    Go Back
            </Button>
          </Link>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="primary" type="button">
            GENRE
            </Button>
          </Link>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="primary" type="button">
            DIRECTOR
            </Button>
          </Link>
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
