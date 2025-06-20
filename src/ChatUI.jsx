import React, { useState } from "react";
import { askQuestion } from "./api";
import "./ChatUI.css";

const ChatUI = ({ onFirstQuestion, chatId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);

  const modelList = ["GPT-3.5", "GPT-4", "Mistral", "Claude"];
  const [selectedModel, setSelectedModel] = useState(modelList[0]);

  const sendQuestion = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    if (!hasAddedToHistory && onFirstQuestion) {
      onFirstQuestion(input); // use question as title
      setHasAddedToHistory(true);
    }

    const answer = await askQuestion(input); // optionally send selectedModel
    const botMessage = { sender: "bot", text: answer };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 Chat Assistant</h2>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="model-select"
        >
          {modelList.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">🔍 Searching...</div>
        )}
      </div>

      <form className="chat-form" onSubmit={sendQuestion}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default ChatUI;
