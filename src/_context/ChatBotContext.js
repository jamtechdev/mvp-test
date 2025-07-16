import { createContext, useContext, useState } from "react";
const ChatBotContext = createContext();
export const ChatBotProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const [aiInput, setAiInput] = useState(null);
  const [contextTitle, setContextTitle] = useState("");

  const launchChat = ({ aiInput, contextTitle }) => {
    setAiInput(aiInput);
    setContextTitle(contextTitle);

    setSessionId((prev) => prev + 1);

    // Only open if not already
    if (!open) setOpen(true);
  };

  return (
    <ChatBotContext.Provider
      value={{ open, setOpen, sessionId, aiInput, contextTitle, launchChat }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBot = () => useContext(ChatBotContext);
