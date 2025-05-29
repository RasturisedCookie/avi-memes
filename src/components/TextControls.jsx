import React from 'react';

function TextControls({
  textBox,
  index,
  onTextChange,
  onSizeChange,
  onFontColorChange,
  onOutlineColorChange,
  onOutlineWidthChange,
  onAlignmentChange,
  onRemove,
  darkMode
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    } else if (e.key === 'Enter' && e.shiftKey) {
      onTextChange(textBox.id, textBox.text + '\n');
    }
  };

  return (
    <div className={`rounded-lg shadow-sm p-4 mb-4 ${
      darkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      {/* Header and Text Input */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Text {index + 1}
          </h3>
          <button
            onClick={() => onRemove(textBox.id)}
            className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-red-500`}
          >
            ✕
          </button>
        </div>
        
        <textarea
          value={textBox.text}
          onChange={(e) => onTextChange(textBox.id, e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Text ${index + 1}`}
          rows={2}
          className={`w-full p-2 rounded resize-none ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } border`}
        />
      </div>

      {/* Controls Row */}
      <div className="grid grid-cols-5 gap-4 items-end">
        {/* Size */}
        <div>
          <label className={`block text-xs mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Size</label>
          <div className={`flex items-center border rounded ${
            darkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-white border-gray-300'
          }`}>
            <button 
              onClick={() => onSizeChange(textBox.id, Math.max(1, textBox.size - 0.1))}
              className={`px-2 py-1 border-r ${
                darkMode 
                  ? 'border-gray-600 hover:bg-gray-600 text-white' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              -
            </button>
            <span className={`flex-1 text-center text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {textBox.size.toFixed(1)}
            </span>
            <button 
              onClick={() => onSizeChange(textBox.id, Math.min(5, textBox.size + 0.1))}
              className={`px-2 py-1 border-l ${
                darkMode 
                  ? 'border-gray-600 hover:bg-gray-600 text-white' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className={`block text-xs mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Text Color</label>
          <input
            type="color"
            value={textBox.fontColor}
            onChange={(e) => onFontColorChange(textBox.id, e.target.value)}
            className={`w-full h-8 p-0 border rounded ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Outline Color */}
        <div>
          <label className={`block text-xs mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Outline Color</label>
          <input
            type="color"
            value={textBox.outlineColor}
            onChange={(e) => onOutlineColorChange(textBox.id, e.target.value)}
            className={`w-full h-8 p-0 border rounded ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Outline Width */}
        <div>
          <label className={`block text-xs mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Outline Width</label>
          <input
            type="range"
            min="0"
            max="4"
            step="0.5"
            value={textBox.outlineWidth}
            onChange={(e) => onOutlineWidthChange(textBox.id, parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Alignment */}
        <div>
          <label className={`block text-xs mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Alignment</label>
          <div className="flex gap-1">
            {['left', 'center', 'right'].map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onAlignmentChange(textBox.id, align)}
                className={`flex-1 p-1 border rounded ${
                  textBox.alignment === align 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : darkMode
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                      : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                }`}
                title={`Align ${align}`}
              >
                {align === 'left' ? '⟵' : align === 'center' ? '↔' : '⟶'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextControls; 