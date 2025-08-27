import React from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Child } from "../types";

interface ChildFormCardProps {
  childForm: Child;
  setChildForm: React.Dispatch<React.SetStateAction<Child>>;
  onSave: () => void;
  onClose?: () => void;
  mode: "edit" | "add" | "profile_complete";
  error: string;
}

const ChildFormCard: React.FC<ChildFormCardProps> = ({
  childForm,
  setChildForm,
  onSave,
  onClose,
  mode,
  error,
}) => {
  return (
    <Card
      className="mb-2"
      style={{
        background: mode === "edit" ? "#fffbe6" : "#e6f7ff",
        borderRadius: 12,
      }}
    >
      <Card.Body>
        <Form>
          <Row>
            <Col xs={12} sm={3} className="mb-2">
              <Form.Group controlId="childFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  placeholder="First Name"
                  value={childForm.first_name}
                  onChange={(e) =>
                    setChildForm({
                      ...childForm,
                      first_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={3} className="mb-2">
              <Form.Group controlId="childLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  placeholder="Last Name"
                  value={childForm.last_name}
                  onChange={(e) =>
                    setChildForm({
                      ...childForm,
                      last_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={3} className="mb-2">
              <Form.Group controlId="childBirthYear">
                <Form.Label>Birth Year</Form.Label>
                <Form.Control
                  placeholder="Birth Year"
                  type="number"
                  max={new Date().getFullYear()}
                  value={childForm.birth_year}
                  onChange={(e) =>
                    setChildForm({
                      ...childForm,
                      birth_year: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={3} className="mb-2">
              <Form.Group controlId="childExperience">
                <Form.Label>Experience</Form.Label>
                <Form.Select
                  value={childForm.experience}
                  onChange={(e) =>
                    setChildForm({
                      ...childForm,
                      experience: e.target.value,
                    })
                  }
                >
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <option
                      key={lvl}
                      value={`${lvl} - ${
                        [
                          "Beginner",
                          "Novice",
                          "Intermediate",
                          "Advanced",
                          "Elite",
                        ][lvl - 1]
                      }`}
                    >
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
              </Form.Group>
            </Col>
          </Row>
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
          <div className="d-flex gap-2 mt-2">
            <Button
              variant={mode === "edit" ? "success" : "primary"}
              style={{ borderRadius: 8 }}
              onClick={onSave}
            >
              {mode === "edit" ? "Save" : "Add Child"}
            </Button>
            {mode !== "profile_complete" && (
              <Button
                variant="outline-secondary"
                style={{ borderRadius: 8 }}
                onClick={() => {
                  setChildForm({
                    id: 0,
                    first_name: "",
                    last_name: "",
                    birth_year: 2000,
                    experience: "1 - Beginner",
                  });
                  onClose && onClose();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChildFormCard;
