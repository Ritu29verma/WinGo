import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { checkOrRegisterUser } from "./chatService";
import { FiMessageCircle } from "react-icons/fi"; // Import chat icon
import socket from "../socket";

function ChatHandler() {
  const [showChat, setShowChat] = useState(false);
  const [onlineAgents, setOnlineAgents] = useState([]);
  const [userData, setUserData] = useState(null);

  const handleOpenChat = async () => {
    let phoneNumber = sessionStorage.getItem("phoneNumber") || "";
    let username = sessionStorage.getItem("username") || "";

    // Prompt user if values are missing
    if (!phoneNumber) phoneNumber = prompt("Enter your phone number:");
    if (!username) username = prompt("Enter your username:");

    if (!phoneNumber || !username) return; // Exit if user cancels

    // Save to session storage
    sessionStorage.setItem("phoneNumber", phoneNumber);
    sessionStorage.setItem("username", username);
    console.log("Saved to sessionStorage:", { phoneNumber, username });
    socket.emit("registerClient", { phoneNumber, username });
    console.log("Emitted registerClient event:", { phoneNumber, username });
    const user = await checkOrRegisterUser(phoneNumber, username);
    if (user) {
      setUserData(user);
      setShowChat(true);
    }
  };

  const handleCloseChat = () => {
    const phoneNumber = sessionStorage.getItem("phoneNumber");
    if (phoneNumber) {
      socket.emit("clientOffline", { phoneNumber });
    }
    setShowChat(false);
  };

  useEffect(() => {
    socket.on("onlineAgents", (users) => {
      console.log("Online Agents received:", users);
      setOnlineAgents(users);
    });
  
    return () => {
      socket.off("onlineAgents");
    };
  }, []);


  useEffect(() => {
    return () => {
      const phoneNumber = sessionStorage.getItem("phoneNumber");
      if (phoneNumber) {
        socket.emit("clientOffline", { phoneNumber });
      }
    };
  }, []);  

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg 
                  hover:scale-110 transition-transform duration-200 flex items-center justify-center"
      >
        <FiMessageCircle size={28} />
      </button>

      {showChat && <ChatWindow onClose={handleCloseChat} 
      onlineAgents={onlineAgents} 
      user = {userData}
      userRole="client" />}
    </>
  );
}

export default ChatHandler;
