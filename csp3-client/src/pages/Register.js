import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error1, setError1] = useState(true);
  const [error2, setError2] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [willRedirect, setWillRedirect] = useState(false);

  useEffect(() => {
    if ((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password1, password2]);

  useEffect(() => {
    if (email === '' || password1 === '' || password2 === '') {
      setError1(true);
      setError2(false);
      setIsActive(false);
    } else if ((email !== '' && password1 !== '' && password2 !== '') && (password1 !== password2)) {
      setError1(false);
      setError2(true);
      setIsActive(false);
    } else if ((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
      setError1(false);
      setError2(false);
      setIsActive(true);
    }
  }, [email, password1, password2]);

  const registerUser = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobileNo,
        password: password1
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Registered Successfully") {
          Swal.fire({
            title: 'Registration Successful!',
            icon: 'success',
            text: 'You may now log in.'
          });
          setWillRedirect(true);
        } else {
          Swal.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: 'Please check your details and try again.',
          });
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword1("");
          setPassword2("");
        }
      });
  };

  if (willRedirect) {
    return <Redirect to={{ pathname: '/login', state: { from: 'register' } }} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #1a1a2e 0%, #30305a 100%)",
        paddingTop: "2rem",
        paddingBottom: "4rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row className="justify-content-center w-100 px-3">
        <Col xs={12} md={10} lg={8} xl={7}>
          <h2 className="text-center mb-4" style={{ fontWeight: 700, color: '#ffffff' }}>
            Register
          </h2>
          <Card className="shadow-lg rounded-4" style={{ borderRadius: '16px' }}>
            <Form onSubmit={registerUser}>
              <Card.Body className="p-4 p-md-5">
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="firstName" className="mb-3">
                      <Form.Label>First Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName" className="mb-3">
                      <Form.Label>Last Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="userEmail" className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="mobileNo" className="mb-3">
                  <Form.Label>Mobile Number:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your 11 digit mobile number"
                    value={mobileNo}
                    onChange={e => setMobileNo(e.target.value)}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="password1" className="mb-3">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password1}
                        onChange={e => setPassword1(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="password2" className="mb-3">
                      <Form.Label>Verify Password:</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Verify your password"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>

              <Card.Footer>
                {isActive ? (
                  <Button variant="success" type="submit" block>
                    Register
                  </Button>
                ) : error1 || error2 ? (
                  <Button variant="danger" type="submit" disabled block>
                    {error1 ? "Please enter your registration details" : "Passwords must match"}
                  </Button>
                ) : null}
              </Card.Footer>
            </Form>
          </Card>

          <p className="text-center mt-3" style={{ color: '#ffffff' }}>
            Already have an account?{" "}
            <Link className="text-warning"
              to={{ pathname: '/login', state: { from: 'register' } }} 
              style={{ color: '#a0baff', textDecoration: 'underline' }}
            >
              Click here
            </Link>{" "}
            to log in.
          </p>
        </Col>
      </Row>
    </div>
  );
}
