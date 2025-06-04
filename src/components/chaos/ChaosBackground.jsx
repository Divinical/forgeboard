import React from 'react';
import { motion } from 'framer-motion';

const ChaosBackground = ({ 
  bubbleCount = 0, 
  isDragActive = false, 
  flameIntensity = 0 
}) => {
  // Dynamic glow intensity based on bubble count and activity
  const getGlowIntensity = () => {
    const baseIntensity = Math.min(0.15, bubbleCount * 0.01);
    const dragBoost = isDragActive ? 0.05 : 0;
    const flameBoost = flameIntensity * 0.1;
    return baseIntensity + dragBoost + flameBoost;
  };

  const glowIntensity = getGlowIntensity();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary ambient gradients */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(147, 51, 234, ${0.1 + glowIntensity}) 0%, transparent 70%)`
        }}
        animate={{
          scale: isDragActive ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: isDragActive ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(251, 146, 60, ${0.1 + glowIntensity}) 0%, transparent 70%)`
        }}
        animate={{
          scale: isDragActive ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: isDragActive ? 1.8 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Central energy core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(239, 68, 68, ${0.05 + glowIntensity * 0.5}) 0%, transparent 80%)`
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Dynamic flame-influenced glow */}
      {flameIntensity > 0.1 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: flameIntensity * 0.3,
            background: `radial-gradient(ellipse at bottom, rgba(251, 146, 60, ${flameIntensity * 0.15}) 0%, rgba(239, 68, 68, ${flameIntensity * 0.1}) 30%, transparent 70%)`
          }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Floating ambient particles */}
      <div className="absolute inset-0">
        {[...Array(Math.min(8, Math.floor(bubbleCount / 3)))].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`, // Keep particles in top 60% to avoid FlameZone
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Overflow state - enhanced energy */}
      {bubbleCount > 15 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            background: [
              'radial-gradient(circle at 30% 40%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Drag state enhancement */}
      {isDragActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Motion blur overlay for high activity */}
      {(isDragActive || bubbleCount > 12) && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.02) 70%)',
            backdropFilter: isDragActive ? 'blur(0.5px)' : 'none'
          }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default ChaosBackground;