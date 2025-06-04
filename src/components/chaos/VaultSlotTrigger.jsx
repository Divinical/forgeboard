import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VaultSlotTrigger = ({ 
  vaultCount = 0, 
  isOverflowing = false,
  onFreezeBubbles,
  onBurnBubbles,
  onDismiss,
  hiddenBubbleCount = 0
}) => {
  // Modal variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Vault access hint (shows when vault has items but no overflow)
  const VaultAccessHint = () => (
    <motion.div
      className="fixed top-4 left-4 z-40 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl px-4 py-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 bg-cyan-400 rounded-full"
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
        <span className="text-xs font-mono text-slate-300">
          ❄️ {vaultCount} frozen
        </span>
      </div>
    </motion.div>
  );

  // Overflow modal
  const OverflowModal = () => (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-900 border border-red-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'
        }}
      >
        <div className="text-center">
          <motion.div
            className="text-4xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}
          >
            🧠💥
          </motion.div>
          
          <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-4">
            Your mind is full
          </h3>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Too many thoughts are floating in chaos. 
            {hiddenBubbleCount > 0 && (
              <span className="block mt-2 text-sm text-red-300">
                {hiddenBubbleCount} thoughts are hidden from view.
              </span>
            )}
            Time to burn the old ones or freeze them into the vault.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button 
              onClick={onBurnBubbles}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>🔥</span>
              <span>Burn Old Thoughts</span>
            </motion.button>
            
            <motion.button 
              onClick={onFreezeBubbles}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>❄️</span>
              <span>Freeze to Vault</span>
            </motion.button>
          </div>
          
          <motion.button
            className="mt-4 text-gray-400 hover:text-white transition-colors text-sm"
            onClick={onDismiss}
            whileHover={{ scale: 1.05 }}
          >
            Continue in chaos
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* Vault access hint when not overflowing but vault has items */}
      <AnimatePresence>
        {!isOverflowing && vaultCount > 0 && (
          <VaultAccessHint />
        )}
      </AnimatePresence>

      {/* Overflow modal */}
      <AnimatePresence>
        {isOverflowing && (
          <OverflowModal />
        )}
      </AnimatePresence>
    </>
  );
};

export default VaultSlotTrigger;