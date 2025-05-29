import React from 'react';

function Header({ darkMode, onDarkModeToggle }) {
  return (
    <header className={`py-4 ${darkMode ? 'bg-gray-800' : 'bg-white border-b border-gray-200'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
           ❤ AVI'S MEMES 🤣
        </h1>
        <button
          onClick={onDarkModeToggle}
          className={`p-2 rounded-lg ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header; 