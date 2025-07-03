import React from "react";
import { Modal, Button } from "react-bootstrap";
import Image from "next/image";

const ACCENT = "#A4E5DF"; // mint highlight
const ACCENT_DARK = "#04524A"; // readable text over light mint
const BG_LIGHT = "#F6FFFD"; // very light mint‑tinted background

export default function ImagePopup({
  show,
  src,
  alt = "Image Preview",
  onClose,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      //   backdrop="static"
      contentClassName="border-0 shadow-lg"
      style={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0,0,0,0.25)",
      }}
    >
      <Modal.Header
        closeButton={false}
        style={{
          backgroundColor: ACCENT,
          borderBottom: "none",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: ACCENT_DARK,
        }}
      >
        <h5
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: "1rem",
            display: "flex",
            gap: ".5rem",
          }}
        >
          <i className="ri-image-line" style={{ fontSize: "1.2rem" }} />
          {alt}
        </h5>

        <button
          onClick={onClose}
          aria-label="Close preview"
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            color: ACCENT_DARK,
            cursor: "pointer",
          }}
        >
          <i className="ri-close-line" />
        </button>
      </Modal.Header>

      <Modal.Body
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: BG_LIGHT,
          padding: "1rem",
        }}
      >
        {src && (
          <div
            style={{
              borderRadius: "0.75rem",
              overflow: "hidden",
              boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
              maxWidth: "100%",
              maxHeight: "70vh",
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={800}
              priority
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          borderTop: "none",
          backgroundColor: BG_LIGHT,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          style={{
            backgroundColor: ACCENT,
            borderColor: ACCENT,
            color: ACCENT_DARK,
            fontWeight: 500,
            padding: ".45rem 2.25rem",
            borderRadius: "2rem",
            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
