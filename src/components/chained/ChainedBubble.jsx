import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChainedBubble = ({ content, tag = "💭", timestamp, id, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
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

  // Truncate content for display
  const truncatedContent = content && content.length > 150 ? 
    content.substring(0, 147) + "..." : 
    content || "Empty thought";

  // Tag-based color mapping (dimmed for chained state)
  const getTagColors = (tag) => {
    const tagMap = {
      "💡": "from-yellow-900/20 to-amber-900/20 border-yellow-700/30",
      "🔥": "from-red-900/20 to-orange-900/20 border-red-700/30",
      "🔧": "from-blue-900/20 to-cyan-900/20 border-blue-700/30",
      "📝": "from-purple-900/20 to-violet-900/20 border-purple-700/30",
      "⚡": "from-orange-900/20 to-yellow-900/20 border-orange-700/30",
      "🎯": "from-green-900/20 to-emerald-900/20 border-green-700/30",
      "💭": "from-zinc-900/40 to-slate-900/40 border-zinc-700/40"
    };
    return tagMap[tag] || tagMap["💭"];
  };

  // Bubble animation variants
  const bubbleVariants = {
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
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.3
      }
    }
  };

  // Chain icon animation variants
  const chainVariants = {
    idle: {
      rotate: 0,
      scale: 1
    },
    hover: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  // Tooltip variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="relative group"
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => {
        setIsHovered(true);
        setShowTooltip(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
      onClick={() => onAction && onAction()}
    >
      <motion.div
        className={`
          relative backdrop-blur-sm rounded-2xl p-6 transition-all duration-500 
          w-80 h-64 overflow-hidden cursor-pointer select-none
          bg-gradient-to-br ${getTagColors(tag)}
        `}
        style={{
          boxShadow: isHovered 
            ? '0 0 30px rgba(251, 146, 60, 0.2), 0 8px 25px rgba(0, 0, 0, 0.4)'
            : '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.02)'
        }}
        animate={{
          borderColor: isHovered ? 'rgba(251, 146, 60, 0.4)' : undefined
        }}
      >
        {/* Chain icon overlay (top-left) */}
        <motion.div
          className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center bg-zinc-800/80 border border-zinc-700/50 rounded-lg backdrop-blur-sm"
          variants={chainVariants}
          animate={isHovered ? "hover" : "idle"}
        >
          <span className="text-sm text-zinc-400">🧷</span>
        </motion.div>

        {/* Dimmed overlay to indicate chained state */}
        <motion.div
          className="absolute inset-0 bg-zinc-900/20 rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.1 : 0.3
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Subtle pulsing glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl pointer-events-none"
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content area */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with tag and timestamp */}
          <div className="flex items-center justify-between mb-4">
            <motion.span
              className="text-2xl opacity-70"
              animate={isHovered ? {
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {tag}
            </motion.span>
            
            <span className="text-xs text-zinc-500 font-mono opacity-60">
              {formatTimestamp(timestamp)}
            </span>
          </div>

          {/* Main content */}
          <div className="flex-1 flex items-center">
            <p className="text-zinc-300 text-sm leading-relaxed break-words opacity-80">
              {truncatedContent}
            </p>
          </div>

          {/* Chained indicator at bottom */}
          <motion.div
            className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-700/30"
            animate={{
              opacity: isHovered ? 1 : 0.6
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 bg-orange-500/60 rounded-full"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-xs text-zinc-500 font-medium">
              Chained · Ready to release
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Tooltip overlay */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-zinc-900/95 backdrop-blur-sm border border-orange-500/50 rounded-xl px-4 py-2 shadow-2xl">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-blue-400 font-medium">
                  🔓 Unchain
                </span>
                <span className="text-zinc-500">or</span>
                <span className="text-orange-400 font-medium">
                  🔥 Burn
                </span>
              </div>
            </div>

            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover glow effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
            filter: 'blur(8px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default ChainedBubble;