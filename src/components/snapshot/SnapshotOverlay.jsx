import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';

const SnapshotOverlay = () => {
  const { 
    showSnapshotOverlay, 
    setShowSnapshotOverlay, 
    createBubbleFromSnapshot 
  } = useBubbleStore();

  const [snapshotText, setSnapshotText] = useState('');
  const [selectedTag, setSelectedTag] = useState('💭');
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef(null);

  // Tag options for quick selection
  const tagOptions = [
    { emoji: '💭', label: 'Thought' },
    { emoji: '💡', label: 'Idea' },
    { emoji: '🔥', label: 'Urgent' },
    { emoji: '🔧', label: 'Task' },
    { emoji: '📝', label: 'Note' },
    { emoji: '⚡', label: 'Quick' },
    { emoji: '🎯', label: 'Goal' }
  ];

  // Auto-focus textarea when overlay opens
  useEffect(() => {
    if (showSnapshotOverlay && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 300); // Wait for animation to start
    }
  }, [showSnapshotOverlay]);

  // Handle snapshot submission
  const handleForgeThought = async () => {
    if (!snapshotText.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      // Create bubble from snapshot
      const bubbleId = createBubbleFromSnapshot({
        text: snapshotText.trim(),
        tag: selectedTag,
        autoClose: false // Keep overlay open for rapid capture
      });

      console.log('🔥 Forged new thought:', bubbleId);

      // Clear input for next thought
      setSnapshotText('');
      setSelectedTag('💭');

      // Show success feedback
      setTimeout(() => {
        setIsProcessing(false);
      }, 600);

    } catch (error) {
      console.error('❌ Failed to forge thought:', error);
      setIsProcessing(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleForgeThought();
    }
    if (e.key === 'Escape') {
      setShowSnapshotOverlay(false);
    }
  };

  // Handle close overlay
  const handleClose = () => {
    setShowSnapshotOverlay(false);
  };

  // Handle minimize (keep in background)
  const handleMinimize = () => {
    setShowSnapshotOverlay(false);
    // Could add a minimized state later
  };

  // Overlay animation variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
      y: -100,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Tag selector variants
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {showSnapshotOverlay && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          {/* Overlay Panel - Responsive */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[10000] max-h-[80vh] sm:max-h-[70vh] overflow-hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-900/95 backdrop-blur-xl border-b border-orange-500/50 shadow-2xl mx-2 sm:mx-0 rounded-b-2xl sm:rounded-none">
              {/* Ambient glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent pointer-events-none"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header - Responsive */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.span
                      className="text-2xl sm:text-4xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      📸
                    </motion.span>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-300">
                        Capture Thought
                      </h2>
                      <p className="text-sm sm:text-base text-zinc-400 italic">
                        Forge raw mental energy into actionable bubbles
                      </p>
                    </div>
                  </div>

                  {/* Controls - Responsive */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <motion.button
                      onClick={handleMinimize}
                      className="p-1.5 sm:p-2 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 hover:border-orange-500/50 rounded-lg sm:rounded-xl text-zinc-400 hover:text-orange-400 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Minimize"
                    >
                      <span className="text-xs sm:text-sm">−</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={handleClose}
                      className="p-1.5 sm:p-2 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 hover:border-red-500/50 rounded-lg sm:rounded-xl text-zinc-400 hover:text-red-400 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Close"
                    >
                      <span className="text-xs sm:text-sm">✕</span>
                    </motion.button>
                  </div>
                </div>

                {/* Tag Selector - Responsive */}
                <motion.div
                  className="mb-4 sm:mb-6"
                  variants={tagVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-zinc-300 mb-2 sm:mb-3">
                    Thought Type
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tagOptions.map((tag) => (
                      <button
                        key={tag.emoji}
                        onClick={() => setSelectedTag(tag.emoji)}
                        className={`
                          flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl border transition-all duration-300
                          ${selectedTag === tag.emoji
                            ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                            : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                          }
                        `}
                      >
                        <span className="text-base sm:text-lg">{tag.emoji}</span>
                        <span className="text-xs sm:text-sm hidden xs:inline">{tag.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Main Input - Responsive */}
                <motion.div
                  className="mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <textarea
                    ref={textareaRef}
                    value={snapshotText}
                    onChange={(e) => setSnapshotText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind? Dump it all here..."
                    className="w-full h-28 sm:h-32 md:h-40 bg-zinc-800/80 border border-zinc-700 hover:border-orange-500/50 focus:border-orange-500 rounded-2xl p-3 sm:p-4 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none text-sm sm:text-base leading-relaxed"
                    style={{
                      boxShadow: snapshotText.trim() 
                        ? '0 0 20px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  />
                </motion.div>

                {/* Action Buttons - Responsive */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleForgeThought}
                    disabled={!snapshotText.trim() || isProcessing}
                    className={`
                      flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300
                      ${snapshotText.trim() && !isProcessing
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                      }
                    `}
                    whileHover={snapshotText.trim() && !isProcessing ? { 
                      y: -2,
                      boxShadow: '0 0 30px rgba(251, 146, 60, 0.4)'
                    } : {}}
                    whileTap={snapshotText.trim() && !isProcessing ? { 
                      scale: 0.98 
                    } : {}}
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Forging...</span>
                      </>
                    ) : (
                      <>
                        <motion.span
                          className="text-lg sm:text-xl"
                          animate={snapshotText.trim() ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          🔨
                        </motion.span>
                        <span>Forge This Thought</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleClose}
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white rounded-2xl font-medium text-sm sm:text-base transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save for Later
                  </motion.button>
                </motion.div>

                {/* Keyboard Shortcuts - Responsive */}
                <motion.div
                  className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-zinc-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">⌘</kbd> + 
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs ml-1">Enter</kbd> to forge • 
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs ml-1">Esc</kbd> to close
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SnapshotOverlay;