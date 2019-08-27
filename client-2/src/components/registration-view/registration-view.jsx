import React, { useState } from 'react';//useState hook used for lesser redundancy
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import './registration-view.scss';

export function RegistrationView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');

    const SuccessfulRegistration = (e) => {
      e.preventDefault();
      axios.post('https://myflixapp.herokuapp.com/users', {
       Username: username,
       Password: password,
       Email: email,
       Birthday: birthday
     })
     .then(response => {
       const data = response.data;
       console.log(data);
       window.open('/', '_self');
     })
     .catch(event => {
       console.log('error registering the user')
     });
   };

    return (
      <Container className='registration-view'>
        <h1>Register</h1>
            <Form>
                <Form.Group controlId='formNewUsername'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control size='sm' type='text' placeholder='Enter username' value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group controlId='formNewPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control size='sm' type='password' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group controlId='formNewEmail'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size='sm' type='email' placeholder='example@gmail.com' value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId='formNewBirthday'>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control size='sm' type='date' placeholder='MM/DD/YYYY' value={birthday} onChange={e => setBirthday(e.target.value)} />
                </Form.Group>
                <Button variant='dark' onClick={SuccessfulRegistration}>Register</Button>
                <p>
                  Already a member?
                  <Link to={'/'}>
                    <span>Login</span>
                  </Link>
                </p>
            </Form>
        </Container>
    );
}
