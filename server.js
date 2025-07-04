const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const { getBoardData, saveBoardData } = require('./server/db');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    path: '/api/socket_io',
  });

  io.on('connection', (socket) => {
    console.log('A client connected');

    getBoardData().then(board => {
      socket.emit('board:load', board);
    });

    socket.on('board:move', async (newBoardState) => {
      await saveBoardData(newBoardState);
      socket.broadcast.emit('board:update', newBoardState);
    });

    socket.on('card:create', async (data) => {
      const board = await getBoardData();
      const newCard = { id: `card-${uuidv4()}`, content: data.content };
      board.cards[newCard.id] = newCard;
      board.columns[data.columnId].cardIds.push(newCard.id);
      await saveBoardData(board);
      io.emit('board:update', board);
    });

    socket.on('card:update', async (updatedCard) => {
      const board = await getBoardData();
      if (board.cards[updatedCard.id]) {
        board.cards[updatedCard.id] = updatedCard;
        await saveBoardData(board);
        io.emit('board:update', board);
      }
    });

    socket.on('card:delete', async (data) => {
      const board = await getBoardData();
      if (board.cards[data.cardId]) {
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

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
