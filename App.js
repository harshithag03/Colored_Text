import React, { useState, useRef } from 'react';

function App() {
  const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
  const [formattedSegments, setFormattedSegments] = useState([
    { text: 'Welcome to ', color: null, bg: null, bold: false, underline: false },
    { text: 'Discord', color: '#7289da', bg: null, bold: false, underline: false },
    { text: ' ', color: null, bg: null, bold: false, underline: false },
    { text: 'Colored', color: '#00aaff', bg: null, bold: false, underline: false },
    { text: ' Text Generator!', color: null, bg: null, bold: false, underline: false },
  ]);
  
  const textareaRef = useRef(null);
  
  // Foreground colors
  const fgColors = [
    '#5c5c5c', // Gray
    '#ff3232', // Red
    '#90b414', // Green
    '#e6a226', // Yellow
    '#3498db', // Blue
    '#e84393', // Pink
    '#1abc9c', // Teal
    '#ffffff', // White
  ];
  
  // Background colors
  const bgColors = [
    '#001e2d', // Dark Blue
    '#d35400', // Orange
    '#627680', // Slate
    '#718b93', // Gray Blue
    '#8c9aa3', // Light Gray
    '#7167c9', // Purple
    '#9eadb5', // Silver
    '#fffbe6', // Cream
  ];
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    setFormattedSegments([{ text: e.target.value, color: null, bg: null, bold: false, underline: false }]);
  };
  
  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        setSelectedRange({ start, end });
      }
    }
  };
  
  const applyFgColor = (color) => {
    applyFormatting('color', color);
  };
  
  const applyBgColor = (color) => {
    applyFormatting('bg', color);
  };
  
  const applyFormatting = (type, value = null) => {
    if (selectedRange.start === selectedRange.end) return;
    
    // Create a new array of formatted segments
    let newSegments = [];
    let currentPosition = 0;
    
    // Process each segment
    formattedSegments.forEach(segment => {
      const segmentStart = currentPosition;
      const segmentEnd = segmentStart + segment.text.length;
      
      // If segment is before selection
      if (segmentEnd <= selectedRange.start) {
        newSegments.push(segment);
      }
      // If segment is after selection
      else if (segmentStart >= selectedRange.end) {
        newSegments.push(segment);
      }
      // If segment overlaps with selection
      else {
        // Part before selection
        if (segmentStart < selectedRange.start) {
          newSegments.push({
            ...segment,
            text: segment.text.substring(0, selectedRange.start - segmentStart)
          });
        }
        
        // The selected part
        const newSegment = {
          ...segment,
          text: segment.text.substring(
            Math.max(0, selectedRange.start - segmentStart),
            Math.min(segment.text.length, selectedRange.end - segmentStart)
          )
        };
        
        // Apply the formatting
        if (type === 'color') {
          newSegment.color = value;
        } else if (type === 'bg') {
          newSegment.bg = value;
        } else if (type === 'bold') {
          newSegment.bold = !segment.bold;
        } else if (type === 'underline') {
          newSegment.underline = !segment.underline;
        }
        
        newSegments.push(newSegment);
        
        // Part after selection
        if (segmentEnd > selectedRange.end) {
          newSegments.push({
            ...segment,
            text: segment.text.substring(selectedRange.end - segmentStart)
          });
        }
      }
      
      currentPosition = segmentEnd;
    });
    
    // Merge adjacent segments with the same formatting
    let mergedSegments = [];
    for (let i = 0; i < newSegments.length; i++) {
      const current = newSegments[i];
      if (current.text.length === 0) continue;
      
      if (i > 0) {
        const prev = mergedSegments[mergedSegments.length - 1];
        if (prev.color === current.color && 
            prev.bg === current.bg && 
            prev.bold === current.bold && 
            prev.underline === current.underline) {
          prev.text += current.text;
          continue;
        }
      }
      
      mergedSegments.push({ ...current });
    }
    
    setFormattedSegments(mergedSegments);
  };
  
  const resetAll = () => {
    setFormattedSegments([{ text, color: null, bg: null, bold: false, underline: false }]);
  };
  
  const copyToClipboard = () => {
    // Generate Discord formatted text
    let discordText = '';
    formattedSegments.forEach(segment => {
      let formattedText = segment.text;
      
      // Apply foreground color
      if (segment.color) {
        const colorCode = segment.color.replace('#', '');
        formattedText = `[${colorCode}]${formattedText}[/${colorCode}]`;
      }
      
      // Apply background color
      if (segment.bg) {
        const bgColorCode = segment.bg.replace('#', '');
        formattedText = `[@${bgColorCode}]${formattedText}[/@${bgColorCode}]`;
      }
      
      // Apply bold
      if (segment.bold) {
        formattedText = `**${formattedText}**`;
      }
      
      // Apply underline
      if (segment.underline) {
        formattedText = `__${formattedText}__`;
      }
      
      discordText += formattedText;
    });
    
    navigator.clipboard.writeText(discordText);
    alert('Discord formatted text copied to clipboard!');
  };

  // Inline styles to ensure they work
  const styles = {
    container: {
      backgroundColor: '#36393f',
      color: 'white',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      marginBottom: '20px',
    },
    coloredText: {
      color: '#7289da',
    },
    section: {
      backgroundColor: '#2f3136',
      padding: '20px',
      borderRadius: '5px',
      marginBottom: '20px',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '22px',
      marginBottom: '15px',
    },
    paragraph: {
      textAlign: 'center',
      marginBottom: '10px',
    },
    link: {
      color: '#7289da',
      textDecoration: 'none',
    },
    buttonsRow: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#2f3136',
      color: 'white',
      border: '1px solid #444',
      padding: '8px 16px',
      margin: '0 5px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    colorRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    colorLabel: {
      width: '40px',
      fontWeight: 'bold',
    },
    colorSwatches: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    colorSwatch: {
      width: '40px',
      height: '40px',
      margin: '0 5px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      minHeight: '150px',
      backgroundColor: 'white',
      color: 'black',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      marginBottom: '15px',
      fontFamily: 'monospace',
      fontSize: '14px',
    },
    previewBox: {
      backgroundColor: '#36393f',
      padding: '15px',
      borderRadius: '4px',
      minHeight: '40px',
      wordBreak: 'break-word',
    },
    copyButton: {
      backgroundColor: '#7289da',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'block',
      margin: '20px auto',
      fontSize: '16px',
    },
    footer: {
      textAlign: 'center',
      color: '#99aab5',
      fontSize: '14px',
      marginTop: '30px',
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Discord <span style={styles.coloredText}>Colored</span> Text Generator
      </h1>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>About</h2>
        <p style={styles.paragraph}>
          This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
        </p>
        <p style={styles.paragraph}>
          To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
        </p>
        
      </div>
      
      <h2 style={styles.sectionTitle}>Create your text</h2>
      
      <div style={styles.buttonsRow}>
        <button style={styles.button} onClick={resetAll}>Reset All</button>
        <button style={styles.button} onClick={() => applyFormatting('bold')}>Bold</button>
        <button style={styles.button} onClick={() => applyFormatting('underline')}>Line</button>
      </div>
      
      <div style={styles.colorRow}>
        <div style={styles.colorLabel}>FG</div>
        <div style={styles.colorSwatches}>
          {fgColors.map((color, index) => (
            <div
              key={`fg-${index}`}
              style={{...styles.colorSwatch, backgroundColor: color}}
              onClick={() => applyFgColor(color)}
            />
          ))}
        </div>
      </div>
      
      <div style={styles.colorRow}>
        <div style={styles.colorLabel}>BG</div>
        <div style={styles.colorSwatches}>
          {bgColors.map((color, index) => (
            <div
              key={`bg-${index}`}
              style={{...styles.colorSwatch, backgroundColor: color}}
              onClick={() => applyBgColor(color)}
            />
          ))}
        </div>
      </div>
      
      <div style={styles.section}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onClick={handleTextSelect}
          onKeyUp={handleTextSelect}
          onMouseUp={handleTextSelect}
          style={styles.textarea}
        />
        
        <div style={styles.previewBox}>
          {formattedSegments.map((segment, index) => (
            <span
              key={index}
              style={{
                color: segment.color || 'white',
                backgroundColor: segment.bg || 'transparent',
                fontWeight: segment.bold ? 'bold' : 'normal',
                textDecoration: segment.underline ? 'underline' : 'none',
              }}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>
      
      <button style={styles.copyButton} onClick={copyToClipboard}>
        Copy text as Discord formatted
      </button>
      
      <div style={styles.footer}>
        This is an unofficial tool, it is not made or endorsed by Discord.
      </div>
    </div>
  );
}

export default App;