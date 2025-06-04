import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlameParticles = ({ isAnimating, isDragOver, flameParticles, bubblePosition }) => {
  // Particle animation variants
  const particleVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 0
    },
    visible: {
      opacity: [0, 1, 1, 0.7, 0],
      scale: [0, 1.5, 1, 0.5, 0],
      y: [-5, -25, -45, -65, -85],
      x: [0, Math.random() * 20 - 10, Math.random() * 15 - 7.5, Math.random() * 10 - 5, 0],
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  };

  // Consumption effect variants
  const consumptionVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      x: bubblePosition?.x || 0,
      y: bubblePosition?.y || 0
    },
    consuming: {
      opacity: [0, 1, 1, 0],
      scale: [1, 0.8, 0.4, 0],
      x: [bubblePosition?.x || 0, 0, 0, 0],
      y: [bubblePosition?.y || 0, -10, -20, -30],
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <>
      {/* Bubble Consumption Effect */}
      <AnimatePresence>
        {isAnimating && bubblePosition && (
          <motion.div
            className="absolute w-8 h-8 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.9) 0%, rgba(239, 68, 68, 0.7) 50%, transparent 100%)',
              filter: 'blur(2px)'
            }}
            variants={consumptionVariants}
            initial="hidden"
            animate="consuming"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      {/* Consumption Flame Particles */}
      <AnimatePresence>
        {flameParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.95) 0%, rgba(239, 68, 68, 0.8) 50%, rgba(220, 38, 38, 0.6) 100%)',
              filter: 'blur(1px)',
              transform: `scale(${particle.scale})`
            }}
            variants={particleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ 
              delay: particle.delay,
              duration: particle.duration
            }}
          />
        ))}
      </AnimatePresence>

      {/* Hover State Particles */}
      <AnimatePresence>
        {isDragOver && !isAnimating && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                style={{
                  left: `${25 + Math.random() * 50}%`,
                  top: `${20 + Math.random() * 60}%`,
                  filter: 'blur(0.5px)',
                }}
                animate={{
                  y: [-5, -20],
                  opacity: [0.9, 0],
                  scale: [1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FlameParticles;