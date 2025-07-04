import type { NextApiRequest, NextApiResponse } from 'next';
import { getBoardData, saveBoardData } from '../../server/db';
import { v4 as uuidv4 } from 'uuid';
import { BoardData, Card } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const board = await getBoardData();
      return res.status(200).json({ success: true, board });
    }
    if (req.method === 'PUT') {
      // Update the whole board (move card)
      await saveBoardData(req.body);
      return res.status(200).json({ success: true });
    }
    if (req.method === 'POST') {
      // Add a card
      const { columnId, content } = req.body;
      const board = await getBoardData();
      const newCard: Card = { id: `card-${uuidv4()}`, content };
      board.cards[newCard.id] = newCard;
      board.columns[columnId].cardIds.push(newCard.id);
      await saveBoardData(board);
      return res.status(200).json({ success: true, board });
    }
    if (req.method === 'PATCH') {
      // Update a card
      const { updatedCard } = req.body;
      const board = await getBoardData();
      if (board.cards[updatedCard.id]) {
        board.cards[updatedCard.id] = updatedCard;
        await saveBoardData(board);
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    if (req.method === 'DELETE') {
      // Delete a card
      const { cardId, columnId } = req.body;
      const board = await getBoardData();
      if (board.cards[cardId]) {
        delete board.cards[cardId];
        const cardIds = board.columns[columnId].cardIds;
        const cardIndex = cardIds.indexOf(cardId);
        if (cardIndex > -1) {
          cardIds.splice(cardIndex, 1);
        }
        await saveBoardData(board);
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, error: message });
  }
} 