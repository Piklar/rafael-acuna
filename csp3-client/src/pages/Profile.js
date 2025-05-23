import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Spinner, Card, ListGroup } from "react-bootstrap";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import UserContext from "../UserContext";
import { Redirect, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import ResetPassword from "../components/ResetPassword";

// Make sure to include Poppins font in your index.html or root component:
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await res.json();

        if (res.ok && data) {
          setDetails(data);
        } else if (data.error === "User not found") {
          await Swal.fire({
            title: "User not found",
            icon: "error",
            text: "Something went wrong. Please contact us for assistance.",
          });
          history.push("/login");
        } else {
          await Swal.fire({
            title: "Something went wrong",
            icon: "error",
            text: "Something went wrong. Please contact us for assistance.",
          });
          history.push("/login");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        await Swal.fire({
          title: "Network Error",
          icon: "error",
          text: "Unable to fetch user details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [history]);

  if (!user || user.id === null) {
    return <Redirect to="/login" />;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status" aria-live="polite" aria-busy="true" />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage:
          "url('https://www.ua.edu.ph/wp-content/uploads/2019/08/DSC_9027.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "60px",
        paddingBottom: "60px",
        fontFamily: "'Poppins', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Black opacity overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", padding: "0 15px" }}>
        <Card
          className="shadow-lg rounded-4 mb-4"
          style={{
            background: "linear-gradient(135deg, #6a11cb, rgba(37, 116, 252, 0.46))",
            color: "#ffffff",
            borderRadius: "16px",
          }}
        >
          <Card.Body className="p-5 text-center">
            <Card.Title
              as="h1"
              className="mb-3 fw-bold display-4 border-bottom border-white pb-3"
              style={{ letterSpacing: "3px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}
            >
              {`${details?.firstName ?? ""} ${details?.lastName ?? ""}`}
            </Card.Title>
            <Card.Subtitle
              className="mb-4 fs-5"
              style={{ color: "#e0e0e0", fontWeight: 600, letterSpacing: "1px" }}
            >
              Your Profile Overview
            </Card.Subtitle>
            <ListGroup variant="flush" className="fs-5">
              <ListGroup.Item
                style={{ backgroundColor: "transparent", border: "none", color: "#f0f0f0" }}
                className="d-flex align-items-center gap-3 justify-content-center mb-3"
              >
                <FaEnvelope size={24} />
                <span>{details?.email ?? "N/A"}</span>
              </ListGroup.Item>
              <ListGroup.Item
                style={{ backgroundColor: "transparent", border: "none", color: "#f0f0f0" }}
                className="d-flex align-items-center gap-3 justify-content-center"
              >
                <FaPhoneAlt size={24} />
                <span>{details?.mobileNo ?? "N/A"}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <ResetPassword />
      </div>
    </div>
  );
}
