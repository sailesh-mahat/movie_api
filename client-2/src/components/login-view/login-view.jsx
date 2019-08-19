/* eslint-disable no-unused-vars */
import React, { useState } from 'react';//useState hook for less redundancy
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import './login-view.scss';
import axios from 'axios';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('https://myflixapp.herokuapp.com/login', {
      Username: username,
      Password: password
    })
    .then(response => {
      const data = response.data;
      props.onLoggedIn(data);
    })
    .catch(err => {
      console.error(err, 'No such user.')
    });
  };


  return (
    <Container className='login-view'>
      <h1>Welcome to MyFlix! </h1>
      <Form>
        <Form.Group controlId="formEnterUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control size='sm' type="text" value={username} onChange={e =>
            setUsername(e.target.value)} placeholder="Enter username" />
        </Form.Group>
        <Form.Group controlId="formEnterPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control size='sm' type="password" value={password} onChange={e =>
            setPassword(e.target.value)} placeholder="Enter password" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleLogin}>Login</Button>
        <Form.Group controlId="formNewUser">
          <Form.Text>Or click <Button id='toRegisterView' style={{ padding: 0 }}
          variant='link' className="btn btn-link" onClick={() => props.newUser()}>here</Button>
           to register</Form.Text>
        </Form.Group>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    newUser: PropTypes.func.isRequired,
    onLoggedIn: PropTypes.func.isRequired
};
