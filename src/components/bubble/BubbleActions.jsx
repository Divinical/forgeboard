import React from 'react';
import { motion } from 'framer-motion';

const BubbleActions = ({
  handleReflect,
  handleFreeze,
  handleBurn,
  state,
  isExpanded,
  shouldGlow
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      {/* Reflect button */}
      <motion.button
        onClick={handleReflect}
        className={`
          w-full min-w-[7rem] h-10 text-sm
          flex items-center justify-center text-center
          rounded-lg font-medium
          bg-purple-500/20 hover:bg-purple-500/30
          border border-purple-500/40 hover:border-purple-500/60
          text-purple-200 transition-colors duration-200
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base mr-1 sm:mr-2">🔮</span>
        <span className="truncate text-xs sm:text-sm">Reflect</span>
      </motion.button>

      {/* Freeze button */}
      <motion.button
        onClick={handleFreeze}
        className={`
          w-full min-w-[7rem] h-10 text-sm
          flex items-center justify-center text-center
          rounded-lg font-medium
          bg-blue-500/20 hover:bg-blue-500/30
          border border-blue-500/40 hover:border-blue-500/60
          text-blue-200 transition-colors duration-200
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base mr-1 sm:mr-2">❄️</span>
        <span className="truncate text-xs sm:text-sm">Freeze</span>
      </motion.button>

      {/* Complete/Burn button */}
      <motion.button
        onClick={handleBurn}
        className={`
          w-full min-w-[7rem] h-10 text-sm mt-2 sm:mt-0
          flex items-center justify-center text-center
          rounded-lg font-medium
          ${shouldGlow 
            ? 'bg-orange-500/30 hover:bg-orange-500/40 border-orange-500/60'
            : 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/40'
          }
          border hover:border-orange-500/60
          text-orange-200 transition-colors duration-200
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base mr-1 sm:mr-2">🔥</span>
        <span className="truncate text-xs sm:text-sm">Complete</span>
      </motion.button>
    </div>
  );
};

export default BubbleActions;