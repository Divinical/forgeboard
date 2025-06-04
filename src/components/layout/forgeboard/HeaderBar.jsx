import React from 'react';
import { motion } from 'framer-motion';

const HeaderBar = ({ 
  activeTab = 'chaos',
  chaosBubbles = [],
  vaultBubbles = []
}) => {
  // Dynamic status based on active tab
  const getStatusText = () => {
    switch (activeTab) {
      case 'chaos':
        return `${chaosBubbles.length} thoughts`;
      case 'vault':
        return `${vaultBubbles.length} frozen`;
      case 'flame':
        return 'completion zone';
      case 'quicksnap':
        return 'capture mode';
      default:
        return 'forging thoughts';
    }
  };

  return (
    <>
      {/* Status Indicator */}
      <motion.div
        className="fixed top-4 right-4 z-40 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-xl px-3 py-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 bg-orange-500 rounded-full"
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
          <span className="text-xs font-mono text-zinc-400">
            {getStatusText()}
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default HeaderBar;