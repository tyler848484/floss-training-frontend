import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import { PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import axios from "axios";
import { Child } from "../types";
import DangerConfirmationModal from "./DangerConfirmationModal";

const ChildrenInfoCard: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [childForm, setChildForm] = useState<Child>({
    first_name: "",
    last_name: "",
    birth_year: 2000,
    experience: "1 - Beginner",
  });
  const [editingChildId, setEditingChildId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteChildId, setDeleteChildId] = useState<number | null>(null);

  const getChildren = () => {
    axios
      .get(`http://localhost:8000/children/`)
      .then((response) => {
        if (response.status === 200) {
          setChildren(response.data);
        }
      })
      .catch(() => {
        setChildren([]);
      });
  };

  const handleChildAdd = () => {
    if (
      !childForm.first_name.trim() ||
      !childForm.last_name.trim() ||
      !/^\d{4}$/.test(String(childForm.birth_year))
    ) {
      setError("Please fill out all child fields correctly.");
      return;
    }

    axios
      .post(`http://localhost:8000/children/`, {
        ...childForm,
      })
      .then((response) => {})
      .catch(() => {})
      .finally(() => {
        getChildren();
        setChildForm({
          first_name: "",
          last_name: "",
          birth_year: 2000,
          experience: "1 - Beginner",
        });
        setShowAddCard(false);
        setError("");
      });
  };

  const handleChildEdit = (child: Child) => {
    setChildForm(child);
    setEditingChildId(child.id ?? null);
  };

  const handleChildSave = () => {
    if (
      !childForm.first_name.trim() ||
      !childForm.last_name.trim() ||
      !/^\d{4}$/.test(String(childForm.birth_year))
    ) {
      setError("Please fill out all child fields correctly.");
      return;
    }

    axios
      .put(`http://localhost:8000/children/${editingChildId}`, {
        ...childForm,
      })
      .then((response) => {})
      .catch(() => {})
      .finally(() => {
        getChildren();
        setEditingChildId(null);
        setError("");
      });
  };

  const handleChildDelete = (id: number) => {
    setDeleteChildId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteChild = () => {
    if (deleteChildId !== null) {
      axios
        .delete(`http://localhost:8000/children/${deleteChildId}`)
        .then((response) => {})
        .catch(() => {})
        .finally(() => {
          getChildren();
        });
    }
    setShowDeleteModal(false);
    setDeleteChildId(null);
  };

  const cancelDeleteChild = () => {
    setShowDeleteModal(false);
    setDeleteChildId(null);
  };

  useEffect(() => {
    getChildren();
  }, []);

  return (
    <>
      <Card className="shadow" style={{ borderRadius: 16 }}>
        <Card.Body>
          <h4 style={{ color: "#1746A2", fontWeight: 700 }}>Children</h4>
          {children.length === 0 && (
            <div className="text-muted mb-2">No children added yet.</div>
          )}
          {children.map((child) =>
            editingChildId === child.id ? (
              <Card
                key={child.id}
                className="mb-2"
                style={{ background: "#fffbe6", borderRadius: 12 }}
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
                        variant="success"
                        style={{ borderRadius: 8 }}
                        onClick={handleChildSave}
                      >
                        Save
                      </Button>
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
                          setEditingChildId(null);
                          setError("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <Card
                key={child.id}
                className="mb-2"
                style={{ background: "#f6faff", borderRadius: 12 }}
              >
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={12} sm={3}>
                      <strong>
                        {child.first_name} {child.last_name}
                      </strong>
                    </Col>
                    <Col xs={12} sm={3}>
                      Birth Year: {child.birth_year}
                    </Col>
                    <Col xs={12} sm={3}>
                      Experience: {child.experience}
                    </Col>
                    <Col
                      xs={12}
                      sm={3}
                      className="d-flex align-items-center justify-content-end"
                      style={{ gap: 12 }}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        style={{ borderRadius: 8, padding: "4px 8px" }}
                        onClick={() => handleChildEdit(child)}
                        aria-label="Edit Child"
                      >
                        <PencilSquare size={20} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{ borderRadius: 8, padding: "4px 8px" }}
                        onClick={() => child.id && handleChildDelete(child.id)}
                        aria-label="Delete Child"
                      >
                        <Trash size={20} />
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )
          )}
          <hr />
          {showAddCard ? (
            <Card
              className="mb-2"
              style={{ background: "#e6f7ff", borderRadius: 12 }}
            >
              <Card.Body>
                <Form>
                  <Row>
                    <Col xs={12} sm={3} className="mb-2">
                      <Form.Group controlId="addChildFirstName">
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
                      <Form.Group controlId="addChildLastName">
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
                      <Form.Group controlId="addChildBirthYear">
                        <Form.Label>Birth Year</Form.Label>
                        <Form.Control
                          placeholder="Birth Year"
                          type="number"
                          min="2000"
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
                      <Form.Group controlId="addChildExperience">
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
                      variant="primary"
                      style={{ borderRadius: 8 }}
                      onClick={handleChildAdd}
                    >
                      Add Child
                    </Button>
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
                        setShowAddCard(false);
                        setError("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Button
              variant="primary"
              style={{ borderRadius: 8, padding: "4px 8px" }}
              onClick={() => {
                setChildForm({
                  id: 0,
                  first_name: "",
                  last_name: "",
                  birth_year: 2000,
                  experience: "1 - Beginner",
                });
                setShowAddCard(true);
                setEditingChildId(null);
                setError("");
              }}
              aria-label="Add Child"
            >
              <PlusCircle size={22} />
            </Button>
          )}
        </Card.Body>
      </Card>
      <DangerConfirmationModal
        show={showDeleteModal}
        cancel={cancelDeleteChild}
        confirm={confirmDeleteChild}
        msg="Are you sure you want to delete this child from your account?"
      />
    </>
  );
};

export default ChildrenInfoCard;
