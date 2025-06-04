import React from 'react';
import { motion } from 'framer-motion';

const BubbleMobileDragHint = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <motion.div
      className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 md:hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="bg-purple-900/90 backdrop-blur-sm border border-purple-500/50 rounded-lg px-2 py-1">
        <p className="text-xs font-medium text-purple-300 whitespace-nowrap">
          Drag to 🔥 to complete
        </p>
      </div>
    </motion.div>
  );
};

export default BubbleMobileDragHint;