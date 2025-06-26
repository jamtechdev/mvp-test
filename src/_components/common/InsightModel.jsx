"use client";
import { useState, useRef } from "react";
import { Overlay, Popover, Button } from "react-bootstrap";
import { FiInfo, FiZap } from "react-icons/fi";

export default function InfoPopover({
  title,
  description,
  placement = "left",
}) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  return (
    <span 
    className="position-absolute top-0 end-0 m-2 text-muted info-icon"
    >
      <FiInfo
        ref={ref}
        role="button"
        className="text-muted"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      />
      <Overlay target={ref.current} show={show} placement={placement} flip>
        {(props) => (
          <Popover id="info-popover" {...props}>
            <Popover.Body className="fs-12">
              <div className="d-flex align-items-center justify-content-center gap-2 fs-6 fw-semibold text-primary-emphasis">
                <FiZap size={24} />
                {title}
              </div>
              <div className="pt-1 pb-2 text-center">
                <p className="mb-0 small lh-lg text-primary-emphasis mb-3">
                  {description}
                </p>
              </div>
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </span>
  );
}
