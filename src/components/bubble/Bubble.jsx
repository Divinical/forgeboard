import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';
import ChecklistScratchEffect from '../forge/ChecklistScratchEffect';
import CompletionGlowProgression from './CompletionGlowProgression';
import '../../styles/bubble.css';

// Import other modularized subcomponents
import BubbleVisual from './BubbleVisual';
import BubbleEditor from './BubbleEditor';
import BubbleActions from './BubbleActions';

const Bubble = ({ 
  id, 
  text = '', 
  tag = "💭", 
  timestamp = Date.now(),
  onClick,
  onReflect,
  state = 'chaos'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text || '');
  const [checklistStats, setChecklistStats] = useState({ total: 0, completed: 0, percentage: 0, hasChecklist: false });
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completedAt, setCompletedAt] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { 
    updateBubble, 
    burnBubble, 
    updateBubbleCompletion,
    markBubbleReadyToBurn,
    getBubbleById
  } = useBubbleStore();

  // Get bubble data to access completion fields
  const bubbleData = getBubbleById(id);

  // Add ref for the bubble element
  const bubbleRef = useRef(null);

  // CRITICAL: Setup touch event listeners with passive: false
  useEffect(() => {
    const element = bubbleRef.current;
    if (!element) return;

    const handleTouchMove = (e) => {
      if (!touchStartPos.current) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Log computed transform for debugging
      console.log('📱 Touch Move Debug:', {
        deltaX: Math.round(deltaX),
        deltaY: Math.round(deltaY),
        distance: Math.round(distance),
        isDragging,
        isDragStarted: isDragStarted.current,
        computedTransform: element.style.transform
      });
      
      if (distance > DRAG_THRESHOLD && !isDragStarted.current) {
        isDragStarted.current = true;
        setIsDragging(true);
        e.preventDefault();
        
        // Add visual feedback class
        element.classList.add('bubble-dragging');
        
        // Dispatch drag start event
        document.dispatchEvent(new CustomEvent('mobileBubbleDrag', {
          detail: {
            bubbleData: { id, text, tag, timestamp, state, isComplete },
            touch: { x: touch.clientX, y: touch.clientY }
          }
        }));
      }
      
      if (isDragStarted.current) {
        e.preventDefault();
        setDragOffset({ x: deltaX, y: deltaY });
      }
    };

    // Attach listeners with passive: false
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [id, text, tag, timestamp, state, isComplete]);

  // Event handlers
  const handleBubbleClick = (e) => {
    if (e) e.stopPropagation();
    if (!isDragging) {
      setIsExpanded(!isExpanded);
      if (onClick) onClick({ id, text: text || '', tag: tag || '💭', timestamp });
    }
  };

  const handleReflect = (e) => {
    e.stopPropagation();
    if (onReflect) {
      onReflect();
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const trimmedText = editText?.trim() || '';
    if (trimmedText !== text) {
      updateBubble(id, { text: trimmedText });
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditText(text || '');
    setIsEditing(false);
  };

  const handleBurn = (e) => {
    e.stopPropagation();
    burnBubble(id);
  };

  const handleBurnNow = () => {
    console.log('🔥 Burn Now clicked for bubble:', id);
    burnBubble(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave(e);
    }
    if (e.key === 'Escape') {
      handleCancel(e);
    }
  };

  // Parse checklist from text
  const parseChecklist = (text = '') => {
    if (!text) return { total: 0, completed: 0, percentage: 0, hasChecklist: false };
    
    const checklistPattern = /^[\s]*-[\s]*\[[x\s]\][\s]*.+$/gim;
    const matches = text.match(checklistPattern) || [];
    const total = matches.length;
    const completed = matches.filter(match => match.includes('[x]')).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage, hasChecklist: total > 0 };
  };

  // Update checklist stats when text changes
  useEffect(() => {
    const stats = parseChecklist(text);
    setChecklistStats(stats);
  }, [text]);

  // Sync completion state with store data
  useEffect(() => {
    if (bubbleData) {
      setIsComplete(bubbleData.isComplete || false);
      setCompletedAt(bubbleData.completedAt || null);
    }
  }, [bubbleData]);

  // Update editText when text prop changes
  useEffect(() => {
    setEditText(text || '');
  }, [text]);

  // Tag-based color mapping
  const getTagColors = (tag = '💭') => {
    const tagMap = {
      "💡": "from-yellow-400/20 to-amber-500/20 border-yellow-500/40 text-yellow-200",
      "🔥": "from-red-400/20 to-orange-500/20 border-red-500/40 text-red-200",
      "🔧": "from-blue-400/20 to-cyan-500/20 border-blue-500/40 text-blue-200",
      "📝": "from-purple-400/20 to-violet-500/20 border-purple-500/40 text-purple-200",
      "⚡": "from-orange-400/20 to-yellow-500/20 border-orange-500/40 text-orange-200",
      "🎯": "from-green-400/20 to-emerald-500/20 border-green-500/40 text-green-200",
      "💭": "from-zinc-400/20 to-slate-500/20 border-zinc-500/40 text-zinc-200"
    };
    return tagMap[tag] || tagMap["💭"];
  };

  // Determine if bubble should glow
  const shouldGlow = tag === "🔥" || checklistStats?.percentage === 100 || isComplete;
  const glowColor = (checklistStats?.percentage === 100 || isComplete) ? 'purple' : 'orange';
  
  // Truncate text for collapsed view
  const truncatedText = text?.length > 60 ? text.substring(0, 57) + "..." : text || '';

  // CRITICAL: HTML5 Drag Event Handlers
  const handleDragStart = (e) => {
    if (state !== 'chaos' || isEditing) {
      e.preventDefault();
      return;
    }
    
    console.log('🚀 DRAG START - Bubble:', id);
    setIsDragging(true);
    
    // CRITICAL: Set drag data that drop zones can read
    const bubbleData = { id, text, tag, timestamp, state, isComplete };
    
    try {
      e.dataTransfer.setData('application/json', JSON.stringify(bubbleData));
      e.dataTransfer.setData('text/plain', text);
      e.dataTransfer.setData('bubbleId', id);
      e.dataTransfer.effectAllowed = 'move';
      
      console.log('📦 Drag data set:', bubbleData);
    } catch (error) {
      console.error('❌ DataTransfer error:', error);
    }
    
    // Add visual feedback
    setTimeout(() => {
      e.target.style.opacity = '0.7';
      e.target.style.transform = 'scale(1.05) rotate(2deg)';
    }, 0);
  };

  const handleDragEnd = (e) => {
    console.log('🏁 DRAG END - Bubble:', id);
    setIsDragging(false);
    
    // Reset visual feedback
    e.target.style.opacity = '1';
    e.target.style.transform = 'scale(1) rotate(0deg)';
  };

  // CRITICAL: Touch handlers for mobile
  const touchStartPos = useRef(null);
  const touchStartTime = useRef(null);
  const isDragStarted = useRef(false);
  const DRAG_THRESHOLD = 3;

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();
    isDragStarted.current = false;
    setDragOffset({ x: 0, y: 0 });
    console.log('📱 Touch Start:', { 
      id,
      startX: touch.clientX,
      startY: touch.clientY
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStartPos.current) return;
    
    const touchDuration = Date.now() - touchStartTime.current;
    const touch = e.changedTouches[0];
    
    console.log('📱 Touch End:', {
      id,
      isDragStarted: isDragStarted.current,
      duration: touchDuration,
      finalX: touch.clientX,
      finalY: touch.clientY
    });
    
    if (isDragStarted.current) {
      // Dispatch drop event
      document.dispatchEvent(new CustomEvent('mobileBubbleDrop', {
        detail: {
          bubbleData: { id, text, tag, timestamp, state, isComplete },
          touch: { x: touch.clientX, y: touch.clientY }
        }
      }));
      
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    } else if (touchDuration < 300) {
      // Only trigger click if we haven't moved significantly
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < DRAG_THRESHOLD) {
        console.log('📱 Touch Click - Distance check passed:', {
          id,
          distance: Math.round(distance),
          threshold: DRAG_THRESHOLD
        });
        handleBubbleClick(e);
      }
    }
    
    touchStartPos.current = null;
    touchStartTime.current = null;
    isDragStarted.current = false;
  };

  // Handle text changes from ChecklistScratchEffect
  const handleTextChange = (newText) => {
    updateBubble(id, { text: newText });
  };

  // Handle completion state changes
  const handleCompletionStateChange = (complete) => {
    if (complete !== isComplete) {
      updateBubbleCompletion(id, complete);
      
      if (complete) {
        console.log('🎯 Bubble marked as complete:', id);
        markBubbleReadyToBurn(id);
      }
    }
  };

  // Props for subcomponents
  const bubbleProps = {
    id,
    text,
    tag,
    timestamp,
    state,
    isExpanded,
    isEditing,
    isDragging,
    checklistStats,
    shouldGlow,
    glowColor,
    truncatedText,
    getTagColors
  };

  const editorProps = {
    editText,
    setEditText,
    handleSave,
    handleCancel,
    handleKeyDown
  };

  const actionsProps = {
    handleReflect,
    handleBurn,
    state,
    isExpanded,
    shouldGlow
  };

  return (
    <div 
      ref={bubbleRef}
      id={`bubble-${id}`}
      draggable={state === 'chaos' && !isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        boxShadow: shouldGlow 
          ? `0 0 30px rgba(${glowColor === 'purple' ? '147, 51, 234' : '251, 146, 60'}, 0.4)`
          : '0 0 20px rgba(0, 0, 0, 0.2)',
        zIndex: isComplete ? 100 : (isDragging ? 1000 : 10),
        touchAction: state === 'chaos' && !isEditing ? 'none' : 'auto',
        userSelect: 'none',
        transform: isDragging 
          ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(1.1) rotate(2deg)`
          : 'translate3d(0, 0, 0) scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        willChange: 'transform',
        backgroundColor: isDragging ? 'rgba(239, 68, 68, 0.2)' : undefined
      }}
      className={`
        relative backdrop-blur-sm rounded-2xl p-4 
        min-w-[200px] max-w-[300px] group overflow-visible select-none
        ${isExpanded ? 'max-w-[400px]' : ''}
        ${state === 'chaos' && !isEditing && !isDragging ? 'cursor-grab' : ''}
        ${state === 'chaos' && !isEditing && isDragging ? 'cursor-grabbing' : ''}
        ${isEditing ? 'cursor-text' : 'cursor-pointer'}
        ${shouldGlow 
          ? `bg-gradient-to-br ${getTagColors(tag)} shadow-lg`
          : 'bg-zinc-800/80 border border-zinc-700/50 hover:border-purple-500/50'
        }
        ${isDragging ? 'bubble-dragging' : ''}
      `}
    >
      {/* Completion Glow Progression System */}
      <CompletionGlowProgression
        isComplete={isComplete}
        completedAt={completedAt}
        bubbleId={id}
        onBurnNow={handleBurnNow}
      />

      {/* Visual Effects and Overlays */}
      <BubbleVisual {...bubbleProps} />

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BubbleEditor {...editorProps} />
          </motion.div>
        ) : (
          <motion.div
            key="viewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBubbleClick}
            className="cursor-pointer"
          >
            {/* Tag and Timestamp Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {tag}
                </span>
                
                {checklistStats.hasChecklist && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300
                      ${checklistStats.percentage === 100 || isComplete
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' 
                        : 'bg-zinc-600/40 text-zinc-400'
                      }
                    `}>
                      {checklistStats.completed}/{checklistStats.total}
                    </span>
                    
                    {(checklistStats.percentage === 100 || isComplete) && (
                      <span className="text-orange-400">🔥</span>
                    )}
                  </div>
                )}
              </div>

              {timestamp && (
                <span className="text-xs text-zinc-500 font-mono opacity-60">
                  {new Date(timestamp).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="text-gray-300 text-sm leading-relaxed break-words">
              {isExpanded ? (
                <ChecklistScratchEffect
                  text={text}
                  onTextChange={handleTextChange}
                  bubbleId={id}
                  onCompletionStateChange={handleCompletionStateChange}
                />
              ) : (
                truncatedText
              )}
            </div>

            {/* Action buttons */}
            <BubbleActions {...actionsProps} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar for checklists */}
      {checklistStats.hasChecklist && checklistStats.total > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/50 overflow-hidden rounded-b-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={`h-full ${
              checklistStats.percentage === 100 || isComplete
                ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                : 'bg-gradient-to-r from-orange-500 to-yellow-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${checklistStats.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      )}

      {/* Debug info */}
      {isDragging && (
        <div className="absolute top-0 left-0 bg-black/80 text-xs text-white p-1 rounded">
          x: {Math.round(dragOffset.x)}, y: {Math.round(dragOffset.y)}
        </div>
      )}

      {/* Drag feedback overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-orange-500/20 border-2 border-orange-400/60 rounded-2xl pointer-events-none" />
      )}

      {/* Mobile drag hint */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 md:hidden">
          <div className="bg-purple-900/90 backdrop-blur-sm border border-purple-500/50 rounded-lg px-2 py-1">
            <p className="text-xs font-medium text-purple-300 whitespace-nowrap">
              Drag to zones to transfer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bubble;