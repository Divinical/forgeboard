import React from 'react';
import { motion } from 'framer-motion';
import ForgeBoardFlame from '../../assets/icons/flame-heart.png';

const FlameIcon = ({ isDragOver, isAnimating }) => {
  // Flame container variants
  const flameContainerVariants = {
    idle: {
      scale: 1,
      y: 0,
      filter: 'drop-shadow(0 0 15px rgba(251, 146, 60, 0.4))'
    },
    hover: {
      scale: 1.15,
      y: -8,
      filter: 'drop-shadow(0 0 25px rgba(251, 146, 60, 0.7)) drop-shadow(0 0 40px rgba(239, 68, 68, 0.4))',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    consuming: {
      scale: [1, 1.3, 1.6, 1.2, 1],
      y: [-8, -20, -25, -15, -8],
      filter: [
        'drop-shadow(0 0 15px rgba(251, 146, 60, 0.4))',
        'drop-shadow(0 0 35px rgba(251, 146, 60, 0.8)) drop-shadow(0 0 50px rgba(239, 68, 68, 0.6))',
        'drop-shadow(0 0 50px rgba(251, 146, 60, 1)) drop-shadow(0 0 80px rgba(239, 68, 68, 0.9))',
        'drop-shadow(0 0 40px rgba(251, 146, 60, 0.8)) drop-shadow(0 0 60px rgba(239, 68, 68, 0.7))',
        'drop-shadow(0 0 25px rgba(251, 146, 60, 0.6))'
      ],
      transition: {
        duration: 2.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="relative z-10 flex items-center justify-center"
      variants={flameContainerVariants}
      initial="idle"
      animate={isAnimating ? "consuming" : (isDragOver ? "hover" : "idle")}
    >
      {/* ForgeBoard Flame Icon */}
      <motion.img
        src={ForgeBoardFlame}
        alt="Complete Thought"
        className="w-10 h-10 md:w-12 md:h-12"
        animate={!isAnimating && !isDragOver ? {
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default FlameIcon;