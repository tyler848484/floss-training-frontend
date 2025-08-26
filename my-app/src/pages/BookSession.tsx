import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "../App.css";
import FinishBookingModal from "../components/FinishBookingModal";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Session } from "../types";

const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

function formatTime12HourNoLeadingZero(timeStr: string, dateStr: string) {
  let [h, m, s] = timeStr.split(":");
  if (!s) s = "00";
  const dt = new Date(
    `${dateStr}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s}`
  );
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  let formatted = dt.toLocaleTimeString("en-US", options);
  formatted = formatted.replace(/^0/, "");
  return formatted;
}

const BookSession: React.FC = () => {
  const { isLoggedIn, profileComplete, setShowLoginModal } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(params.date);
  const [sessionData, setSessionData] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const handleBookClick = (sessionId: number) => {
    if (isLoggedIn && profileComplete) {
      const session = sessionData.find((s) => s.id === sessionId) || null;
      setSelectedSession(session);
      setShowModal(true);
    } else if (isLoggedIn && !profileComplete) {
      sessionStorage.setItem("path", window.location.pathname);
      navigate("/complete-profile");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedSession(null);
  };

  const handleBookingResult = (success: boolean) => {
    if (success) {
      setToastMessage("Session booked successfully!");
      setToastVariant("success");
    } else {
      setToastMessage("Failed to book session.");
      setToastVariant("danger");
    }
    fetchSessions();
    setShowToast(true);
  };

  const fetchSessions = () => {
    axios
      .get(`http://localhost:8000/sessions/${selectedDate}`)
      .then((response) => {
        if (response.status === 200) {
          setSessionData(response.data);
        }
      })
      .catch(() => {
        setSessionData([]);
      });
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedDate]);

  return (
    <Container style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <Card className="shadow" style={{ borderRadius: 16 }}>
        <Card.Body>
          <h2 style={{ color: "#1746A2", fontWeight: 700 }}>Book a Session</h2>
          <Form.Group as={Row} className="mb-4" controlId="date">
            <Form.Label column sm={3} style={{ fontWeight: 600 }}>
              Select Date
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="date"
                min={getToday()}
                value={selectedDate}
                onChange={(e) => {
                  navigate(`/book/${e.target.value}`);
                  setSelectedDate(e.target.value);
                }}
                style={{ borderRadius: 8, borderColor: "#1746A2" }}
              />
            </Col>
          </Form.Group>
          <hr />
          <h4 style={{ color: "#1746A2", fontWeight: 600 }}>
            Available Sessions
          </h4>
          <Row>
            {sessionData.length > 0 ? (
              sessionData.map((session) => (
                <Col md={6} key={session.id} className="mb-3">
                  <Card style={{ background: "#eaf1fb", borderRadius: 12 }}>
                    <Card.Body>
                      <div style={{ fontWeight: 600, color: "#1746A2" }}>
                        {formatTime12HourNoLeadingZero(
                          session.start_time,
                          session.date
                        )}{" "}
                        -{" "}
                        {formatTime12HourNoLeadingZero(
                          session.end_time,
                          session.date
                        )}
                      </div>
                      <Button
                        variant="primary"
                        style={{
                          background: "#1746A2",
                          border: "none",
                          borderRadius: 8,
                          marginTop: 12,
                          minWidth: 120,
                        }}
                        onClick={() => handleBookClick(session.id)}
                      >
                        Book Session
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <h5>No available sessions. Try a different day.</h5>
            )}
          </Row>
        </Card.Body>
      </Card>

      {selectedSession && (
        <FinishBookingModal
          show={showModal}
          onHide={handleClose}
          date={selectedSession.date}
          startTime={formatTime12HourNoLeadingZero(
            selectedSession.start_time,
            selectedSession.date
          )}
          endTime={formatTime12HourNoLeadingZero(
            selectedSession.end_time,
            selectedSession.date
          )}
          session_id={selectedSession.id}
          onBookingResult={handleBookingResult}
        />
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
    </Container>
  );
};

export default BookSession;
