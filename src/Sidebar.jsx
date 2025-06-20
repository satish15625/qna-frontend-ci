import React, { useEffect, useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ onSelectChat, onNewChat }) => {
  const [chatList, setChatList] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState("");

  useEffect(() => {
    loadChats();
    window.addEventListener("storage", loadChats);
    return () => window.removeEventListener("storage", loadChats);
  }, []);

  const loadChats = () => {
    const index = JSON.parse(localStorage.getItem("chat_index")) || [];
    setChatList(index);
  };

  const deleteChat = (chatId) => {
    localStorage.removeItem(`chat_${chatId}`);
    const updated = chatList.filter((chat) => chat.id !== chatId);
    localStorage.setItem("chat_index", JSON.stringify(updated));
    setChatList(updated);
    window.dispatchEvent(new Event("storage"));
  };

  const handleRenameSubmit = (e, chatId) => {
    e.preventDefault();
    if (!renameText.trim()) return;
    const updated = chatList.map((chat) =>
      chat.id === chatId ? { ...chat, title: renameText } : chat
    );
    localStorage.setItem("chat_index", JSON.stringify(updated));
    setChatList(updated);
    setRenamingId(null);
    setRenameText("");
    setActiveMenuId(null);
    window.dispatchEvent(new Event("storage"));
  };

  const toggleMenu = (chatId) => {
    setActiveMenuId(activeMenuId === chatId ? null : chatId);
    setRenamingId(null);
  };

  const handleNewChat = () => {
    if (onNewChat) onNewChat(); // callback to parent to reset chat
  };

  return (
    <div className="sidebar">
      <div className="new-chat-section">
        <button className="new-chat-button" onClick={handleNewChat}>
          ➕ New Chat
        </button>
      </div>
      <h3>📚 History</h3>
      {chatList.length === 0 ? (
        <p className="no-history">No chat history</p>
      ) : (
        chatList.map(({ id, title }) => (
          <div key={id} className="sidebar-item">
            {renamingId === id ? (
              <form onSubmit={(e) => handleRenameSubmit(e, id)} className="rename-form">
                <input
                  autoFocus
                  value={renameText}
                  onChange={(e) => setRenameText(e.target.value)}
                  onBlur={(e) => handleRenameSubmit(e, id)}
                  className="rename-input"
                />
              </form>
            ) : (
              <button className="chat-button" onClick={() => onSelectChat(id)} title={title}>
                {title}
              </button>
            )}
            <div className="menu-wrapper">
              <button className="menu-button" onClick={() => toggleMenu(id)}>⋮</button>
              {activeMenuId === id && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setRenamingId(id);
                      setRenameText(title);
                    }}
                  >
                    📝 Rename
                  </div>
                  <div className="dropdown-item" onClick={() => alert("📤 Share is coming soon!")}>
                    📤 Share
                  </div>
                  <div className="dropdown-item" onClick={() => alert("🗃️ Archive is coming soon!")}>
                    🗃️ Archive
                  </div>
                  <div className="dropdown-item delete" onClick={() => deleteChat(id)}>
                    🗑️ Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Sidebar;
