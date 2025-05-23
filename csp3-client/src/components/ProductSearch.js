import React, { useState, useEffect, useCallback } from 'react';
import Product from './Product';
import { Col, Row, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounce searchQuery to avoid too many calls
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const validatePriceRange = () => {
    if (minPrice < 0 || maxPrice < 0) {
      setError("Prices can't be negative.");
      return false;
    }
    if (minPrice > maxPrice) {
      setError('Minimum price cannot be greater than maximum price.');
      return false;
    }
    if (maxPrice > 100000) {
      setError('Maximum price cannot exceed 100,000.');
      return false;
    }
    return true;
  };

  const fetchProducts = useCallback(async () => {
    if (!validatePriceRange()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/searchByPrice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: debouncedQuery,
          minPrice,
          maxPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      setSearchResults(data.products || data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch products. Please try again later.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, minPrice, maxPrice]);

  const handleClear = () => {
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(100000);
    setSearchResults(null);
    setError(null);
  };

  // Trigger search on debouncedQuery or price change if any filter is active
  useEffect(() => {
    if (debouncedQuery || minPrice !== 0 || maxPrice !== 100000) {
      fetchProducts();
    } else {
      setSearchResults(null);
    }
  }, [debouncedQuery, minPrice, maxPrice, fetchProducts]);

  // Helpers to safely update min and max prices with bounds
  const updateMinPrice = val => {
    if (val < 0) val = 0;
    if (val > maxPrice) val = maxPrice;
    setMinPrice(val);
  };

  const updateMaxPrice = val => {
    if (val < minPrice) val = minPrice;
    if (val > 100000) val = 100000;
    setMaxPrice(val);
  };

  return (
    <div className="pt-5 container" style={{ maxWidth: '1100px' }}>
      <h2 className="mb-4 text-center" style={{ fontWeight: '700', color: '#4a4a4a' }}>
        Product Search
      </h2>

      <Form>
        <Form.Group controlId="productName" className="mb-4">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-4 g-4 align-items-center">
          <Col xs={12} md={6}>
            <Form.Label htmlFor="minPrice">Minimum Price</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="secondary"
                className="rounded-pill"
                onClick={() => updateMinPrice(minPrice - 1000)}
                disabled={loading}
                aria-label="Decrease minimum price"
              >
                –
              </Button>
              <Form.Control
                type="number"
                id="minPrice"
                min={0}
                max={maxPrice}
                value={minPrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) updateMinPrice(val);
                }}
                disabled={loading}
              />
              <Button
                variant="secondary"
                className="rounded-pill"
                onClick={() => updateMinPrice(minPrice + 1000)}
                disabled={loading}
                aria-label="Increase minimum price"
              >
                +
              </Button>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label htmlFor="maxPrice">Maximum Price</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="secondary"
                className="rounded-pill"
                onClick={() => updateMaxPrice(maxPrice - 1000)}
                disabled={loading}
                aria-label="Decrease maximum price"
              >
                –
              </Button>
              <Form.Control
                type="number"
                id="maxPrice"
                min={minPrice}
                max={100000}
                value={maxPrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) updateMaxPrice(val);
                }}
                disabled={loading}
              />
              <Button
                variant="secondary"
                className="rounded-pill"
                onClick={() => updateMaxPrice(maxPrice + 1000)}
                disabled={loading}
                aria-label="Increase maximum price"
              >
                +
              </Button>
            </div>
          </Col>
        </Row>

        <div className="mb-5 d-flex gap-3 flex-wrap justify-content-center">
          <Button 
            variant="primary" 
            className="rounded-pill"
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
          </Button>
          <Button 
            variant="outline-secondary" 
            className="ms-2 rounded-pill"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </Button>
        </div>
      </Form>

      {error && (
        <Alert variant="danger" className="my-3 text-center" style={{ fontWeight: '600' }}>
          {error}
        </Alert>
      )}

      {searchResults !== null && (
        <>
          <h3 className="mb-3" style={{ textAlign: 'center' }}>
            Search Results:
          </h3>

          {searchResults.length === 0 ? (
            <Card className="mt-4 text-center shadow-sm rounded-3">
              <Card.Body>No matching products found</Card.Body>
            </Card>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4 mt-2">
              {searchResults.map(product => (
                <Col key={product._id}>
                  <Product data={product} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSearch;
