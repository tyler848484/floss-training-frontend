import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const navItems = [
  { key: "my-account", label: "My Account", path: "my-account" },
  { key: "my-reviews", label: "My Reviews", path: "my-reviews" },
  { key: "my-sessions", label: "My Sessions", path: "my-sessions" },
];

const MyAccount: React.FC = () => {
  const { user, isLoggedIn, profileComplete, setShowLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection =
    navItems.find((item) => location.pathname.includes(item.path)) ||
    navItems[0];

  return (
    <Container fluid>
      <Row>
        <Col
          xs={12}
          md={3}
          style={{
            backgroundColor: "#f8f9fa",
            height: "auto",
          }}
        >
          <h5 className="mb-4 fw-bold">{user?.name ?? "My Account"}</h5>
          <Nav className="flex-column" activeKey={activeSection.key}>
            {navItems.map((item) => (
              <Nav.Item key={item.key}>
                <Nav.Link
                  eventKey={item.key}
                  className={
                    activeSection.key === item.key
                      ? "account-nav-link active"
                      : "account-nav-link"
                  }
                  onClick={() => navigate(`/account/${item.path}`)}
                >
                  {item.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>

        <Col
          xs={12}
          md={9}
          className="p-4"
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          {isLoggedIn && profileComplete ? (
            <Outlet />
          ) : !isLoggedIn ? (
            <div>
              <h4>Please log in to see {activeSection.label}.</h4>
              <Button
                className="btn btn-primary mt-2"
                onClick={() => setShowLoginModal(true)}
              >
                Log In
              </Button>
            </div>
          ) : (
            <div>
              <h4>
                Please complete your profile to see {activeSection.label}.
              </h4>
              <Button
                className="btn btn-warning mt-2"
                onClick={() => {
                  sessionStorage.setItem("path", window.location.pathname);
                  navigate("/complete-profile");
                }}
              >
                Complete Profile
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyAccount;
