import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgeGlowOverlay = ({ flameProgress = 0 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary ambient gradients */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(147, 51, 234, ${0.1 + (flameProgress * 0.1)}) 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(251, 146, 60, ${0.1 + (flameProgress * 0.15)}) 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Dynamic flame glow based on drag progress */}
      <AnimatePresence>
        {flameProgress > 0.1 && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: flameProgress * 0.4,
              background: `radial-gradient(ellipse at bottom, rgba(251, 146, 60, ${flameProgress * 0.2}) 0%, rgba(239, 68, 68, ${flameProgress * 0.15}) 30%, transparent 70%)`
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Enhanced flame overlay for high progress */}
      {flameProgress > 0.5 && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center bottom, rgba(251, 146, 60, ${flameProgress * 0.1}) 0%, rgba(239, 68, 68, ${flameProgress * 0.08}) 40%, transparent 80%)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Intense burn glow for near-completion */}
      {flameProgress > 0.8 && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at bottom, rgba(239, 68, 68, ${(flameProgress - 0.8) * 0.5}) 0%, rgba(220, 38, 38, ${(flameProgress - 0.8) * 0.3}) 50%, transparent 80%)`
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Floating flame particles for high intensity */}
      {flameProgress > 0.6 && (
        <div className="absolute inset-0">
          {[...Array(Math.floor((flameProgress - 0.6) * 20))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                bottom: `${Math.random() * 40}%`,
              }}
              animate={{
                y: [0, -30, -60],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.3]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForgeGlowOverlay;