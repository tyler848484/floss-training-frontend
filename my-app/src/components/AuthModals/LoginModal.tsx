import React from "react";
import { Modal, Button } from "react-bootstrap";

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onHide }) => {
  const handleGoogleLogin = () => {
    const currentPath = window.location.pathname;
    sessionStorage.setItem("path", currentPath);
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>Login to your account using Google:</p>
        <Button
          variant="danger"
          size="lg"
          style={{ fontWeight: 600, fontSize: "1.1rem" }}
          onClick={handleGoogleLogin}
        >
          <span style={{ marginRight: 8, fontSize: "1.3em" }}>🔒</span>
          Login with Google
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
