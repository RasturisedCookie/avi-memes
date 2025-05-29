import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

const HISTORY_KEY = 'meme_history';
const MAX_IMAGE_DIMENSION = 400; // Maximum width or height for stored images

// Helper function to compress image
const compressImage = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > MAX_IMAGE_DIMENSION) {
          height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
          width = MAX_IMAGE_DIMENSION;
        }
      } else {
        if (height > MAX_IMAGE_DIMENSION) {
          width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
          height = MAX_IMAGE_DIMENSION;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress as JPG with reduced quality
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export const createNewTextBox = () => ({
  id: uuidv4(),
  text: '',
  x: window.innerWidth / 4,  // Center horizontally in the canvas
  y: window.innerHeight / 4, // Center vertically in the canvas
  size: 2,
  fontColor: '#ffffff',
  outlineColor: '#000000',
  outlineWidth: 2,
  alignment: 'center'
});

export const downloadMeme = async (containerRef) => {
  try {
    // Wait for any pending image loads
    const images = containerRef.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(
        img => img.complete ? Promise.resolve() : new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        })
      )
    );

    const canvas = await html2canvas(containerRef, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.querySelector('div[class*="relative aspect-square"]');
        if (clonedContainer) {
          const originalRect = containerRef.getBoundingClientRect();
          clonedContainer.style.width = `${originalRect.width}px`;
          clonedContainer.style.height = `${originalRect.height}px`;
        }
      }
    });

    // For download, use PNG with full quality
    const downloadUrl = canvas.toDataURL('image/png');
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Return compressed version for storage
    return await compressImage(downloadUrl);
  } catch (error) {
    console.error('Error downloading meme:', error);
    throw error;
  }
};

export const saveMemeToHistory = async (dataUrl, textBoxes) => {
  try {
    // Load existing history
    let existingHistory = [];
    const historyData = localStorage.getItem(HISTORY_KEY);
    if (historyData) {
      try {
        existingHistory = JSON.parse(historyData);
        if (!Array.isArray(existingHistory)) {
          console.warn('History was not an array, resetting');
          existingHistory = [];
        }
      } catch (e) {
        console.error('Error parsing history:', e);
        existingHistory = [];
      }
    }

    // Create new meme entry
    const newMeme = {
      id: uuidv4(),
      imageUrl: dataUrl,
      textBoxes: JSON.parse(JSON.stringify(textBoxes)), // Deep copy
      createdAt: new Date().toISOString()
    };

    // Keep only the most recent 10 items
    const updatedHistory = [newMeme, ...existingHistory].slice(0, 10);

    try {
      const historyString = JSON.stringify(updatedHistory);
      localStorage.setItem(HISTORY_KEY, historyString);
      console.log('Successfully saved meme to history. Total items:', updatedHistory.length);
      return updatedHistory;
    } catch (storageError) {
      console.error('Storage error:', storageError);
      // If storage fails, try with just the new item
      const singleItemHistory = [newMeme];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(singleItemHistory));
        console.log('Saved single item to history');
        return singleItemHistory;
      } catch (finalError) {
        console.error('Final storage attempt failed:', finalError);
        return existingHistory;
      }
    }
  } catch (error) {
    console.error('Error in saveMemeToHistory:', error);
    return loadMemeHistory();
  }
};

export const loadMemeHistory = () => {
  try {
    const historyData = localStorage.getItem(HISTORY_KEY);
    if (!historyData) {
      console.log('No history found in localStorage');
      return [];
    }
    
    const parsedHistory = JSON.parse(historyData);
    if (!Array.isArray(parsedHistory)) {
      console.log('History is not an array, resetting');
      return [];
    }
    
    // Filter and validate each meme entry
    const validatedHistory = parsedHistory.filter(meme => {
      try {
        const isValid = (
          meme &&
          typeof meme === 'object' &&
          typeof meme.id === 'string' &&
          typeof meme.imageUrl === 'string' &&
          Array.isArray(meme.textBoxes) &&
          meme.textBoxes.every(box => (
            box &&
            typeof box === 'object' &&
            typeof box.id === 'string' &&
            typeof box.text === 'string' &&
            typeof box.x === 'number' &&
            typeof box.y === 'number'
          ))
        );
        if (!isValid) {
          console.log('Invalid meme entry:', meme);
        }
        return isValid;
      } catch {
        return false;
      }
    });

    console.log('Loaded history:', validatedHistory.length, 'valid items');
    return validatedHistory;
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const clearMemeHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    console.log('History cleared successfully');
    return [];
  } catch (error) {
    console.error('Error clearing history:', error);
    return [];
  }
}; 