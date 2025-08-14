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

interface Child {
  firstName: string;
  lastName: string;
  birthYear: string;
  experience: number;
}
const Profile: React.FC = () => {
  const { user, setProfileComplete } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || localStorage.getItem("user_name") || "";
  const email = user?.email || localStorage.getItem("user_email") || "";
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [childForm, setChildForm] = useState<Child>({
    firstName: "",
    lastName: "",
    birthYear: "",
    experience: 1,
  });
  const [error, setError] = useState("");

  const isValidPhone = (value: string) =>
    /^\d{10}$/.test(value.replace(/\D/g, ""));
  const isValidChild = (child: Child) =>
    child.firstName.trim() &&
    child.lastName.trim() &&
    /^\d{4}$/.test(child.birthYear) &&
    child.experience >= 1 &&
    child.experience <= 5;

  const canComplete =
    isValidPhone(phone) && children.length > 0 && children.every(isValidChild);

  const handleAddChild = () => {
    if (!isValidChild(childForm)) {
      setError("Please fill out all child fields correctly.");
      return;
    }
    setChildren([...children, childForm]);
    setChildForm({ firstName: "", lastName: "", birthYear: "", experience: 1 });
    setError("");
  };

  const handleComplete = () => {
    const payload = {
      phone_number: phone,
      children: children.map((child) => {
        return {
          first_name: child.firstName,
          last_name: child.lastName,
          birth_year: Number(child.birthYear),
          experience: String(child.experience),
        };
      }),
    };
    axios
      .put("http://localhost:8000/parents/me", payload, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
          setProfileComplete(true);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

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
                        {child.firstName} {child.lastName}
                      </strong>
                    </Col>
                    <Col>Birth Year: {child.birthYear}</Col>
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
                        aria-label={`Delete child ${child.firstName} ${child.lastName}`}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <Card
              className="mt-3 mb-2"
              style={{ background: "#eaf1fb", borderRadius: 12 }}
            >
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Control
                      placeholder="First Name"
                      value={childForm.firstName}
                      onChange={(e) =>
                        setChildForm({
                          ...childForm,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      placeholder="Last Name"
                      value={childForm.lastName}
                      onChange={(e) =>
                        setChildForm({ ...childForm, lastName: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      placeholder="Birth Year"
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={childForm.birthYear}
                      onChange={(e) =>
                        setChildForm({
                          ...childForm,
                          birthYear: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={childForm.experience}
                      onChange={(e) =>
                        setChildForm({
                          ...childForm,
                          experience: Number(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl} -{" "}
                          {
                            [
                              "Beginner",
                              "Novice",
                              "Intermediate",
                              "Advanced",
                              "Elite",
                            ][lvl - 1]
                          }
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  className="mt-2"
                  style={{
                    background: "#1746A2",
                    border: "none",
                    borderRadius: 8,
                  }}
                  onClick={handleAddChild}
                >
                  Add Child
                </Button>
                {error && (
                  <Alert variant="danger" className="mt-2">
                    {error}
                  </Alert>
                )}
              </Card.Body>
            </Card>
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
