import { useEffect } from "react";
import { getSocket } from "../services/socket-client";

export function useSocketEvent<T>(event: string, handler: (payload: T) => void) {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}
