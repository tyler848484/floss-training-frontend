import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, ListGroup, Form, Row, Col } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Review } from "../types";
import DangerConfirmationModal from "./DangerConfirmationModal";

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    rating: number;
    description: string;
  }>({ rating: 5, description: "" });
  const [error, setError] = useState("");

  const fetchReviews = () => {
    axios
      .get("http://localhost:8000/reviews/by_parent")
      .then((response) => {
        if (response.status === 200) {
          setReviews(response.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = () => {
    axios
      .delete(`http://localhost:8000/reviews/${deletingId}`)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setDeletingId(null);
        fetchReviews();
      });
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ rating: review.rating, description: review.description });
    setError("");
  };

  const handleEditSave = (id: number) => {
    if (!editForm.description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    axios
      .put(`http://localhost:8000/reviews/${id}`, {
        rating: editForm.rating,
        description: editForm.description,
      })
      .then(() => {})
      .catch(() => setError("Failed to update review."))
      .finally(() => {
        setEditingId(null);
        fetchReviews();
      });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setError("");
  };

  return (
    <>
      <Card className="shadow" style={{ borderRadius: 16 }}>
        <Card.Body>
          <h4 style={{ color: "#1746A2", fontWeight: 700 }}>My Reviews</h4>
          {reviews.length === 0 ? (
            <div className="text-muted mb-2">No reviews yet.</div>
          ) : (
            <ListGroup variant="flush">
              {reviews.map((review) => (
                <ListGroup.Item
                  key={review.id}
                  className="mb-3 p-3"
                  style={{
                    borderRadius: 14,
                    background: "#f6faff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {editingId === review.id ? (
                    <div>
                      <div className="mb-2">
                        <strong>Date:</strong> {review.date}
                      </div>
                      <Form>
                        <Form.Group className="mb-2">
                          <Form.Label>Rating</Form.Label>
                          <Form.Select
                            value={editForm.rating}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                rating: Number(e.target.value),
                              })
                            }
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>
                                {n} Star{n > 1 ? "s" : ""}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        {error && (
                          <div className="text-danger mb-2">{error}</div>
                        )}
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            style={{ borderRadius: 8 }}
                            onClick={() => handleEditSave(review.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{ borderRadius: 8 }}
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </div>
                  ) : (
                    <Row className="align-items-center">
                      <Col xs={12} md={9}>
                        <div
                          style={{
                            fontSize: 15,
                            marginBottom: 2,
                            textAlign: "left",
                          }}
                        >
                          <strong>Date:</strong> {review.date}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            marginBottom: 2,
                            textAlign: "left",
                          }}
                        >
                          <strong>Rating:</strong> {review.rating} Star
                          {review.rating > 1 ? "s" : ""}
                        </div>
                        <div style={{ fontSize: 15, textAlign: "left" }}>
                          <strong>Description:</strong> {review.description}
                        </div>
                      </Col>
                      <Col
                        xs={12}
                        md={3}
                        className="d-flex align-items-center justify-content-end"
                        style={{ gap: 16 }}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ borderRadius: 8, padding: "4px 8px" }}
                          onClick={() => handleEdit(review)}
                          aria-label="Edit Review"
                        >
                          <PencilSquare size={20} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          style={{ borderRadius: 8, padding: "4px 8px" }}
                          onClick={() => setDeletingId(review.id)}
                          aria-label="Delete Review"
                        >
                          <Trash size={20} />
                        </Button>
                      </Col>
                    </Row>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
      <DangerConfirmationModal
        show={!!deletingId}
        confirm={deleteReview}
        cancel={() => setDeletingId(null)}
        msg="Are you sure you want to delete this review?"
      />
    </>
  );
};

export default ReviewsSection;
