import { useEffect, useState } from "react";
import socket from "../socket";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Receive messages from server
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
      sender: "User", // Change dynamically based on role
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("chatMessage", messageData); // Send to server
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInput(""); // Clear input field
  };

  return (
    <div className="w-96 p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-lg font-bold mb-2">Chat</h2>
      
      <div className="h-60 overflow-y-auto p-2 border rounded-md bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 ${msg.sender === "User" ? "text-right" : "text-left"}`}>
            <span className="font-bold">{msg.sender}:</span> {msg.text}
            <div className="text-xs text-gray-500">{msg.timestamp}</div>
          </div>
        ))}
      </div>

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
