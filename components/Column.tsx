import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType, Card as CardType } from '../types';
import Card from './Card';
import { Plus } from 'lucide-react';
import { useBoard } from '../context/BoardContext';
import toast from 'react-hot-toast';
import AddCardModal from './AddCardModal';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onCardEdit: (card: CardType) => void;
}

const Column = ({ column, cards, onCardEdit }: ColumnProps) => {
  const { actions } = useBoard();
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);

  const handleAddCard = () => {
    setAddModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full sm:w-80 bg-gradient-to-br from-[#f2e9e4] via-[#c9ada7] to-[#4a4e69] bg-opacity-80 rounded-2xl p-2 mr-0 sm:mr-4 flex-shrink-0 shadow-lg border border-white/30 backdrop-blur-md mb-2 sm:mb-0">
      <h3 className="font-bold p-2 text-primary-text text-base sm:text-lg truncate">{column.title}</h3>
     <Droppable droppableId={column.id} type="CARD" isDropDisabled={false}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow min-h-[100px] p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-700' : ''
            }`}
          >
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} onEdit={() => onCardEdit(card)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        onClick={handleAddCard}
        className="mt-2 p-2 flex items-center justify-center text-secondary-text hover:bg-hover-card-bg hover:text-primary-text rounded-lg transition-colors"
      >
        <Plus size={16} className="mr-2" /> Add a card
      </button>
      <AddCardModal columnId={column.id} isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};

export default Column;