import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChecklistScratchEffect = ({ 
  text, 
  onTextChange, 
  bubbleId,
  onCompletionStateChange 
}) => {
  const [lines, setLines] = useState([]);
  const [burnedLines, setBurnedLines] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);

  // Parse text into lines with checklist detection
  useEffect(() => {
    const textLines = text.split('\n').map((line, index) => {
      const checklistMatch = line.match(/^(\s*)-\s*\[([x\s])\]\s*(.+)$/i);
      
      if (checklistMatch) {
        const [, indent, checkState, content] = checklistMatch;
        return {
          id: `${bubbleId}_line_${index}`,
          type: 'checklist',
          content: content.trim(),
          isChecked: checkState.toLowerCase() === 'x',
          indent: indent || '',
          rawLine: line,
          index
        };
      }
      
      return {
        id: `${bubbleId}_line_${index}`,
        type: 'text',
        content: line,
        rawLine: line,
        index
      };
    });

    setLines(textLines);
    
    // Check completion state
    const checklistItems = textLines.filter(line => line.type === 'checklist');
    const completedItems = checklistItems.filter(line => line.isChecked);
    const newIsComplete = checklistItems.length > 0 && completedItems.length === checklistItems.length;
    
    if (newIsComplete !== isComplete) {
      setIsComplete(newIsComplete);
      onCompletionStateChange?.(newIsComplete);
    }
  }, [text, bubbleId, isComplete, onCompletionStateChange]);

  // Handle checklist item toggle
  const handleChecklistToggle = (lineIndex) => {
    const updatedLines = [...lines];
    const line = updatedLines[lineIndex];
    
    if (line.type === 'checklist') {
      const newCheckedState = !line.isChecked;
      const newRawLine = `${line.indent}- [${newCheckedState ? 'x' : ' '}] ${line.content}`;
      
      // Update the line
      updatedLines[lineIndex] = {
        ...line,
        isChecked: newCheckedState,
        rawLine: newRawLine
      };
      
      // Reconstruct text
      const newText = updatedLines.map(l => l.rawLine).join('\n');
      onTextChange(newText);
    }
  };

  // Handle line deletion with burn effect
  const handleLineDelete = (lineIndex) => {
    const lineId = lines[lineIndex].id;
    
    // Add to burned lines for visual effect
    setBurnedLines(prev => new Set([...prev, lineId]));
    
    // Remove after burn animation
    setTimeout(() => {
      const updatedLines = lines.filter((_, index) => index !== lineIndex);
      const newText = updatedLines.map(l => l.rawLine).join('\n');
      onTextChange(newText);
      
      // Clean up burned lines
      setBurnedLines(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }, 800);
  };

  // Scratch animation variants
  const scratchVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 0.8,
      transition: {
        pathLength: { duration: 0.6, ease: "easeInOut" },
        opacity: { duration: 0.2 }
      }
    }
  };

  // Ember effect variants
  const emberVariants = {
    hidden: {
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: [0, 1.2, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Burn out effect variants
  const burnOutVariants = {
    initial: {
      opacity: 1,
      scale: 1,
      filter: 'brightness(1)'
    },
    burning: {
      opacity: [1, 0.7, 0.3, 0],
      scale: [1, 1.02, 0.98, 0.95],
      filter: [
        'brightness(1)',
        'brightness(1.2) saturate(1.3)',
        'brightness(0.8) saturate(0.7)',
        'brightness(0.3) saturate(0.3)'
      ],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-2 relative">
      <AnimatePresence mode="popLayout">
        {lines.map((line, index) => (
          <motion.div
            key={line.id}
            layout
            initial={{ opacity: 1 }}
            animate={burnedLines.has(line.id) ? "burning" : "initial"}
            variants={burnOutVariants}
            className="relative group"
          >
            {line.type === 'checklist' ? (
              <div className="flex items-start gap-3 py-1">
                {/* Checkbox */}
                <motion.button
                  onClick={() => handleChecklistToggle(index)}
                  className={`
                    relative w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all duration-300 flex-shrink-0 mt-0.5
                    ${line.isChecked 
                      ? 'bg-orange-500 border-orange-500 text-white' 
                      : 'border-zinc-500 hover:border-orange-400 hover:bg-orange-500/10'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {line.isChecked && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      ✓
                    </motion.span>
                  )}
                  
                  {/* Ember effect on check */}
                  <AnimatePresence>
                    {line.isChecked && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        variants={emberVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <div className="w-full h-full bg-orange-400/60 rounded blur-sm" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Content with scratch effect */}
                <div className="flex-1 relative">
                  <motion.span
                    className={`text-sm transition-all duration-300 ${
                      line.isChecked 
                        ? 'text-zinc-400' 
                        : 'text-zinc-300'
                    }`}
                  >
                    {line.content}
                  </motion.span>
                  
                  {/* Scratch-through effect */}
                  <AnimatePresence>
                    {line.isChecked && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 20"
                          preserveAspectRatio="none"
                        >
                          <motion.path
                            d="M5,10 Q25,8 45,12 Q65,14 75,9 Q85,6 95,11"
                            stroke="rgba(249, 115, 22, 0.8)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            variants={scratchVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                              filter: 'drop-shadow(0 0 3px rgba(249, 115, 22, 0.5))'
                            }}
                          />
                          
                          {/* Additional scratch marks for texture */}
                          <motion.path
                            d="M8,9 Q28,11 48,8 Q68,6 78,12 Q88,15 92,10"
                            stroke="rgba(249, 115, 22, 0.4)"
                            strokeWidth="1"
                            fill="none"
                            strokeLinecap="round"
                            variants={scratchVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Delete button */}
                <motion.button
                  onClick={() => handleLineDelete(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-400 hover:text-red-300 text-xs p-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  🗑️
                </motion.button>
              </div>
            ) : (
              // Regular text line
              <div className="flex items-start gap-3 py-1">
                <div className="flex-1">
                  <span className="text-sm text-zinc-300">{line.content}</span>
                </div>
                
                {/* Delete button for text lines */}
                {line.content.trim() && (
                  <motion.button
                    onClick={() => handleLineDelete(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-400 hover:text-red-300 text-xs p-1"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    🗑️
                  </motion.button>
                )}
              </div>
            )}

            {/* Burn smoke effect for deleted lines */}
            <AnimatePresence>
              {burnedLines.has(line.id) && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Smoke particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-zinc-600 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: '50%'
                      }}
                      animate={{
                        y: [0, -20, -40],
                        opacity: [0.8, 0.4, 0],
                        scale: [0.5, 1, 0.3]
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 blur-sm rounded"
                    animate={{
                      opacity: [0, 0.6, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Completion glow overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute -inset-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-500/20 to-orange-500/10 rounded-2xl blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Ready to burn tooltip */}
            <motion.div
              className="absolute -top-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-orange-900/90 border border-orange-500/50 rounded-xl px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🔥
                  </motion.span>
                  <span className="text-xs font-medium text-orange-300">
                    Ready to Burn
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChecklistScratchEffect;