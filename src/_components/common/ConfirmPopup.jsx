"use client";

import { Modal, Button } from "react-bootstrap";

/**
 * Generic confirmation dialog.
 *
 * Props:
 *  - show         Boolean – open / close
 *  - title        Heading text
 *  - message      Body message
 *  - confirmText  Label for confirm button
 *  - cancelText   Label for cancel button
 *  - onConfirm    Called when user clicks confirm
 *  - onCancel     Called when user cancels / closes
 */
export default function ConfirmPopup({
  show,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDark,
}) {
  return (
    <Modal centered show={show} onHide={onCancel} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fs-6">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className={isDark ? "text-white" : "text-dark"}>
        {message}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
