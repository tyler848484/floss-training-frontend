import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { Child } from "../types";
import { Locations } from "../Locations";
import { useToast } from "../context/ToastContext";
const apiUrl = import.meta.env.VITE_API_URL;

interface FinishBookingModalProps {
  show: boolean;
  onHide: () => void;
  date: string;
  startTime: string;
  endTime: string;
  session_id: number;
  onBookingResult: (success: boolean) => void;
}

const FinishBookingModal: React.FC<FinishBookingModalProps> = ({
  show,
  onHide,
  date,
  startTime,
  endTime,
  session_id,
  onBookingResult,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    Locations[0].name
  );
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
      });
  }, []);

  const handleChildToggle = (id: number) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      setError("Please select a location.");
      return;
    }
    if (selectedChildren.length === 0) {
      setError("Please select at least one child.");
      return;
    }
    setError("");

    const payload = {
      price: totalPrice,
      num_of_kids: selectedChildren.length,
      session_id: session_id,
      child_ids: selectedChildren,
      description: description,
      location: selectedLocation,
    };

    setIsLoading(true);
    axios
      .post(`${apiUrl}/bookings/`, payload)
      .then((response) => {
        if (response.status === 200) {
          onBookingResult(true);
        } else {
          onBookingResult(false);
        }
      })
      .catch(() => {
        onBookingResult(false);
      })
      .finally(() => {
        setIsLoading(false);
        onHide();
      });
  };

  const basePrice = 40;
  const locationPrice =
    Locations.find((loc) => loc.name === selectedLocation)?.price || 0;
  const extraChildren =
    selectedChildren.length > 1 ? selectedChildren.length - 1 : 0;
  const totalPrice = basePrice + locationPrice + extraChildren * 10;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ background: "#eaf1fb" }}>
        <Modal.Title style={{ color: "#1746A2" }}>Book Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: 16 }}>
          <strong>Date:</strong> {date}
          <br />
          <strong>Time:</strong> {startTime} - {endTime}
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label style={{ fontWeight: 600 }}>
              Session Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Describe what you want to work on in this session..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ borderRadius: 8, borderColor: "#1746A2" }}
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="location">
            <Form.Label style={{ fontWeight: 600 }}>Location</Form.Label>
            <Form.Select
              value={selectedLocation ?? ""}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ borderRadius: 8, borderColor: "#1746A2" }}
              disabled={isLoading}
            >
              <option value="" disabled>
                Select a location
              </option>
              {Locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="children">
            <Form.Label style={{ fontWeight: 600 }}>Children</Form.Label>
            <Row>
              {children.length > 0 ? (
                children.map((child) => (
                  <Col xs={6} key={child.id} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`child-${child.id}`}
                      label={child.first_name + " " + child.last_name}
                      checked={
                        child.id !== undefined &&
                        selectedChildren.includes(child.id)
                      }
                      onChange={() =>
                        child.id !== undefined && handleChildToggle(child.id)
                      }
                      style={{ fontWeight: 500 }}
                      disabled={isLoading}
                    />
                  </Col>
                ))
              ) : (
                <p>No children found</p>
              )}
            </Row>
            <Form.Text className="text-muted">
              Select at least one child
            </Form.Text>
          </Form.Group>
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1746A2",
                background: "#fffbe6",
                border: "2px solid #FFD700",
                borderRadius: 10,
                padding: "8px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                minWidth: 140,
              }}
            >
              ${totalPrice} Total
            </div>
            <Button
              type="submit"
              variant="success"
              style={{
                background: "#1746A2",
                border: "none",
                borderRadius: 8,
                minWidth: 120,
              }}
              disabled={isLoading}
            >
              {isLoading ? "Confirming Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FinishBookingModal;
