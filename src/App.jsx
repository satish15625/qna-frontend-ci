import React, { useEffect, useState } from "react";
import ChatUI from "./ChatUI";
import Sidebar from "./Sidebar";
import "./ChatUI.css";

const App = () => {
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    if (!chatId) {
      // Only generate ID but don't store in history yet
      const newId = Date.now().toString();
      setChatId(newId);
    }
  }, []);

  const startNewChat = () => {
    const newId = Date.now().toString();
    setChatId(newId);
  };

  // When a question is asked, add to localStorage.chat_index
const addChatToIndex = (chatMeta) => {
  const index = JSON.parse(localStorage.getItem("chat_index")) || [];
  if (!index.find((chat) => chat.id === chatMeta.id)) {
    index.unshift(chatMeta); // add to beginning
    localStorage.setItem("chat_index", JSON.stringify(index));
    // dispatch custom event so Sidebar can re-read history
    window.dispatchEvent(new Event("storage")); 
  }
};



  return (
    <div className="app-layout">
      <Sidebar onSelectChat={setChatId} />
      {chatId && (
        <ChatUI
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
