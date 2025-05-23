import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

export default function Highlights({ data }) {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(apiData => {
        // Generate up to 5 unique random indices
        const generateRandomNums = (count, max) => {
          const numbers = new Set();
          while (numbers.size < Math.min(count, max)) {
            numbers.add(Math.floor(Math.random() * max));
          }
          return Array.from(numbers);
        };

        const numbers = generateRandomNums(5, apiData.length);

        const products = numbers.map(i => {
          const product = apiData[i];
          return (
            <Col
              key={product._id}
              xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex align-items-stretch"
            >
              <Card className="h-100 shadow-sm border-0 highlight-card transition">
                <Card.Img variant="top" src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={product.name} style={{ objectFit: 'cover', height: '200px' }} />
                <Card.Body>
                  <Card.Title className="fw-bold">{product.name}</Card.Title>
                  <Card.Text style={{ minHeight: '60px' }}>
                    {product.description?.slice(0, 80) || "No description."}
                    {product.description && product.description.length > 80 ? "..." : ""}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary fs-6">${product.price?.toFixed(2) ?? "0.00"}</span>
                    <button className="btn btn-outline-primary btn-sm">View</button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        });

        setPreviews(products);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center fw-bold display-6 text-primary">Featured Products</h2>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Row className="g-4 justify-content-center">
          {previews}
        </Row>
      )}
    </Container>
  );
}