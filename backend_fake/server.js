// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8081", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow specific HTTP methods
    allowedHeaders: ["my-custom-header"], // Customize allowed headers if needed
    credentials: true, // Allow credentials if necessary
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Forward signaling data between clients
  socket.on("signal", (data) => {
    // Assume 'to' contains the target peer ID
    io.to(data.to).emit("signal", {
      from: socket.id,
      signal: data.signal,
    });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Signaling server listening on port 3000");
});
