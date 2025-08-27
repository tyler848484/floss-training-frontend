import React, { createContext, useState, useContext } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext<any>(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"success" | "danger">("success");

  const showToast = (msg: string, type: "success" | "danger" = "success") => {
    setMessage(msg);
    setVariant(type);
    setShow(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999, color: "#90e6edff" }}
      >
        <Toast
          show={show}
          onClose={() => setShow(false)}
          bg={variant}
          delay={3000}
          autohide
        >
          <Toast.Body
            style={{ color: variant === "success" ? "#ffffffff" : "#ed8e8eff" }}
          >
            {message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};
