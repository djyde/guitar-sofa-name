import { useState } from 'react'
import './App.css'
import React from 'react';

interface GuitarKeyProps {
  keyName: string;
}

const FRET_COUNT = 22;
const STRING_COUNT = 6;
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E']; // High to low

const GuitarKey: React.FC<GuitarKeyProps> = ({ keyName }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Get notes in the key
  const getKeyNotes = (key: string): string[] => {
    // Major scale pattern: W-W-H-W-W-W-H (W=2 semitones, H=1 semitone)
    const pattern = [2, 2, 1, 2, 2, 2, 1];
    const startIndex = NOTES.indexOf(key);
    const notes: string[] = [key];
    let currentIndex = startIndex;

    for (let i = 0; i < 6; i++) {
      currentIndex = (currentIndex + pattern[i]) % 12;
      notes.push(NOTES[currentIndex]);
    }
    return notes;
  };

  const getNoteNameInSolfege = (note: string): string => {
    const noteIndex = NOTES.indexOf(note);
    const keyIndex = NOTES.indexOf(keyName);
    const relativeIndex = (noteIndex - keyIndex + 12) % 12;
    return relativeIndex === 0 ? '1' :
      relativeIndex === 1 ? '1#' :
        relativeIndex === 2 ? '2' :
          relativeIndex === 3 ? '2#' :
            relativeIndex === 4 ? '3' :
              relativeIndex === 5 ? '4' :
                relativeIndex === 6 ? '4#' :
                  relativeIndex === 7 ? '5' :
                    relativeIndex === 8 ? '5#' :
                      relativeIndex === 9 ? '6' :
                        relativeIndex === 10 ? '6#' : '7';
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const fretWidth = width / (FRET_COUNT + 1)
    const stringGap = height / (STRING_COUNT + 1);

    // Draw frets
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    for (let i = 0; i <= FRET_COUNT; i++) { // Changed to 24 frets
      const x = i * fretWidth;
      ctx.beginPath();
      ctx.moveTo(x, stringGap);
      ctx.lineTo(x, height - stringGap);
      ctx.stroke();
    }

    // Draw strings
    for (let i = 0; i < STRING_COUNT; i++) {
      const y = (i + 1) * stringGap;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw fret markers
    const markerPositions = [3, 5, 7, 9, 12];
    ctx.fillStyle = '#888';
    markerPositions.forEach(fret => {
      const x = fret * fretWidth - fretWidth / 2;
      const y = height / 2;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Get notes in the key
    const keyNotes = getKeyNotes(keyName);

    // Draw notes
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let string = 0; string < STRING_COUNT; string++) {
      const openNote = STANDARD_TUNING[string];
      const openNoteIndex = NOTES.indexOf(openNote);

      for (let fret = 0; fret <= FRET_COUNT; fret++) { // Changed to 24 frets
        const noteIndex = (openNoteIndex + fret) % 12;
        const note = NOTES[noteIndex];

        if (keyNotes.includes(note)) {
          const x = fret * fretWidth - fretWidth / 2;
          const y = (string + 1) * stringGap;

          // Draw circle with different color for root note
          ctx.fillStyle = note === keyName ? '#FF0000' : '#4CAF50';
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fill();

          // Draw note name in solfege
          ctx.fillStyle = '#fff';
          ctx.fillText(getNoteNameInSolfege(note), x, y);
        }
      }
    }
  }, [keyName]);

  return (
    <canvas
      ref={canvasRef}
      width={1200} // Increased width to accommodate more frets
      height={200}
      style={{ border: '1px solid #ccc', zoom: 0.8 }}
    />
  );
};


function App() {
  const [count, setCount] = useState(0)

  const [selectedKey, setSelectedKey] = useState('C');

  const handleKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKey(event.target.value);
  };

  const keySelector = (
    <select value={selectedKey} onChange={handleKeyChange}>
      {NOTES.map(key => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <div>
        <div>
          {keySelector}
        </div>
        <GuitarKey keyName={selectedKey} />
      </div>
    </>
  )
}

export default App
