import { Button, Modal } from "react-bootstrap";

interface DangerConfirmationModalProps {
  show: boolean;
  cancel: () => void;
  confirm: () => void;
  msg: string;
}

const DangerConfirmationModal: React.FC<DangerConfirmationModalProps> = ({
  show,
  cancel,
  confirm,
  msg,
}) => {
  return (
    <Modal show={show} onHide={cancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>{msg}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangerConfirmationModal;
