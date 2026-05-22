"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001",
      {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );
  }
  return socket;
}

export function useLivePrices(
  callback: (data: any[]) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const s = getSocket();

    const handler = (data: any[]) => {
      callbackRef.current(data);
    };

    s.on("prices:update", handler);

    s.on("connect", () => {
      console.log("socket connected:", s.id);
    });

    s.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      s.off("prices:update", handler);
    };
  }, []);
}