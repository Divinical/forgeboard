import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BurnZoneHint = ({ 
  isDragActive = false, 
  activeDraggedBubble = null,
  bubbleCount = 0,
  showStaticHint = true 
}) => {
  // Show hint when:
  // 1. There are bubbles to drag
  // 2. Not currently dragging (for static hint)
  // 3. Or actively dragging (for dynamic hint)
  const shouldShowHint = bubbleCount > 0 && (showStaticHint || isDragActive);

  // Static hint (when not dragging)
  const StaticHint = () => (
    <motion.div
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none z-30 md:hidden"
      animate={{ 
        opacity: [0.5, 0.8, 0.5],
        y: [0, -2, 0]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-600 rounded-xl px-3 py-2 text-xs text-gray-400">
        Drag bubbles down to 🔥 to complete
      </div>
    </motion.div>
  );

  // Dynamic hint (when actively dragging)
  const DynamicHint = () => (
    <motion.div
      className="fixed bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-30"
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-purple-900/90 backdrop-blur-sm border border-purple-500/50 rounded-xl px-4 py-2">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {activeDraggedBubble?.tag || '💭'}
          </motion.span>
          <div>
            <p className="text-xs font-medium text-purple-300">
              Dragging: {activeDraggedBubble?.text?.slice(0, 20)}...
            </p>
            <p className="text-xs text-purple-400 opacity-75">
              Drop on 🔥 to complete
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Pulsing flame indicator
  const FlameIndicator = () => (
    <motion.div
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 pointer-events-none z-20"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="text-2xl">🔥</div>
    </motion.div>
  );

  // Tutorial sequence for new users (could be enhanced with localStorage tracking)
  const TutorialHint = () => (
    <motion.div
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none z-30 max-w-xs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-orange-500/50 rounded-xl px-4 py-3 text-center">
        <motion.div
          className="text-xl mb-2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          👆
        </motion.div>
        <p className="text-sm font-medium text-orange-300 mb-1">
          Long press & drag
        </p>
        <p className="text-xs text-gray-400">
          Thoughts down to the flame to complete them
        </p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {shouldShowHint && (
        <>
          {/* Show different hints based on state */}
          {isDragActive && activeDraggedBubble ? (
            <DynamicHint key="dynamic" />
          ) : bubbleCount <= 3 ? (
            <TutorialHint key="tutorial" />
          ) : (
            <StaticHint key="static" />
          )}

          {/* Always show subtle flame indicator when not dragging */}
          {!isDragActive && bubbleCount > 0 && (
            <FlameIndicator key="flame" />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default BurnZoneHint;