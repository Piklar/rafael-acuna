import React, { useState, useEffect, useContext, useCallback } from 'react';
import AdminView from '../components/AdminView';
import CustomerView from '../components/CustomerView';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';

import UserContext from '../UserContext';

export default function Products() {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/products/all`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Error loading products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontFamily: "'Poppins', sans-serif",
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <Spinner animation="border" variant="light" />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Loading user data...</p>
      </div>
    );
  }

  return (
    <div
      style={{
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #1a1a2e 0%, #30305a 100%)",
      paddingTop: "2rem",
      paddingBottom: "4rem",
    }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.25)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
            flexDirection: 'column',
            color: 'white',
            fontSize: '1.25rem',
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <Spinner animation="border" variant="light" />
          <span style={{ marginTop: '1rem', fontWeight: '600' }}>Loading products...</span>
        </div>
      )}

      <Container
        style={{
          maxWidth: '1100px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow:
            '0 10px 20px rgba(102, 126, 234, 0.2), 0 6px 6px rgba(118, 75, 162, 0.15)',
          animation: 'fadeIn 0.8s ease forwards',
        }}
      >
        {error && (
          <Alert
            variant="danger"
            style={{
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '15px',
            }}
          >
            {error}
            <Button
              variant="outline-light"
              onClick={fetchData}
              className="rounded-pill"
              style={{
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                padding: '0.25rem 1rem',
                fontWeight: '600',
                boxShadow: '0 3px 8px rgba(255, 255, 255, 0.5), 0 3px 6px rgba(102, 126, 234, 0.3)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {user.isAdmin ? (
              <AdminView products={products} fetchData={fetchData} />
            ) : (
              <CustomerView products={products} />
            )}
          </>
        )}
      </Container>

      <style>{`
        @keyframes fadeIn {
          0% {opacity: 0; transform: translateY(20px);}
          100% {opacity: 1; transform: translateY(0);}
        }

        /* Add subtle hover effect for admin and customer views cards */
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          cursor: pointer;
          background: white;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 25px rgba(102, 126, 234, 0.4);
          z-index: 5;
        }
      `}</style>
    </div>
  );
}
