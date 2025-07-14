import React, { useEffect, useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ onSelectChat, selectedChatId }) => {
  const [chatList, setChatList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const loadChats = () => {
      const index = JSON.parse(localStorage.getItem("chat_index")) || [];
      setChatList(index);
    };
    loadChats();
    window.addEventListener("storage", loadChats);
    return () => window.removeEventListener("storage", loadChats);
  }, []);

  const startNewChat = () => {
    const newId = Date.now().toString();
    onSelectChat(newId);
  };

  const openModal = (e, chatId) => {
    e.stopPropagation();
    setActiveChatId(chatId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveChatId(null);
  };

  const handleRename = () => {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
      const updated = chatList.map(chat => chat.id === activeChatId ? { ...chat, title: newTitle } : chat);
      setChatList(updated);
      localStorage.setItem("chat_index", JSON.stringify(updated));
    }
    closeModal();
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Delete this chat?");
    if (confirmDelete) {
      const updated = chatList.filter(chat => chat.id !== activeChatId);
      setChatList(updated);
      localStorage.setItem("chat_index", JSON.stringify(updated));
      localStorage.removeItem(`chat_${activeChatId}`);
    }
    closeModal();
  };

  const handleShare = () => {
    alert("Share link copied to clipboard: /chat?id=" + activeChatId);
    closeModal();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🤖 ChatBot</h2>
        <button className="sidebar-new-btn colorful" onClick={startNewChat}>➕ New Chat</button>
      </div>

      <h3 className="chat-history-heading">🕘 Chat History</h3>
      <div className="chat-history">
        {chatList.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === selectedChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="chat-icon">💬</span>
            <p className="chat-title">{chat.title || "Untitled Chat"}</p>
            <p className="" onClick={(e) => openModal(e, chat.id)}>⋯</p>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="chat-modal-overlay" onClick={closeModal}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Chat Options</h4>
            <button onClick={handleShare}>🔗 Share</button>
            <button onClick={handleRename}>✏️ Rename</button>
            <button onClick={handleDelete}>🗑️ Delete</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
