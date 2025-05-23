import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// Array of background image URLs
const backgroundImages = [
  "https://dailyguardian.com.ph/wp-content/uploads/2024/10/getty_522735456_249841.jpg",
  "https://t3.ftcdn.net/jpg/01/43/75/28/360_F_143752895_VEjQuZnOLV5sWqeV11m88xWSSW7Dihp4.jpg",
  "https://plus.unsplash.com/premium_photo-1661380434047-65f0e315ed04?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVvcGxlJTIwc2hvcHBpbmd8ZW58MHx8MHx8fDA%3D",
  "https://english.ahram.org.eg/Media/News/2022/3/22/41_2022-637835854651690205-169.jpg",
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 2000); // change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="slideshow-background"
      style={{
        backgroundImage: `url(${backgroundImages[currentImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out",
        opacity: 0.8,
      }}
    >
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center py-5"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center text-white">
              <h1
                className="display-2 fw-bold mb-4 text-center"
                style={{
                  color: "white",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  fontFamily:
                    "'Orbitron', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  animation: "pulseGlowWhite 2.5s ease-in-out infinite",
                }}
              >
                Welcome to <br />
                UA Shop!
              </h1>

              <p
                className="lead mb-5 text-white text-center"
                style={{
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 5px rgba(255, 255, 255, 0.2)",
                }}
              >
                <strong style={{ fontWeight: "800" }}>UA fit starts here.</strong>{" "}
                <br />Shop official merch, track your orders, stay fresh.
              </p>

              <div className="d-flex justify-content-center gap-3">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  variant="primary"
                  className="px-5 shadow rounded-pill"
                >
                  Shop Now
                </Button>
                <Button
                  as={Link}
                  to="/orders"
                  size="lg"
                  variant="light"
                  className="px-5 shadow rounded-pill"
                >
                  My Orders
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}
