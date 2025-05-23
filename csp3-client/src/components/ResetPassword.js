import React, { useState, useContext } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const ResetPassword = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Password Mismatch',
        icon: 'error',
        text: 'The entered passwords do not match. Please try again.',
      });
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/users/resetPassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error resetting password');
        }
      })
      .then(() => {
        Swal.fire({
          title: 'Password Reset Successful!',
          icon: 'success',
          text: 'Your password has been successfully reset.',
        });
        handleClose();
        setPassword('');
        setConfirmPassword('');
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        Swal.fire({
          title: 'Password Reset Failed',
          icon: 'error',
          text: 'An error occurred while resetting your password. Please try again.',
        });
      });
  };

  return (
    <>
      <Button
        variant="info"
        className='rounded-pill'
        onClick={handleShow}
        style={{
          background: "linear-gradient(135deg, rgba(107, 17, 203, 0.8), rgba(37, 116, 252, 0.8))",
          border: 'none',
          borderRadius: '50px',
          padding: '0.5rem 1.5rem',
          fontWeight: '600',
        }}
      >
        Reset Password
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} style={{ borderRadius: '50px' }}>
            Close
          </Button>
          <Button
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResetPassword;