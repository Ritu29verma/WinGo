import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; 
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import gameRoutes from "./routes/gameRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import {initializeSocket} from "./socket.js"; 
import gameRoutes from "./routes/gameRoutes.js"



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
// app.use("/api/game", gameRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes);



const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
