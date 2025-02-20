import { useState, useEffect } from 'react';
import AgentChatWindow from './ChatWindowAgent';
import { checkOrRegisterAgent } from './chatServiceAgent';
import { FiMessageCircle } from 'react-icons/fi'; // Import chat icon
import socket from '../socket';
function ChatHandlerAgent() {
  const [showChat, setShowChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [agentData, setAgentData] = useState(null);

  const handleOpenChat = async () => {
    let phoneNumber = sessionStorage.getItem("phoneNumber");
    if (!phoneNumber) {
      phoneNumber = prompt('Enter your phone number:');
      if (!phoneNumber) return;
    }

    const agent = await checkOrRegisterAgent(phoneNumber);
    if (agent) {
      // Store the username from the agent object
      setAgentData(agent);
      sessionStorage.setItem("phoneNumber", agent.phoneNumber);
      sessionStorage.setItem("username", agent.username);  // Store the username
      // Emit the registration details to socket
      socket.emit("registerAgent", {
        phoneNumber: agent.phoneNumber,
        username: agent.username,  // Emit the username
      });
  
      setShowChat(true);
    }
};

useEffect(() => {
  socket.on("onlineUsers", (users) => {
    console.log("Online users received:", users);
    setOnlineUsers(users);
  });

  return () => {
    socket.off("onlineUsers");
  };
}, []);

const handleCloseChat = () => {
  const phoneNumber = sessionStorage.getItem("phoneNumber");
  if (phoneNumber) {
    socket.emit("AgentOffline", { phoneNumber });
  }
  setShowChat(false);
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
      {showChat && <AgentChatWindow onClose={handleCloseChat}
      onlineUsers={onlineUsers} 
      agent={agentData} 
      userRole="agent"/>}

    </>
  );
}

export default ChatHandlerAgent;
