import React, { useState, useEffect } from "react";
import socket from "../socket";
import { FiX } from "react-icons/fi";

function AgentChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender: "Agent",
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white shadow-lg border rounded-lg z-50">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center p-2 bg-blue-500 text-white font-semibold">
        <span>Agent Chat</span>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <FiX size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="p-2 h-64 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="p-1 text-sm">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-2 flex border-t">
        <input
          type="text"
          className="flex-1 border p-1 text-sm"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="ml-2 bg-blue-500 text-white px-3 text-sm rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default AgentChatWindow;
