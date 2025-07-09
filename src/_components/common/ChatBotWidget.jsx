"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Button,
  Form,
  InputGroup,
  Spinner,
  CloseButton,
} from "react-bootstrap";

/* ------------------------------------------------------------------
   Colour palettes
------------------------------------------------------------------- */
const LIGHT = {
  brand: "#37BEB0",
  bg: "#37BEB0",
  bodyBg: "rgb(165 229 223)",
  headerText: "#ffffff",
  userBubbleBg: "#37BEB0",
  userBubbleText: "#ffffff",
  assistantBubbleBg: "#ffffff",
  assistantBubbleText: "#212529",
  inputBg: "#ffffff",
  inputText: "#212529",
};

const DARK = {
  brand: "#2a9d90",
  bg: "#37BEB0",
  bodyBg: "#0c1427",
  headerText: "#ffffff",
  userBubbleBg: "#37BEB0",
  userBubbleText: "#ffffff",
  assistantBubbleBg: "#313131",
  assistantBubbleText: "#e8e8e8",
  inputBg: "#0c1427",
  inputText: "#e8e8e8",
};

/* ------------------------------------------------------------------
   Theme hook — reads <html data-theme="…"> and reacts to changes
------------------------------------------------------------------- */
function useTheme() {
  const getAttrScheme = () => {
    if (typeof document === "undefined") return null;
    return document.documentElement.getAttribute("data-theme"); // "dark" | "light" | null
  };

  const getPrefersScheme = () => {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  /* start with attribute, fallback to system, else "light" */
  const [scheme, setScheme] = useState(
    () => getAttrScheme() || getPrefersScheme()
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    /* 1) Observe data‑theme attribute */
    const obs = new MutationObserver(() => {
      const attr = getAttrScheme();
      if (attr === "dark" || attr === "light") setScheme(attr);
    });
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    /* 2) Fallback: listen to prefers‑color‑scheme if no data‑theme present */
    let mq;
    if (!getAttrScheme() && window.matchMedia) {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handle = (e) => setScheme(e.matches ? "dark" : "light");
      mq.addEventListener("change", handle);
    }

    return () => {
      obs.disconnect();
      mq?.removeEventListener("change", () => {});
    };
  }, []);

  return useMemo(
    () =>
      scheme === "dark"
        ? { ...DARK, scheme: "dark" }
        : { ...LIGHT, scheme: "light" },
    [scheme]
  );
}

/* ------------------------------------------------------------------
   Static style objects (created once)
------------------------------------------------------------------- */
const launcherStyle = {
  border: "none",
  width: 60,
  height: 60,
  position: "fixed",
  bottom: 20,
  right: 20,
  zIndex: 1000,
};

const wrapperBase = {
  position: "fixed",
  bottom: 0,
  right: 2,
  width: "90%",
  maxWidth: 380,
  height: 440,
  borderRadius: "1rem",
  display: "flex",
  flexDirection: "column",
  zIndex: 1050,
  overflow: "hidden",
  fontFamily: "Segoe UI, sans-serif",
};

const bubbleBase = {
  borderRadius: "1rem",
  padding: "0.6rem 1rem",
  maxWidth: "80%",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  whiteSpace: "pre-wrap",
  fontStyle: "italic",
};

/* ------------------------------------------------------------------
   Launcher
------------------------------------------------------------------- */
export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      {!open && (
        <Button
          className="rounded-circle shadow"
          style={{ ...launcherStyle, backgroundColor: theme.brand }}
          onClick={() => setOpen(true)}
        >
          💬
        </Button>
      )}
      {open && <ChatBox theme={theme} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ------------------------------------------------------------------
   Chat box
------------------------------------------------------------------- */
function ChatBox({ onClose, theme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bodyRef = useRef(null);

  /* load history */
  useEffect(() => {
    setMessages(JSON.parse(localStorage.getItem("chat_history") || "[]"));
    setHydrated(true);
  }, []);

  /* persist + autoscroll */
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("chat_history", JSON.stringify(messages));
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [messages, hydrated]);

  /* send */
  const send = async (content) => {
    if (!content.trim()) return;
    const draft = [...messages, { role: "user", content }];
    setMessages(draft);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: draft }),
      });
      const json = await res.json();

      setMessages([
        ...draft,
        {
          role: "assistant",
          content:
            !res.ok || json.error
              ? `❗ Error: ${json.error || "Unknown error occurred."}`
              : json.response,
        },
      ]);
    } catch (err) {
      setMessages([
        ...draft,
        { role: "assistant", content: `❗ Network error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_history");
  };

  const bubbleStyle = (isUser) => ({
    ...bubbleBase,
    backgroundColor: isUser ? theme.userBubbleBg : theme.assistantBubbleBg,
    color: isUser ? theme.userBubbleText : theme.assistantBubbleText,
  });

  return (
    <div
      style={{
        ...wrapperBase,
        backgroundColor: theme.bg,
        boxShadow:
          theme.scheme === "dark"
            ? "0 6px 24px rgba(0,0,0,0.6)"
            : "0 6px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <div
        className="py-2 px-3 d-flex justify-content-between align-items-center"
        style={{ backgroundColor: theme.brand, color: theme.headerText }}
      >
        <span className="fw-bold fst-italic">AI Assistant</span>
        <div>
          <Button
            variant="outline-light"
            size="sm"
            className="fst-italic me-2"
            onClick={clearChat}
          >
            Clear
          </Button>
          <CloseButton variant="white" onClick={onClose} />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={bodyRef}
        className="flex-grow-1 overflow-auto p-3"
        style={{ background: theme.bodyBg }}
      >
        {messages.length === 0 && !loading && (
          <div className="d-flex justify-content-start mb-2">
            <div style={bubbleStyle(false)}>
              👋 Hey there! What can I help you with today?
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              m.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div style={bubbleStyle(m.role === "user")}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" />
            <small
              className="fst-italic"
              style={{ color: theme.assistantBubbleText }}
            >
              AI is typing...
            </small>
          </div>
        )}
      </div>

      {/* Input */}
      <InputGroup className="p-2 border-top" style={{ background: theme.bg }}>
        <Form.Control
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          disabled={loading}
          className="fst-italic border-0"
          style={{ backgroundColor: theme.inputBg, color: theme.inputText }}
        />
        <Button
          disabled={loading}
          onClick={() => send(input)}
          className="fst-italic border-0"
          style={{ backgroundColor: theme.brand }}
        >
          Send
        </Button>
      </InputGroup>
    </div>
  );
}
