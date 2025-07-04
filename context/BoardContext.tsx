import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { BoardData, Card } from '../types';
import toast from 'react-hot-toast';

type BoardAction =
  | { type: 'SET_BOARD'; payload: BoardData }
  | { type: 'MOVE_CARD'; payload: BoardData }
  | { type: 'ADD_CARD'; payload: { columnId: string, card: Card } }
  | { type: 'UPDATE_CARD'; payload: Card }
  | { type: 'DELETE_CARD'; payload: { cardId: string, columnId: string } };

interface BoardContextType {
  state: BoardData;
  dispatch: Dispatch<BoardAction>;
  isConnected: boolean;
  actions: {
    moveCard: (newState: BoardData) => void;
    addCard: (columnId: string, content: string) => void;
    updateCard: (updatedCard: Card) => void;
    deleteCard: (cardId: string, columnId: string) => void;
  };
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const boardReducer = (state: BoardData, action: BoardAction): BoardData => {
  switch (action.type) {
    case 'SET_BOARD':
      return action.payload;
    case 'MOVE_CARD':
      return action.payload;
    case 'ADD_CARD': {
      const { columnId, card } = action.payload;
      const newCards = { ...state.cards, [card.id]: card };
      const column = state.columns[columnId];
      const newCardIds = [...column.cardIds, card.id];
      const newColumn = { ...column, cardIds: newCardIds };
      const newColumns = { ...state.columns, [columnId]: newColumn };
      return { ...state, cards: newCards, columns: newColumns };
    }
    case 'UPDATE_CARD': {
        const updatedCard = action.payload;
        return {
            ...state,
            cards: {
                ...state.cards,
                [updatedCard.id]: updatedCard,
            },
        };
    }
    case 'DELETE_CARD': {
        const { cardId, columnId } = action.payload;
        const newCards = { ...state.cards };
        delete newCards[cardId];
        const column = state.columns[columnId];
        const newCardIds = column.cardIds.filter(id => id !== cardId);
        const newColumn = { ...column, cardIds: newCardIds };
        return {
            ...state,
            cards: newCards,
            columns: {
                ...state.columns,
                [columnId]: newColumn,
            }
        };
    }
    default:
      return state;
  }
};

export const BoardProvider = ({ children, initialData }: { children: ReactNode; initialData: BoardData }) => {
  const [state, dispatch] = useReducer(boardReducer, initialData);
  const [isConnected, setIsConnected] = React.useState(true); // Always true for REST

  // Fetch latest board data on mount
  useEffect(() => {
    fetch('/api/board')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch({ type: 'SET_BOARD', payload: data.board });
        } else {
          toast.error('Failed to load board data.');
        }
      })
      .catch(() => toast.error('Failed to load board data.'));
  }, []);

  const actions = {
    moveCard: async (newState: BoardData) => {
      const prevState = state;
      dispatch({ type: 'MOVE_CARD', payload: newState });
      try {
        const res = await fetch('/api/board', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newState),
        });
        if (!res.ok) throw new Error('Failed to move card');
      } catch (error) {
        dispatch({ type: 'SET_BOARD', payload: prevState });
        toast.error('Failed to move card. Board reverted. ❌');
      }
    },
    addCard: async (columnId: string, content: string) => {
      try {
        const res = await fetch('/api/board', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columnId, content }),
        });
        const data = await res.json();
        if (data.success) {
          dispatch({ type: 'SET_BOARD', payload: data.board });
        } else {
          toast.error('Failed to add card.');
        }
      } catch {
        toast.error('Failed to add card.');
      }
    },
    updateCard: async (updatedCard: Card) => {
      const prevState = state;
      dispatch({ type: 'UPDATE_CARD', payload: updatedCard });
      try {
        const res = await fetch('/api/board', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updatedCard }),
        });
        if (!res.ok) throw new Error('Failed to update card');
      } catch (error) {
        dispatch({ type: 'SET_BOARD', payload: prevState });
        toast.error('Failed to update card. Board reverted. ❌');
      }
    },
    deleteCard: async (cardId: string, columnId: string) => {
      const prevState = state;
      dispatch({ type: 'DELETE_CARD', payload: { cardId, columnId } });
      try {
        const res = await fetch('/api/board', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId, columnId }),
        });
        if (!res.ok) throw new Error('Failed to delete card');
      } catch (error) {
        dispatch({ type: 'SET_BOARD', payload: prevState });
        toast.error('Failed to delete card. Board reverted. ❌');
      }
    },
  };

  return (
    <BoardContext.Provider value={{ state, dispatch, isConnected, actions }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};