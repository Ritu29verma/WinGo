import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { fetchAgents,fetchChatHistory } from './chatServiceAgent';
import { FiX, FiArrowLeft } from "react-icons/fi";

const ChatWindow = ({ onClose, userRole, onlineAgents, user }) => {
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
     const allAgents = await fetchAgents();
            setAgents(allAgents);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); 

  const isAgentOnline = (phoneNumber) => {
    return onlineAgents.some((user) => user.phoneNumber === phoneNumber);
  };


  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]); // Store as an array
    });    
  
    return () => {
      socket.off("receiveMessage"); 
    };
  }, []);

  useEffect(() => {
    if (selectedUser && selectedUser.id && user) {
      console.log("Fetching chat history for:", { userId: user.id, agentId: selectedUser.id });

      const loadChatHistory = async () => {
        setLoading(true);
        try {
          let history = await fetchChatHistory(user.id, selectedUser.id);
          console.log("Fetched history:", history);

          if (!Array.isArray(history)) {
            history = []; // ✅ Ensure history is an array
          }

          // Format messages correctly
          const formattedMessages = history.map((msg) => ({
            sender: msg.senderType === "user" ? user.username : selectedUser.username, // ✅ Fix username display
            role: msg.senderType,
            text: msg.message,
            timestamp: msg.createdAt,
          }));

          setMessages(formattedMessages);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
        setLoading(false);
      };

      loadChatHistory();
    }
  }, [selectedUser, user]); 
  
  

  // Handle Input Change and Emit Typing Event
  const handleInputChange = (e) => {
    setInput(e.target.value);
    socket.emit('typing',{ user: selectedUser });
  };

// Debounce Typing Event
useEffect(() => {
  let typingTimer; 
  if (input.trim() === "") {
    socket.emit('stopped-typing',  { user: selectedUser });
  } else {
    typingTimer = setTimeout(() => {
      socket.emit('stopped-typing',{ user:selectedUser });
    }, 600);
  }
  return () => clearTimeout(typingTimer);
}, [input]);

useEffect(() => {
  if (!socket) {
    console.log("Socket not available");
    return;
  }

  socket.on('typing', (data) => {
    console.log("Typing event from:", data.user.username);
    setTypingUser(data.user.username);
    setIsTyping(true);
  });

  socket.on('stopped-typing', () => {
    console.log("Stopped typing event");
    setTypingUser('');
    setIsTyping(false);
  });

  return () => {
    socket.off('typing');
    socket.off('stopped-typing');
  };
}, [socket]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const messageData = {
      sender:  user.username,
      role: "user",
      receiver: selectedUser.username,
      text: input,
      timestamp: new Date(),
    };

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput("");
    socket.emit('stopped-typing',{ user:selectedUser}); // FIX: Stop typing on send
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white shadow-lg border rounded-lg z-50">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center p-2 bg-blue-500 rounded-lg text-black font-semibold">
        {selectedUser ? (
          <>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-white hover:text-gray-300" >
              <FiArrowLeft size={20} />
            </button>
            <span>{selectedUser.username}'s Chat</span>
          </>
        ) : (
          <span>Online Agents</span>
        )}
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <FiX size={20} />
        </button>
      </div>

      {/* Online Users List (Default View) */}
      {!selectedUser ? (
        <div className="p-2 h-80 bg-gray-100">
          <h3 className="font-semibold">Agents:</h3>
          <ul className="max-h-64 overflow-y-auto">
            {agents.length === 0 ? (
              <li className="text-gray-500">No agents available</li>
            ) : (
              agents.map((user, index) => (
                <li
                  key={index}
                  className="cursor-pointer flex items-center p-2 bg-white shadow-sm hover:bg-gray-200 rounded mb-1"
                  onClick={() => setSelectedUser(user)}
                >
                  <span
                    className={`h-2 w-2 rounded-full mr-2 ${
                      isAgentOnline(user.phoneNumber)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                    title={isAgentOnline(user.phoneNumber) ? "Online" : "Offline"}
                  ></span>
                  {user.username || "Unknown"} ({user.phoneNumber})  ({user.id})
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        // Chat Section (After Selecting a User)
        <>
          <div className="p-2 h-64 overflow-y-auto bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-1 text-lg text-black ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.text}
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            ))}
                  <div ref={messagesEndRef} />
          </div>
            {/* Typing Indicator with Margin for Visibility */}
        <div className="h-6 px-2 flex items-center bg-gray-100 text-sm text-black">
      {isTyping && typingUser && (
        <span className="animate-pulse">{typingUser} is typing...</span>
      )}
    </div>

          {/* Input Field */}
          <div className="p-2 flex border-t">
            <input
              type="text"
              className="flex-1 border p-1 text-sm"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
            />
            <button
              className="ml-2 bg-red-500 text-black px-3 text-sm rounded"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;