import React from 'react';
import { motion } from 'framer-motion';

const ForgeHeader = ({ 
  activeTab,
  flameProgress = 0,
  bubbleData,
  hasChanges = false,
  onSave,
  onCancel,
  BURN_THRESHOLD = 300
}) => {
  // Get flame intensity based on progress
  const getFlameIntensity = () => {
    if (flameProgress < 0.3) return 'low';
    if (flameProgress < 0.7) return 'medium';
    return 'high';
  };

  const flameIntensity = getFlameIntensity();

  return (
    <motion.div
      className="relative flex items-center justify-between px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="text-2xl"
          animate={{
            rotate: [0, 5, -5, 0],
            transition: { duration: 4, repeat: Infinity }
          }}
        >
          🔨
        </motion.div>
        <div>
          <h2 className="text-lg font-medium text-zinc-200">
            Forge Zone
          </h2>
          <p className="text-sm text-zinc-500">
            Shape your thoughts
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Created date */}
        <div className="text-xs text-zinc-500 font-mono">
          {bubbleData?.createdAt && new Date(bubbleData.createdAt).toLocaleDateString()}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={onSave}
            disabled={!hasChanges}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
              ${hasChanges 
                ? 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105' 
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }
            `}
            whileHover={hasChanges ? { y: -1 } : {}}
            whileTap={hasChanges ? { scale: 0.98 } : {}}
            style={{
              boxShadow: hasChanges 
                ? '0 0 20px rgba(249, 115, 22, 0.3)' 
                : 'none'
            }}
          >
            {hasChanges ? 'Save' : 'Saved'}
          </motion.button>

          <motion.button
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white rounded-xl font-medium text-sm transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgeHeader;