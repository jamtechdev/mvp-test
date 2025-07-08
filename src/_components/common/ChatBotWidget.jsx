"use client";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  InputGroup,
  Spinner,
  CloseButton,
} from "react-bootstrap";

/**
 * Light & dark palettes
 * --------------------
 * brand        – primary accent
 * bg           – chatbox background
 * bodyBg       – message pane background
 * userBubbleBg – user message bubble
 * assistantBubbleBg – assistant message bubble
 */
const LIGHT = {
  brand: "#37BEB0", // teal‑ish accent
  bg: "#ffffff",
  bodyBg: "#f1f3f5",
  headerText: "#ffffff",
  userBubbleBg: "#37BEB0",
  userBubbleText: "#ffffff",
  assistantBubbleBg: "#e9ecef",
  assistantBubbleText: "#212529",
  inputBg: "#ffffff",
  inputText: "#212529",
};

const DARK = {
  brand: "#2a9d90",
  bg: "#1e1e1e",
  bodyBg: "#252525",
  headerText: "#ffffff",
  userBubbleBg: "#37BEB0",
  userBubbleText: "#ffffff",
  assistantBubbleBg: "#313131",
  assistantBubbleText: "#e8e8e8",
  inputBg: "#2a2a2a",
  inputText: "#212529",
};

/**
 * Detects system colour‑scheme and keeps it in sync.
 */
function useTheme() {
  const getScheme = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [scheme, setScheme] = useState(getScheme);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setScheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return scheme === "dark" ? DARK : LIGHT;
}

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      {!open && (
        <Button
          className="rounded-circle shadow"
          style={{
            backgroundColor: theme.brand,
            border: "none",
            width: 60,
            height: 60,
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        >
          💬
        </Button>
      )}
      {open && <ChatBox theme={theme} onClose={() => setOpen(false)} />}
    </>
  );
}

function ChatBox({ onClose, theme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const bodyRef = useRef(null);

  // Load from localStorage once
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chat_history") || "[]");
    setMessages(saved);
    setHasLoaded(true);
    // scroll after first paint
    setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  // Persist history & autoscroll on every change (after load)
  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem("chat_history", JSON.stringify(messages));
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, hasLoaded]);

  const send = async (content) => {
    if (!content.trim()) return;
    const newMsgs = [...messages, { role: "user", content }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        // 👇 show error in chat
        setMessages([
          ...newMsgs,
          {
            role: "assistant",
            content: `❗ Error: ${json.error || "Unknown error occurred."}`,
          },
        ]);
      } else {
        setMessages([
          ...newMsgs,
          { role: "assistant", content: json.response },
        ]);
      }
    } catch (err) {
      // 👇 show fetch/network errors
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          content: `❗ Network error: ${
            err.message || "Something went wrong."
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_history");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 2,
        width: "90%",
        maxWidth: 380,
        height: 520,
        backgroundColor: theme.bg,
        borderRadius: "1rem",
        boxShadow:
          theme.scheme === "dark"
            ? "0 6px 24px rgba(0,0,0,0.6)"
            : "0 6px 24px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1050,
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: theme.brand,
          color: theme.headerText,
          padding: "0.75rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="fw-bold">AI Assistant</span>
        <div>
          <Button
            variant="outline-light"
            size="sm"
            onClick={clearChat}
            style={{ marginRight: 8 }}
          >
            Clear
          </Button>
          <CloseButton variant="white" onClick={onClose} />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={bodyRef}
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "1rem",
          background: theme.bodyBg,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: "0.75rem",
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background:
                  m.role === "user"
                    ? theme.userBubbleBg
                    : theme.assistantBubbleBg,
                color:
                  m.role === "user"
                    ? theme.userBubbleText
                    : theme.assistantBubbleText,
                borderRadius: "1rem",
                padding: "0.6rem 1rem",
                maxWidth: "80%",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" />
            <small style={{ color: theme.assistantBubbleText }}>
              AI is typing...
            </small>
          </div>
        )}
      </div>

      {/* Input */}
      <InputGroup className="p-2 border-top " style={{ background: theme.bg }}>
        <Form.Control
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          disabled={loading}
          style={{
            // backgroundColor: theme.inputBg, // use backgroundColor to ensure override
            color: theme.inputText,
            border: "none",
          }}
        />
        <Button
          onClick={() => send(input)}
          disabled={loading}
          style={{ backgroundColor: theme.brand, border: "none" }}
        >
          Send
        </Button>
      </InputGroup>
    </div>
  );
}
