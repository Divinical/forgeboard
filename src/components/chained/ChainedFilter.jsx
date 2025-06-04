import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChainedFilter = ({ 
  chainedBubbles = [], 
  onFilteredBubbles,
  className = '' 
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Emotional filter categories for chained thoughts
  const filterCategories = [
    {
      id: 'all',
      label: 'All Chained',
      icon: '🧷',
      description: 'Show all chained thoughts',
      color: 'zinc',
      bgClass: 'bg-zinc-800/60 border-zinc-600/40 text-zinc-300',
      hoverClass: 'hover:border-zinc-500/60 hover:bg-zinc-700/60',
      activeClass: 'bg-zinc-700/80 border-zinc-500/60 text-white'
    },
    {
      id: 'heavy',
      label: 'Heavy',
      icon: '⚖️',
      description: 'Emotionally heavy thoughts',
      color: 'red',
      bgClass: 'bg-red-900/30 border-red-600/40 text-red-300',
      hoverClass: 'hover:border-red-500/60 hover:bg-red-800/40',
      activeClass: 'bg-red-800/60 border-red-500/70 text-red-200'
    },
    {
      id: 'delayed',
      label: 'Delayed',
      icon: '⏳',
      description: 'Thoughts waiting for the right time',
      color: 'orange',
      bgClass: 'bg-orange-900/30 border-orange-600/40 text-orange-300',
      hoverClass: 'hover:border-orange-500/60 hover:bg-orange-800/40',
      activeClass: 'bg-orange-800/60 border-orange-500/70 text-orange-200'
    },
    {
      id: 'fear',
      label: 'Fear',
      icon: '😰',
      description: 'Thoughts chained by anxiety or fear',
      color: 'purple',
      bgClass: 'bg-purple-900/30 border-purple-600/40 text-purple-300',
      hoverClass: 'hover:border-purple-500/60 hover:bg-purple-800/40',
      activeClass: 'bg-purple-800/60 border-purple-500/70 text-purple-200'
    },
    {
      id: 'unfinished',
      label: 'Unfinished',
      icon: '🚧',
      description: 'Incomplete thoughts and projects',
      color: 'yellow',
      bgClass: 'bg-yellow-900/30 border-yellow-600/40 text-yellow-300',
      hoverClass: 'hover:border-yellow-500/60 hover:bg-yellow-800/40',
      activeClass: 'bg-yellow-800/60 border-yellow-500/70 text-yellow-200'
    },
    {
      id: 'conflict',
      label: 'Conflict',
      icon: '⚔️',
      description: 'Thoughts involving internal conflict',
      color: 'pink',
      bgClass: 'bg-pink-900/30 border-pink-600/40 text-pink-300',
      hoverClass: 'hover:border-pink-500/60 hover:bg-pink-800/40',
      activeClass: 'bg-pink-800/60 border-pink-500/70 text-pink-200'
    }
  ];

  // Mock classification logic for demonstration
  // In real implementation, this would be based on bubble metadata
  const classifyBubble = (bubble) => {
    const text = (bubble.text || '').toLowerCase();
    const tag = bubble.tag || '';
    
    // Simple keyword-based classification (expand as needed)
    if (text.includes('scared') || text.includes('afraid') || text.includes('anxiety')) {
      return 'fear';
    }
    if (text.includes('heavy') || text.includes('difficult') || text.includes('hard')) {
      return 'heavy';
    }
    if (text.includes('later') || text.includes('someday') || text.includes('when')) {
      return 'delayed';
    }
    if (text.includes('unfinished') || text.includes('incomplete') || text.includes('todo')) {
      return 'unfinished';
    }
    if (text.includes('conflict') || text.includes('torn') || text.includes('unsure')) {
      return 'conflict';
    }
    
    // Default classification based on tag
    switch (tag) {
      case '😰': case '😨': case '😱': return 'fear';
      case '⚖️': case '😔': case '😢': return 'heavy';
      case '⏳': case '🕒': case '📅': return 'delayed';
      case '🚧': case '🔨': case '📝': return 'unfinished';
      case '⚔️': case '🤔': case '💭': return 'conflict';
      default: return 'general';
    }
  };

  // Filter bubbles based on selected filters
  const filteredBubbles = useMemo(() => {
    if (selectedFilters.length === 0 || selectedFilters.includes('all')) {
      return chainedBubbles;
    }

    return chainedBubbles.filter(bubble => {
      const classification = classifyBubble(bubble);
      return selectedFilters.includes(classification);
    });
  }, [chainedBubbles, selectedFilters]);

  // Calculate counts for each filter
  const filterCounts = useMemo(() => {
    const counts = { all: chainedBubbles.length };
    
    chainedBubbles.forEach(bubble => {
      const classification = classifyBubble(bubble);
      counts[classification] = (counts[classification] || 0) + 1;
    });
    
    return counts;
  }, [chainedBubbles]);

  // Update parent component when filters change
  React.useEffect(() => {
    onFilteredBubbles?.(filteredBubbles);
  }, [filteredBubbles, onFilteredBubbles]);

  // Handle filter toggle
  const handleFilterToggle = (filterId) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
      return;
    }

    setSelectedFilters(prev => {
      const newFilters = prev.filter(f => f !== 'all');
      
      if (newFilters.includes(filterId)) {
        const updated = newFilters.filter(f => f !== filterId);
        return updated.length === 0 ? ['all'] : updated;
      } else {
        return [...newFilters, filterId];
      }
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedFilters(['all']);
  };

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
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08
      }
    }
  };

  const filterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.4
      }
    }
  };

  const expandVariants = {
    collapsed: {
      height: 0,
      opacity: 0
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Don't render if no bubbles
  if (chainedBubbles.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`space-y-4 ${className}`}
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
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🔍
          </motion.span>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">
              Filter Chained Thoughts
            </h4>
            <p className="text-xs text-zinc-500">
              {filteredBubbles.length} of {chainedBubbles.length} thoughts shown
            </p>
          </div>
        </div>

        {/* Expand/Collapse Toggle */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-orange-500/50 rounded-xl text-zinc-400 hover:text-orange-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-sm"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </motion.button>
      </div>

      {/* Quick Filters (Always Visible) */}
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
      >
        {/* All filter */}
        <motion.button
          variants={filterVariants}
          onClick={() => handleFilterToggle('all')}
          className={`
            relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300
            ${selectedFilters.includes('all') || selectedFilters.length === 0
              ? filterCategories[0].activeClass
              : filterCategories[0].bgClass + ' ' + filterCategories[0].hoverClass
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-base">{filterCategories[0].icon}</span>
          <span className="text-sm font-medium">{filterCategories[0].label}</span>
          <span className="text-xs opacity-70">({filterCounts.all})</span>
        </motion.button>

        {/* Active filter count */}
        {selectedFilters.length > 1 && !selectedFilters.includes('all') && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500/40 rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <span className="text-sm text-orange-300 font-medium">
              {selectedFilters.length} filters active
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Expanded Filter Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={expandVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              variants={containerVariants}
            >
              {filterCategories.slice(1).map((filter) => {
                const isSelected = selectedFilters.includes(filter.id);
                const count = filterCounts[filter.id] || 0;
                
                return (
                  <motion.button
                    key={filter.id}
                    variants={filterVariants}
                    onClick={() => handleFilterToggle(filter.id)}
                    disabled={count === 0}
                    className={`
                      relative p-4 rounded-xl border transition-all duration-300 text-left
                      ${count === 0 
                        ? 'opacity-40 cursor-not-allowed bg-zinc-800/30 border-zinc-700/30' 
                        : isSelected 
                          ? filter.activeClass
                          : filter.bgClass + ' ' + filter.hoverClass
                      }
                    `}
                    whileHover={count > 0 ? { scale: 1.02 } : {}}
                    whileTap={count > 0 ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <motion.span
                        className="text-xl"
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
                        {filter.icon}
                      </motion.span>
                      <span className="text-xs font-bold opacity-80">
                        {count}
                      </span>
                    </div>
                    
                    <h5 className="font-semibold text-sm mb-1">
                      {filter.label}
                    </h5>
                    <p className="text-xs opacity-70 leading-relaxed">
                      {filter.description}
                    </p>

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        className="absolute top-2 right-2 w-3 h-3 bg-current rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}

                    {/* Glow effect for selected filters */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 70%)`
                        }}
                        animate={{
                          opacity: [0.2, 0.4, 0.2]
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

            {/* Filter Guide */}
            <motion.div
              className="mt-4 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm text-blue-400 mt-0.5">💡</span>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  <p className="mb-1">
                    <strong className="text-zinc-300">Emotional filtering:</strong> Thoughts are automatically classified based on content and tags.
                  </p>
                  <p>
                    Select multiple categories to see thoughts that match any of the selected types.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChainedFilter;