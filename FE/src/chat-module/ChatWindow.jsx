import { useEffect, useState } from "react";
import socket from "../socket";
import { FiX } from "react-icons/fi";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const messageData = {
      text: input,
      sender: "User",
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("chatMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInput("");
  };

  return (
    <div
      className="fixed bottom-6 right-6 w-96 bg-white shadow-2xl rounded-lg p-4 border border-gray-300 z-50"
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-bold">Chat</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <FiX size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-60 overflow-y-auto p-2 border rounded-md bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 ${msg.sender === "User" ? "text-right" : "text-left"}`}>
            <span className="font-bold">{msg.sender}:</span> {msg.text}
            <div className="text-xs text-gray-500">{msg.timestamp}</div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="mt-2 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 rounded-r-md" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
