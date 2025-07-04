import { Server as NetServer, Socket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getBoardData, saveBoardData } from '../../server/db';
import { BoardData, Card } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

const socketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');

    const httpServer: HTTPServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket_io',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A client connected');

      getBoardData().then(board => {
        socket.emit('board:load', board);
      });

      socket.on('board:move', async (newBoardState: BoardData) => {
        await saveBoardData(newBoardState);
        socket.broadcast.emit('board:update', newBoardState);
      });

      socket.on('card:create', async (data: { columnId: string; content: string }) => {
        const board = await getBoardData();
        const newCard: Card = { id: `card-${uuidv4()}`, content: data.content };
        
        board.cards[newCard.id] = newCard;
        board.columns[data.columnId].cardIds.push(newCard.id);
        
        await saveBoardData(board);
        io.emit('board:update', board);
      });
      
      socket.on('card:update', async (updatedCard: Card) => {
        const board = await getBoardData();
        if(board.cards[updatedCard.id]) {
            board.cards[updatedCard.id] = updatedCard;
            await saveBoardData(board);
            io.emit('board:update', board);
        }
      });
      
      socket.on('card:delete', async (data: { cardId: string; columnId: string }) => {
          const board = await getBoardData();
          if(board.cards[data.cardId]) {
              delete board.cards[data.cardId];
              const cardIds = board.columns[data.columnId].cardIds;
              const cardIndex = cardIds.indexOf(data.cardId);
              if (cardIndex > -1) {
                  cardIds.splice(cardIndex, 1);
              }
              await saveBoardData(board);
              io.emit('board:update', board);
          }
      });

      socket.on('disconnect', () => {
        console.log('A client disconnected');
      });
    });
  }
  res.end();
};

export default socketHandler; 