import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';
import { toast } from 'react-hot-toast';

// Import modularized components
import BubbleField from './BubbleField';
import ChaosBackground from './ChaosBackground';
import VaultSlotTrigger from './VaultSlotTrigger';
import BurnZoneHint from './BurnZoneHint';
import ForgeZone from '../forge/ForgeZone';
import FlameZone from '../flame/FlameZone';

// Animation variants
const contentVariants = {
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
};

const ChaosRealm = () => {
  const { 
    bubbles, 
    freezeBubble, 
    burnBubble, 
    updateBubble,
    moveBubbleToForge,
    getChaosCount,
    activeBubble,
    setActiveBubble,
    clearActiveBubble
  } = useBubbleStore();
  
  // State management
  const [editingBubble, setEditingBubble] = useState(null);
  const [dragY, setDragY] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [activeDraggedBubble, setActiveDraggedBubble] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [flameIntensity, setFlameIntensity] = useState(0);
  const [isOverForgeZone, setIsOverForgeZone] = useState(false);

  // Refs for scroll behavior
  const chaosRealmRef = useRef(null);
  const forgeZoneRef = useRef(null);

  const BUBBLE_LIMIT = 20;

  // Filter chaos bubbles from store
  const chaosBubbles = bubbles.filter(bubble => bubble.state === 'chaos');
  const vaultBubbles = bubbles.filter(bubble => bubble.state === 'vault');
  const hiddenBubbleCount = Math.max(0, chaosBubbles.length - BUBBLE_LIMIT);

  // Update overflow state
  useEffect(() => {
    setIsOverflowing(chaosBubbles.length > BUBBLE_LIMIT);
  }, [chaosBubbles.length]);

  // Calculate flame intensity based on drag and bubble activity
  useEffect(() => {
    const baseIntensity = Math.min(0.3, chaosBubbles.length * 0.01);
    const dragIntensity = Math.min(0.7, dragY / 300); // dragY up to 300px = max intensity
    setFlameIntensity(Math.max(baseIntensity, dragIntensity));
  }, [dragY, chaosBubbles.length]);

  // Event handlers
  const handleBubbleClick = (bubble) => {
    console.log('Bubble clicked:', bubble);
    // Could expand bubble, show details, etc.
  };

  const handleBubbleReflect = (bubble) => {
    console.log('Bubble reflect requested:', bubble);
    setActiveBubble(bubble);
    
    // Smooth scroll to StillnessZone
    setTimeout(() => {
      if (forgeZoneRef.current) {
        forgeZoneRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleDragStart = (bubble) => {
    setActiveDraggedBubble(bubble);
    setIsDragActive(true);
    
    // Set HTML5 drag data
    if (event?.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(bubble));
      event.dataTransfer.effectAllowed = 'move';
    }
    
    console.log('🔄 Drag started:', { 
      bubbleId: bubble.id, 
      state: bubble.state,
      isComplete: bubble.isComplete 
    });
  };

  const handleDragEnd = (bubble, info) => {
    console.log('🔄 Drag ended:', { 
      bubbleId: bubble.id,
      isOverForgeZone,
      position: info?.point
    });

    setActiveDraggedBubble(null);
    setIsDragActive(false);
    setDragY(0);

    // Check if dropped in ForgeZone
    if (isOverForgeZone) {
      console.log('🔧 Attempting to transfer bubble to ForgeZone:', bubble.id);
      moveBubbleToForge(bubble.id);
      toast.success('Thought moved to Forge', {
        icon: '🔧',
        duration: 2000
      });
    }

    setIsOverForgeZone(false);
  };

  // Handle drag updates for zone detection
  const handleDragUpdate = (event, info, bubble) => {
    // Update dragY based on drag position
    const dragY = Math.max(0, info.point.y);
    setDragY(dragY);
    
    // Check if over ForgeZone
    const forgeZoneElement = document.querySelector('.forge-zone');
    if (forgeZoneElement) {
      const forgeRect = forgeZoneElement.getBoundingClientRect();
      const isOver = (
        info.point.x >= forgeRect.left &&
        info.point.x <= forgeRect.right &&
        info.point.y >= forgeRect.top &&
        info.point.y <= forgeRect.bottom
      );

      console.log('🔄 Drag update:', {
        bubbleId: bubble.id,
        position: info.point,
        forgeRect: {
          left: forgeRect.left,
          right: forgeRect.right,
          top: forgeRect.top,
          bottom: forgeRect.bottom
        },
        isOverForgeZone: isOver
      });

      setIsOverForgeZone(isOver);
    }
  };

  // Overflow management
  const handleFreezeBubbles = () => {
    // Freeze oldest bubbles first
    const bubblesToFreeze = chaosBubbles
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(0, Math.max(1, chaosBubbles.length - BUBBLE_LIMIT + 5));
    
    bubblesToFreeze.forEach(bubble => freezeBubble(bubble.id));
    setIsOverflowing(false);
  };

  const handleBurnBubbles = () => {
    // Burn oldest bubbles first
    const bubblesToBurn = chaosBubbles
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(0, Math.max(1, chaosBubbles.length - BUBBLE_LIMIT + 5));
    
    bubblesToBurn.forEach(bubble => burnBubble(bubble.id));
    setIsOverflowing(false);
  };

  // Forge Zone handlers
  const handleForgeSave = (updatedBubble) => {
    updateBubble(updatedBubble.id, {
      text: updatedBubble.text,
      tag: updatedBubble.tag,
      updatedAt: updatedBubble.updatedAt
    });
    setEditingBubble(null);
    setDragY(0);
  };

  const handleForgeCancel = () => {
    setEditingBubble(null);
    setDragY(0);
  };

  const handleForgeBurn = (bubbleId) => {
    burnBubble(bubbleId);
    setEditingBubble(null);
    setDragY(0);
  };

  return (
    <div className="relative w-full">
      {/* Chaos Realm Section */}
      <div 
        ref={chaosRealmRef}
        className="relative w-full h-full min-h-screen bg-zinc-900"
      >
        {/* Background Effects */}
        <ChaosBackground 
          bubbleCount={chaosBubbles.length}
          isDragActive={isDragActive}
          flameIntensity={flameIntensity}
          isOverForgeZone={isOverForgeZone}
        />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {editingBubble ? (
            <motion.div
              ref={forgeZoneRef}
              key="forge"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-20 forge-zone"
            >
              <ForgeZone
                bubbleData={editingBubble}
                dragY={dragY}
                onBurn={handleForgeBurn}
                onCancel={handleForgeCancel}
                onSave={handleForgeSave}
                isHighlighted={isOverForgeZone}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chaos"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10"
            >
              <BubbleField
                bubbles={chaosBubbles}
                onBubbleClick={handleBubbleClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragUpdate={handleDragUpdate}
                isOverForgeZone={isOverForgeZone}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transfer Hint */}
        <AnimatePresence>
          {isDragActive && isOverForgeZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 
                         bg-orange-500/20 border border-orange-500/40 rounded-lg
                         text-orange-200 text-sm font-medium z-50"
            >
              Release to transfer to Forge
            </motion.div>
          )}
        </AnimatePresence>

        {/* UI Overlays */}
        <VaultSlotTrigger
          vaultCount={vaultBubbles.length}
          isOverflowing={isOverflowing}
          onFreezeBubbles={handleFreezeBubbles}
          onBurnBubbles={handleBurnBubbles}
          onDismiss={() => setIsOverflowing(false)}
          hiddenBubbleCount={hiddenBubbleCount}
        />

        {/* Mobile Drag Hints */}
        <BurnZoneHint
          isDragActive={isDragActive}
          activeDraggedBubble={activeDraggedBubble}
          bubbleCount={chaosBubbles.length}
          showStaticHint={!isDragActive && chaosBubbles.length > 0}
        />
      </div>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono z-50">
          <div>Chaos: {chaosBubbles.length}</div>
          <div>Vault: {vaultBubbles.length}</div>
          <div>Drag: {isDragActive ? 'Active' : 'Inactive'}</div>
          <div>Active Bubble: {activeBubble ? activeBubble.id : 'None'}</div>
          <div>Flame: {Math.round(flameIntensity * 100)}%</div>
        </div>
      )}
    </div>
  );
};

export default ChaosRealm;