import React, { useState, useEffect } from "react";
import { askQuestion, markSatisfaction } from "./api";
import "./ChatUI.css";

const ChatUI = ({ chatId, onFirstQuestion, selectedModel: sidebarModel }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [satisfactionMap, setSatisfactionMap] = useState({});
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);
  const [model, setModel] = useState(sidebarModel || "deepseek-r1:1.5b");
  const [isModelLoading, setIsModelLoading] = useState(false);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || [];
    setMessages(savedMessages);
    setHasAddedToHistory(savedMessages.length > 0);
    setSatisfactionMap({});
  }, [chatId]);

  useEffect(() => {
    setModel(sidebarModel);
  }, [sidebarModel]);

  const handleModelChange = async (e) => {
    const newModel = e.target.value;
    setModel(newModel);
    setIsModelLoading(true);

    try {
      const response = await fetch("/load-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: newModel })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Model load failed");
      }

      const result = await response.json();
      console.log("✅ Model load result:", result);
    } catch (err) {
      console.error("❌ Failed to load model:", err);
      alert("Model load failed: " + err.message);
    } finally {
      setIsModelLoading(false);
    }
  };

  const sendQuestion = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(updated));
    setInput("");
    setIsLoading(true);

    if (!hasAddedToHistory && onFirstQuestion) {
      onFirstQuestion(input);
      setHasAddedToHistory(true);
    }

    const answer = await askQuestion(input, model);
    const botMsg = { sender: "bot", text: answer };
    const final = [...updated, botMsg];
    setMessages(final);
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(final));
    setIsLoading(false);
  };

  const handleFeedback = async (index, satisfied) => {
    const question = messages[index - 1]?.text;
    if (!question) return;

    try {
      await markSatisfaction(question, satisfied);
      setSatisfactionMap((prev) => ({ ...prev, [index]: satisfied }));
    } catch (e) {
      console.error("Feedback failed:", e);
    }
  };

  const isNewChat = messages.length === 0;

  return (
    <div className="chat-ui">
      <div className="chat-header">
        <h2>🤖 Chat Assistant</h2>
        <div className="model-upgrade-select">
          <select
            value={model}
            onChange={handleModelChange}
            className="model-dropdown"
          >
            <option value="deepseek-r1:1.5b">DeepSeek R1</option>
            <option value="mistral">Mistral</option>
            <option value="llama3">LLaMA 3</option>
          </select>
          <button className="upgrade-btn">🚀 Upgrade</button>
        </div>
      </div>

      {isNewChat ? (
        <div className="empty-state">
          <h2>Ready when you are.</h2>
          <form onSubmit={sendQuestion} className="input-centered">
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={isModelLoading}>→</button>
          </form>
        </div>
      ) : (
        <>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
                {msg.sender === "bot" && (
                  <div className="feedback-toggle">
                    <button
                      className={`feedback-button ${satisfactionMap[i] === true ? "active" : ""}`}
                      onClick={() => handleFeedback(i, true)}
                    >
                      👍 Helpful
                    </button>
                    <button
                      className={`feedback-button ${satisfactionMap[i] === false ? "active" : ""}`}
                      onClick={() => handleFeedback(i, false)}
                    >
                      👎 Unhelpful
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="message bot loading">Generating...</div>}
          </div>

          <form className="chat-form" onSubmit={sendQuestion}>
            <input
              type="text"
              placeholder={isModelLoading ? "Loading model..." : "Ask a question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isModelLoading}
            />
            <button type="submit" disabled={isLoading || isModelLoading}>
              {isModelLoading ? "Loading..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatUI;
