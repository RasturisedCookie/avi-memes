import React from 'react';
import { clearMemeHistory } from '../utils/memeUtils';

function HistoryModal({ isOpen, onClose, history, onClearHistory, darkMode }) {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleClearHistory = () => {
    clearMemeHistory();
    onClearHistory();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-4xl rounded-lg shadow-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-6`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Meme History
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {history.length === 0 ? (
            <div className={`text-center py-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No memes in history yet. Create and download some memes to see them here!
            </div>
          ) : (
            <>
              {/* Clear History Button */}
              <div className="mb-4">
                <button
                  onClick={handleClearHistory}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Clear History
                </button>
              </div>

              {/* Meme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
                {history.map((meme) => (
                  <div
                    key={meme.id}
                    className={`rounded-lg overflow-hidden border ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={meme.imageUrl}
                      alt="Saved meme"
                      className="w-full aspect-square object-contain"
                    />
                    <div className={`p-2 text-xs ${
                      darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'
                    }`}>
                      Created: {formatDate(meme.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryModal; 