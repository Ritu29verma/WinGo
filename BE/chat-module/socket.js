import { io } from "../index.js";
import Chat from "./models/Chats.js";
import User from './models/User.js';
import Agent from './models/Agent.js';


const onlineUsers = new Map(); 
const onlineAgents = new Map(); 

export const chatSocket = () => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Register clients
    socket.on("registerClient", ({ phoneNumber, username }) => {
      console.log(`Registering Client: ${username}, Phone: ${phoneNumber}, Socket ID: ${socket.id}`);
      onlineUsers.set(socket.id, { phoneNumber, username, role: "user" });
      console.log("Current Online Users:", Array.from(onlineUsers.entries()));
      io.emit("onlineUsers", Array.from(onlineUsers.values())); // Update agents
    });
    

    // Register agents
    socket.on("registerAgent", ({ phoneNumber, username }) => {
      console.log(`Registering Agent: ${username}, Phone: ${phoneNumber}, Socket ID: ${socket.id}`);
      onlineAgents.set(socket.id, { phoneNumber, username, role: "agent" });
      console.log("Current Online Agents:", Array.from(onlineAgents.entries()));
      io.emit("onlineAgents", Array.from(onlineAgents.values())); // Update users
    });

    socket.on("clientOffline", ({ phoneNumber }) => {
      for (const [socketId, user] of onlineUsers.entries()) {
        if (user.phoneNumber === phoneNumber) {
          onlineUsers.delete(socketId);
          break;
        }
      }
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });


    socket.on("AgentOffline", ({ phoneNumber }) => {
      for (const [socketId, user] of onlineAgents.entries()) {
        if (user.phoneNumber === phoneNumber) {
          onlineAgents.delete(socketId);
          break;
        }
      }
      io.emit("onlineAgents", Array.from(onlineAgents.values()));
    });

socket.on("sendMessage", async ({ sender, receiver, text, timestamp, role }) => {
  console.log("Received sendMessage event with data:", { sender, receiver, text, timestamp, role });

  let senderUser = onlineUsers.get(socket.id) || onlineAgents.get(socket.id);
  if (!senderUser) {
    console.error("Sender not found or not registered.");
    return;
  }

  console.log("Sender user:", senderUser);

  // Determine receiver's socket ID
  let receiverUser = [...onlineUsers.entries()].find(
    ([, user]) => user.username === receiver
  )?.[0] || [...onlineAgents.entries()].find(
    ([, agent]) => agent.username === receiver
  )?.[0];

  console.log("Receiver Socket ID:", receiverUser);

  if (receiverUser) {
    const messageData = {
      sender: senderUser.username,
      receiver: receiverUser.username,
      text,
      timestamp,
      role,
    };

     // Send message to receiver socket
  let receiverSocketId = [...onlineUsers.entries()].find(([id, user]) => user.username === receiver)?.[0] ||
  [...onlineAgents.entries()].find(([id, agent]) => agent.username === receiver)?.[0];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", messageData);
    console.log(`Message sent to receiver socket ID: ${receiverSocketId}`);
  } else {
    console.error(`Receiver with username ${receiver} is offline or not found.`);
  }
  
    // Store message in the database
    try {
      // Find sender's database ID
      const senderDB = await (role === "user" 
        ? User.findOne({ where: { username: sender } }) 
        : Agent.findOne({ where: { username: sender } }));
    
      // Find receiver's database ID
      const receiverDB = await (role === "agent" 
        ? User.findOne({ where: { username: receiver } }) 
        : Agent.findOne({ where: { username: receiver } }));
    
      if (!senderDB || !receiverDB) {
        console.error("Sender or receiver not found in DB");
        return;
      }
    
      // Save to DB with correct IDs
      const savedMessage = await Chat.create({
        senderType: role,  
        message: text,
        userId: role === "user" ? senderDB.id : receiverDB.id,  // ✅ Use id, not phoneNumber
        agentId: role === "agent" ? senderDB.id : receiverDB.id, // ✅ Use id, not phoneNumber
      });
    
      console.log("Message saved:", savedMessage.toJSON());
    } catch (error) {
      console.error("Error saving message to DB:", error);
    }
    
  } else {
    console.error(`Receiver with phone number ${receiver} not found`);
  }
});


    // Inside your server-side socket code

// Typing Event Listener
socket.on("typing", ({ user }) => {
  if (!user || !user.username || !user.phoneNumber) {
    console.error("Invalid user data received in 'typing' event:", user);
    return;
  }
  console.log(`${user.username} is typing...`);
  socket.broadcast.emit("typing", { user });
});

// Stopped Typing Event Listener
socket.on("stopped-typing", ({ user }) => {
  if (!user || !user.username || !user.phoneNumber) {
    console.error("Invalid user data received in 'stopped-typing' event:", user);
    return;
  }
  console.log(`${user.username} stopped typing.`);
  socket.broadcast.emit("stopped-typing", { user });
});


    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
      console.log("A user disconnected:", socket.id);
    });
  });
};
