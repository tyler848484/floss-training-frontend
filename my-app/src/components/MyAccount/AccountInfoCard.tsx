import React, { useState } from "react";
import { Card, Button, ListGroup, Form } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { PencilSquare } from "react-bootstrap-icons";
import { useToast } from "../../context/ToastContext";
const apiUrl = import.meta.env.VITE_API_URL;

const isValidPhone = (value: string) =>
  /^\d{10}$/.test(value.replace(/\D/g, ""));

const AccountInfoCard: React.FC = () => {
  const { user, login } = useAuth();
  const [editPhoneNumber, setEditPhoneNumber] = useState(
    user?.phone_number || ""
  );
  const [editingUser, setEditingUser] = useState(false);
  const [userError, setUserError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleUserEdit = () => {
    setEditingUser(true);
    setUserError("");
  };
  const handleUserSave = () => {
    if (!isValidPhone(editPhoneNumber || "")) {
      setUserError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsLoading(true);
    axios
      .put(`${apiUrl}/parents/phone`, {
        phone_number: editPhoneNumber,
      })
      .then((response) => {
        if (response.status === 200) {
          showToast("Phone number updated successfully!", "success");
        } else {
          showToast("Failed to update phone number.", "danger");
        }
      })
      .catch(() => {
        showToast("Failed to update phone number.", "danger");
      })
      .finally(() => {
        login(window.location.pathname);
        setEditingUser(false);
        setIsLoading(false);
      });
  };

  return (
    <Card className="shadow mb-4" style={{ borderRadius: 16 }}>
      <Card.Body>
        <h4 style={{ color: "#1746A2", fontWeight: 700 }}>Account Info</h4>
        {editingUser ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={editPhoneNumber}
                onChange={(e) => setEditPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit phone number"
                isInvalid={!!editPhoneNumber && !isValidPhone(editPhoneNumber)}
                disabled={isLoading}
              />
              {userError && (
                <Form.Text className="text-danger">{userError}</Form.Text>
              )}
            </Form.Group>
            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={handleUserSave}
                style={{ borderRadius: 8 }}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setEditingUser(false)}
                style={{ borderRadius: 8 }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <div className="mb-3">
            <div>
              <strong>Name:</strong> {user?.name}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Phone:</strong> {user?.phone_number?.substring(0, 3)}-
              {user?.phone_number?.substring(3, 6)}-
              {user?.phone_number?.substring(6)}
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              style={{ borderRadius: 8, padding: "4px 8px" }}
              onClick={handleUserEdit}
              aria-label="Edit User"
            >
              <PencilSquare size={20} />
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AccountInfoCard;
