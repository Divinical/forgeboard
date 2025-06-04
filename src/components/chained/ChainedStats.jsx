import React from 'react';
import { motion } from 'framer-motion';

const ChainedStats = ({ chainedBubbles = [] }) => {
  // Calculate statistics
  const totalChained = chainedBubbles.length;
  
  // Group by tag
  const tagCounts = chainedBubbles.reduce((acc, bubble) => {
    const tag = bubble.tag || '💭';
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  // Calculate time-based stats
  const getTimeStats = () => {
    const now = new Date();
    const stats = {
      today: 0,
      thisWeek: 0,
      older: 0
    };

    chainedBubbles.forEach(bubble => {
      const bubbleDate = new Date(bubble.timestamp || bubble.createdAt);
      const daysDiff = Math.floor((now - bubbleDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        stats.today++;
      } else if (daysDiff <= 7) {
        stats.thisWeek++;
      } else {
        stats.older++;
      }
    });

    return stats;
  };

  const timeStats = getTimeStats();

  // Get most common tag
  const mostCommonTag = Object.entries(tagCounts).reduce((max, [tag, count]) => 
    count > max.count ? { tag, count } : max, 
    { tag: '💭', count: 0 }
  );

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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const statVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
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
        duration: 0.5
      }
    }
  };

  // Don't render if no chained thoughts
  if (totalChained === 0) {
    return null;
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6"
        style={{
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
        }}
      >
        {/* Stats Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          variants={statVariants}
        >
          <motion.span
            className="text-2xl"
            animate={{
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            📊
          </motion.span>
          <div>
            <h3 className="text-lg font-semibold text-zinc-300">
              Chain Statistics
            </h3>
            <p className="text-sm text-zinc-500">
              Overview of your chained thoughts
            </p>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
        >
          {/* Total Count */}
          <motion.div
            className="bg-zinc-800/50 border border-zinc-700/30 rounded-xl p-4 text-center"
            variants={statVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(251, 146, 60, 0.3)' }}
          >
            <motion.div
              className="text-2xl font-bold text-orange-400 mb-1"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {totalChained}
            </motion.div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              Total Chained
            </div>
          </motion.div>

          {/* Today's Count */}
          <motion.div
            className="bg-zinc-800/50 border border-zinc-700/30 rounded-xl p-4 text-center"
            variants={statVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.3)' }}
          >
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {timeStats.today}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              Today
            </div>
          </motion.div>

          {/* This Week */}
          <motion.div
            className="bg-zinc-800/50 border border-zinc-700/30 rounded-xl p-4 text-center"
            variants={statVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(139, 92, 246, 0.3)' }}
          >
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {timeStats.thisWeek}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              This Week
            </div>
          </motion.div>

          {/* Older */}
          <motion.div
            className="bg-zinc-800/50 border border-zinc-700/30 rounded-xl p-4 text-center"
            variants={statVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.3)' }}
          >
            <div className="text-2xl font-bold text-green-400 mb-1">
              {timeStats.older}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              Older
            </div>
          </motion.div>
        </motion.div>

        {/* Tag Distribution */}
        <motion.div variants={statVariants}>
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <span>🏷️</span>
            Tag Distribution
          </h4>
          
          <div className="space-y-2">
            {Object.entries(tagCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5) // Show top 5 tags
              .map(([tag, count], index) => {
                const percentage = (count / totalChained) * 100;
                
                return (
                  <motion.div
                    key={tag}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-lg w-8 text-center">{tag}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-400">
                          {count} thought{count === 1 ? '' : 's'}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ 
                            duration: 1, 
                            delay: index * 0.1,
                            ease: "easeOut" 
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Insights */}
        {mostCommonTag.count > 0 && (
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-600/30 rounded-xl"
            variants={statVariants}
          >
            <div className="flex items-start gap-3">
              <motion.span
                className="text-xl mt-0.5"
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
                💡
              </motion.span>
              <div>
                <h4 className="text-sm font-semibold text-orange-300 mb-1">
                  Insight
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Your most chained thought type is <span className="text-orange-400 font-medium">{mostCommonTag.tag}</span> 
                  {' '}with {mostCommonTag.count} thought{mostCommonTag.count === 1 ? '' : 's'}. 
                  Consider if these need more dedicated attention or processing time.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions Hint */}
        <motion.div
          className="mt-4 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl"
          variants={statVariants}
        >
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>💡</span>
            <span>
              Click any chained thought to unchain it back to Chaos Realm or burn it to completion
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ChainedStats;