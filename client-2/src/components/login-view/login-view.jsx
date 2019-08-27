import React, { useState } from 'react';//useState hook for less redundancy
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route} from "react-router-dom";

import './login-view.scss';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  /* Send a request to the server for authentication */
  axios.post('https://myflixapp.herokuapp.com/login', {
    Username: username,
    Password: password
  })
  .then(response => {
    const data = response.data;
    props.onLoggedIn(data);
  })
  .catch(e => {
    alert('no such user')
  });
};

  return (
    <Container className='login-view'>
      <h1>Welcome to MyFlix! </h1>
      <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label >Username</Form.Label>
        <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" />

      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" />
      </Form.Group>
      <Button variant="primary" type="button" className="btn btn-dark" onClick={handleLogin}>
      LOGIN
      </Button>
      <p>Not a member, Signup
        <Router>
        <Link to={'/register'}>
          <span> here</span>
        </Link>
        </Router></p>
    </Form>
    </Container>
  );
}

LoginView.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    NewUser: PropTypes.func.isRequired,
};
