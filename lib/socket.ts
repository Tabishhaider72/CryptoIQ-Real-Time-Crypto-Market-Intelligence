import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export function getIO() {
  return io;
}

export function setIO(server: IOServer) {
  io = server;
}