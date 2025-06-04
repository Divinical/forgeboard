import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNavBar = ({ 
  activeTab = 'chaos',
  onTabChange,
  chaosBubbles = [],
  vaultBubbles = []
}) => {
  // Tab configuration
  const tabs = [
    {
      id: 'chaos',
      icon: '🌀',
      label: 'Chaos',
      count: chaosBubbles.length,
      description: 'Mental chaos realm'
    },
    {
      id: 'flame',
      icon: '🔥',
      label: 'Burn',
      count: null,
      description: 'Complete thoughts'
    },
    {
      id: 'vault',
      icon: '❄️',
      label: 'Vault',
      count: vaultBubbles.length,
      description: 'Frozen thoughts'
    },
    {
      id: 'quicksnap',
      icon: '📝',
      label: 'Capture',
      count: null,
      description: 'Quick thought capture'
    }
  ];

  // Tab button variants
  const tabVariants = {
    inactive: {
      scale: 1,
      opacity: 0.7
    },
    active: {
      scale: 1.1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-800"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3), 0 -1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              variants={tabVariants}
              initial="inactive"
              animate={isActive ? "active" : "inactive"}
              whileTap="tap"
              className={`
                relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                  : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                }
              `}
              style={{
                filter: isActive ? 
                  'drop-shadow(0 0 15px rgba(251, 146, 60, 0.3))' : 
                  'none'
              }}
            >
              {/* Tab Icon */}
              <motion.div
                className="relative text-xl"
                animate={isActive ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {tab.icon}
                
                {/* Count Badge */}
                {tab.count !== null && tab.count > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {tab.count > 99 ? '99+' : tab.count}
                  </motion.div>
                )}
              </motion.div>

              {/* Tab Label */}
              <span className={`
                text-xs font-medium transition-all duration-300
                ${isActive ? 'text-orange-300' : 'text-zinc-500'}
              `}>
                {tab.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-8 h-0.5 bg-orange-500 rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  style={{
                    transform: 'translateX(-50%)'
                  }}
                />
              )}

              {/* Pulse Effect for Active Tab */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-orange-500/10 rounded-2xl"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="text-center pb-2">
        <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
      </div>
    </motion.nav>
  );
};

export default BottomNavBar;