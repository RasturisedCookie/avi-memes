import React from 'react';

function ActionButtons({ onNewMeme, onDownload, onShowHistory, isDownloading, darkMode }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onNewMeme}
        className={`flex-1 p-2 rounded-lg ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        New Meme
      </button>
      
      <button
        onClick={onDownload}
        disabled={isDownloading}
        className={`flex-1 p-2 rounded-lg ${
          darkMode
            ? isDownloading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
            : isDownloading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
      
      <button
        onClick={onShowHistory}
        className={`flex-1 p-2 rounded-lg ${
          darkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        History
      </button>
    </div>
  );
}

export default ActionButtons; 