import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (!socket) {
    socket = io(    import.meta.env.VITE_API_SOCKET_URL ||
    "https://socket.dev.cness.io", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;
