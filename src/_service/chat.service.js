import axios from "axios";

export const openAIServices = {
  sendChat,
  getAIInsight,
};

const API = "/api";

async function sendChat(messages, aiInput = null, token = null) {
  try {
    const res = await axios.post(
      `${API}/ask-ai`,
      { messages, aiInput }, // ✅ send both messages + aiInput
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: res.data.response,
    };
  } catch (error) {
    const message =
      error?.response?.data?.error || error?.message || "Something went wrong";

    if (process.env.NODE_ENV === "development") {
      console.warn("📦 Chat API failed:", message);
    }

    return {
      success: false,
      error: `❗ ${message}`,
      status: error?.response?.status || 500,
    };
  }
}

async function getAIInsight({ payload, kpi, targets }) {
  try {
    const body = payload ? { payload } : { kpi, targets };

    const response = await axios.post(`${API}/ai-insight`, body, {
      headers: { "Content-Type": "application/json" },
    });

    const { insight, error } = response.data;

    return {
      success: true,
      data: insight || `⚠️ ${error || "No insight returned."}`,
    };
  } catch (error) {
    const fallback =
      error?.response?.data?.error ||
      error?.message ||
      "Unknown error occurred.";

    return {
      success: false,
      error: `⚠️ ${fallback}`,
      status: error?.response?.status || 500,
    };
  }
}
