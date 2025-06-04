import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ForgeBubble from './ForgeBubble';

const BubbleStack = ({ 
  stackId,
  bubbles,
  position,
  isExpanded,
  onToggleExpand,
  onBubbleDragEnd,
  onBubbleLockToggle,
  lockedBubbles,
  onBubbleRemoveFromStack
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const stackHeight = bubbles.length;
  const visibleBubbles = isExpanded ? bubbles : bubbles.slice(0, 2);
  const hiddenCount = Math.max(0, bubbles.length - 2);

  // Stack container variants
  const stackVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  // Connector line variants
  const connectorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 0.6, 
      height: '100%',
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isExpanded ? 200 : 100
      }}
      variants={stackVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Stack Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 60%)',
          transform: 'scale(1.2)',
          borderRadius: '2rem'
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.3 : 1.2
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Vertical Connector Line */}
      {bubbles.length > 1 && (
        <motion.div
          className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            height: isExpanded ? `${(bubbles.length - 1) * 140}px` : '120px'
          }}
          variants={connectorVariants}
          animate={isHovered ? "visible" : "hidden"}
        />
      )}

      {/* Stack Header/Top Bubble */}
      <div className="relative">
        <ForgeBubble
          bubble={bubbles[0]}
          position={{ x: 50, y: 50 }} // Relative positioning within stack
          isLocked={lockedBubbles.has(bubbles[0].id)}
          onDragEnd={(event, info) => {
            // Check if dragged far enough to remove from stack
            const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
            if (dragDistance > 100) {
              onBubbleRemoveFromStack(stackId, bubbles[0].id, event, info);
            } else {
              onBubbleDragEnd(bubbles[0].id, event, info);
            }
          }}
          onLockToggle={() => onBubbleLockToggle(bubbles[0].id)}
        />

        {/* Stack Indicator */}
        {bubbles.length > 1 && (
          <motion.button
            onClick={() => onToggleExpand(stackId)}
            className="absolute -top-2 -right-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-xs text-orange-300 font-bold"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? '−' : `${bubbles.length}`}
            </motion.span>
          </motion.button>
        )}

        {/* Hidden Count Badge */}
        {!isExpanded && hiddenCount > 0 && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-zinc-800/90 border border-orange-500/30 rounded-full px-2 py-1 z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xs text-orange-400 font-medium">
              +{hiddenCount} more
            </span>
          </motion.div>
        )}
      </div>

      {/* Expanded Stack Items */}
      <AnimatePresence>
        {isExpanded && bubbles.length > 1 && (
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {bubbles.slice(1).map((bubble, index) => (
              <motion.div
                key={bubble.id}
                className="relative"
                style={{
                  marginTop: '120px', // Spacing between stacked bubbles
                  marginLeft: `${(index % 2) * 20 - 10}px` // Slight offset for visual depth
                }}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
              >
                <ForgeBubble
                  bubble={bubble}
                  position={{ x: 50, y: 50 }}
                  isLocked={lockedBubbles.has(bubble.id)}
                  onDragEnd={(event, info) => {
                    // Check if dragged far enough to remove from stack
                    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
                    if (dragDistance > 100) {
                      onBubbleRemoveFromStack(stackId, bubble.id, event, info);
                    } else {
                      onBubbleDragEnd(bubble.id, event, info);
                    }
                  }}
                  onLockToggle={() => onBubbleLockToggle(bubble.id)}
                />

                {/* Connector Node */}
                <motion.div
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500/60 rounded-full pointer-events-none"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stack Actions (when hovered) */}
      <AnimatePresence>
        {isHovered && bubbles.length > 1 && (
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 backdrop-blur-sm border border-orange-500/30 rounded-xl px-4 py-2 pointer-events-auto z-30"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="text-orange-400 font-medium">
                {bubbles.length} thoughts stacked
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">
                Click to {isExpanded ? 'collapse' : 'expand'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Development Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -top-8 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono pointer-events-none">
          Stack: {stackId} | Count: {bubbles.length} | Expanded: {isExpanded ? 'Y' : 'N'}
        </div>
      )}
    </motion.div>
  );
};

export default BubbleStack;