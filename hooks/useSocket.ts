import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetch(url);

    const socketIo = io(url, {
      path: '/api/socket_io',
      autoConnect: typeof window !== 'undefined',
    });

    socketIo.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  return { socket, isConnected };
};