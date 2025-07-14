import React, { useState, useEffect } from "react";
import ChatUI from "./ChatUI";
import Sidebar from "./Sidebar";
import "./App.css";

const App = () => {
  const [chatId, setChatId] = useState(null);

  // Load first chat session on mount
  useEffect(() => {
    const index = JSON.parse(localStorage.getItem("chat_index")) || [];
    if (index.length > 0) {
      setChatId(index[0].id);
    } else {
      const newId = Date.now().toString();
      setChatId(newId);
    }
  }, []);

  const startNewChat = () => {
    const newId = Date.now().toString();
    setChatId(newId);
  };

  const addChatToIndex = (chatMeta) => {
    const index = JSON.parse(localStorage.getItem("chat_index")) || [];
    if (!index.find((chat) => chat.id === chatMeta.id)) {
      index.unshift(chatMeta);
      localStorage.setItem("chat_index", JSON.stringify(index));
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="app-layout">
      <Sidebar onSelectChat={setChatId} selectedChatId={chatId} />
      {chatId && (
        <ChatUI
          key={chatId}
          chatId={chatId}
          onNewChat={startNewChat}
          onFirstQuestion={(question) =>
            addChatToIndex({ id: chatId, title: question.slice(0, 40) })
          }
        />
      )}
    </div>
  );
};

export default App;
