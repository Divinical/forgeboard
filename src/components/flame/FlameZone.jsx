import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';
import FlameParticles from './FlameParticles';
import FlameUndoToast from './FlameUndoToast';
import FlameIcon from './FlameIcon';

const FlameZone = () => {
  const { burnBubble, createBubble, getBubbleById, bubbles } = useBubbleStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [burnedBubble, setBurnedBubble] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimer, setUndoTimer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flameParticles, setFlameParticles] = useState([]);
  const dropZoneRef = useRef(null);

  // Generate flame particles for animation
  const generateFlameParticles = () => {
    const particles = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        id: Date.now() + i,
        x: 45 + Math.random() * 10,
        y: 40 + Math.random() * 20,
        delay: i * 0.06,
        scale: 0.3 + Math.random() * 0.5,
        duration: 1.5 + Math.random() * 0.8,
      });
    }
    return particles;
  };

  // Process bubble burn (unified for both desktop and mobile)
  const processBubbleBurn = useCallback((bubbleData, dropPosition = null) => {
    console.log('🔥 FLAME: Processing bubble burn:', bubbleData);
    
    // Check if bubble is complete (for thoughts that require completion)
    const bubble = getBubbleById(bubbleData.id);
    if (!bubble) {
      console.warn('⚠️ FLAME: Bubble not found in store:', bubbleData.id);
      return;
    }
    
    // For now, allow any bubble to be burned (remove completion requirement for testing)
    // if (!bubble.isComplete && bubble.state === 'chaos') {
    //   console.warn('⚠️ FLAME: Bubble not complete, cannot burn:', bubbleData.id);
    //   return;
    // }
    
    // Clear any existing undo state
    if (undoTimer) {
      clearTimeout(undoTimer);
      setUndoTimer(null);
    }
    
    // Trigger consumption animation
    setIsAnimating(true);
    setFlameParticles(generateFlameParticles());
    
    // Store bubble data for undo
    setBurnedBubble(bubbleData);
    
    // Burn the bubble after a brief delay (for visual feedback)
    setTimeout(() => {
      burnBubble(bubbleData.id);
      console.log('✅ FLAME: Bubble burned successfully:', bubbleData.id);
    }, 400);
    
    // Show undo option after animation starts
    setTimeout(() => {
      setShowUndo(true);
      
      // Set 6-second timer for auto-dismiss
      const timer = setTimeout(() => {
        setShowUndo(false);
        setBurnedBubble(null);
      }, 6000);
      
      setUndoTimer(timer);
    }, 800);
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
      setFlameParticles([]);
    }, 2500);
  }, [burnBubble, getBubbleById, undoTimer]);

  // CRITICAL: HTML5 Drop Event Handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault(); // CRITICAL: Must prevent default to allow drop
    e.stopPropagation();
    
    console.log('🔥 FLAME: dragOver detected');
    setIsDragOver(true);
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔥 FLAME: dragEnter');
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set false if actually leaving the container
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      console.log('🔥 FLAME: dragLeave');
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔥 FLAME: DROP EVENT TRIGGERED');
    setIsDragOver(false);
    
    try {
      // Try to get bubble data from different formats
      let bubbleData = null;
      
      // Try JSON first
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        bubbleData = JSON.parse(jsonData);
        console.log('📦 FLAME: Got JSON data:', bubbleData);
      } else {
        // Try getting bubbleId
        const bubbleId = e.dataTransfer.getData('bubbleId') || e.dataTransfer.getData('text/plain');
        if (bubbleId) {
          // Find bubble in store
          const foundBubble = bubbles.find(b => b.id === bubbleId);
          if (foundBubble) {
            bubbleData = foundBubble;
            console.log('📦 FLAME: Found bubble by ID:', bubbleData);
          }
        }
      }
      
      if (!bubbleData) {
        console.error('❌ FLAME: No bubble data found in drop');
        return;
      }
      
      // CRITICAL: Process the burn
      const coordinates = { x: e.clientX, y: e.clientY };
      processBubbleBurn(bubbleData, coordinates);
      
    } catch (error) {
      console.error('❌ FLAME: Drop processing failed:', error);
    }
  }, [bubbles, processBubbleBurn]);

  // Mobile touch drop handler
  useEffect(() => {
    const handleMobileDrop = (e) => {
      const { bubbleData, touch } = e.detail;
      
      if (!dropZoneRef.current) return;
      
      // Check if touch position is over flame zone
      const rect = dropZoneRef.current.getBoundingClientRect();
      const isOverFlame = (
        touch.x >= rect.left &&
        touch.x <= rect.right &&
        touch.y >= rect.top &&
        touch.y <= rect.bottom
      );
      
      if (isOverFlame) {
        console.log('📱 FLAME: Mobile drop detected');
        processBubbleBurn(bubbleData, touch);
      }
    };
    
    document.addEventListener('mobileBubbleDrop', handleMobileDrop);
    return () => document.removeEventListener('mobileBubbleDrop', handleMobileDrop);
  }, [processBubbleBurn]);

  const handleUndo = () => {
    if (burnedBubble) {
      createBubble({
        text: burnedBubble.text,
        tag: burnedBubble.tag
      });
      
      setShowUndo(false);
      setBurnedBubble(null);
      
      if (undoTimer) {
        clearTimeout(undoTimer);
        setUndoTimer(null);
      }
    }
  };

  const handleDismissUndo = () => {
    setShowUndo(false);
    setBurnedBubble(null);
    
    if (undoTimer) {
      clearTimeout(undoTimer);
      setUndoTimer(null);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimer) {
        clearTimeout(undoTimer);
      }
    };
  }, [undoTimer]);

  // Props for subcomponents
  const flameIconProps = {
    isDragOver,
    isAnimating
  };

  const flameParticlesProps = {
    isAnimating,
    isDragOver,
    flameParticles
  };

  const undoToastProps = {
    showUndo,
    burnedBubble,
    handleUndo,
    handleDismissUndo
  };

  return (
    <>
      {/* Fixed Flame Zone - Ultra High z-index for drag operations - Responsive */}
      <motion.div
        className="fixed bottom-24 sm:bottom-28 md:bottom-32 left-1/2 transform -translate-x-1/2 z-[9999]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        style={{ isolation: 'isolate' }} // Create new stacking context
      >
        <motion.div
          ref={dropZoneRef}
          className={`
            relative flex items-center justify-center transition-all duration-500 rounded-full p-4 sm:p-6
            border-4 border-dashed
            ${isDragOver 
              ? 'bg-orange-500/20 backdrop-blur-md border-orange-400' 
              : 'bg-zinc-900/80 backdrop-blur-sm border-zinc-600'
            }
          `}
          style={{
            boxShadow: isDragOver 
              ? '0 0 50px rgba(251, 146, 60, 0.6), inset 0 0 30px rgba(251, 146, 60, 0.2)'
              : '0 0 25px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.08)',
            minWidth: '80px',
            minHeight: '80px'
          }}
          // CRITICAL: All drag event handlers
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: isDragOver ? 1.1 : 1,
            background: isDragOver 
              ? 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(239, 68, 68, 0.2) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(39, 39, 42, 0.8) 0%, rgba(24, 24, 27, 0.9) 80%)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Enhanced background glow for consuming state */}
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.9, 1, 0.6, 0.3],
                background: [
                  'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 80%)',
                  'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(239, 68, 68, 0.4) 40%, transparent 80%)',
                  'radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, rgba(239, 68, 68, 0.6) 30%, rgba(220, 38, 38, 0.4) 60%, transparent 80%)',
                  'radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, rgba(239, 68, 68, 0.3) 50%, transparent 80%)',
                  'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 80%)'
                ]
              }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            />
          )}

          {/* Flame Icon Container */}
          <FlameIcon {...flameIconProps} />

          {/* Flame Particles */}
          <FlameParticles {...flameParticlesProps} />

          {/* Drop Zone Text */}
          <AnimatePresence>
            {isDragOver && (
              <motion.div
                className="absolute -bottom-14 sm:-bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-zinc-900/95 backdrop-blur-sm border border-orange-500/50 rounded-xl px-3 sm:px-4 py-2">
                  <p className="text-xs sm:text-sm font-medium text-orange-300 text-center">
                    {isAnimating ? 'Consuming...' : 'Release to Complete'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion Success Indicator */}
          {isAnimating && (
            <motion.div
              className="absolute -top-16 sm:-top-20 left-1/2 transform -translate-x-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0, y: 15 }}
              animate={{ 
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0, 1.1, 1, 0.9, 0.8],
                y: [15, -5, -10, -15, -20]
              }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            >
              <div className="bg-zinc-900/95 border border-orange-500/60 rounded-xl px-3 sm:px-5 py-2 sm:py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-orange-300">
                  <motion.span
                    className="text-base sm:text-lg"
                    animate={{ rotate: [0, 360, 720] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    🔥
                  </motion.span>
                  <span className="text-xs sm:text-sm font-medium">Thought Completed</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Idle Pulse Effect */}
          {!isDragOver && !isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full border border-orange-500/25 pointer-events-none"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Mobile drag indicator */}
          <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 pointer-events-none md:hidden">
            <motion.div
              className="bg-zinc-800/80 backdrop-blur-sm border border-zinc-600 rounded-lg px-2 sm:px-3 py-1 text-xs text-gray-400"
              animate={{ 
                opacity: isDragOver ? 0 : [0.6, 1, 0.6],
                scale: isDragOver ? 0.9 : 1
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Sacred Flame
            </motion.div>
          </div>

          {/* Drop instruction for desktop */}
          {!isDragOver && !isAnimating && (
            <motion.div
              className="absolute -bottom-10 sm:-bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-none hidden md:block"
              animate={{ 
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-600/50 rounded-lg px-2 sm:px-3 py-1 text-xs text-zinc-400">
                Drag thoughts here to complete them
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Enhanced Undo Toast */}
      <FlameUndoToast {...undoToastProps} />

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-28 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono z-50">
          <div>Flame Zone Active</div>
          <div>Drag Over: {isDragOver ? 'Yes' : 'No'}</div>
          <div>Animating: {isAnimating ? 'Yes' : 'No'}</div>
          <div>Show Undo: {showUndo ? 'Yes' : 'No'}</div>
        </div>
      )}
    </>
  );
};

export default FlameZone;