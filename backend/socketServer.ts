import { createServer } from "http";
import { Server } from "socket.io";
import { setIO } from "@/lib/socket";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setIO(io);

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  // Worker connects and sends prices:update
  // Server rebroadcasts to all OTHER clients (browsers)
  socket.on("prices:update", (data) => {
    console.log("rebroadcasting prices:update to", io.engine.clientsCount - 1, "clients");
    socket.broadcast.emit("prices:update", data);
  });

  socket.on("alert:trigger", (data) => {
    console.log("rebroadcasting alert:trigger");
    socket.broadcast.emit("alert:trigger", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

httpServer.listen(4001, () => {
  console.log("socket running on port 4001");
});