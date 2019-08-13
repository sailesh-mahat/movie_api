import React, { useState } from 'react'; //useState hook used for lesser redundancy
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import './registration-view.scss';

export function RegistrationView (props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    //console.log(username, password, email, birthday);
    props.onSignedIn();
    props.onLoggedIn(username);
  };

  return (
    <Container className='registration-view'>
      <h1>Register New User</h1>
      <Form>
        <Form.Group controlId = "formNewUsername">
          <Form.Label> Username </Form.Label>
          <Form.Conrol size='sm' type = "text" value = {username} onChange = {e =>
          setUsername(e.target.value)} placeholder = "Enter Username" />
        </Form.Group>
        <Form.Group controlId = "formNewPassword">
            <Form.Label> Password </Form.Label>
            <Form.Control size='sm' type="password" value={password} onChange={e =>
            setPassword(e.target.value)} placeholder="Enter Password" />
        </Form.Group>
        <Form.Group controlId="formNewEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control size='sm' type="email" value={email} onChange={e =>
            setEmail(e.target.value)} placeholder="example@gmail.com" />
        </Form.Group>
        <Form.Group controlId="formNewBirthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control size='sm' type="date" value={birthday} onChange={e =>
          setBirthday(e.target.value)} placeholder="MM/DD/YY" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSignIn}>Register</Button>
        <Form.Group controlId='formNewUser'>
          <Form.Text>Already a member? Click <Button style={{ padding: 0}} variant='link'
          onClick={() => props.onSignedIn()}> here </Button> to login. </Form.Text>
        </Form.Group>
      </Form>
    </Container>
  );
}
