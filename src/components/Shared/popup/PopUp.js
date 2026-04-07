import { Button, Modal } from "react-bootstrap";
import React, { useEffect } from "react";
// import Popup from 'react-animated-popup'
import "./popup.scss";

// popup with success , error, confirm and alert classes
const PopUp = ({
  show,
  closeAlert,
  msg,
  type = "alert",
  confirmAction,
  confirmText = "OK",
  cancelText = "Cancel",
  autoClose = null,
}) => {
  // useEffect(() => {
  //   if (autoClose && show) {
  //     const timer = setTimeout(() => {
  //       closeAlert();
  //     }, autoClose);
  //     return () => clearTimeout(timer);
  //   }
  // }, [show, autoClose, closeAlert]);

  const headerClass =
    {
      success: "bg-success",
      error: "bg-danger",
      confirm: "bg-primary",
      alert: "bg-primary",
    }[type] || "bg-primary";

  return (
    <Modal show={show} onHide={closeAlert} centered className="popup-modal">
      <Modal.Header closeButton className={`text-white ${headerClass}`}>
        <Modal.Title>
          {type === "success" && "Success"}
          {type === "error" && "Error"}
          {type === "confirm" && "Confirm Action"}
          {type === "alert" && "Notification"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{msg}</Modal.Body>
      <Modal.Footer>
        {type === "confirm" && (
          <Button variant="secondary" onClick={closeAlert}>
            {cancelText}
          </Button>
        )}
        <Button
          variant={
            type === "success"
              ? "success"
              : type === "error"
              ? "danger"
              : type === "confirm"
              ? "danger"
              : "primary"
          }
          onClick={type === "confirm" ? confirmAction : closeAlert}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopUp;
