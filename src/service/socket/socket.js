const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const repo = require("../../repository");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join_room", async (data) => {
    socket.join(data);
    console.log(data);
    console.log(`User with with ID : ${socket.id} joined room: ${data} `);
  });

  socket.on("send_message", async (data) => {
    try {
      const resultMassage = await repo.liveChat.saveMessageChat(data);
      await socket.to(data.room).emit("receive_message", resultMassage);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { app, server, io };
