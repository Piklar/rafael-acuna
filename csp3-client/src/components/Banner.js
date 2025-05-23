import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AppNavBar() {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="py-3 shadow"
      sticky="top"
      style={{
        background: "linear-gradient(to right, #000000, #d3d3d3)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
          <span role="img" aria-label="logo">🛒</span> UA Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fs-5 text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/products" className="fs-5 text-white">Products</Nav.Link>
            <Nav.Link as={Link} to="/orders" className="fs-5 text-white">Orders</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="fs-5 text-white">Cart</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="fs-5 text-white">Profile</Nav.Link>
          </Nav>
          <Nav>
            <Button as={Link} to="/logout" variant="dark" className="mx-2 px-4 border-white text-white">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
