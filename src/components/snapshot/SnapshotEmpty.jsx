import React from 'react';
import { motion } from 'framer-motion';

const SnapshotEmpty = () => {
  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
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

  return (
    <motion.div
      className="flex items-center justify-center min-h-[60vh] px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center max-w-lg">
        {/* Main illustration */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="relative inline-block"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-8xl mb-4 relative">
              📸
              
              {/* Floating sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${15 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Main message */}
        <motion.div
          className="space-y-4 mb-8"
          variants={itemVariants}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-zinc-300">
            No snapshots captured yet
          </h3>
          
          <p className="text-zinc-400 leading-relaxed text-lg">
            Your completed thoughts will appear here as preserved snapshots, 
            ready for reflection and insight.
          </p>
        </motion.div>

        {/* Journey illustration */}
        <motion.div
          className="space-y-6 mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-12 h-12 bg-purple-900/30 border border-purple-500/40 rounded-full flex items-center justify-center text-xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                💭
              </motion.div>
              <span className="font-medium">Create</span>
            </div>
            
            <motion.div
              className="text-orange-500"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.div>
            
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-12 h-12 bg-orange-900/30 border border-orange-500/40 rounded-full flex items-center justify-center text-xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🔥
              </motion.div>
              <span className="font-medium">Complete</span>
            </div>
            
            <motion.div
              className="text-orange-500"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              →
            </motion.div>
            
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-12 h-12 bg-orange-900/30 border border-orange-500/40 rounded-full flex items-center justify-center text-xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(251, 146, 60, 0.2)',
                    '0 0 30px rgba(251, 146, 60, 0.4)',
                    '0 0 20px rgba(251, 146, 60, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                📸
              </motion.div>
              <span className="font-medium">Snapshot</span>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="space-y-4"
          variants={itemVariants}
        >
          <p className="text-zinc-500 text-sm">
            Start your journey by capturing thoughts in{' '}
            <span className="text-orange-400 font-medium">Quicksnap</span>, 
            then drag them to the{' '}
            <span className="text-orange-400 font-medium">🔥 flame</span> 
            {' '}when complete.
          </p>

          {/* Visual guide */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-xs text-zinc-400">
              💭 → 🔥 → 📸
            </span>
          </motion.div>

          {/* Encouraging message */}
          <motion.div
            className="mt-6 p-4 bg-gradient-to-br from-orange-900/20 to-purple-900/20 border border-orange-500/30 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌟
              </motion.div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-orange-300 mb-1">
                  Your journey begins
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every completed thought becomes a preserved snapshot, 
                  building your personal archive of achievements and insights.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Ambient background effect */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <motion.div
            className="absolute top-1/3 left-1/4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SnapshotEmpty;