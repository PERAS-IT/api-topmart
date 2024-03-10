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

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // receiver userId from query from user
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  //sent event all connection clients => sent to admin
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // join room by user and admin room == userId
  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(room);
    console.log(`User with with ID : ${socket.id} joined room: ${room} `);
  });

  //send message to anyone user and admin

  socket.on("send_message", async (data) => {
    try {
      //SAVE MESSAGE TO DATA BASE
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
