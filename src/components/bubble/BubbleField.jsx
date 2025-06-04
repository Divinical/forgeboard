import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bubble from '../bubble/Bubble';

const BubbleField = ({ 
  bubbles = [], 
  onBubbleClick,
  onBubbleReflect,
  BUBBLE_LIMIT = 20 
}) => {
  const [visibleBubbles, setVisibleBubbles] = useState([]);
  const [randomPositions, setRandomPositions] = useState({});
  const containerRef = useRef(null);

  // Generate random positions for bubbles - constrained to safe viewport area
  const generateRandomPosition = useCallback((id) => {
    // Keep bubbles in top 65% of viewport to avoid overlapping with bottom nav and FlameZone
    const maxY = 65; // Maximum Y position as percentage - safe for mobile
    const minY = 8;  // Minimum Y position to avoid top edge
    const maxX = 85; // Maximum X position to avoid right edge  
    const minX = 8;  // Minimum X position to avoid left edge
    
    return {
      x: Math.random() * (maxX - minX) + minX, // 8-85% of container width
      y: Math.random() * (maxY - minY) + minY, // 8-65% of container height
    };
  }, []);

  // Update visible bubbles when input changes
  useEffect(() => {
    // Sort by timestamp (newest first) and limit
    const sortedBubbles = [...bubbles].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    const limitedBubbles = sortedBubbles.slice(0, BUBBLE_LIMIT);
    setVisibleBubbles(limitedBubbles);

    // Generate positions for new bubbles only
    setRandomPositions(prev => {
      const newPositions = { ...prev };
      limitedBubbles.forEach(bubble => {
        if (!newPositions[bubble.id]) {
          newPositions[bubble.id] = generateRandomPosition(bubble.id);
        }
      });
      return newPositions;
    });
  }, [bubbles, BUBBLE_LIMIT, generateRandomPosition]);

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Individual bubble animation variants
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  // Empty state
  const EmptyState = () => (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pb-32 sm:pb-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center max-w-md px-4 sm:px-6">
        <motion.div
          className="text-4xl sm:text-6xl mb-4 sm:mb-6"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🫧
        </motion.div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400 mb-3 sm:mb-4">
          Your chaos realm awaits
        </h3>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-4 sm:mb-6">
          Capture thoughts with Quicksnap and watch them float into existence as bubbles of pure mental energy.
        </p>
        <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
          <span>Click</span>
          <motion.div
            className="inline-flex items-center gap-1"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>🧘</span>
            <span>Reflect</span>
          </motion.div>
          <span>to dive deeper</span>
        </div>
      </div>
    </motion.div>
  );

  // Bubble counter - Responsive
  const BubbleCounter = () => (
    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-xl px-2 sm:px-4 py-1 sm:py-2 z-30">
      <span className="text-xs sm:text-sm font-mono text-gray-400">
        {visibleBubbles.length}/{BUBBLE_LIMIT}
      </span>
      {bubbles.length > BUBBLE_LIMIT && (
        <span className="ml-1 sm:ml-2 text-xs text-red-400">
          (+{bubbles.length - BUBBLE_LIMIT} hidden)
        </span>
      )}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full min-h-screen p-2 sm:p-4 md:p-8 pb-32 sm:pb-40 md:pb-44"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        // CRITICAL: Ensure container doesn't block drag events
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Bubble Counter */}
      <BubbleCounter />

      {/* Bubbles Container - SIMPLIFIED: Let Bubble handle its own drag */}
      <div className="relative w-full h-full min-h-screen">
        <AnimatePresence mode="popLayout">
          {visibleBubbles.map((bubble) => {
            const position = randomPositions[bubble.id] || { x: 50, y: 50 };
            
            return (
              <motion.div
                key={bubble.id}
                className="absolute w-full max-w-[280px] sm:max-w-sm"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {/* CRITICAL: Bubble handles its own drag events */}
                <Bubble 
                  {...bubble}
                  onClick={() => onBubbleClick?.(bubble)}
                  onReflect={() => onBubbleReflect?.(bubble)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {visibleBubbles.length === 0 && <EmptyState />}
      </div>
    </motion.div>
  );
};

export default BubbleField;