import React from 'react';
import { motion } from 'framer-motion';

const LayoutBackground = ({ 
  activeTab = 'chaos',
  intensity = 0.5 
}) => {
  // Dynamic background colors based on active tab
  const getTabBackground = () => {
    switch (activeTab) {
      case 'chaos':
        return {
          primary: 'rgba(147, 51, 234, 0.1)', // purple
          secondary: 'rgba(239, 68, 68, 0.05)', // red
          accent: 'rgba(251, 146, 60, 0.08)' // orange
        };
      case 'flame':
        return {
          primary: 'rgba(251, 146, 60, 0.15)', // orange
          secondary: 'rgba(239, 68, 68, 0.1)', // red
          accent: 'rgba(220, 38, 38, 0.05)' // darker red
        };
      case 'vault':
        return {
          primary: 'rgba(71, 85, 105, 0.1)', // slate
          secondary: 'rgba(59, 130, 246, 0.05)', // blue
          accent: 'rgba(139, 92, 246, 0.03)' // purple
        };
      case 'quicksnap':
        return {
          primary: 'rgba(139, 92, 246, 0.1)', // purple
          secondary: 'rgba(251, 146, 60, 0.08)', // orange
          accent: 'rgba(34, 197, 94, 0.05)' // green
        };
      default:
        return {
          primary: 'rgba(147, 51, 234, 0.1)',
          secondary: 'rgba(239, 68, 68, 0.05)',
          accent: 'rgba(251, 146, 60, 0.08)'
        };
    }
  };

  const colors = getTabBackground();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary Ambient Glow */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        key={`primary-${activeTab}`}
      />

      {/* Secondary Ambient Glow */}
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        key={`secondary-${activeTab}`}
      />

      {/* Central Energy Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 80%)`
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        key={`core-${activeTab}`}
      />

      {/* Tab Transition Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.primary} 0%, transparent 60%)`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: intensity * 0.3 }}
        transition={{ duration: 0.8 }}
        key={`overlay-${activeTab}`}
      />

      {/* Floating Ambient Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${activeTab}-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: colors.primary,
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Tab-specific enhancement layers */}
      {activeTab === 'flame' && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{
            background: `radial-gradient(ellipse at bottom, ${colors.primary} 0%, ${colors.secondary} 30%, transparent 70%)`
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {activeTab === 'vault' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, transparent 50%, ${colors.accent} 100%)`
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default LayoutBackground;