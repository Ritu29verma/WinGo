import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { Server } from "socket.io";
// import gameRoutes from "./routes/gameRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import connectMySQL from "./config/mysql.js";
import adminRoutes from "./routes/adminRoutes.js";
import { initializeSocket } from "./socket.js";
import { chatSocket } from "./chat-module/socket.js";
import gameRoutes from "./routes/gameRoutes.js";
import chatModule from './chat-module/chatModule.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();
const mysqlPool = await connectMySQL(); // MySQL

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  if (!mysqlPool) {
    return res.status(500).json({ error: 'MySQL pool not initialized' });
  }
  req.mysqlPool = mysqlPool; // Attach the MySQL pool to the request object
  next();
});

app.use("/images", express.static(path.resolve("images")));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes);
app.use("/chat", chatModule);


    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    initializeSocket(io);
    chatSocket(io);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });


export { io };