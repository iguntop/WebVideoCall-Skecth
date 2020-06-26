const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
    console.log("Client connected: " + socket.id);
  }
  socket.emit("yourID", socket.id);

  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  //Drawing Canvas socket
  socket.on("mouse", (data) => {
    socket.broadcast.emit("mouse", data);
  });

  socket.on("disconnect", () => console.log("Client Canvass has disconnected"));
});

server.listen(8000, () => console.log("server is running on port 8000"));
