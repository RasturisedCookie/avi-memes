import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

function MemeGenerator() {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [textBoxes, setTextBoxes] = useState([
    { 
      id: 1, 
      text: '', 
      x: 50, 
      y: 50, 
      fontSize: 2,
      color: '#ffffff',
      outline: '#000000',
      outlineWidth: 2,
      align: 'center',
      lineHeight: 1.2
    }
  ]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [draggedText, setDraggedText] = useState(null);
  const memeRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await axios.get('https://api.imgflip.com/get_memes');
      setMemes(response.data.data.memes);
      setRandomMeme(response.data.data.memes);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const setRandomMeme = (memesList) => {
    const randomIndex = Math.floor(Math.random() * memesList.length);
    setCurrentMeme(memesList[randomIndex]);
    setImageLoaded(false);
  };

  const handleNewMeme = () => {
    setRandomMeme(memes);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleDownload = async () => {
    if (memeRef.current) {
      try {
        const canvas = await html2canvas(memeRef.current);
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = url;
        link.click();
      } catch (error) {
        console.error('Error downloading meme:', error);
      }
    }
  };

  const handleMouseDown = (id, e) => {
    e.preventDefault();
    setDraggedText(id);
  };

  const handleMouseMove = (e) => {
    if (draggedText && memeRef.current) {
      const rect = memeRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setTextBoxes(boxes =>
        boxes.map(box =>
          box.id === draggedText
            ? { ...box, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
            : box
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedText(null);
  };

  const handleTextChange = (id, newText) => {
    setTextBoxes(boxes =>
      boxes.map(box =>
        box.id === id ? { ...box, text: newText } : box
      )
    );
  };

  const handleStyleChange = (id, property, value) => {
    setTextBoxes(boxes =>
      boxes.map(box =>
        box.id === id ? { ...box, [property]: value } : box
      )
    );
  };

  const addTextBox = () => {
    const newId = Math.max(...textBoxes.map(box => box.id)) + 1;
    setTextBoxes([...textBoxes, {
      id: newId,
      text: '',
      x: 50,
      y: 50,
      fontSize: 2,
      color: '#ffffff',
      outline: '#000000',
      outlineWidth: 2,
      align: 'center',
      lineHeight: 1.2
    }]);
  };

  const removeTextBox = (id) => {
    setTextBoxes(boxes => boxes.filter(box => box.id !== id));
  };

  const handleKeyDown = (id, e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newText = e.target.value + '\n';
      handleTextChange(id, newText);
    }
  };

  useEffect(() => {
    if (draggedText) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedText]);

  return (
    <div className="meme-generator">
      <div className="meme-workspace">
        {currentMeme && (
          <div className="meme-container" ref={memeRef}>
            <img
              ref={imageRef}
              src={currentMeme.url}
              alt="meme"
              onLoad={handleImageLoad}
            />
            {imageLoaded && textBoxes.map(box => (
              <div
                key={box.id}
                className={`meme-text ${draggedText === box.id ? 'dragging' : ''}`}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: draggedText === box.id ? 'grabbing' : 'grab',
                  fontSize: `${box.fontSize}em`,
                  color: box.color,
                  textShadow: `${box.outlineWidth}px ${box.outlineWidth}px 0 ${box.outline},
                              -${box.outlineWidth}px -${box.outlineWidth}px 0 ${box.outline},
                              ${box.outlineWidth}px -${box.outlineWidth}px 0 ${box.outline},
                              -${box.outlineWidth}px ${box.outlineWidth}px 0 ${box.outline}`,
                  textAlign: box.align,
                  lineHeight: box.lineHeight,
                  whiteSpace: 'pre-wrap'
                }}
                onMouseDown={(e) => handleMouseDown(box.id, e)}
              >
                {box.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={handleNewMeme}>Get New Meme</button>
        
        {textBoxes.map(box => (
          <div key={box.id} className="text-box-controls">
            <div className="text-box-header">
              <h3>Text Box {box.id}</h3>
              {textBoxes.length > 1 && (
                <button
                  className="delete-text-btn"
                  onClick={() => removeTextBox(box.id)}
                >
                  ×
                </button>
              )}
            </div>
            <textarea
              placeholder="Enter text (Press Enter for new line)"
              value={box.text}
              onChange={(e) => handleTextChange(box.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(box.id, e)}
              rows={3}
            />
            <div className="format-controls">
              <div className="control-group">
                <label>Font Size</label>
                <div className="font-size-control">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.1"
                    value={box.fontSize}
                    onChange={(e) => handleStyleChange(box.id, 'fontSize', parseFloat(e.target.value))}
                  />
                  <span>{box.fontSize.toFixed(1)}x</span>
                </div>
              </div>
              
              <div className="control-group">
                <label>Text Color</label>
                <input
                  type="color"
                  value={box.color}
                  onChange={(e) => handleStyleChange(box.id, 'color', e.target.value)}
                />
              </div>

              <div className="control-group">
                <label>Outline Color</label>
                <input
                  type="color"
                  value={box.outline}
                  onChange={(e) => handleStyleChange(box.id, 'outline', e.target.value)}
                />
              </div>

              <div className="control-group">
                <label>Outline Width</label>
                <div className="font-size-control">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={box.outlineWidth}
                    onChange={(e) => handleStyleChange(box.id, 'outlineWidth', parseFloat(e.target.value))}
                  />
                  <span>{box.outlineWidth}px</span>
                </div>
              </div>

              <div className="control-group">
                <label>Line Height</label>
                <div className="font-size-control">
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={box.lineHeight}
                    onChange={(e) => handleStyleChange(box.id, 'lineHeight', parseFloat(e.target.value))}
                  />
                  <span>{box.lineHeight.toFixed(1)}</span>
                </div>
              </div>

              <div className="control-group">
                <label>Alignment</label>
                <select
                  value={box.align}
                  onChange={(e) => handleStyleChange(box.id, 'align', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        
        {textBoxes.length < 5 && (
          <button className="add-text-btn" onClick={addTextBox}>
            Add Text Box
          </button>
        )}
        
        <button onClick={handleDownload}>Download Meme</button>
      </div>
    </div>
  );
}

export default MemeGenerator; 