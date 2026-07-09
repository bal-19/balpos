import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "../stores/auth.store";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false, withCredentials: true });
  }
  const outletId = useAuthStore.getState().user?.outletId;
  if (!socket.connected) {
    socket.connect();
    if (outletId) socket.emit("join-outlet", outletId);
  }
  return socket;
}
