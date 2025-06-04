import React from 'react';
import { useBubbleStore } from '../components/logic/useBubbleStore';

const DebugOverlay = ({ 
  chaosBubbles = [], 
  hiddenBubbleCount = 0,
  showLatest = true 
}) => {
  const { bubbles } = useBubbleStore();

  // Get latest bubble timestamp
  const getLatestTimestamp = () => {
    if (chaosBubbles.length === 0) return 'none';
    
    const latest = chaosBubbles[0];
    if (!latest?.timestamp) return 'none';
    
    return new Date(latest.timestamp).toLocaleTimeString();
  };

  return (
    <div className="fixed top-2 left-2 z-[1000] w-[calc(100%-1rem)] max-w-xs bg-black bg-opacity-80 rounded p-2 text-xs sm:text-sm text-white break-words">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>Store Total:</span>
          <span>{bubbles.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Chaos State:</span>
          <span>{chaosBubbles.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Hidden:</span>
          <span>{hiddenBubbleCount}</span>
        </div>
        {showLatest && (
          <div className="flex justify-between items-center text-yellow-400">
            <span>Latest:</span>
            <span className="text-xs truncate">{getLatestTimestamp()}</span>
          </div>
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-xs text-gray-400">Debug: Responsive test</div>
      </div>
    </div>
  );
};

export default DebugOverlay;