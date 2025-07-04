import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useBoard } from '../context/BoardContext';
import { BoardData, Card as CardType } from '../types';
import Column from './Column';
import EditCardModal from './EditCardModal';

const Board = () => {
  const { state, actions } = useBoard();
  const [editingCard, setEditingCard] = useState<{ card: CardType; columnId: string; } | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const startColumn = state.columns[source.droppableId];
    const finishColumn = state.columns[destination.droppableId];
    let newBoardState: BoardData;
    if (startColumn === finishColumn) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...startColumn, cardIds: newCardIds };
      newBoardState = {
        ...state,
        columns: { ...state.columns, [newColumn.id]: newColumn },
      };
    } else {
      const startCardIds = Array.from(startColumn.cardIds);
      startCardIds.splice(source.index, 1);
      const newStartColumn = { ...startColumn, cardIds: startCardIds };
      const finishCardIds = Array.from(finishColumn.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = { ...finishColumn, cardIds: finishCardIds };
      newBoardState = {
        ...state,
        columns: {
          ...state.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        },
      };
    }
    actions.moveCard(newBoardState);
  };

  const handleCardEdit = (card: CardType) => {
    const columnId = Object.values(state.columns).find(col => col.cardIds.includes(card.id))?.id;
    if (columnId) {
      setEditingCard({ card, columnId });
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex p-2 sm:p-4 overflow-x-auto h-full backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 gap-2 sm:gap-4 scrollbar-thin scrollbar-thumb-[#4a4e69]/60 scrollbar-track-transparent">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const cards = column.cardIds.map((cardId) => state.cards[cardId]);
            return <Column key={column.id} column={column} cards={cards} onCardEdit={handleCardEdit} />;
          })}
        </div>
      </DragDropContext>
      <EditCardModal 
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        card={editingCard?.card || null}
        columnId={editingCard?.columnId || null}
      />
    </>
  );
};

export default Board;