import { connectToDatabase } from '../lib/mongodb';
import { BoardData } from '../types';

const COLLECTION_NAME = 'boards';
const BOARD_ID = 'main-board'; // We use a fixed ID for our single-board setup

// Define the shape of the document stored in MongoDB, explicitly setting _id to be a string.
interface BoardDocument extends BoardData {
  _id: string;
}

// The initial data to seed the database with if it's empty
const initialData: BoardData = {
  cards: {
    "card-1": { id: "card-1", content: "Learn Next.js & MongoDB" },
    "card-2": { id: "card-2", content: "Setup MongoDB Connection" },
    "card-3": { id: "card-3", content: "Implement Optimistic UI" },
  },
  columns: {
    "col-1": { id: "col-1", title: "Ideas", cardIds: ["card-1", "card-2", "card-3"] },
    "col-2": { id: "col-2", title: "In Development", cardIds: [] },
    "col-3": { id: "col-3", title: "Launched", cardIds: [] },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};


export const getBoardData = async (): Promise<BoardData> => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<BoardDocument>(COLLECTION_NAME);

    let board = await collection.findOne({ _id: BOARD_ID });

    if (!board) {
      console.log('No board found, seeding database with initial data...');
      await collection.insertOne({ _id: BOARD_ID, ...initialData });
      return initialData;
    }

    const { _id, ...boardData } = board;
    return boardData as BoardData;
  } catch (error) {
    console.error('Error in getBoardData:', error);
    throw error;
  }
};

// Saves the entire board state to the database
export const saveBoardData = async (data: BoardData) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<BoardDocument>(COLLECTION_NAME);
    await collection.updateOne(
      { _id: BOARD_ID },
      { $set: data },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving board data to MongoDB:', error);
    throw error;
  }
};