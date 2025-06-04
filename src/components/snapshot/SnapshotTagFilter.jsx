import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SnapshotTagFilter = ({ 
  availableTags = [], 
  selectedTags = [], 
  onTagToggle, 
  onClearFilters 
}) => {
  // Tag color mapping for visual consistency
  const getTagStyle = (tag, isSelected) => {
    const tagStyles = {
      "💡": {
        bg: isSelected ? "bg-yellow-500/20" : "bg-yellow-500/10",
        border: isSelected ? "border-yellow-500/60" : "border-yellow-500/30",
        text: isSelected ? "text-yellow-300" : "text-yellow-400/70",
        glow: "shadow-yellow-500/20"
      },
      "🔥": {
        bg: isSelected ? "bg-red-500/20" : "bg-red-500/10",
        border: isSelected ? "border-red-500/60" : "border-red-500/30",
        text: isSelected ? "text-red-300" : "text-red-400/70",
        glow: "shadow-red-500/20"
      },
      "🔧": {
        bg: isSelected ? "bg-blue-500/20" : "bg-blue-500/10",
        border: isSelected ? "border-blue-500/60" : "border-blue-500/30",
        text: isSelected ? "text-blue-300" : "text-blue-400/70",
        glow: "shadow-blue-500/20"
      },
      "📝": {
        bg: isSelected ? "bg-purple-500/20" : "bg-purple-500/10",
        border: isSelected ? "border-purple-500/60" : "border-purple-500/30",
        text: isSelected ? "text-purple-300" : "text-purple-400/70",
        glow: "shadow-purple-500/20"
      },
      "⚡": {
        bg: isSelected ? "bg-orange-500/20" : "bg-orange-500/10",
        border: isSelected ? "border-orange-500/60" : "border-orange-500/30",
        text: isSelected ? "text-orange-300" : "text-orange-400/70",
        glow: "shadow-orange-500/20"
      },
      "🎯": {
        bg: isSelected ? "bg-green-500/20" : "bg-green-500/10",
        border: isSelected ? "border-green-500/60" : "border-green-500/30",
        text: isSelected ? "text-green-300" : "text-green-400/70",
        glow: "shadow-green-500/20"
      },
      "💭": {
        bg: isSelected ? "bg-zinc-500/20" : "bg-zinc-500/10",
        border: isSelected ? "border-zinc-500/60" : "border-zinc-500/30",
        text: isSelected ? "text-zinc-300" : "text-zinc-400/70",
        glow: "shadow-zinc-500/20"
      }
    };

    return tagStyles[tag] || tagStyles["💭"];
  };

  // Container variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08
      }
    }
  };

  const tagVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Don't render if no tags available
  if (availableTags.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-xl"
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🏷️
          </motion.span>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">
              Filter by Tag
            </h4>
            <p className="text-xs text-zinc-500">
              Show snapshots with specific tags
            </p>
          </div>
        </div>

        {/* Clear filters button */}
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.button
              onClick={onClearFilters}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-xs text-zinc-400 hover:text-orange-400 transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-zinc-800/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Tag Filter Buttons */}
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
      >
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          const style = getTagStyle(tag, isSelected);
          
          return (
            <motion.button
              key={tag}
              variants={tagVariants}
              onClick={() => onTagToggle(tag)}
              className={`
                relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300
                ${style.bg} ${style.border} ${style.text}
                hover:scale-105 active:scale-95
              `}
              style={{
                boxShadow: isSelected ? `0 0 15px ${style.glow}` : 'none'
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              {/* Tag icon */}
              <motion.span
                className="text-lg"
                animate={isSelected ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isSelected ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {tag}
              </motion.span>

              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="w-2 h-2 bg-current rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Glow effect for selected tags */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)`
                  }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Active filter summary */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-400 font-medium">
                  Active filters:
                </span>
                <div className="flex items-center gap-1">
                  {selectedTags.map((tag, index) => (
                    <span key={tag} className="text-orange-300">
                      {tag}{index < selectedTags.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter instructions */}
      <motion.div
        className="p-2 bg-zinc-800/30 border border-zinc-700/30 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-2">
          <span className="text-xs text-blue-400 mt-0.5">💡</span>
          <p className="text-xs text-zinc-400">
            Click tags to filter snapshots. Multiple tags show snapshots with any of the selected tags.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SnapshotTagFilter;