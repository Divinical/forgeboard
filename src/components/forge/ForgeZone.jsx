import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';

const ForgeZone = ({ isHighlighted = false }) => {
  const { bubbles, updateBubble } = useBubbleStore();
  const containerRef = useRef(null);
  
  // State management
  const [isDragOver, setIsDragOver] = useState(false);

  // Filter bubbles that should appear in forge
  const forgeBubbles = bubbles.filter(bubble => bubble.state === 'forge');

  // CRITICAL: HTML5 Drop Event Handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault(); // CRITICAL: Must prevent default to allow drop
    e.stopPropagation();
    
    console.log('🔧 FORGE: dragOver detected');
    setIsDragOver(true);
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔧 FORGE: dragEnter');
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set false if actually leaving the container
    if (!containerRef.current?.contains(e.relatedTarget)) {
      console.log('🔧 FORGE: dragLeave');
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔧 FORGE: DROP EVENT TRIGGERED');
    setIsDragOver(false);
    
    try {
      // Try to get bubble data from different formats
      let bubbleData = null;
      
      // Try JSON first
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        bubbleData = JSON.parse(jsonData);
        console.log('📦 FORGE: Got JSON data:', bubbleData);
      } else {
        // Try getting bubbleId
        const bubbleId = e.dataTransfer.getData('bubbleId') || e.dataTransfer.getData('text/plain');
        if (bubbleId) {
          // Find bubble in store
          const foundBubble = bubbles.find(b => b.id === bubbleId);
          if (foundBubble) {
            bubbleData = foundBubble;
            console.log('📦 FORGE: Found bubble by ID:', bubbleData);
          }
        }
      }
      
      if (!bubbleData) {
        console.error('❌ FORGE: No bubble data found in drop');
        return;
      }
      
      // CRITICAL: Transfer bubble to forge state
      console.log('🔧 FORGE: Transferring bubble to forge:', bubbleData.id);
      updateBubble(bubbleData.id, { state: 'forge' });
      
      console.log('✅ FORGE: Bubble successfully transferred to forge');
      
    } catch (error) {
      console.error('❌ FORGE: Drop processing failed:', error);
    }
  }, [bubbles, updateBubble]);

  // Mobile touch drop handler
  useEffect(() => {
    const handleMobileDrop = (e) => {
      const { bubbleData, touch } = e.detail;
      
      if (!containerRef.current) return;
      
      // Check if touch position is over forge zone
      const rect = containerRef.current.getBoundingClientRect();
      const isOverForge = (
        touch.x >= rect.left &&
        touch.x <= rect.right &&
        touch.y >= rect.top &&
        touch.y <= rect.bottom
      );
      
      if (isOverForge) {
        console.log('📱 FORGE: Mobile drop detected');
        console.log('🔧 FORGE: Transferring mobile bubble to forge:', bubbleData.id);
        updateBubble(bubbleData.id, { state: 'forge' });
        console.log('✅ FORGE: Mobile bubble successfully transferred');
      }
    };
    
    document.addEventListener('mobileBubbleDrop', handleMobileDrop);
    return () => document.removeEventListener('mobileBubbleDrop', handleMobileDrop);
  }, [updateBubble]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`
        relative w-full h-full min-h-screen bg-zinc-900 overflow-hidden
        transition-all duration-300 border-2 border-dashed
        ${isDragOver || isHighlighted 
          ? 'border-orange-500 bg-orange-950/30' 
          : 'border-zinc-700/30'
        }
      `}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // CRITICAL: All drag event handlers
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Over Highlight */}
      <AnimatePresence>
        {(isDragOver || isHighlighted) && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-orange-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="px-8 py-4 rounded-2xl bg-orange-500/20 border border-orange-500/50 backdrop-blur-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: 1
                }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <motion.span
                    className="text-4xl block mb-2"
                    animate={{
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🔧
                  </motion.span>
                  <span className="text-orange-200 font-bold text-xl">Drop to Forge</span>
                  <p className="text-orange-300/80 text-sm mt-1">Shape and position your thought</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forge Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(234, 88, 12, 0.06) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Zone Header */}
      <motion.div
        className="relative z-10 p-6 border-b border-zinc-800/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.span
              className="text-4xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔧
            </motion.span>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-300">
                ForgeZone
              </h2>
              <p className="text-lg text-zinc-500 italic">
                Shape, stack, and position your thoughts with precision
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-zinc-400">
              {forgeBubbles.length} thought{forgeBubbles.length === 1 ? '' : 's'} forged
            </div>
            <div className="text-xs text-zinc-500">
              Drag thoughts here from Chaos Realm
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative flex-1 w-full h-full min-h-[calc(100vh-120px)] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {forgeBubbles.length === 0 ? (
            // Empty State
            <motion.div
              className="absolute inset-0 flex items-center justify-center pb-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center max-w-md px-6">
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🔧
                </motion.div>
                <h3 className="text-2xl font-bold text-zinc-400 mb-4">
                  Forge awaits your thoughts
                </h3>
                <p className="text-zinc-500 leading-relaxed mb-4">
                  Drag thoughts from the Chaos Realm into this zone to forge and shape them with precision.
                </p>
                <div className="text-sm text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="font-semibold mb-2">🔥 How to Forge:</div>
                  <div className="text-left space-y-1">
                    <div>1. Drag bubble from Chaos Realm</div>
                    <div>2. Drop it in this zone</div>
                    <div>3. Position and shape your thought</div>
                    <div>4. Drag to Flame when complete</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Show forged bubbles
            <motion.div className="relative w-full h-full p-6">
              <div className="grid gap-4">
                {forgeBubbles.map((bubble, index) => (
                  <motion.div
                    key={bubble.id}
                    className="bg-zinc-800/60 border border-orange-500/30 rounded-2xl p-4 shadow-lg"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{bubble.tag}</span>
                      <div className="flex-1">
                        <div className="text-sm text-orange-400 font-medium">
                          Forged Thought
                        </div>
                        <div className="text-xs text-zinc-500">
                          {new Date(bubble.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-orange-500/20 border border-orange-500/40 rounded-full px-2 py-1">
                        <span className="text-xs text-orange-300 font-medium">🔧 Forged</span>
                      </div>
                    </div>
                    <div className="text-zinc-300 text-sm leading-relaxed">
                      {bubble.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700/60 rounded-xl px-4 py-2">
          <p className="text-xs text-zinc-400 text-center">
            Drop thoughts here to forge them • Drag forged thoughts to Flame Zone when complete
          </p>
        </div>
      </motion.div>

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-16 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono z-50">
          <div>Forge Bubbles: {forgeBubbles.length}</div>
          <div>Drag Over: {isDragOver ? 'Yes' : 'No'}</div>
          <div>Highlighted: {isHighlighted ? 'Yes' : 'No'}</div>
        </div>
      )}
    </motion.div>
  );
};

export default ForgeZone;