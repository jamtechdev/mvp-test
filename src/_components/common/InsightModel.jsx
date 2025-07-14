"use client";

import { openAIServices } from "@/_service";
import { useState, useRef, useMemo, useEffect } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { FiZap } from "react-icons/fi";
import ChatBotWidget from "./ChatBotWidget";
import ReactMarkdown from "react-markdown";

export default function InfoPopover({
  title,
  description = "AI insight",
  placement = "left",
  kpi,
  targets,
  payload,
  revealDelay = 600,
}) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [visible, setVisible] = useState(0);
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(0);

  const badgeRef = useRef(null);
  const popoverRef = useRef(null);

  const fetchInsight = async () => {
    if (loading || insight || (!kpi && !payload)) return;
    setLoading(true);
    try {
      const result = await openAIServices.getAIInsight({
        payload,
        kpi,
        targets,
      });
      if (result.success) setInsight(result.data);
      else setInsight(result.error);
    } finally {
      setLoading(false);
    }
  };

  const bullets = useMemo(() => {
    if (!insight) return [];
    return insight.split(/\n{2,}/).filter(Boolean);
  }, [insight]);

  useEffect(() => {
    if (!show || bullets.length === 0) return;
    setVisible(1);
    if (bullets.length === 1) return;
    const id = setInterval(() => {
      setVisible((c) => (c >= bullets.length ? (clearInterval(id), c) : c + 1));
    }, revealDelay);
    return () => clearInterval(id);
  }, [show, bullets, revealDelay]);

  const enter = () => {
    setShow(true);
    fetchInsight();
  };

  const leave = (e) => {
    const t = e.relatedTarget;
    if (
      t instanceof Node &&
      (badgeRef.current?.contains(t) || popoverRef.current?.contains(t))
    )
      return;
    setShow(false);
  };

  const handleClick = () => {
    setOpen(false);
    setTimeout(() => {
      setSessionId((id) => id + 1);
      setOpen(true);
    }, 10);
  };

  return (
    <>
      <span className="position-absolute top-0 end-0 m-2 info-icon">
        <span
          ref={badgeRef}
          role="button"
          aria-label="AI insight"
          className="badge bg-warning text-white fw-bold"
          style={{ cursor: "pointer", fontSize: "0.65rem", letterSpacing: 0.5 }}
          onMouseEnter={enter}
          onMouseLeave={leave}
          onFocus={enter}
          onBlur={leave}
          onClick={handleClick}
        >
          AI
        </span>

        <Overlay
          target={badgeRef.current}
          show={show}
          placement={placement}
          flip
        >
          {(props) => (
            <Popover
              id="ai-popover"
              ref={popoverRef}
              {...props}
              onMouseEnter={() => setShow(true)}
              onMouseLeave={leave}
            >
              {/* <Popover.Body className="fs-12">
                <div className="d-flex gap-2 align-items-center justify-content-center fw-semibold text-primary-emphasis mb-1">
                  <FiZap size={20} />
                  {title}
                </div>
                {loading ? (
                  <p className="text-center small mb-0">Analyzing…</p>
                ) : bullets.length === 0 ? (
                  <p className="text-center small mb-0">{description}</p>
                ) : (
                  <>
                    <div
                      style={{
                        maxHeight: "280px",
                        overflowY: "auto",
                        paddingRight: "4px",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "280px",
                          overflowY: "auto",
                          paddingRight: "4px",
                        }}
                      >
                        {bullets.slice(0, visible).map((b, i) => (
                          <div
                            key={i}
                            style={{
                              marginBottom: "1rem",
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                            }}
                          >
                            <ReactMarkdown>{b}</ReactMarkdown>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </Popover.Body> */}
              <Popover.Body className="fs-12">
                <div className="d-flex gap-2 align-items-center justify-content-center fw-semibold text-primary-emphasis mb-1">
                  <FiZap size={20} />
                  {title}
                </div>
                <p className="text-center small mb-0">{description}</p>
              </Popover.Body>
            </Popover>
          )}
        </Overlay>
      </span>

      {/* {open && (
        <ChatBotWidget
          open={open}
          setOpen={setOpen}
          aiInput={{ payload, kpi, targets }} // ✅ this aiInput is scoped per section
          contextTitle={title}
        />
      )} */}
    </>
  );
}
