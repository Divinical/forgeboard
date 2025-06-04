import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ 
  children,
  className = '',
  sectionKey,
  variant = 'default',
  ...motionProps
}) => {
  // Different transition variants for different section types
  const variants = {
    default: {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.98
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    slide: {
      hidden: {
        opacity: 0,
        x: 100,
        scale: 0.95
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      exit: {
        opacity: 0,
        x: -100,
        scale: 0.95,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    fade: {
      hidden: {
        opacity: 0
      },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeIn"
        }
      }
    },
    scale: {
      hidden: {
        opacity: 0,
        scale: 0.8
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    }
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <motion.div
      key={sectionKey}
      variants={selectedVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`w-full h-full flex-1 ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;