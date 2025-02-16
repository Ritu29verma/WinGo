import { useState, useEffect } from 'react';
import AgentChatWindow from './ChatWindowAgent';
import { checkOrRegisterAgent } from './chatServiceAgent';
import { FiMessageCircle } from 'react-icons/fi'; // Import chat icon

function ChatHandlerAgent() {
  const [showChat, setShowChat] = useState(false);

  const handleOpenChat = async () => {
    let phoneNumber = sessionStorage.getItem("phoneNumber");
    
    if (!phoneNumber) {
      phoneNumber = prompt('Enter your phone number:');

      if (!phoneNumber) return; // Exit if user cancels
    }

    // Save to session storage to avoid future prompts
    sessionStorage.setItem("phoneNumber", phoneNumber);

    // Register user if needed
    const agent = await checkOrRegisterAgent(phoneNumber);
    if (agent) {
      setShowChat(true);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button 
        onClick={handleOpenChat} 
        className="fixed bottom-20 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg 
                  hover:scale-110 transition-transform duration-200 flex items-center justify-center"
      >
        <FiMessageCircle size={28} />
      </button>

      {/* Chat Window (Pass onClose function) */}
      {showChat && <AgentChatWindow onClose={() => setShowChat(false)} />}
    </>
  );
}

export default ChatHandlerAgent;
