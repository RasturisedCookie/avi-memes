import React, { forwardRef } from 'react';

const MemeCanvas = forwardRef(({ memeImage, textBoxes, onTextBoxDrag, darkMode }, ref) => {
  const handleMouseDown = (e, textBox) => {
    const container = e.target.parentElement;
    const startX = e.clientX - textBox.x;
    const startY = e.clientY - textBox.y;

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - startX;
      const newY = moveEvent.clientY - startY;
      onTextBoxDrag(textBox.id, newX, newY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line || ' '}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div 
      ref={ref}
      className={`relative aspect-square rounded-lg overflow-hidden border ${
        darkMode ? 'border-gray-700' : 'border-gray-300'
      }`}
    >
      {memeImage ? (
        <div className="relative w-full h-full">
          <img
            src={memeImage.url}
            alt={memeImage.name || 'Meme template'}
            className="w-full h-full object-contain bg-transparent"
            crossOrigin="anonymous"
          />
          {textBoxes.map((textBox, index) => (
            <div
              key={textBox.id}
              className="absolute cursor-move select-none font-impact"
              style={{
                left: `${textBox.x}px`,
                top: `${textBox.y}px`,
                fontSize: `${textBox.size}rem`,
                color: textBox.fontColor,
                textShadow: `${textBox.outlineWidth}px ${textBox.outlineWidth}px 0 ${textBox.outlineColor},
                          -${textBox.outlineWidth}px -${textBox.outlineWidth}px 0 ${textBox.outlineColor},
                          ${textBox.outlineWidth}px -${textBox.outlineWidth}px 0 ${textBox.outlineColor},
                          -${textBox.outlineWidth}px ${textBox.outlineWidth}px 0 ${textBox.outlineColor}`,
                transform: 'translate(-50%, -50%)',
                minWidth: '200px',
                width: '300px',
                textAlign: textBox.alignment,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                whiteSpace: 'pre-wrap'
              }}
              onMouseDown={(e) => handleMouseDown(e, textBox)}
            >
              {textBox.text ? renderText(textBox.text) : `Text ${index + 1}`}
            </div>
          ))}
        </div>
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <div className="text-center">
            <div className={`text-4xl mb-2 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              🖼️
            </div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Loading meme...
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

MemeCanvas.displayName = 'MemeCanvas';

export default MemeCanvas; 