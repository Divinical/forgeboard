import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ForgeBoardFlame from '../../assets/icons/flame-heart.png';

const FlameUndoToast = ({ showUndo, burnedBubble, handleUndo, handleDismissUndo }) => {
  return (
    <AnimatePresence>
      {showUndo && burnedBubble && (
        <motion.div
          className="fixed bottom-32 md:bottom-36 right-4 md:right-6 z-[9998]"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div 
            className="bg-zinc-900/98 border border-orange-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-sm min-w-[300px] relative overflow-hidden"
            style={{
              boxShadow: '0 0 40px rgba(251, 146, 60, 0.25), 0 15px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Toast glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/8 to-red-500/8 rounded-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <motion.img
                  src={ForgeBoardFlame}
                  alt="Completed"
                  className="w-6 h-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    Thought consumed by the forge
                  </p>
                  <p className="text-gray-400 text-xs leading-tight mt-1">
                    "{burnedBubble.text.slice(0, 45)}{burnedBubble.text.length > 45 ? '...' : ''}"
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={handleUndo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex-1"
                >
                  ↶ Resurrect
                </motion.button>
                <motion.button
                  onClick={handleDismissUndo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-zinc-700 hover:bg-zinc-600 text-gray-300 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300"
                >
                  Accept
                </motion.button>
              </div>
            </div>

            {/* 6-second Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1.5 bg-orange-500 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
            />

            {/* Progress glow */}
            <motion.div
              className="absolute bottom-0 left-0 h-1.5 bg-orange-400/60 rounded-full blur-sm"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlameUndoToast;