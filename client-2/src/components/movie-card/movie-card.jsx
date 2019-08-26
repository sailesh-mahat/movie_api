import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import './movie-card.scss';


export class MovieCard extends React.Component {
  render() {

    const { movie } = this.props;

    return (
      <Card style={{ width: '16rem' }}>
      <Card.Img variant="top" src={movie.Imagepath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="primary">More</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string,
        ImagePath: PropTypes.string,
        Description: PropTypes.string
    }).isRequired
  //  onClick: PropTypes.func.isRequired
};
