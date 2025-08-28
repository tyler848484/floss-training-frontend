import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { BookingSummary } from "../types";
import DangerConfirmationModal from "./DangerConfirmationModal";
import EditBookingModal from "./EditBookingModal";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "./LoadingSpinner";
const apiUrl = import.meta.env.VITE_API_URL;

const SessionsSection: React.FC = () => {
  const [sessions, setSessions] = useState<BookingSummary[]>([]);
  const [pastSessions, setPastSessions] = useState<BookingSummary[]>([]);
  const [futureSessions, setFutureSessions] = useState<BookingSummary[]>([]);
  const [showPast, setShowPast] = useState(true);
  const [showFuture, setShowFuture] = useState(true);
  const [editingSession, setEditingSession] = useState<BookingSummary | null>(
    null
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const fetchSessions = () => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/bookings`)
      .then((response) => {
        if (response.status === 200) {
          setSessions(response.data);
        } else {
          showToast("Failed to fetch sessions.", "danger");
        }
      })
      .catch(() => {
        showToast("Failed to fetch sessions.", "danger");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const past: BookingSummary[] = [];
    const future: BookingSummary[] = [];
    sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      if (sessionDate < today) {
        past.push(session);
      } else {
        future.push(session);
      }
    });
    setPastSessions(past);
    setFutureSessions(future);
  }, [sessions]);

  const handleEditSession = (session: BookingSummary) => {
    setEditingSession(session);
    setShowBookingModal(true);
  };

  const handleDeleteSession = (id: number) => {
    setDeleteSessionId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteSession = () => {
    if (deleteSessionId !== null) {
      setSaving(true);
      axios
        .delete(`${apiUrl}/bookings/${deleteSessionId}`)
        .then((response) => {
          if (response.status === 204) {
            showToast("Session deleted successfully!", "success");
          } else {
            showToast("Failed to delete session.", "danger");
          }
        })
        .catch(() => {
          showToast("Failed to delete session.", "danger");
        })
        .finally(() => {
          setSaving(false);
          setShowDeleteModal(false);
          setDeleteSessionId(null);
          fetchSessions();
        });
    }
  };

  const handleBookingResult = (success: boolean) => {
    if (success) {
      showToast("Booking successful!", "success");
    } else {
      showToast("Booking failed.", "danger");
    }
    setShowBookingModal(false);
    setEditingSession(null);
    fetchSessions();
  };

  if (isLoading) {
    return <LoadingSpinner msg="Loading sessions..." />;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Card className="mb-4 shadow" style={{ borderRadius: 16 }}>
        <Card.Header
          style={{ cursor: "pointer", background: "#eaf1fb" }}
          onClick={() => setShowFuture((prev) => !prev)}
        >
          <h5 style={{ color: "#1746A2", fontWeight: 700, marginBottom: 0 }}>
            Future Sessions ({futureSessions.length}) {showFuture ? "▼" : "▲"}
          </h5>
        </Card.Header>
        {showFuture && (
          <ListGroup variant="flush">
            {futureSessions.length === 0 ? (
              <ListGroup.Item className="text-muted">
                No future sessions.
              </ListGroup.Item>
            ) : (
              futureSessions.map((session) => (
                <ListGroup.Item
                  key={session.id}
                  className="mb-3 p-3"
                  style={{
                    borderRadius: 14,
                    background: "#f6faff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col-12 col-md-9">
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Date:</strong> {session.date}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Time:</strong> {session.start_time} -{" "}
                        {session.end_time}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Location:</strong> {session.location}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Price:</strong> ${session.price}
                      </div>
                      <div style={{ fontSize: 15, textAlign: "left" }}>
                        <strong>Description:</strong> {session.description}
                      </div>
                    </div>
                    <div
                      className="col-12 col-md-3 d-flex align-items-center justify-content-end"
                      style={{ gap: 16 }}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        style={{ borderRadius: 8, padding: "4px 8px" }}
                        onClick={() => handleEditSession(session)}
                        aria-label="Edit Session"
                      >
                        <PencilSquare size={20} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{ borderRadius: 8, padding: "4px 8px" }}
                        onClick={() => handleDeleteSession(session.id)}
                        aria-label="Delete Session"
                      >
                        <Trash size={20} />
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        )}
      </Card>

      {/* Past Sessions */}
      <Card className="mb-4 shadow" style={{ borderRadius: 16 }}>
        <Card.Header
          style={{ cursor: "pointer", background: "#eaf1fb" }}
          onClick={() => setShowPast((prev) => !prev)}
        >
          <h5 style={{ color: "#1746A2", fontWeight: 700, marginBottom: 0 }}>
            Past Sessions ({pastSessions.length}) {showPast ? "▼" : "▲"}
          </h5>
        </Card.Header>
        {showPast && (
          <ListGroup variant="flush">
            {pastSessions.length === 0 ? (
              <ListGroup.Item className="text-muted">
                No past sessions.
              </ListGroup.Item>
            ) : (
              pastSessions.map((session) => (
                <ListGroup.Item
                  key={session.id}
                  className="mb-3 p-3"
                  style={{
                    borderRadius: 14,
                    background: session.paid ? "#e6ffe6" : "#ffe6e6",
                    color: session.paid ? "#228B22" : "#B22222",
                    borderLeft: `6px solid ${
                      session.paid ? "#228B22" : "#B22222"
                    }`,
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col-12 col-md-9">
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Date:</strong> {session.date}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Time:</strong> {session.start_time} -{" "}
                        {session.end_time}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Location:</strong> {session.location}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          marginBottom: 2,
                          textAlign: "left",
                        }}
                      >
                        <strong>Price:</strong> ${session.price}
                      </div>
                      <div style={{ fontSize: 15, textAlign: "left" }}>
                        <strong>Description:</strong> {session.description}
                      </div>
                    </div>
                    <div
                      className="col-12 col-md-3 d-flex align-items-center justify-content-end"
                      style={{ gap: 16 }}
                    >
                      <span>
                        Paid:{" "}
                        <span style={{ fontWeight: 700 }}>
                          {session.paid ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        )}
      </Card>

      {editingSession && (
        <EditBookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          booking={editingSession}
          handleBookingResult={handleBookingResult}
        />
      )}

      <DangerConfirmationModal
        show={showDeleteModal}
        cancel={() => setShowDeleteModal(false)}
        confirm={confirmDeleteSession}
        msg="Are you sure you want to delete this session?"
        loading={saving}
      />
    </div>
  );
};

export default SessionsSection;
