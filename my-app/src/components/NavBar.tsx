import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "./AuthModals/LogoutModal";
import { Button, Offcanvas, Nav, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import LoginModal from "./AuthModals/LoginModal";

const NavBar: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { isLoggedIn, logout, showLoginModal, setShowLoginModal } = useAuth();
  const [localName, setLocalName] = useState(
    localStorage.getItem("user_name") || ""
  );
  useEffect(() => {
    setLocalName(localStorage.getItem("user_name") || "");
  }, [isLoggedIn]);

  return (
    <div
      style={{
        background: "#1746a2",
        color: "#fff",
        padding: "0.5rem 0",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1040,
      }}
    >
      <Container
        fluid
        className="d-flex align-items-center justify-content-between px-4"
      >
        <div className="d-flex align-items-center">
          <Button
            variant="primary"
            onClick={handleShow}
            style={{ background: "#1746a2", border: "none" }}
          >
            <span style={{ fontSize: "2rem" }}>&#9776;</span>
          </Button>
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.5rem",
              marginLeft: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/Soccer_ball.png"
              alt="Soccer Ball"
              style={{ width: 40, height: 40, marginRight: 12 }}
            />
            Floss Private Soccer Coaching
          </Link>
        </div>
        <div className="d-flex align-items-center">
          {isLoggedIn && localName ? (
            <>
              <span style={{ color: "#fff", fontWeight: 600, marginRight: 16 }}>
                {localName}
              </span>
              <Button
                variant="outline-light"
                onClick={() => setShowLogout(true)}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline-light" onClick={() => setShowLogin(true)}>
              Login
            </Button>
          )}
        </div>
      </Container>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        style={{ background: "#1746a2", color: "#fff" }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <NavLink
              to="/book"
              className="nav-link"
              onClick={handleClose}
              style={{ color: "#fff" }}
            >
              <span className="me-2" role="img" aria-label="session">
                📅
              </span>{" "}
              Book a Session
            </NavLink>
            <NavLink
              to="/reviews"
              className="nav-link"
              onClick={handleClose}
              style={{ color: "#fff" }}
            >
              <span className="me-2" role="img" aria-label="reviews">
                ⭐
              </span>{" "}
              Reviews
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              onClick={handleClose}
              style={{ color: "#fff" }}
            >
              <span className="me-2" role="img" aria-label="about">
                👤
              </span>{" "}
              About The Coach
            </NavLink>
            <NavLink
              to="/account"
              className="nav-link"
              onClick={handleClose}
              style={{ color: "#fff" }}
            >
              <span className="me-2" role="img" aria-label="account">
                ⚙️
              </span>{" "}
              My Account
            </NavLink>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <LoginModal
        show={showLogin || showLoginModal}
        onHide={() => {
          setShowLogin(false);
          setShowLoginModal(false);
        }}
      />
      <LogoutModal
        show={showLogout}
        onHide={() => setShowLogout(false)}
        onConfirm={() => {
          logout();
          setShowLogout(false);
        }}
      />
    </div>
  );
};

export default NavBar;
