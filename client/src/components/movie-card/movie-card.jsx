import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    //this is given to the <MovieCard/> component by the outer world
    //which, in this case, is 'MainView', as 'MainView' is what's
    //connected to your database via the movies endpoint of the API
    const { movie, onClick } = this.props;

    return (
      <Card onClick={() => onClick(movie)} variant='link'style={{ width: '16rem' }}>


        <Card.Body>
          <Card.Img variant="top" src={movie.Imagepath} />
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Button onClick={() => onClick(movie)} variant="link">Open</Button>
        </Card.Body>
      </Card>
    );
  }
}
