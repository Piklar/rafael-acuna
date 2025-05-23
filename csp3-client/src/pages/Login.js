import React, { useState, useContext } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';

export default function LoginForm(props) {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [willRedirect, setWillRedirect] = useState(false);

  const authenticate = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.access !== 'undefined') {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);

          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'User not found',
            icon: 'error',
            text: 'Authentication failed. Please check your login details and try again.',
          });
        }
      });
  };

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({ id: data._id, isAdmin: data.isAdmin });

        if (data.isAdmin === true) {
          setWillRedirect(true);
        } else {
          if (props.location?.state?.from === 'cart') {
            history.goBack();
          } else {
            setWillRedirect(true);
          }
        }
      });
  };

  if (willRedirect === true) {
    return user.isAdmin === true ? <Redirect to="/products" /> : <Redirect to="/" />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
        background: 'linear-gradient(135deg, #1a1a2e 0%, #30305a 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6} xl={5}>
          <h2 className="text-center my-4 text-white">Log In</h2>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <Form onSubmit={(e) => authenticate(e)}>
              <Card.Body>
                <Form.Group controlId="userEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Body>

              <Card.Footer className="d-flex justify-content-center">
                <Button variant="primary" type="submit" style={{ borderRadius: '25px', padding: '10px 40px' }}>
                  Submit
                </Button>
              </Card.Footer>
            </Form>
          </Card>
          <p className="text-center mt-3 text-white">
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#a0baff', textDecoration: 'underline' }}>
              Click here
            </Link>{' '}
            to register.
          </p>
        </Col>
      </Row>
    </div>
  );
}
