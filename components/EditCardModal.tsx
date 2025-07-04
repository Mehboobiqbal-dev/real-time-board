import { Card } from '../types';
import { X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBoard } from '../context/BoardContext';
import toast from 'react-hot-toast';

interface EditCardModalProps {
    card: Card | null;
    columnId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const EditCardModal = ({ card, columnId, isOpen, onClose }: EditCardModalProps) => {
    const { actions } = useBoard();
    const [content, setContent] = useState(card?.content || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        setContent(card?.content || '');
    }, [card]);

    if (!isOpen || !card || !columnId) return null;

    const handleSave = () => {
        if(content.trim()) {
            actions.updateCard({ ...card, content });
            toast.success('Card updated successfully! ✏️');
            onClose();
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (card && columnId) {
            actions.deleteCard(card.id, columnId);
            toast('Card deleted 🗑️', { icon: '🗑️', style: { background: '#ef476f', color: '#fff' } });
            setShowDeleteModal(false);
            onClose();
        }
    };

    const cancelDelete = () => setShowDeleteModal(false);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#22223b]/80 via-[#4a4e69]/70 to-[#9a8c98]/80 backdrop-blur-[3px] flex justify-center items-center z-50 px-2 sm:px-0">
            <div className="bg-white/90 dark:bg-[#22223b]/90 p-4 sm:p-6 rounded-2xl w-full max-w-md shadow-2xl relative border border-white/30 backdrop-blur-md">
                <button onClick={onClose} className="absolute top-3 right-3 text-secondary-text hover:text-primary-text">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-primary-text">Edit Card</h2>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 bg-card-bg text-primary-text rounded-md border border-border-color focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                    rows={4}
                />
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <button onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center p-2 rounded-md hover:bg-red-500/10 w-full sm:w-auto justify-center">
                        <Trash2 size={18} className="mr-2" /> Delete Card
                    </button>
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
                        Save Changes
                    </button>
                </div>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 flex justify-center items-center z-60 bg-black/40 backdrop-blur-sm px-2 sm:px-0">
                    <div className="bg-gradient-to-br from-[#ef476f]/90 via-[#ffd166]/90 to-[#06d6a0]/90 p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/30 max-w-xs w-full text-center">
                        <h3 className="text-lg font-bold mb-2 text-[#22223b]">Are you sure you want to delete this card?</h3>
                        <p className="mb-4 text-[#22223b]">This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                            <button onClick={confirmDelete} className="bg-[#ef476f] hover:bg-[#d90429] text-white font-bold py-2 px-4 rounded shadow w-full sm:w-auto">Yes, Delete</button>
                            <button onClick={cancelDelete} className="bg-gray-200 hover:bg-gray-300 text-[#22223b] font-bold py-2 px-4 rounded shadow w-full sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCardModal;