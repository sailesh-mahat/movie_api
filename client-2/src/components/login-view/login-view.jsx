<<<<<<< Updated upstream
import React, { useState } from 'react';//useState hook for less redundancy
=======
import React, { useState } from 'react';
>>>>>>> Stashed changes
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './login-view.scss';
import axios from 'axios';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://myflixapp.herokuapp.com/login/', {
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
      <h1>Login</h1>
      <Form>
        <Form.Group controlId='formUsername'>
          <Form.Label>Username:</Form.Label>
          <Form.Control size='sm' type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId='formPassword'>
          <Form.Label>Password:</Form.Label>
          <Form.Control size='sm' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant='primary' onClick={handleSubmit} >Submit</Button>
        <Form.Group controlId='formNewUser'>
          <Form.Text>New user? Click <Button id='login-view__register' style={{ padding: 0 }} variant='link' onClick={() => props.newUser()}> here </Button> to register</Form.Text>
        </Form.Group>
      </Form>
    </Container>
  );//return
}

LoginView.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  newUser: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired
}
