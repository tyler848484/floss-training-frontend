import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import { PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import axios from "axios";
import { Child } from "../../types";
import DangerConfirmationModal from "../DangerConfirmationModal";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../LoadingSpinner";
import ChildFormCard from "../ChildFormCard";
const apiUrl = import.meta.env.VITE_API_URL;

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
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getChildren = () => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/children/`)
      .then((response) => {
        if (response.status === 200) {
          setChildren(response.data);
        } else {
          showToast("Failed to fetch children.", "danger");
        }
      })
      .catch(() => {
        showToast("Failed to fetch children.", "danger");
      })
      .finally(() => {
        setIsLoading(false);
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
      .post(`${apiUrl}/children/`, {
        ...childForm,
      })
      .then((response) => {
        if (response.status === 200) {
          showToast("Child added successfully!", "success");
        } else {
          showToast("Failed to add child.", "danger");
        }
      })
      .catch(() => {
        showToast("Failed to add child.", "danger");
      })
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
      .put(`${apiUrl}/children/${editingChildId}`, {
        ...childForm,
      })
      .then((response) => {
        if (response.status === 200) {
          showToast("Child updated successfully!", "success");
        } else {
          showToast("Failed to update child.", "danger");
        }
      })
      .catch(() => {
        showToast("Failed to update child.", "danger");
      })
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
        .delete(`${apiUrl}/children/${deleteChildId}`)
        .then((response) => {
          if (response.status === 204) {
            showToast("Child deleted successfully!", "success");
          } else {
            showToast("Failed to delete child.", "danger");
          }
        })
        .catch(() => {
          showToast("Failed to delete child.", "danger");
        })
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
          {isLoading ? (
            <LoadingSpinner msg="Loading children..." />
          ) : (
            children.map((child) =>
              editingChildId === child.id ? (
                <ChildFormCard
                  key={child.id}
                  mode="edit"
                  childForm={childForm}
                  setChildForm={setChildForm}
                  onSave={handleChildSave}
                  onClose={() => {
                    setEditingChildId(null);
                  }}
                  error={error}
                />
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
                          onClick={() =>
                            child.id && handleChildDelete(child.id)
                          }
                          aria-label="Delete Child"
                        >
                          <Trash size={20} />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )
            )
          )}
          <hr />
          {showAddCard ? (
            <ChildFormCard
              mode="add"
              childForm={childForm}
              setChildForm={setChildForm}
              onSave={handleChildAdd}
              onClose={() => {
                setShowAddCard(false);
              }}
              error={error}
            />
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
