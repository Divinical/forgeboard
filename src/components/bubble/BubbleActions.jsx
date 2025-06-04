import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BubbleActions = ({ handleReflect, handleFreeze, handleBurn, state, isExpanded, shouldGlow }) => {
  return (
    <AnimatePresence>
      {(isExpanded || shouldGlow) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex gap-2 mt-3 pt-3 border-t border-zinc-700/30"
        >
          <button
            onClick={handleReflect}
            className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-400 rounded-lg text-xs font-medium transition-all duration-300"
          >
            <span>🧘</span>
            <span className="hidden sm:inline">Reflect</span>
          </button>

          {state === 'chaos' && (
            <>
              <button
                onClick={handleFreeze}
                className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 rounded-lg text-xs font-medium transition-all duration-300"
              >
                <span>❄️</span>
                <span className="hidden sm:inline">Freeze</span>
              </button>

              <button
                onClick={handleBurn}
                className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 rounded-lg text-xs font-medium transition-all duration-300"
              >
                <span>🔥</span>
                <span className="hidden sm:inline">Complete</span>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BubbleActions;