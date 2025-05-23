import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { BsBoxSeam, BsCalendarCheck, BsCurrencyDollar } from "react-icons/bs";

const statusVariant = {
  Delivered: "success",
  Pending: "warning",
  Cancelled: "danger",
  Shipped: "info",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/mine`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Could not fetch orders.");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      <Container>
        <h2
          className="text-center mb-5 text-white"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "700",
            letterSpacing: "2px",
            textShadow: "0 0 15px rgba(154, 103, 234, 0.5)",
          }}
        >
          <BsBoxSeam className="me-3" />
          Your Orders History
        </h2>

        {loading && (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              variant="light"
              style={{ width: "3rem", height: "3rem" }}
            />
          </div>
        )}

        {error && (
          <Alert
            variant="danger"
            className="text-center mx-auto"
            style={{
              maxWidth: "500px",
              background: "rgba(220, 53, 69, 0.9)",
              borderColor: "#dc3545",
              color: "white",
              borderRadius: "10px", // Added rounded corners for the Alert
            }}
          >
            {error}
            <Button
              variant="outline-light"
              size="sm"
              className="ms-3 rounded" // Added rounded-pill class for the button
              onClick={fetchOrders}
            >
              Retry
            </Button>
          </Alert>
        )}

        {!loading && !error && orders.length === 0 && (
          <Alert
            variant="info"
            className="text-center mx-auto"
            style={{
              maxWidth: "500px",
              background: "rgba(154, 103, 234, 0.2)",
              borderColor: "#9a67ea",
              color: "white",
            }}
          >
            <BsBoxSeam className="me-2" /> No orders found. Start shopping!
          </Alert>
        )}

        <Row className="g-4">
          {orders.map((order) => (
            <Col key={order._id} xs={12} md={6} xl={4}>
              <Card
                className="h-100 border-0 order-card"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(106, 17, 203, 0.2), rgba(37, 117, 252, 0.1))",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5
                      className="m-0 text-white"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h5>
                    <Badge
                      bg={statusVariant[order.status] || "secondary"}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontWeight: "600",
                      }}
                    >
                      {order.status || "Pending"}
                    </Badge>
                  </div>

                  <div className="mb-4 text-white-50">
                    <BsCalendarCheck className="me-2" />
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <div className="mb-3 text-white">
                    <BsCurrencyDollar className="me-2" />
                    <span className="fs-5 fw-bold">
                      ${order.total?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>

                  <div className="text-white-50">
                    <h6 className="mb-2 text-white">Items:</h6>
                    <ul className="list-unstyled">
                      {(order.items || []).map((item, idx) => (
                        <li
                          key={idx}
                          className="mb-2 d-flex justify-content-between"
                        >
                          <span>{item.name}</span>
                          <span>×{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
