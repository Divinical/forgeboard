// Auto-Chain Overflow System for ForgeBoard
// Handles automatic chaining when chaos realm exceeds 20 thoughts

import { useBubbleStore } from '../components/logic/useBubbleStore';
import { toast } from 'react-hot-toast';

const CHAOS_LIMIT = 20;
const AUTO_CHAIN_BATCH_SIZE = 5; // Chain 5 oldest at a time

export const useAutoChain = () => {
  const { bubbles, freezeBubble } = useBubbleStore();

  // Get chaos bubbles sorted by age (oldest first)
  const getChaosQueueByAge = () => {
    return bubbles
      .filter(bubble => bubble.state === 'chaos')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Check if auto-chaining should trigger
  const shouldAutoChain = () => {
    const chaosBubbles = getChaosQueueByAge();
    return chaosBubbles.length > CHAOS_LIMIT;
  };

  // Execute auto-chaining
  const executeAutoChain = async () => {
    const chaosBubbles = getChaosQueueByAge();
    const overflowCount = chaosBubbles.length - CHAOS_LIMIT;
    
    if (overflowCount <= 0) return;

    // Determine how many to chain (minimum 1, maximum batch size)
    const toChainCount = Math.min(
      Math.max(1, overflowCount + AUTO_CHAIN_BATCH_SIZE), 
      AUTO_CHAIN_BATCH_SIZE
    );

    // Chain the oldest bubbles
    const bubblesToChain = chaosBubbles.slice(0, toChainCount);
    
    console.log(`🧷 Auto-chaining ${toChainCount} thoughts due to overflow`);
    
    // Chain each bubble (using freezeBubble which changes state to 'vault')
    for (const bubble of bubblesToChain) {
      freezeBubble(bubble.id);
    }

    // Show simple text notification
    toast(
      `🧷 Chained ${toChainCount} older thoughts to manage overflow`,
      {
        duration: 4000,
        style: {
          background: '#f97316',
          color: 'white',
          fontWeight: '500'
        }
      }
    );

    return toChainCount;
  };

  // Smart chaining - considers thought priority
  const executeSmartAutoChain = async () => {
    const chaosBubbles = getChaosQueueByAge();
    const overflowCount = chaosBubbles.length - CHAOS_LIMIT;
    
    if (overflowCount <= 0) return;

    // Priority scoring for thoughts (lower score = more likely to be chained)
    const scoreBubble = (bubble) => {
      let score = 0;
      
      // Recent thoughts get lower score (less likely to chain)
      const ageInHours = (Date.now() - new Date(bubble.timestamp)) / (1000 * 60 * 60);
      score += Math.min(ageInHours, 168); // Cap at 1 week
      
      // Completed checklists get lower score (less likely to chain)
      const checklistPattern = /^[\s]*-[\s]*\[[x\s]\][\s]*.+$/gim;
      const matches = bubble.text.match(checklistPattern) || [];
      const total = matches.length;
      const completed = matches.filter(match => match.includes('[x]')).length;
      
      if (total > 0) {
        const completionRate = completed / total;
        score -= completionRate * 50; // Boost priority for partially completed
      }
      
      // Important tags get lower score
      const importantTags = ['🔥', '⚡', '🎯'];
      if (importantTags.includes(bubble.tag)) {
        score -= 25;
      }
      
      // Length consideration - very short thoughts more likely to chain
      if (bubble.text.length < 20) {
        score += 10;
      }
      
      return score;
    };

    // Sort by priority score (highest score first = most likely to chain)
    const prioritizedBubbles = chaosBubbles
      .map(bubble => ({ bubble, score: scoreBubble(bubble) }))
      .sort((a, b) => b.score - a.score);

    const toChainCount = Math.min(overflowCount + AUTO_CHAIN_BATCH_SIZE, AUTO_CHAIN_BATCH_SIZE);
    const bubblesToChain = prioritizedBubbles.slice(0, toChainCount).map(item => item.bubble);
    
    console.log(`🧷 Smart auto-chaining ${toChainCount} thoughts:`, 
      bubblesToChain.map(b => ({ id: b.id, score: scoreBubble(b), preview: b.text.slice(0, 30) }))
    );
    
    // Chain the selected bubbles
    for (const bubble of bubblesToChain) {
      freezeBubble(bubble.id);
    }

    // Enhanced notification with chained thought preview - using simple string
    const chainedPreview = bubblesToChain
      .map(b => `${b.tag} ${b.text.slice(0, 20)}...`)
      .join(', ');

    const notificationText = `🧷 Auto-chained ${toChainCount} thoughts: ${chainedPreview}`;

    toast(
      notificationText,
      {
        duration: 6000,
        style: {
          background: '#f97316',
          color: 'white',
          maxWidth: '400px',
          fontSize: '14px'
        }
      }
    );

    return toChainCount;
  };

  return {
    shouldAutoChain,
    executeAutoChain,
    executeSmartAutoChain,
    getChaosQueueByAge,
    CHAOS_LIMIT
  };
};

// Utility hook for overflow management
export const useOverflowManager = () => {
  const { bubbles } = useBubbleStore();
  const { shouldAutoChain, executeSmartAutoChain } = useAutoChain();

  // Monitor chaos bubble count
  const chaosCount = bubbles.filter(b => b.state === 'chaos').length;
  const isOverflowing = chaosCount > CHAOS_LIMIT;

  // If overflowing, trigger auto-chain after a delay
  if (isOverflowing) {
    setTimeout(() => {
      executeSmartAutoChain();
    }, 1000);
  }

  return {
    shouldAutoChain: shouldAutoChain(),
    chaosCount,
    isOverflowing
  };
};

// Manual overflow management for user control
export const createOverflowManager = (bubbleStore) => {
  return {
    // Force chain specific bubbles
    chainBubbles: (bubbleIds) => {
      bubbleIds.forEach(id => {
        bubbleStore.freezeBubble(id);
      });
      
      toast.success(`🧷 Chained ${bubbleIds.length} thoughts`);
    },

    // Chain all but the newest N bubbles
    chainAllButNewest: (keepCount = 10) => {
      const chaosBubbles = bubbleStore.bubbles
        .filter(b => b.state === 'chaos')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      const toChain = chaosBubbles.slice(keepCount);
      
      toChain.forEach(bubble => {
        bubbleStore.freezeBubble(bubble.id);
      });
      
      toast.success(`🧷 Chained ${toChain.length} older thoughts, kept ${keepCount} newest`);
      return toChain.length;
    },

    // Chain by tag priority
    chainByTagPriority: (lowPriorityTags = ['💭', '📝']) => {
      const chaosBubbles = bubbleStore.bubbles
        .filter(b => b.state === 'chaos' && lowPriorityTags.includes(b.tag))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      const toChain = chaosBubbles.slice(0, AUTO_CHAIN_BATCH_SIZE);
      
      toChain.forEach(bubble => {
        bubbleStore.freezeBubble(bubble.id);
      });
      
      toast.success(`🧷 Chained ${toChain.length} low-priority thoughts`);
      return toChain.length;
    }
  };
};