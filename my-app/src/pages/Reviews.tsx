import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface Review {
  id: number;
  first_name: string;
  parent_id: number;
  rating: number;
  description: string;
  date: string;
}

const Reviews: React.FC = () => {
  const { isLoggedIn, profileComplete } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [submitting, setSubmitting] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      date: new Date().toISOString().split("T")[0],
      rating: rating,
      description: description,
    };

    axios
      .post(`http://localhost:8000/reviews/`, payload)
      .then((response) => {
        if (response.status === 200) {
          setToastMessage("Review submitted successfully!");
          setToastVariant("success");
        } else {
          setToastMessage("Failed to submit review.");
          setToastVariant("danger");
        }
      })
      .catch(() => {
        setToastMessage("Failed to submit review.");
        setToastVariant("danger");
      })
      .finally(() => {
        setShowToast(true);
        fetchReviews();
        setSubmitting(false);
      });

    setRating(5);
    setDescription("");
    setError("");
  };

  const fetchReviews = () => {
    axios
      .get(`http://localhost:8000/reviews/`)
      .then((response) => {
        if (response.status === 200) {
          setReviews(response.data);
        }
      })
      .catch(() => {
        setReviews([]);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h2 style={{ color: "#1746A2", fontWeight: 700, marginBottom: 24 }}>
        Reviews
      </h2>
      <Card className="shadow mb-4" style={{ borderRadius: 16 }}>
        <Card.Body>
          <h4 style={{ color: "#333", fontWeight: 600 }}>Add Your Review</h4>
          {isLoggedIn && profileComplete ? (
            <Form onSubmit={handleAddReview}>
              <Row className="align-items-center mb-2">
                <Col xs={12} md={3}>
                  <Form.Label style={{ fontWeight: 600 }}>Rating</Form.Label>
                  <Form.Select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    style={{ borderRadius: 8, borderColor: "#1746A2" }}
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? "s" : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={12} md={9}>
                  <Form.Label style={{ fontWeight: 600 }}>
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Write your review..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ borderRadius: 8, borderColor: "#1746A2" }}
                  />
                </Col>
              </Row>
              {error && (
                <Alert variant="danger" className="mt-2">
                  {error}
                </Alert>
              )}
              <div className="d-flex justify-content-end mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    background: "#1746A2",
                    border: "none",
                    borderRadius: 8,
                  }}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </Form>
          ) : (
            <Alert variant="info" className="mt-2">
              You must be signed in and have completed your profile to submit a
              review.
            </Alert>
          )}
        </Card.Body>
      </Card>
      {reviews.length === 0 ? (
        <h5>No reviews yet.</h5>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-3">
          {reviews.map((review) => (
            <Col key={review.id}>
              <Card
                className="shadow"
                style={{
                  borderRadius: 14,
                  background: "#f6faff",
                  height: "100%",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div style={{ fontWeight: 600, fontSize: 18 }}>
                      {review.first_name}
                    </div>
                    <div
                      style={{
                        color: "#FFD700",
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div style={{ color: "#888", fontSize: 14, marginBottom: 4 }}>
                    {review.date}
                  </div>
                  <div style={{ color: "#333", fontSize: 16 }}>
                    {review.description}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toastVariant}
          delay={3000}
          autohide
        >
          <Toast.Body
            style={{ color: toastVariant === "success" ? "#1746A2" : "#fff" }}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Reviews;
