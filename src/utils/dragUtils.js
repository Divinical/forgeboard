/**
 * Shared drag utilities for ForgeBoard components
 * Handles both desktop and mobile drag operations
 */

// Unified function to get coordinates from event (mouse or touch)
export const getEventCoordinates = (e) => {
    // Handle touch events
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    
    // Handle changedTouches (for touchend events)
    if (e.changedTouches && e.changedTouches[0]) {
      return {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    }
    
    // Handle mouse events
    if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      return {
        x: e.clientX,
        y: e.clientY
      };
    }
    
    console.warn('⚠️ Could not extract coordinates from event:', e);
    return null;
  };
  
  // Enhanced point detection with more generous boundaries
  export const isPointInFlameZone = (clientX, clientY, dropZoneRef) => {
    if (!dropZoneRef.current || typeof clientX !== 'number' || typeof clientY !== 'number') {
      console.warn('⚠️ Invalid coordinates for flame zone check:', { clientX, clientY });
      return false;
    }
    
    const rect = dropZoneRef.current.getBoundingClientRect();
    const padding = 40; // More generous padding for mobile
    
    const isInZone = (
      clientX >= rect.left - padding &&
      clientX <= rect.right + padding &&
      clientY >= rect.top - padding &&
      clientY <= rect.bottom + padding
    );
    
    console.log('🎯 Flame zone check:', {
      touch: { x: clientX, y: clientY },
      zone: { 
        left: rect.left - padding, 
        right: rect.right + padding,
        top: rect.top - padding, 
        bottom: rect.bottom + padding
      },
      isInZone
    });
    
    return isInZone;
  };
  
  // Apply visual feedback during drag
  export const applyDragFeedback = (element, isDragging = true) => {
    if (!element) return;
    
    if (isDragging) {
      element.style.opacity = '0.7';
      element.style.transform = 'scale(1.05) rotate(3deg)';
      element.style.filter = 'drop-shadow(0 0 25px rgba(251, 146, 60, 0.7))';
      element.style.zIndex = '1000';
    } else {
      element.style.opacity = '1';
      element.style.transform = 'scale(1) rotate(0deg)';
      element.style.filter = 'none';
      element.style.zIndex = 'auto';
    }
  };
  
  // Apply mobile-specific drag feedback
  export const applyMobileDragFeedback = (element, isDragging = true) => {
    if (!element) return;
    
    if (isDragging) {
      element.style.opacity = '0.8';
      element.style.transform = 'scale(1.1) rotate(2deg)';
      element.style.filter = 'drop-shadow(0 0 20px rgba(251, 146, 60, 0.6))';
      element.style.zIndex = '1000';
      element.style.pointerEvents = 'none'; // Prevent interference with drop detection
    } else {
      element.style.opacity = '1';
      element.style.transform = 'scale(1) rotate(0deg)';
      element.style.filter = 'none';
      element.style.zIndex = 'auto';
      element.style.pointerEvents = 'auto';
    }
  };
  
  // Setup flame drag handlers for FlameZone
  export const setupFlameDragHandlers = ({
    processBubbleBurn,
    getBubbleById,
    setIsDragOver,
    setActiveDraggedBubble,
    isDragOver
  }) => {
    let currentDraggedBubble = null;
    let isDragging = false;
    let lastKnownPosition = null;
    let dragStartTime = null;
  
    // More robust touch position tracking
    const handleGlobalTouchMove = (e) => {
      if (!isDragging || !currentDraggedBubble) return;
      
      const coordinates = getEventCoordinates(e);
      if (!coordinates) {
        console.warn('⚠️ Could not get coordinates from touchmove event');
        return;
      }
      
      // Always update last known position
      lastKnownPosition = coordinates;
      
      // Check flame zone collision - this needs to be passed in or modified
      // For now, we'll skip the flame zone check here and do it in the component
      // const isOverFlame = isPointInFlameZone(coordinates.x, coordinates.y, dropZoneRef);
      
      // Update drag over state would be handled in component
    };
  
    const handleGlobalTouchEnd = (e) => {
      console.log('📱 Touch end - isDragging:', isDragging, 'bubble:', !!currentDraggedBubble);
      
      if (!isDragging || !currentDraggedBubble) {
        console.log('📱 No active drag or bubble, cleaning up');
        // Reset all state
        isDragging = false;
        currentDraggedBubble = null;
        lastKnownPosition = null;
        dragStartTime = null;
        setIsDragOver(false);
        setActiveDraggedBubble(null);
        return;
      }
      
      // Get final touch position from multiple sources
      let finalPosition = getEventCoordinates(e) || lastKnownPosition;
      
      if (!finalPosition) {
        console.error('❌ No final position available for drop detection');
        // Reset state
        isDragging = false;
        currentDraggedBubble = null;
        lastKnownPosition = null;
        dragStartTime = null;
        setIsDragOver(false);
        setActiveDraggedBubble(null);
        return;
      }
      
      console.log('📱 Final position:', finalPosition);
      
      // Flame zone check would need to be passed in or done in component
      // const isOverFlame = isPointInFlameZone(finalPosition.x, finalPosition.y, dropZoneRef);
      
      // Verify this was actually a drag (not just a tap)
      const dragDuration = dragStartTime ? Date.now() - dragStartTime : 0;
      const isDragGesture = dragDuration > 150; // Must drag for at least 150ms
      
      console.log('📱 Drag verification:', { dragDuration, isDragGesture });
      
      // For now, we'll handle this in the component since we need dropZoneRef access
      // if (isOverFlame && isDragGesture && currentDraggedBubble) {
      //   console.log('🔥 Mobile drop confirmed - burning bubble:', currentDraggedBubble.id);
      //   processBubbleBurn(currentDraggedBubble, finalPosition);
      // }
      
      // Always reset state after processing
      isDragging = false;
      currentDraggedBubble = null;
      lastKnownPosition = null;
      dragStartTime = null;
      setIsDragOver(false);
      setActiveDraggedBubble(null);
    };
  
    // Handle custom bubble drag events
    const handleBubbleDragStart = (e) => {
      const bubbleData = e.detail;
      console.log('📱 Mobile bubble drag started:', bubbleData.id);
      
      currentDraggedBubble = bubbleData;
      isDragging = true;
      lastKnownPosition = null;
      dragStartTime = Date.now();
      setActiveDraggedBubble(bubbleData);
      
      // Prevent page scroll during drag
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    };
  
    const handleBubbleDragEnd = (e) => {
      console.log('📱 Bubble drag end event received');
      
      // Clean up body styles but don't reset drag state yet
      // Let the touchend handler process the drop
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  
    // Add event listeners with proper options
    document.addEventListener('touchmove', handleGlobalTouchMove, { 
      passive: true, 
      capture: false 
    });
    document.addEventListener('touchend', handleGlobalTouchEnd, { 
      passive: false, 
      capture: false 
    });
    document.addEventListener('bubbleDragStart', handleBubbleDragStart);
    document.addEventListener('bubbleDragEnd', handleBubbleDragEnd);
  
    // Return cleanup function
    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('bubbleDragStart', handleBubbleDragStart);
      document.removeEventListener('bubbleDragEnd', handleBubbleDragEnd);
      
      // Cleanup body styles
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  };
  
  // Desktop drag handlers for FlameZone
  export const createDesktopDragHandlers = (setIsDragOver, processBubbleBurn, getBubbleById) => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      console.log('🖥️ Desktop drag enter FlameZone');
      setIsDragOver(true);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    };
  
    const handleDragLeave = (e, dropZoneRef) => {
      e.preventDefault();
      if (!dropZoneRef.current?.contains(e.relatedTarget)) {
        console.log('🖥️ Desktop drag leave FlameZone');
        setIsDragOver(false);
      }
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      
      console.log('🖥️ Desktop drop event triggered on FlameZone');
      
      try {
        // Try multiple data transfer formats
        const bubbleId = e.dataTransfer.getData('bubbleId') || 
                         e.dataTransfer.getData('application/x-bubble-id');
        const bubbleData = e.dataTransfer.getData('text/plain');
        
        console.log('🖥️ Extracted data:', { bubbleId, bubbleData });
        
        if (!bubbleId && !bubbleData) {
          console.warn('❌ No bubble data found in drop event');
          return;
        }
        
        // Parse bubble data
        let parsedBubbleData = null;
        try {
          parsedBubbleData = JSON.parse(bubbleData);
        } catch (parseError) {
          console.warn('⚠️ Could not parse bubble data, using ID only:', parseError);
          if (bubbleId) {
            // Try to get bubble from store
            const bubbleFromStore = getBubbleById(bubbleId);
            if (bubbleFromStore) {
              parsedBubbleData = bubbleFromStore;
            } else {
              parsedBubbleData = { id: bubbleId, text: 'Unknown thought', tag: '💭' };
            }
          } else {
            return;
          }
        }
        
        const coordinates = getEventCoordinates(e);
        processBubbleBurn(parsedBubbleData, coordinates);
        
      } catch (error) {
        console.error('❌ Failed to process dropped bubble:', error);
      }
    };
  
    return {
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop
    };
  };