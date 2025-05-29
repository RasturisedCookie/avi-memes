import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import MemeCanvas from './components/MemeCanvas';
import TextControls from './components/TextControls';
import ActionButtons from './components/ActionButtons';
import {
  createNewTextBox,
  downloadMeme,
  saveMemeToHistory,
  loadMemeHistory,
  clearMemeHistory
} from './utils/memeUtils';
import HistoryModal from './components/HistoryModal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [memeImage, setMemeImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([createNewTextBox()]);
  const [memeHistory, setMemeHistory] = useState([]);
  const [availableMemes, setAvailableMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const memeContainerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Load history and fetch memes on initial mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const history = await loadMemeHistory();
        setMemeHistory(history);
        await fetchMemes();
      } catch (error) {
        console.error('Error initializing:', error);
        setLoadError('Failed to initialize the app. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchMemes = async () => {
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      if (!response.ok) {
        throw new Error('Failed to fetch memes');
      }
      const data = await response.json();
      if (data.success) {
        setAvailableMemes(data.data.memes);
        // Set a random meme initially
        const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        setMemeImage({
          url: randomMeme.url,
          name: randomMeme.name
        });
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
      setLoadError('Failed to load memes. Please try again later.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleNewMeme = () => {
    if (availableMemes.length === 0) {
      setErrorMessage('No memes available. Please try again later.');
      return;
    }
    const randomMeme = availableMemes[Math.floor(Math.random() * availableMemes.length)];
    setMemeImage({
      url: randomMeme.url,
      name: randomMeme.name
    });
  };

  const handleDownload = async () => {
    if (!memeContainerRef.current) {
      console.error('Meme container reference is not available');
      return;
    }
    
    try {
      setIsDownloading(true);
      setErrorMessage('');
      
      // Step 1: Generate the meme image
      console.log('Generating meme image...');
      const dataUrl = await downloadMeme(memeContainerRef.current);
      
      // Step 2: Save to history
      console.log('Saving to history...');
      const updatedHistory = await saveMemeToHistory(dataUrl, textBoxes);
      console.log('History updated, new length:', updatedHistory.length);
      
      // Step 3: Update state
      setMemeHistory(updatedHistory);
      
      // Step 4: Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error in handleDownload:', error);
      setErrorMessage(error.message || 'Failed to download meme. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddTextBox = () => {
    setTextBoxes(prev => [...prev, createNewTextBox()]);
  };

  const handleTextChange = (id, text) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, text } : box))
    );
  };

  const handleSizeChange = (id, size) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, size } : box))
    );
  };

  const handleFontColorChange = (id, fontColor) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, fontColor } : box))
    );
  };

  const handleOutlineColorChange = (id, outlineColor) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, outlineColor } : box))
    );
  };

  const handleOutlineWidthChange = (id, outlineWidth) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, outlineWidth } : box))
    );
  };

  const handleAlignmentChange = (id, alignment) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, alignment } : box))
    );
  };

  const handleTextBoxDrag = (id, x, y) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, x, y } : box))
    );
  };

  const handleRemoveTextBox = (id) => {
    setTextBoxes(prev => prev.filter(box => box.id !== id));
  };

  const handleClearHistory = () => {
    clearMemeHistory();
    setMemeHistory([]);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        Loading...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} onDarkModeToggle={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Meme Canvas */}
          <div className="space-y-4">
            <MemeCanvas
              ref={memeContainerRef}
              memeImage={memeImage}
              textBoxes={textBoxes}
              onTextBoxDrag={handleTextBoxDrag}
              darkMode={darkMode}
            />
            
            <ActionButtons
              onNewMeme={handleNewMeme}
              onDownload={handleDownload}
              onShowHistory={() => setShowHistory(true)}
              isDownloading={isDownloading}
              darkMode={darkMode}
            />
            
            {showSuccessMessage && (
              <div className="text-green-500 text-center mt-2">
                Meme saved to history!
              </div>
            )}
            
            {errorMessage && (
              <div className="text-red-500 text-center mt-2">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Right column - Text Controls */}
          <div className="space-y-4">
            {textBoxes.map((textBox, index) => (
              <TextControls
                key={textBox.id}
                textBox={textBox}
                index={index}
                onTextChange={handleTextChange}
                onSizeChange={handleSizeChange}
                onFontColorChange={handleFontColorChange}
                onOutlineColorChange={handleOutlineColorChange}
                onOutlineWidthChange={handleOutlineWidthChange}
                onAlignmentChange={handleAlignmentChange}
                onRemove={handleRemoveTextBox}
                darkMode={darkMode}
              />
            ))}
            
            <button
              onClick={handleAddTextBox}
              className={`w-full p-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Add Text Box
            </button>
          </div>
        </div>
      </main>

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={memeHistory}
        onClearHistory={handleClearHistory}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App; 