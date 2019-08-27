import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import { Link } from 'react-router-dom';

import './profile-view.scss';


export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  deleteUser(event) {
    event.preventDefault();
    axios.delete(`https://myflixapp.herokuapp.com/users/${this.props.user.Username}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(response => {
      alert('Your Account has been deleted!');
      //clears storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      //opens login view
      window.open('/', '_self');
    })
    .catch(event => {
      alert('failed to delete user');
    });
  }

  render() {
    const {user} = this.props;

    if (!user) return null;

    return (
      <div className="profile-view">
      <h1>Your Profile Data</h1>
        <div className="username">
          <div className="label">Name</div>
          <div className="value">{user.Username}</div>
        </div>
        <div className="password">
          <div className="label">Password</div>
          <div className="value">***********</div>
        </div>
        <div className="birthday">
          <div className="label">Birthday</div>
          <div className="value">{user.Birthday}</div>
        </div>
        <div className="email">
          <div className="label">EMail</div>
          <div className="value">{user.EMail}</div>
        </div>
        <div className="favoriteMovies">
          <div className="label">Favorite Movies</div>
          <div className="value">{user.FavoriteMovies}</div>
        </div>
        <Link to={'/'}>
          <Button className="view-btn" variant="primary" type="button">
          Go Back
          </Button>
        </Link>
        <Button className="view-btn" variant="primary" type="button" onClick={(event) => this.deleteUser(event)}>
        DELETE
        </Button>
      </div>
    );
  }
}

// ProfileView.propTypes = {
//   movie: PropTypes.shape({
//     Title: PropTypes.string,
//     Description: PropTypes.string,
//     ImagePath: PropTypes.string,
//     Genre: PropTypes.shape({
//       Name: PropTypes.string
//     }),
//     Director: PropTypes.shape({
//       Name: PropTypes.string
//     })
//   }).isRequired
// };
