import React from "react";
import { Modal, Button } from "react-bootstrap";

interface LogoutModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  show,
  onHide,
  onConfirm,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Logout</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to log out?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Log Out
      </Button>
    </Modal.Footer>
  </Modal>
);

export default LogoutModal;
