import React from 'react';
import { motion } from 'framer-motion';

const BubbleVisual = ({ shouldGlow, glowColor, getTagColors, tag }) => {
  return (
    <>
      {/* Glow effect overlay for completed items */}
      {shouldGlow && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${
            glowColor === 'purple' 
              ? 'from-purple-500/10 to-pink-500/10' 
              : 'from-orange-500/10 to-red-500/10'
          } rounded-2xl pointer-events-none`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </>
  );
};

export default BubbleVisual;