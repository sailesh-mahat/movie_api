import React, { useState } from 'react';//useState hook for less redundancy
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import './login-view.scss';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(username, password);

    props.onLoggedIn(username);
    //send a request to the server for authentication
    //then call props.onLoggedIn(username)
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
          variant='link' className="btn btn-link" onClick={() => props.NewUser()}>here</Button>
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
    NewUser: PropTypes.func.isRequired,
    onLoggedIn: PropTypes.func.isRequired
};
