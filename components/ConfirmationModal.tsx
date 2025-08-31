import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] rounded-2xl p-8 text-center shadow-2xl border border-[var(--card-border)] transform transition-all animate-fade-in-up w-11/12 max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-600/80 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-110"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500/80 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl hover:shadow-red-500/40 shadow-red-500/30"
          >
            Confirm
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;