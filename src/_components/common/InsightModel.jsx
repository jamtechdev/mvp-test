"use client";

import { openAIServices } from "@/_service";
import { useState, useRef, useMemo, useEffect } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { FiZap } from "react-icons/fi";

/**
 * Re‑usable AI insight badge.
 *
 *  • Pass kpi + targets   → endpoint receives { kpi, targets }.
 *  • Pass payload         → endpoint receives { payload }.
 *  • Pass neither         → static description only.
 */
export default function InfoPopover({
  title,
  description = "AI insight",
  placement = "left",
  kpi,
  targets,
  payload,
  revealDelay = 600, // ms between bullet reveals
}) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [visible, setVisible] = useState(0); // bullet reveal counter

  const badgeRef = useRef(null);
  const popoverRef = useRef(null);

  /* ── Fetch once per mount ────────────────────────────── */
  // const fetchInsight = async () => {
  //   if (loading || insight || (!kpi && !payload)) return;
  //   setLoading(true);

  //   try {
  //     const res = await fetch("/api/ai-insight", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload ? { payload } : { kpi, targets }),
  //     });

  //     /* ---------- 1. Bad HTTP status? ---------- */
  //     if (!res.ok) {
  //       const txt = await res.text(); // may be HTML
  //       throw new Error(`HTTP ${res.status}: ${txt.slice(0, 120)}…`);
  //     }

  //     /* ---------- 2. Non‑JSON content? ---------- */
  //     const isJson = res.headers
  //       .get("content-type")
  //       ?.includes("application/json");
  //     if (!isJson) {
  //       const txt = await res.text();
  //       throw new Error(`Non‑JSON response: ${txt.slice(0, 120)}…`);
  //     }

  //     /* ---------- 3. Parse JSON safely ---------- */
  //     const data = await res.json();
  //     if (data.insight) setInsight(data.insight);
  //     else setInsight(`⚠️ ${data.error || "No insight returned."}`);
  //   } catch (err) {
  //     setInsight(`⚠️ ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchInsight = async () => {
    if (loading || insight || (!kpi && !payload)) return;

    setLoading(true);

    try {
      const result = await openAIServices.getAIInsight({
        payload,
        kpi,
        targets,
      });

      if (result.success) {
        setInsight(result.data);
      } else {
        setInsight(result.error); // e.g., ⚠️ HTTP 500, etc.
      }
    } finally {
      setLoading(false);
    }
  };
  /* ── Split insight into bullets ───────────────────────── */
  const bullets = useMemo(() => {
    if (!insight) return [];
    const lines = insight
      .split(/\n+/)
      .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean);
    return lines.length > 1 ? lines : [insight];
  }, [insight]);

  /* ── Progressive reveal ───────────────────────────────── */
  useEffect(() => {
    if (!show || bullets.length === 0) return;
    setVisible(1);
    if (bullets.length === 1) return;

    const id = setInterval(() => {
      setVisible((c) => (c >= bullets.length ? (clearInterval(id), c) : c + 1));
    }, revealDelay);
    return () => clearInterval(id);
  }, [show, bullets, revealDelay]);

  /* ── Keep popover open while pointer in badge or popover */
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

  return (
    <span className="position-absolute top-0 end-0 m-2  info-icon">
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
      >
        AI
      </span>

      <Overlay target={badgeRef.current} show={show} placement={placement} flip>
        {(props) => (
          <Popover
            id="ai-popover"
            ref={popoverRef}
            {...props}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={leave}
          >
            <Popover.Body className="fs-12">
              <div className="d-flex gap-2 align-items-center justify-content-center fw-semibold text-primary-emphasis mb-1">
                <FiZap size={20} />
                {title}
              </div>

              {/* Content area */}
              {loading ? (
                <p className="text-center small mb-0">Analyzing…</p>
              ) : bullets.length === 0 ? (
                <p className="text-center small mb-0">{description}</p>
              ) : bullets.length === 1 ? (
                <p className="text-center small mb-0">{bullets[0]}</p>
              ) : (
                <ul className="small lh-lg mb-0 ps-3">
                  {bullets.slice(0, visible).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </span>
  );
}
