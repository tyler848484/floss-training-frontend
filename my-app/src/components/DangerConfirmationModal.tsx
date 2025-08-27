import { Button, Modal } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";

interface DangerConfirmationModalProps {
  show: boolean;
  cancel: () => void;
  confirm: () => void;
  msg: string;
  loading?: boolean;
}

const DangerConfirmationModal: React.FC<DangerConfirmationModalProps> = ({
  show,
  cancel,
  confirm,
  msg,
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={cancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? <LoadingSpinner msg="Deleting..." /> : msg}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm} disabled={loading}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangerConfirmationModal;
