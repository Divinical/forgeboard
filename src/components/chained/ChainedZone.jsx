import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';
import ChainedPanel from './ChainedPanel';
import ChainedActions from './ChainedActions';
import ChainedStats from './ChainedStats';
import ChainedBackground from './ChainedBackground';

const ChainedZone = ({ isVisible = false, onClose }) => {
  const { bubbles, reviveBubble, burnBubble } = useBubbleStore();
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filter chained bubbles (using 'vault' state)
  const chainedBubbles = bubbles.filter(bubble => bubble.state === 'vault');
  const chainedCount = chainedBubbles.length;

  // Handle bubble action selection
  const handleBubbleAction = (bubble) => {
    setSelectedBubble(bubble);
    setIsActionsOpen(true);
  };

  // Handle unchain action - return to chaos
  const handleUnchain = async (bubbleId) => {
    setIsProcessing(true);
    try {
      reviveBubble(bubbleId); // Changes state back to 'chaos'
      console.log('🔓 Thought unchained:', bubbleId);
    } catch (error) {
      console.error('Failed to unchain thought:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle burn action - send to archive
  const handleBurn = async (bubbleId) => {
    setIsProcessing(true);
    try {
      burnBubble(bubbleId); // Changes state to 'burned'
      console.log('🔥 Thought burned from chains:', bubbleId);
    } catch (error) {
      console.error('Failed to burn thought:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Close actions modal
  const handleActionsClose = () => {
    setIsActionsOpen(false);
    setSelectedBubble(null);
  };

  // Panel animation variants
  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.8
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="relative w-full min-h-screen">
      {/* Chained Background Effects */}
      <ChainedBackground 
        intensity={0.6}
        chainedCount={chainedCount}
        isVisible={isVisible}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="chained-panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-20"
        >
          {/* Statistics Section */}
          <ChainedStats chainedBubbles={chainedBubbles} />
          
          {/* Main Panel - Always Visible When Open */}
          <ChainedPanel 
            chainedBubbles={chainedBubbles}
            onClose={onClose}
            onBubbleAction={handleBubbleAction}
          />
        </motion.div>
      </AnimatePresence>

      {/* Actions Modal */}
      <ChainedActions
        bubble={selectedBubble}
        isOpen={isActionsOpen}
        onClose={handleActionsClose}
        onUnchain={handleUnchain}
        onBurn={handleBurn}
        isProcessing={isProcessing}
      />

      {/* Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-16 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono z-50">
          <div>Chained: {chainedCount}</div>
          <div>Visible: {isVisible ? 'Yes' : 'No'}</div>
          <div>Actions: {isActionsOpen ? 'Open' : 'Closed'}</div>
          <div>Processing: {isProcessing ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};

export default ChainedZone;