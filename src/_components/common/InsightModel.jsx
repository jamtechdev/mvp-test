"use client";

import { openAIServices } from "@/_service";
import { useState, useRef, useMemo, useEffect } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { FiZap } from "react-icons/fi";
import ChatBotWidget from "./ChatBotWidget";
import ReactMarkdown from "react-markdown";

// ✅ Add unifiedPayload here (you can also import from a file if needed)
const unifiedPayload = {
  ads: [
    {
      id: "fb‑001",
      name: "Summer Flash Sale",
      platform: "facebook",
      objective: "Traffic",
      impressions: 82450,
      clicks: 3214,
      spend: 1500,
      thumbnail_url: "/images/advertisement-1.jpg",
      preview_url: "https://facebook.com/ads/fb-001"
    },
    {
      id: "gg‑002",
      name: "Free Trial – Search",
      platform: "google",
      objective: "Leads",
      impressions: 91320,
      clicks: 5876,
      spend: 3200,
      leads: 250,
      thumbnail_url: "/images/advertisement-2.jpg",
      preview_url: "https://ads.google.com/gg-002"
    },
    {
      id: "li‑003",
      name: "Whitepaper Download",
      platform: "linkedin",
      objective: "Conversions",
      impressions: 25900,
      clicks: 1120,
      spend: 2400,
      conversions: 70,
      thumbnail_url: "/images/advertisement-3.webp"
    },
    {
      id: "tt‑004",
      name: "Back‑to‑School Promo",
      platform: "tiktok",
      objective: "Engagement",
      impressions: 45000,
      clicks: 3500,
      spend: 800,
      engagements: 2800,
      thumbnail_url: "/images/advertisement-4.webp",
      video_url: "advertisement-vdo.mp4"
    },
    {
      id: "tw‑005",
      name: "Webinar Registration",
      platform: "twitter",
      objective: "Leads",
      impressions: 38400,
      clicks: 2450,
      spend: 1600,
      leads: 120,
      thumbnail_url: "/images/advertisement-5.jpg"
    }
  ],
  campaigns: [
    { name: "Campaign P", clicks: 9642, media_cost: 4112.68, revenue: 8520 },
    { name: "Campaign G", clicks: 9015, media_cost: 3210.44, revenue: 7900 },
    { name: "Campaign F", clicks: 8767, media_cost: 1520.78, revenue: 6250 },
    { name: "Campaign A", clicks: 8276, media_cost: 2345.12, revenue: 7050 },
    { name: "Campaign N", clicks: 8103, media_cost: 3480.91, revenue: 6980 },
    { name: "Campaign I", clicks: 7498, media_cost: 2978.35, revenue: 6020 },
    { name: "Campaign D", clicks: 6567, media_cost: 2541.87, revenue: 5430 },
    { name: "Campaign K", clicks: 6121, media_cost: 2640.27, revenue: 5110 },
    { name: "Campaign E", clicks: 5688, media_cost: 7847.6, revenue: 4000 },
    { name: "Campaign O", clicks: 5437, media_cost: 2233.07, revenue: 4880 },
    { name: "Campaign B", clicks: 5120, media_cost: 1880.5, revenue: 4600 },
    { name: "Campaign M", clicks: 4955, media_cost: 1925.49, revenue: 4520 },
    { name: "Campaign H", clicks: 4332, media_cost: 1145.2, revenue: 3920 },
    { name: "Campaign C", clicks: 3901, media_cost: 1220.99, revenue: 3700 }
  ]
};

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
                {loading ? (
                  <p className="text-center small mb-0">Analyzing…</p>
                ) : bullets.length === 0 ? (
                  <p className="text-center small mb-0">{description}</p>
                ) : (
                  bullets
                    .slice(0, visible)
                    .map((b, i) => <ReactMarkdown key={i}>{b}</ReactMarkdown>)
                )}
              </Popover.Body>
            </Popover>
          )}
        </Overlay>
      </span>

      {open && (
        <ChatBotWidget
           open={open}
  setOpen={setOpen}
  aiInput={{ payload, kpi, targets }} // ✅ this aiInput is scoped per section
        />
      )}
    </>
  );
}
