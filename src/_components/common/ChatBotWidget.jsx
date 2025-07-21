"use client";

import { openAIServices } from "@/_service";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  InputGroup,
  Spinner,
  CloseButton,
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import unified from "../../_data/unifiedPayload.json";

const LIGHT = {
  brand: "#37BEB0",

  bg: "#37BEB0",

  bodyBg: "#ffffff",

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

function useTheme() {
  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const [scheme, setScheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") ||
        (isDark ? "dark" : "light")
      : "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      const attr = root.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") setScheme(attr);
    });

    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return scheme === "dark" ? { ...DARK, scheme } : { ...LIGHT, scheme };
}

export default function ChatBotWidget({
  open,
  setOpen,
  aiInput,
  contextTitle,
  sessionId,
}) {
  const theme = useTheme();

  return (
    <>
      {open && (
        <ChatBox
          theme={theme}
          onClose={() => setOpen(false)}
          aiInput={aiInput}
          contextTitle={contextTitle}
          sessionId={sessionId}
        />
      )}
    </>
  );
}

function ChatBox({ onClose, theme, aiInput, contextTitle, sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);
  // 👇 This effect ensures reset when sessionId changes
  useEffect(() => {
    const introMessage = contextTitle
      ? {
          role: "assistant",
          content: `📊 **You selected:** *${contextTitle}.*\nI’ve loaded the relevant data. Feel free to ask questions or request insights.`,
        }
      : {
          role: "assistant",
          content: "👋 Hey there! Please select a section to begin the chat.",
        };

    setMessages([introMessage]);
    setInput("");
  }, [sessionId]); // 👈 reacts to sessionId
  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [messages]);

  const send = async (content) => {
    if (!content.trim()) return;

    const draft = [...messages, { role: "user", content }];
    setMessages(draft);
    setInput("");
    setLoading(true);

    const result = await openAIServices.sendChat(draft, aiInput, unified);

    setMessages([
      ...draft,
      {
        role: "assistant",
        content: result.success ? result.data : result.error,
      },
    ]);

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "👋 Hey there! Please select a section to begin the chat.",
      },
    ]);
    setInput("");
  };

  const handleClose = () => {
    onClose();
  };

  // const bubbleStyle1 = (isUser) => ({
  //   borderRadius: "1rem",

  //   padding: "0.6rem 1rem",

  //   maxWidth: "85%",

  //   boxShadow: theme.scheme === "dark" ? "0 6px 24px rgba(0,0,0,0.6)" : "",

  //   fontStyle: "italic",

  //   backgroundColor: isUser ? theme.userBubbleBg : theme.assistantBubbleBg,

  //   color: isUser ? theme.userBubbleText : theme.assistantBubbleText,
  // });

  const bubbleStyle = (isUser) => ({
    borderRadius: "1rem",
    padding: "0.8rem 1.3rem",
    maxWidth: "85%",
    backgroundColor: isUser ? theme.userBubbleBg : theme.assistantBubbleBg,
    color: isUser ? theme.userBubbleText : theme.assistantBubbleText,
    fontStyle: "italic",
    fontSize: "1rem",
    border: "1px solid rgba(0, 0, 0, 0.06)",

    // 🧱 Clearer, crisper gray shadow
    boxShadow:
      theme.scheme === "dark"
        ? "0 6px 20px rgba(0, 0, 0, 0.5)"
        : "0 8px 24px rgba(0, 0, 0, 0.25)",

    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  });

  return (
    <div
      className="chatbox-wrapper"
      style={{
        position: "fixed",
        bottom: 0,
        right: 2,
        width: "90%",
        maxWidth: 440,
        height: 440,
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        zIndex: 1050,
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: theme.bg,
        boxShadow: theme.scheme === "dark" ? "0 6px 24px rgba(0,0,0,0.6)" : "",
        border: theme.scheme === "dark" ? "" : "1px solid rgb(55, 190, 176)",
        transition: "transform 0.25s ease, opacity 0.25s ease",
        transform: "translateY(0)",
        opacity: 1,
      }}
    >
      <div
        className="py-2 px-3 d-flex justify-content-between align-items-center"
        style={{ backgroundColor: theme.brand, color: theme.headerText }}
      >
        <span className="fw-bold fst-italic text-white">AI Assistant</span>
        <div>
          <Button
            variant="outline-light"
            size="sm"
            className="fst-italic me-2"
            onClick={clearChat}
          >
            Clear
          </Button>
          <CloseButton variant="white" onClick={handleClose} />
        </div>
      </div>

      <div
        ref={bodyRef}
        className="flex-grow-1 overflow-auto p-3"
        style={{ background: theme.bodyBg }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              m.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div style={bubbleStyle(m.role === "user")}>
              {m.role === "assistant" ? (
                <ReactMarkdown>{m.content}</ReactMarkdown>
              ) : (
                m.content
              )}
            </div>
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

      <InputGroup className="p-2 border-top" style={{ background: theme.bg }}>
        <Form.Control
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          disabled={loading}
          className="fst-italic border-0"
          style={{
            backgroundColor: theme.inputBg,
            color: theme.inputText,
          }}
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
