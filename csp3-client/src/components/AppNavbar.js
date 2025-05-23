import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function AppNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      style={{
        backdropFilter: "blur(14px)",
        background: "linear-gradient(90deg, #3a0ca3, #720026)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 0 25px rgba(112, 33, 169, 0.9)",
        padding: "1rem 0",
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: "1.2px",
        zIndex: 9999,
      }}
      className="creative-navbar"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-3 creative-brand"
          style={{
            color: "#f0f0ff",
            textShadow: "0 0 6px #b39ddb, 0 0 15px #9a67ea, 0 0 25px #6a0dad",
            transition: "text-shadow 0.3s ease-in-out",
            fontFamily: "'Orbitron', monospace",
          }}
        >
          <span role="img" aria-label="logo" style={{ marginRight: "8px" }}>
            🛒
          </span>
          UA Shop
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          style={{
            borderColor: "transparent",
            filter: "drop-shadow(0 0 3px #6a0dad)",
          }}
        />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto" style={{ gap: "1rem" }}>
            {["Home", "Products", "Orders", "Cart", "Profile"].map((page) => {
              const path =
                page.toLowerCase() === "home" ? "/" : `/${page.toLowerCase()}`;
              const isActive = currentPath === path;

              return (
                <Nav.Link
                  key={page}
                  as={Link}
                  to={path}
                  className={`fs-5 creative-navlink ${
                    isActive ? "active-link" : ""
                  }`}
                  style={{
                    color: isActive ? "#ffffff" : "#e0d9ff",
                    position: "relative",
                    paddingBottom: "4px",
                    transition: "color 0.3s ease",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {page}
                  <span className="nav-underline"></span>
                </Nav.Link>
              );
            })}
          </Nav>

          <Nav>
            <Button
              as={Link}
              to="/logout"
              className="mx-2 px-4 creative-logout-btn"
              style={{
                borderRadius: "30px",
                background: "linear-gradient(135deg, #720026, #3a0ca3, #6a0dad)",
                boxShadow: "0 0 15px #9a67ea",
                border: "none",
                color: "white",
                fontWeight: "600",
                fontFamily: "'Poppins', sans-serif",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 25px 6px #9a67ea, 0 0 40px 12px #6a0dad")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 15px #9a67ea")
              }
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>

        <style>{`
          .creative-navlink:hover {
            color: #d1c4e9 !important;
          }
          .creative-navlink .nav-underline {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            height: 3px;
            width: 0%;
            background: #9a67ea;
            border-radius: 3px;
            transition: width 0.3s ease;
          }
          .creative-navlink:hover .nav-underline {
            width: 100%;
          }

          .active-link {
            color: #ffffff !important;
            text-shadow: 0 0 6px #b39ddb, 0 0 12px #9a67ea;
          }
        `}</style>
      </Container>
    </Navbar>
  );
}
