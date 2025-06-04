import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChainedBubble from './ChainedBubble';

const ChainedPanel = ({ chainedBubbles = [], onClose, onBubbleAction }) => {
  // Container animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Header animation variants
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20
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

  // Scroll container variants
  const scrollVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-zinc-900/95 backdrop-blur-xl flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Ambient background layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-red-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header Section */}
      <motion.div
        className="relative z-10 p-6 border-b border-zinc-800/50"
        variants={headerVariants}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.span
              className="text-4xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧷
            </motion.span>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-300">
                The Chained
              </h2>
              <p className="text-lg text-zinc-500 italic">
                Thoughts held in waiting, ready to be unchained
              </p>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="p-3 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-orange-500/50 rounded-xl text-zinc-400 hover:text-orange-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">✕</span>
          </motion.button>
        </div>

        {/* Count indicator */}
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-800/40 border border-orange-600/40 rounded-full backdrop-blur-sm">
            <motion.div
              className="w-2 h-2 bg-orange-400 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-sm text-orange-300 font-medium">
              {chainedBubbles.length} thought{chainedBubbles.length === 1 ? '' : 's'} awaiting release
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        className="flex-1 relative z-10 overflow-hidden"
        variants={scrollVariants}
      >
        {chainedBubbles.length === 0 ? (
          // Empty state
          <motion.div
            className="flex items-center justify-center h-full px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="text-center max-w-md">
              <motion.div
                className="text-6xl mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔗
              </motion.div>
              <h3 className="text-2xl font-bold text-zinc-400 mb-4">
                No thoughts chained
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                When your mind overflows, thoughts will be chained here until you're ready to unchain or release them.
              </p>
            </div>
          </motion.div>
        ) : (
          // Horizontal scroll container
          <div className="h-full flex flex-col">
            {/* Scroll hint */}
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-xs text-zinc-500 font-mono">
                ← Scroll horizontally to explore chained thoughts →
              </div>
            </motion.div>

            {/* Bubbles container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
              <motion.div
                className="flex gap-6 h-full items-center min-w-max py-4"
                variants={scrollVariants}
              >
                <AnimatePresence mode="popLayout">
                  {chainedBubbles.map((bubble, index) => (
                    <motion.div
                      key={bubble.id}
                      layout
                      className="flex-shrink-0"
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <ChainedBubble
                        content={bubble.text}
                        tag={bubble.tag}
                        timestamp={bubble.timestamp || bubble.createdAt}
                        id={bubble.id}
                        onAction={() => onBubbleAction(bubble)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer gradient */}
      <motion.div
        className="relative z-10 h-16 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />

      {/* Custom scrollbar styles */}
      <style jsx>{`
        /* Custom horizontal scrollbar */
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.3);
          border-radius: 3px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.4);
          border-radius: 3px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.6);
        }
      `}</style>
    </motion.div>
  );
};

export default ChainedPanel;