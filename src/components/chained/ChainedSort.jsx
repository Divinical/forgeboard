import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChainedSort = ({ 
  chainedBubbles = [], 
  onSortedBubbles,
  className = '' 
}) => {
  const [sortMode, setSortMode] = useState('dateChained');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sort options configuration
  const sortOptions = [
    {
      id: 'dateChained',
      label: 'Date Chained',
      icon: '📅',
      description: 'When thought was chained',
      sortFn: (a, b, direction) => {
        const dateA = new Date(a.timestamp || a.createdAt || 0);
        const dateB = new Date(b.timestamp || b.createdAt || 0);
        return direction === 'desc' ? dateB - dateA : dateA - dateB;
      }
    },
    {
      id: 'tag',
      label: 'Tag Type',
      icon: '🏷️',
      description: 'Group by thought tag',
      sortFn: (a, b, direction) => {
        const tagA = (a.tag || '💭').toLowerCase();
        const tagB = (b.tag || '💭').toLowerCase();
        const result = tagA.localeCompare(tagB);
        return direction === 'desc' ? -result : result;
      }
    },
    {
      id: 'content',
      label: 'Content Length',
      icon: '📏',
      description: 'Sort by thought length',
      sortFn: (a, b, direction) => {
        const lengthA = (a.text || '').length;
        const lengthB = (b.text || '').length;
        return direction === 'desc' ? lengthB - lengthA : lengthA - lengthB;
      }
    },
    {
      id: 'emotional',
      label: 'Emotional Weight',
      icon: '⚖️',
      description: 'Sort by emotional intensity',
      sortFn: (a, b, direction) => {
        // Mock emotional weight calculation
        const getEmotionalWeight = (bubble) => {
          const text = (bubble.text || '').toLowerCase();
          const tag = bubble.tag || '';
          
          let weight = 0;
          
          // Heavy emotional indicators
          if (text.includes('scared') || text.includes('afraid') || text.includes('anxiety')) weight += 3;
          if (text.includes('heavy') || text.includes('difficult') || text.includes('hard')) weight += 2;
          if (text.includes('conflict') || text.includes('torn') || text.includes('unsure')) weight += 2;
          if (text.includes('delayed') || text.includes('later') || text.includes('someday')) weight += 1;
          
          // Tag-based weight
          switch (tag) {
            case '😰': case '😨': case '😱': weight += 3; break;
            case '⚖️': case '😔': case '😢': weight += 3; break;
            case '⚔️': case '🤔': weight += 2; break;
            case '⏳': case '🕒': weight += 1; break;
            default: weight += 0;
          }
          
          return weight;
        };
        
        const weightA = getEmotionalWeight(a);
        const weightB = getEmotionalWeight(b);
        return direction === 'desc' ? weightB - weightA : weightA - weightB;
      }
    },
    {
      id: 'alphabetical',
      label: 'Alphabetical',
      icon: '🔤',
      description: 'Sort by content A-Z',
      sortFn: (a, b, direction) => {
        const textA = (a.text || '').toLowerCase().trim();
        const textB = (b.text || '').toLowerCase().trim();
        const result = textA.localeCompare(textB);
        return direction === 'desc' ? -result : result;
      }
    }
  ];

  // Sort bubbles based on current mode and direction
  const sortedBubbles = useMemo(() => {
    const currentSort = sortOptions.find(option => option.id === sortMode);
    if (!currentSort) return chainedBubbles;

    return [...chainedBubbles].sort((a, b) => currentSort.sortFn(a, b, sortDirection));
  }, [chainedBubbles, sortMode, sortDirection]);

  // Update parent component when sort changes
  React.useEffect(() => {
    onSortedBubbles?.(sortedBubbles);
  }, [sortedBubbles, onSortedBubbles]);

  // Handle sort mode change
  const handleSortModeChange = (newMode) => {
    setSortMode(newMode);
    setIsDropdownOpen(false);
  };

  // Toggle sort direction
  const handleDirectionToggle = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Get current sort option
  const currentSortOption = sortOptions.find(option => option.id === sortMode);

  // Animation variants
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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const optionVariants = {
    hidden: {
      opacity: 0,
      x: -10
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Don't render if no bubbles
  if (chainedBubbles.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        {/* Sort Header */}
        <div className="flex items-center gap-3">
          <motion.span
            className="text-xl"
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🔄
          </motion.span>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">
              Sort Chained Thoughts
            </h4>
            <p className="text-xs text-zinc-500">
              {sortedBubbles.length} thoughts sorted by {currentSortOption?.label.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Direction Toggle */}
          <motion.button
            onClick={handleDirectionToggle}
            className="p-2 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-orange-500/50 rounded-xl text-zinc-400 hover:text-orange-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            <motion.span
              className="text-sm"
              animate={{
                rotate: sortDirection === 'asc' ? 0 : 180
              }}
              transition={{ duration: 0.3 }}
            >
              ↑
            </motion.span>
          </motion.button>

          {/* Sort Mode Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-orange-500/50 rounded-xl text-zinc-300 hover:text-orange-300 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base">{currentSortOption?.icon}</span>
              <span className="text-sm font-medium">{currentSortOption?.label}</span>
              <motion.span
                className="text-xs"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl p-2 z-50"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <motion.div className="space-y-1">
                    {sortOptions.map((option) => {
                      const isSelected = sortMode === option.id;
                      
                      return (
                        <motion.button
                          key={option.id}
                          variants={optionVariants}
                          onClick={() => handleSortModeChange(option.id)}
                          className={`
                            w-full p-3 rounded-xl transition-all duration-300 text-left
                            ${isSelected 
                              ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300' 
                              : 'bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 hover:border-zinc-600/50 hover:bg-zinc-700/60'
                            }
                          `}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-3">
                            <motion.span
                              className="text-lg mt-0.5"
                              animate={isSelected ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              } : {}}
                              transition={{
                                duration: 2,
                                repeat: isSelected ? Infinity : 0,
                                ease: "easeInOut"
                              }}
                            >
                              {option.icon}
                            </motion.span>
                            <div className="flex-1">
                              <h5 className="font-semibold text-sm mb-1">
                                {option.label}
                              </h5>
                              <p className="text-xs opacity-70 leading-relaxed">
                                {option.description}
                              </p>
                            </div>
                            {isSelected && (
                              <motion.div
                                className="w-2 h-2 bg-orange-400 rounded-full mt-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              />
                            )}
                          </div>

                          {/* Glow effect for selected option */}
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 bg-orange-500/10 rounded-xl pointer-events-none"
                              animate={{
                                opacity: [0.1, 0.3, 0.1]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>

                  {/* Sort Direction Indicator */}
                  <motion.div
                    className="mt-3 p-2 bg-zinc-800/50 border border-zinc-700/30 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Sort Direction:</span>
                      <div className="flex items-center gap-1 text-orange-400">
                        <motion.span
                          animate={{
                            rotate: sortDirection === 'asc' ? 0 : 180
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          ↑
                        </motion.span>
                        <span className="font-medium">
                          {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sort Summary */}
      <motion.div
        className="mt-3 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <motion.span
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ℹ️
          </motion.span>
          <span>
            Showing {sortedBubbles.length} thoughts sorted by{' '}
            <span className="text-orange-400 font-medium">
              {currentSortOption?.label}
            </span>
            {' '}({sortDirection === 'asc' ? 'oldest first' : 'newest first'})
          </span>
        </div>
      </motion.div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default ChainedSort;