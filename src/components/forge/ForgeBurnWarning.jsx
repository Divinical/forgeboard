import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgeBurnWarning = ({ flameProgress = 0, BURN_THRESHOLD = 300 }) => {
  const showWarning = flameProgress > 0.8;

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          className="absolute inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center p-8 bg-zinc-900/90 border border-red-500/50 rounded-2xl max-w-md"
            animate={{
              scale: [1, 1.05, 1],
              borderColor: [
                'rgba(239, 68, 68, 0.5)', 
                'rgba(239, 68, 68, 0.8)', 
                'rgba(239, 68, 68, 0.5)'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {/* Warning Icon */}
            <motion.div
              className="text-4xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔥
            </motion.div>

            {/* Warning Text */}
            <h3 className="text-xl font-bold text-red-400 mb-2">
              Almost There!
            </h3>
            <p className="text-gray-300 mb-4">
              Pull down a bit more to complete this thought
            </p>

            {/* Progress indicator */}
            <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                style={{ width: `${flameProgress * 100}%` }}
                animate={{
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Threshold marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                style={{ left: '80%' }}
              />
            </div>

            {/* Additional instruction */}
            <motion.p
              className="text-sm text-zinc-400"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Keep dragging to reach the completion threshold
            </motion.p>

            {/* Pulsing border effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-orange-500/30 pointer-events-none"
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgeBurnWarning;