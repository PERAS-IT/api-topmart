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

  const { EIO, transport, ...onlineUser } = socket.handshake.query;
  // set online user On connect
  if (
    onlineUser.userId != "undefined" &&
    onlineUser.userId != "null" &&
    !userSocketMap.map((el) => el.userId).includes(onlineUser.userId)
  ) {
    userSocketMap = [...userSocketMap, onlineUser];
  }
  console.log(userSocketMap);
  io.emit("getOnlineUser", userSocketMap);

  // join room by user and admin room == userId
  socket.on("join_room", async (room) => {
    socket.join(room); //user id
    console.log(room);
    console.log(`User with with ID : ${socket.id} joined room: ${room} `);
  });

  //send message to anyone user and admin

  socket.on("send_message", async (data) => {
    try {
      //SAVE MESSAGE TO DATA BASE
      const resultMassage = await repo.liveChat.saveMessageChat(data);
      await socket.to(data.userId).emit("receive_message", resultMassage);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { app, server, io };
