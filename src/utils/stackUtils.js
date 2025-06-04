/**
 * Stack utilities for ForgeZone snap-to-stack behavior
 * Handles proximity detection, stack formation, and position management
 */

// Constants
export const STACK_PROXIMITY_THRESHOLD = 50; // pixels
export const STACK_SPACING = 140; // vertical spacing between stacked bubbles
export const STACK_REMOVE_THRESHOLD = 100; // drag distance to remove from stack

/**
 * Calculate distance between two positions (in percentage coordinates)
 * @param {Object} pos1 - {x: %, y: %}
 * @param {Object} pos2 - {x: %, y: %}
 * @param {Object} containerDimensions - {width: px, height: px}
 * @returns {number} Distance in pixels
 */
export const calculateDistance = (pos1, pos2, containerDimensions) => {
  const x1 = (pos1.x / 100) * containerDimensions.width;
  const y1 = (pos1.y / 100) * containerDimensions.height;
  const x2 = (pos2.x / 100) * containerDimensions.width;
  const y2 = (pos2.y / 100) * containerDimensions.height;
  
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Find the nearest bubble within proximity threshold
 * @param {string} draggedBubbleId - ID of the bubble being dragged
 * @param {Object} draggedPosition - {x: %, y: %}
 * @param {Object} bubblePositions - Map of bubbleId -> position
 * @param {Object} containerDimensions - {width: px, height: px}
 * @param {Set} lockedBubbles - Set of locked bubble IDs
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {Object|null} {bubbleId, distance} or null if none found
 */
export const findNearestBubble = (
  draggedBubbleId, 
  draggedPosition, 
  bubblePositions, 
  containerDimensions, 
  lockedBubbles,
  bubbleStacks
) => {
  let nearest = null;
  let minDistance = STACK_PROXIMITY_THRESHOLD;

  // Get all bubbles that are eligible for stacking
  const eligibleBubbles = Object.keys(bubblePositions).filter(bubbleId => {
    // Can't stack with self
    if (bubbleId === draggedBubbleId) return false;
    
    // Can't stack with locked bubbles
    if (lockedBubbles.has(bubbleId)) return false;
    
    // Can't stack if dragged bubble is locked
    if (lockedBubbles.has(draggedBubbleId)) return false;
    
    return true;
  });

  eligibleBubbles.forEach(bubbleId => {
    const targetPosition = bubblePositions[bubbleId];
    const distance = calculateDistance(draggedPosition, targetPosition, containerDimensions);
    
    if (distance < minDistance) {
      nearest = { bubbleId, distance };
      minDistance = distance;
    }
  });

  return nearest;
};

/**
 * Generate a unique stack ID
 * @returns {string} Unique stack identifier
 */
export const generateStackId = () => {
  return `stack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new stack from two bubbles
 * @param {string} targetBubbleId - The bubble being stacked onto
 * @param {string} draggedBubbleId - The bubble being dragged
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {Object} Updated stack configuration
 */
export const createStack = (targetBubbleId, draggedBubbleId, bubbleStacks) => {
  const newStackId = generateStackId();
  
  // Check if target bubble is already in a stack
  const existingStackId = findBubbleStack(targetBubbleId, bubbleStacks);
  
  if (existingStackId) {
    // Add to existing stack
    return {
      ...bubbleStacks,
      [existingStackId]: [...bubbleStacks[existingStackId], draggedBubbleId]
    };
  } else {
    // Create new stack with both bubbles
    return {
      ...bubbleStacks,
      [newStackId]: [targetBubbleId, draggedBubbleId]
    };
  }
};

/**
 * Find which stack contains a given bubble
 * @param {string} bubbleId - The bubble to search for
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {string|null} Stack ID or null if not in any stack
 */
export const findBubbleStack = (bubbleId, bubbleStacks) => {
  for (const [stackId, bubbles] of Object.entries(bubbleStacks)) {
    if (bubbles.includes(bubbleId)) {
      return stackId;
    }
  }
  return null;
};

/**
 * Remove a bubble from its current stack
 * @param {string} bubbleId - The bubble to remove
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {Object} Updated stack configuration
 */
export const removeBubbleFromStack = (bubbleId, bubbleStacks) => {
  const newStacks = { ...bubbleStacks };
  
  for (const [stackId, bubbles] of Object.entries(newStacks)) {
    if (bubbles.includes(bubbleId)) {
      const updatedBubbles = bubbles.filter(id => id !== bubbleId);
      
      if (updatedBubbles.length <= 1) {
        // Stack has only one bubble left, dissolve it
        delete newStacks[stackId];
      } else {
        // Update stack with remaining bubbles
        newStacks[stackId] = updatedBubbles;
      }
      
      break;
    }
  }
  
  return newStacks;
};

/**
 * Calculate the snap position for a bubble joining a stack
 * @param {string} targetBubbleId - The bubble being stacked onto
 * @param {Object} bubblePositions - Current bubble positions
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {Object} Snap position {x: %, y: %}
 */
export const calculateSnapPosition = (targetBubbleId, bubblePositions, bubbleStacks) => {
  const existingStackId = findBubbleStack(targetBubbleId, bubbleStacks);
  const targetPosition = bubblePositions[targetBubbleId];
  
  if (existingStackId) {
    // Stack already exists, position at bottom
    const stackSize = bubbleStacks[existingStackId].length;
    return {
      x: targetPosition.x,
      y: targetPosition.y + (stackSize * 15) // Slight offset for each additional bubble
    };
  } else {
    // New stack, position directly below target
    return {
      x: targetPosition.x,
      y: targetPosition.y + 15 // Standard stack spacing
    };
  }
};

/**
 * Get the position for a stack (position of the top bubble)
 * @param {string} stackId - The stack ID
 * @param {Object} bubbleStacks - Current stack configuration
 * @param {Object} bubblePositions - Current bubble positions
 * @returns {Object} Stack position {x: %, y: %}
 */
export const getStackPosition = (stackId, bubbleStacks, bubblePositions) => {
  const stack = bubbleStacks[stackId];
  if (!stack || stack.length === 0) return { x: 50, y: 50 };
  
  const topBubbleId = stack[0];
  return bubblePositions[topBubbleId] || { x: 50, y: 50 };
};

/**
 * Check if a bubble is part of any stack
 * @param {string} bubbleId - The bubble to check
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {boolean} True if bubble is in a stack
 */
export const isBubbleInStack = (bubbleId, bubbleStacks) => {
  return findBubbleStack(bubbleId, bubbleStacks) !== null;
};

/**
 * Get all bubbles that are not in any stack
 * @param {Array} allBubbles - All bubble objects
 * @param {Object} bubbleStacks - Current stack configuration
 * @returns {Array} Bubbles not in any stack
 */
export const getUnstackedBubbles = (allBubbles, bubbleStacks) => {
  const stackedBubbleIds = new Set();
  Object.values(bubbleStacks).forEach(stack => {
    stack.forEach(bubbleId => stackedBubbleIds.add(bubbleId));
  });
  
  return allBubbles.filter(bubble => !stackedBubbleIds.has(bubble.id));
};

/**
 * Validate and clean up stack configuration
 * Removes empty stacks and ensures consistency
 * @param {Object} bubbleStacks - Current stack configuration
 * @param {Array} existingBubbleIds - Array of valid bubble IDs
 * @returns {Object} Cleaned stack configuration
 */
export const cleanupStacks = (bubbleStacks, existingBubbleIds) => {
  const validBubbleIds = new Set(existingBubbleIds);
  const cleanedStacks = {};
  
  Object.entries(bubbleStacks).forEach(([stackId, bubbles]) => {
    // Filter out bubbles that no longer exist
    const validBubbles = bubbles.filter(bubbleId => validBubbleIds.has(bubbleId));
    
    // Only keep stacks with 2+ bubbles
    if (validBubbles.length >= 2) {
      cleanedStacks[stackId] = validBubbles;
    }
  });
  
  return cleanedStacks;
};