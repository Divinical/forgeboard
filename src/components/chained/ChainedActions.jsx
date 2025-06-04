import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChainedActions = ({ 
  bubble, 
  isOpen, 
  onClose, 
  onUnchain, 
  onBurn,
  isProcessing = false 
}) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Action configurations
  const actions = [
    {
      id: 'unchain',
      icon: '🔓',
      title: 'Unchain',
      description: 'Release back to Chaos Realm',
      color: 'blue',
      bgClass: 'from-blue-900/30 to-cyan-900/30 border-blue-600/40',
      hoverClass: 'hover:border-blue-500/60 hover:bg-blue-500/10',
      textClass: 'text-blue-300',
      accentClass: 'text-blue-400'
    },
    {
      id: 'burn',
      icon: '🔥',
      title: 'Burn & Complete',
      description: 'Mark as complete forever',
      color: 'orange',
      bgClass: 'from-orange-900/30 to-red-900/30 border-orange-600/40',
      hoverClass: 'hover:border-orange-500/60 hover:bg-orange-500/10',
      textClass: 'text-orange-300',
      accentClass: 'text-orange-400'
    }
  ];

  // Modal animation variants
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
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Action button variants
  const actionVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      x: 2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.2
      }
    }
  };

  // Confirmation animation variants
  const confirmationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30
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

  // Handle action selection
  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId);
    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!selectedAction || !bubble) return;

    try {
      if (selectedAction === 'unchain') {
        await onUnchain(bubble.id);
      } else if (selectedAction === 'burn') {
        await onBurn(bubble.id);
      }
      
      // Close modal after successful action
      handleClose();
    } catch (error) {
      console.error('Action failed:', error);
      // Could add error toast here
    }
  };

  // Handle close with state reset
  const handleClose = () => {
    setSelectedAction(null);
    setShowConfirmation(false);
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !bubble) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="relative bg-zinc-900/95 border border-zinc-700/60 rounded-2xl p-6 md:p-8 max-w-md w-full backdrop-blur-xl"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative z-10">
            {!showConfirmation ? (
              // Action Selection View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.span
                    className="text-4xl block mb-3"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🧷
                  </motion.span>
                  <h3 className="text-xl font-bold text-zinc-300 mb-2">
                    Release This Thought?
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Choose how to handle this chained thought
                  </p>
                </div>

                {/* Bubble Preview */}
                <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{bubble.tag}</span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {new Date(bubble.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {bubble.text.length > 100 ? 
                      bubble.text.substring(0, 97) + "..." : 
                      bubble.text
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="space-y-3 mb-6"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {actions.map((action) => (
                    <motion.button
                      key={action.id}
                      variants={actionVariants}
                      whileHover="hover"
                      onClick={() => handleActionSelect(action.id)}
                      disabled={isProcessing}
                      className={`
                        w-full p-4 rounded-xl border transition-all duration-300 text-left
                        bg-gradient-to-r ${action.bgClass} ${action.hoverClass}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <motion.span
                          className="text-2xl"
                          whileHover={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {action.icon}
                        </motion.span>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${action.textClass}`}>
                            {action.title}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <motion.div
                          className={`text-lg ${action.accentClass} opacity-50`}
                          whileHover={{ opacity: 1, x: 2 }}
                        >
                          →
                        </motion.div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Cancel Button */}
                <motion.button
                  onClick={handleClose}
                  className="w-full p-3 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-zinc-600 rounded-xl text-zinc-400 hover:text-zinc-300 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            ) : (
              // Confirmation View
              <motion.div
                variants={confirmationVariants}
                initial="hidden"
                animate="visible"
              >
                {(() => {
                  const action = actions.find(a => a.id === selectedAction);
                  return (
                    <>
                      {/* Confirmation Header */}
                      <div className="text-center mb-6">
                        <motion.span
                          className="text-4xl block mb-3"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {action?.icon}
                        </motion.span>
                        <h3 className={`text-xl font-bold mb-2 ${action?.textClass}`}>
                          Confirm {action?.title}
                        </h3>
                        <p className="text-sm text-zinc-500">
                          This action cannot be undone
                        </p>
                      </div>

                      {/* Warning Message */}
                      <motion.div
                        className={`p-4 rounded-xl border mb-6 bg-gradient-to-r ${action?.bgClass}`}
                        animate={{
                          borderColor: action?.color === 'orange' ? 
                            ['rgba(251, 146, 60, 0.4)', 'rgba(251, 146, 60, 0.6)', 'rgba(251, 146, 60, 0.4)'] :
                            ['rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.4)']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <p className="text-sm text-zinc-300">
                          {selectedAction === 'unchain' ? 
                            'This thought will return to the Chaos Realm where you can work with it again.' :
                            'This thought will be marked as complete and moved to your permanent archive.'
                          }
                        </p>
                      </motion.div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => setShowConfirmation(false)}
                          className="flex-1 p-3 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-zinc-600 rounded-xl text-zinc-400 hover:text-zinc-300 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Back
                        </motion.button>
                        <motion.button
                          onClick={handleConfirm}
                          disabled={isProcessing}
                          className={`
                            flex-1 p-3 rounded-xl font-semibold transition-all duration-300
                            ${action?.bgClass} ${action?.hoverClass} ${action?.textClass}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          whileHover={!isProcessing ? { scale: 1.02 } : {}}
                          whileTap={!isProcessing ? { scale: 0.98 } : {}}
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center gap-2">
                              <motion.div
                                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Processing...
                            </div>
                          ) : (
                            `Confirm ${action?.title}`
                          )}
                        </motion.button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChainedActions;