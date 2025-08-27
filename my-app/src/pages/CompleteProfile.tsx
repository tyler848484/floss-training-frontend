import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { Child } from "../types";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ChildFormCard from "../components/ChildFormCard";
const Profile: React.FC = () => {
  const { user, setProfileComplete } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || localStorage.getItem("user_name") || "";
  const email = user?.email || localStorage.getItem("user_email") || "";
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [childForm, setChildForm] = useState<Child>({
    first_name: "",
    last_name: "",
    birth_year: 2000,
    experience: "1 - Beginner",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const isValidPhone = (value: string) =>
    /^\d{10}$/.test(value.replace(/\D/g, ""));
  const isValidChild = (child: Child) =>
    child.first_name.trim() &&
    child.last_name.trim() &&
    /^\d{4}$/.test(String(child.birth_year));

  const canComplete =
    isValidPhone(phone) && children.length > 0 && children.every(isValidChild);

  const handleAddChild = () => {
    if (!isValidChild(childForm)) {
      setError("Please fill out all child fields correctly.");
      return;
    }
    setChildren([...children, childForm]);
    setChildForm({
      first_name: "",
      last_name: "",
      birth_year: 2000,
      experience: "1 - Beginner",
    });
    setError("");
  };

  const handleComplete = () => {
    setIsLoading(true);
    const payload = {
      phone_number: phone,
      children: children.map((child) => {
        return {
          first_name: child.first_name,
          last_name: child.last_name,
          birth_year: child.birth_year,
          experience: child.experience,
        };
      }),
    };
    axios
      .put("http://localhost:8000/parents/me", payload)
      .then((response) => {
        if (response.status === 200) {
          const storedPath = sessionStorage.getItem("path");
          showToast("Profile updated successfully!", "success");
          navigate(storedPath || "/");
          setProfileComplete(true);
        } else {
          showToast("Failed to update profile.", "danger");
        }
      })
      .catch(() => {
        showToast("Failed to update profile.", "danger");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <LoadingSpinner msg="Finishing profile setup..." />;
  }

  return (
    <div
      className="profile-page"
      style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}
    >
      <h2
        style={{
          color: "#1746A2",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Please complete your profile setup before using the site
      </h2>
      <Card className="shadow" style={{ borderRadius: 16 }}>
        <Card.Body>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#222",
              marginBottom: 4,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
            {email}
          </div>
          <hr />
          <Form>
            <Form.Group controlId="phone">
              <Form.Label style={{ fontWeight: 600 }}>Phone Number</Form.Label>
              <InputGroup>
                <Form.Control
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={!!phone && !isValidPhone(phone)}
                />
              </InputGroup>
              <Form.Text className="text-muted">Required</Form.Text>
            </Form.Group>
            <hr />
            <h4 style={{ color: "#333", fontWeight: 600 }}>Children</h4>
            {children.length === 0 && (
              <div className="text-muted mb-2">
                Add at least one child to continue.
              </div>
            )}
            {children.map((child, idx) => (
              <Card
                key={idx}
                className="mb-2"
                style={{ background: "#f6faff", borderRadius: 12 }}
              >
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <strong>
                        {child.first_name} {child.last_name}
                      </strong>
                    </Col>
                    <Col>Birth Year: {child.birth_year}</Col>
                    <Col>
                      Experience:{" "}
                      <span style={{ color: "#1746A2", fontWeight: 600 }}>
                        {child.experience}
                      </span>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{ borderRadius: 8 }}
                        onClick={() =>
                          setChildren(children.filter((_, i) => i !== idx))
                        }
                        aria-label={`Delete child ${child.first_name} ${child.last_name}`}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <ChildFormCard
              childForm={childForm}
              setChildForm={setChildForm}
              onSave={handleAddChild}
              mode="profile_complete"
              error={error}
            />
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="success"
                style={{
                  background: canComplete ? "#1746A2" : "#aaa",
                  border: "none",
                  borderRadius: 8,
                  minWidth: 160,
                }}
                disabled={!canComplete}
                onClick={handleComplete}
              >
                Complete Setup
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
