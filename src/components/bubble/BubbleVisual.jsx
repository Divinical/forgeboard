import React from 'react';
import { motion } from 'framer-motion';

const BubbleVisual = ({ 
  shouldGlow, 
  glowColor, 
  getTagColors, 
  tag, 
  text,
  truncatedText,
  isExpanded,
  timestamp
}) => {
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Glow effect overlay for completed items */}
      {shouldGlow && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${
            glowColor === 'purple' 
              ? 'from-purple-500/10 to-pink-500/10' 
              : 'from-orange-500/10 to-red-500/10'
          } rounded-2xl pointer-events-none`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Header with tag and timestamp */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-y-1 w-full mb-3">
        <motion.span 
          className="text-xl sm:text-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {tag}
        </motion.span>
        
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-zinc-500 font-mono">
            {formatTimestamp(timestamp)}
          </span>
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Text content */}
      <div className="text-gray-300 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
        {isExpanded ? text : truncatedText}
      </div>
    </>
  );
};

export default BubbleVisual;