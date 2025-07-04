import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card as CardType } from '../types';
import { cn } from '../lib/cn';

interface CardProps {
  card: CardType;
  index: number;
  onEdit: () => void;
}

const Card = ({ card, index, onEdit }: CardProps) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onEdit}
          className={cn(
            "p-3 mb-2 rounded-xl shadow-md bg-gradient-to-br from-[#9a8c98] via-[#c9ada7] to-[#f2e9e4] bg-opacity-80 text-primary-text cursor-pointer select-none text-sm sm:text-base",
            "hover:bg-gradient-to-tl hover:from-[#4a4e69] hover:to-[#9a8c98] transition-colors",
            snapshot.isDragging && "ring-2 ring-blue-500 shadow-2xl"
          )}
        >
          {card.content}
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(Card);