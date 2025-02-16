import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { checkOrRegisterUser } from "./chatService";
import { FiMessageCircle } from "react-icons/fi"; // Import chat icon

function ChatHandler() {
  const [showChat, setShowChat] = useState(false);

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

    // Register user if needed
    const user = await checkOrRegisterUser(phoneNumber, username);
    if (user) {
      setShowChat(true);
    }
  };

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

      {/* Chat Window */}
      {showChat && <ChatWindow onClose={() => setShowChat(false)} />}
    </>
  );
}

export default ChatHandler;
