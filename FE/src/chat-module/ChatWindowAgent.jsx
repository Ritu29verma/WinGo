import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import { FiX, FiArrowLeft } from "react-icons/fi";
import { fetchUsers, fetchChatHistory } from "./chatService";

function AdminChatWindow({ onClose, onlineUsers, userRole, agent }) {
  const [messages, setMessages] = useState([]); // ✅ Change to an array
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await fetchUsers();
      setUsers(allUsers);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isUserOnline = (phoneNumber) => {
    return onlineUsers.some((user) => user.phoneNumber === phoneNumber);
  };

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]); // ✅ Store as an array
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (selectedUser && selectedUser.id && agent) {
      console.log("Fetching chat history for:", {
        userId: selectedUser.id, // ✅ User first
        agentId: agent.id, // ✅ Agent second
      });
  
      const loadChatHistory = async () => {
        setLoading(true);
        try {
          let history = await fetchChatHistory(selectedUser.id, agent.id); // ✅ Fix order
  
          console.log("Fetched history:", history);
  
          if (!Array.isArray(history)) {
            history = []; // ✅ Ensure history is an array
          }
  
          // ✅ Correct sender names & timestamps
          const formattedMessages = history.map((msg) => ({
            sender:
              msg.senderType === "user" ? selectedUser.username : agent.username,
            role: msg.senderType,
            text: msg.message,
            timestamp: msg.createdAt, // ✅ Use correct timestamp
          }));
  
          setMessages(formattedMessages);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
        setLoading(false);
      };
  
      loadChatHistory();
    }
  }, [selectedUser, agent]);
  

  // Handle Input Change and Emit Typing Event
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", { user: selectedUser });
  };

  // Debounce Typing Event
  useEffect(() => {
    let typingTimer;
    if (newMessage.trim() === "") {
      socket.emit("stopped-typing", { user: selectedUser });
    } else {
      typingTimer = setTimeout(() => {
        socket.emit("stopped-typing", { user: selectedUser });
      }, 600);
    }
    return () => clearTimeout(typingTimer);
  }, [newMessage, selectedUser]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket not available");
      return;
    }

    socket.on("typing", (data) => {
      console.log("Typing event from:", data.user.username);
      setTypingUser(data.user.username);
      setIsTyping(true);
    });

    socket.on("stopped-typing", () => {
      console.log("Stopped typing event");
      setTypingUser("");
      setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopped-typing");
    };
  }, [socket]);

  // Send a message to a selected user
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    const messageData = {
      sender: agent.username,
      role: "agent",
      receiver: selectedUser.username,
      text: newMessage,
      timestamp: new Date().toISOString(), // ✅ Ensure valid timestamp
    };

    console.log("Message data being sent:", messageData);
    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]); // ✅ Append to array
    setNewMessage("");
    socket.emit("stopped-typing", { user: selectedUser });
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white shadow-lg border rounded-lg z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-blue-500 rounded-lg text-white font-semibold">
        {selectedUser ? (
          <>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-white hover:text-gray-300"
            >
              <FiArrowLeft size={20} />
            </button>
            <span>{selectedUser.username}'s Chat</span>
          </>
        ) : (
          <span>Online Users</span>
        )}
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <FiX size={20} />
        </button>
      </div>

      {/* Online Users List (Default View) */}
      {!selectedUser ? (
        <div className="p-2 h-80 bg-gray-100">
          <h3 className="font-semibold">Online Users:</h3>
          <ul className="max-h-64 overflow-y-auto">
            {users.length === 0 ? (
              <li className="text-gray-500">No users available</li>
            ) : (
              users.map((user, index) => (
                <li
                  key={index}
                  className="cursor-pointer flex items-center p-2 bg-white shadow-sm hover:bg-gray-200 rounded mb-1"
                  onClick={() => setSelectedUser(user)}
                >
                  <span
                    className={`h-2 w-2 rounded-full mr-2 ${
                      isUserOnline(user.phoneNumber)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                    title={isUserOnline(user.phoneNumber) ? "Online" : "Offline"}
                  ></span>
                  {user.username || "Unknown"} ({user.phoneNumber})
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        // Chat Section (After Clicking a User)
        <>
        {/* Chat Messages */}
        <div className="p-2 h-64 overflow-y-auto bg-gray-100 flex flex-col">
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
    
          {/* Invisible Ref Element to Auto-scroll */}
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
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 bg-red-500 text-black px-3 text-sm rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </>
      )}
    </div>
  );
}

export default AdminChatWindow;
