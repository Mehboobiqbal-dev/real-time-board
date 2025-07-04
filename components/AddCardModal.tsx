import { X } from 'lucide-react';
import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import toast from 'react-hot-toast';

interface AddCardModalProps {
  columnId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const AddCardModal = ({ columnId, isOpen, onClose }: AddCardModalProps) => {
  const { actions } = useBoard();
  const [content, setContent] = useState('');

  if (!isOpen || !columnId) return null;

  const handleAdd = () => {
    if (content.trim()) {
      actions.addCard(columnId, content);
      toast.success('A new task card was added! 🚀');
      setContent('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#22223b]/80 via-[#4a4e69]/70 to-[#9a8c98]/80 backdrop-blur-[3px] flex justify-center items-center z-50 px-2 sm:px-0">
      <div className="bg-white/90 dark:bg-[#22223b]/90 p-4 sm:p-6 rounded-2xl w-full max-w-md shadow-2xl relative border border-white/30 backdrop-blur-md">
        <button onClick={onClose} className="absolute top-3 right-3 text-secondary-text hover:text-primary-text">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-primary-text">Add New Card</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 bg-card-bg text-primary-text rounded-md border border-border-color focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
          rows={4}
          placeholder="Enter card content..."
        />
        <div className="mt-4 flex justify-end items-center">
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md w-full sm:w-auto">
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal; 