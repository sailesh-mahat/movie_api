import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


import { Link } from 'react-router-dom';

import './profile-view.scss';


export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      favoriteMovies: [],
      usernameForm: null,
      passwordForm: null,
      emailForm: null,
      birthdayForm: null
    };
  }

  componentDidMount() {
      //authentication
      let accessToken = localStorage.getItem('token');
      if (accessToken !== null) {
        this.getUser(accessToken);
      }
    }

    //get user
      getUser(token) {
        let username = localStorage.getItem('user');
        axios.get(`https://myflixapp.herokuapp.com/users/${username}`, {
          headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
          this.setState({
            userData: response.data,
            username: response.data.Username,
            password: response.data.Password,
            email: response.data.Email,
            birthday: response.data.Birthday,
            favoriteMovies: response.data.FavoriteMovies
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }

  deleteUser(event) {
    event.preventDefault();
    axios.delete(`https://myflixapp.herokuapp.com/users/${localStorage.getItem('user')}`, {
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

  // delete movie from list
    deleteMovie(event, favoriteMovie) {
      event.preventDefault();
      console.log(favoriteMovie);
      axios.delete(`https://myflixapp.herokuapp.com/users/${localStorage.getItem('user')}/movies/${favoriteMovie}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      .then(response => {
        alert('Movie has been removed from list!');
      })
      .catch(event => {
        alert('Something went wrong...');
      });

    }

  //handle the changes
    handleChange(event) {
      this.setState( {[event.target.name]: event.target.value} )
    }

    //update user data
    handleSubmit(event) {
      event.preventDefault();
      console.log(this.state);
      axios.put(`https://myflixapp.herokuapp.com/users/${localStorage.getItem('user')}`, {
        Username: this.state.usernameForm,
        Password: this.state.passwordForm,
        Email: this.state.emailForm,
        Birthday: this.state.birthdayForm
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      .then(response => {
        console.log(response);
        alert('Your data has been updated!');
        //update localStorage
        localStorage.setItem('user', this.state.username);
      })
      .catch(event => {
        console.log('Error updating the userdata');
        alert('Something went wrong!');
      });
    };

//toggle change data form
  toggleForm() {
    console.log(this.props.user.FavoriteMovies);
    let form = document.getElementsByClassName('changeDataForm')[0];
    let toggleButton = document.getElementById('toggleButton');
    form.classList.toggle('show-form');
    if (form.classList.contains('show-form')) {
      toggleButton.innerHTML= 'CHANGE DATA &uarr;';
    } else {
      toggleButton.innerHTML = 'CHANGE DATA &darr;';
    }
  }

  render() {
    const {user, movies} = this.props;

    if (!user) return null;

    return (
      <div className="profile-view">
      <h1>Your Profile Data</h1>
        <div className="username">
          <div className="label">Name:</div>
          <div className="value">{user.Username}</div>
        </div>
        <div className="password">
          <div className="label">Password:</div>
          <div className="value">***********</div>
        </div>
        <div className="birthday">
          <div className="label">Birthday:</div>
          <div className="value">{user.Birthday}</div>
        </div>
        <div className="email">
          <div className="label">Email:</div>
          <div className="value">{user.Email}</div>
        </div>
        <div className="favoriteMovies">
          <div className="label">Favorite Movies:</div>
            {
              user.FavoriteMovies.length === 0 &&
              <div className="value">Your Favorite Movie List is empty.
              </div>
            }
            {
              user.FavoriteMovies.length > 0 &&
              <div className="value">{user.FavoriteMovies.map(favoriteMovie =>
                (<p key={favoriteMovie}>{movies.find(movie =>
                  movie._id === favoriteMovie).Title}<span onClick={(event) =>
                    this.deleteMovie(event, favoriteMovie)}> Delete</span></p>))}
              </div>
            }
                </div>
        <Link to={'/'}>
          <Button className="view-btn" variant="dark" type="button">
          Go Back
          </Button>
        </Link>
        <Button className="view-btn" variant="dark" type="button" onClick={(event) => this.deleteUser(event)}>
        Deregister Account
        </Button>
        <Button id="toggleButton" variant="dark" type="button" onClick={() => this.toggleForm()}>
        CHANGE DATA &darr;
        </Button>

        <Form className="changeDataForm">
          <h2>Change Data</h2>
          <Form.Group controlId="formBasicUsername">
            <Form.Label >Your Username</Form.Label>
            <Form.Control type="text" name="username" onChange={event => this.handleChange(event)} placeholder="Enter Username" />
            <Form.Text className="text-muted">
            Type your username here.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Your Password</Form.Label>
            <Form.Control type="password" name="password" onChange={event => this.handleChange(event)} placeholder="Enter Password" />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Your Email</Form.Label>
            <Form.Control type="email" name="email" onChange={event => this.handleChange(event)} placeholder="example@ema.il" />
          </Form.Group>

          <Form.Group controlId="formBasicBirthday">
            <Form.Label>Your Birthday</Form.Label>
            <Form.Control type="date" placeholder="01.01.2000" name="birthday" onChange={event => this.handleChange(event)} />
          </Form.Group>

          <Button variant="dark" type="button" onClick={event => this.handleSubmit(event)} >
          CHANGE!
          </Button>
        </Form>
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
