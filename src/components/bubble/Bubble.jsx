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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
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

  // Refs for touch and mouse tracking
  const touchStartPos = useRef(null);
  const touchStartTime = useRef(null);
  const mouseStartPos = useRef(null);
  const isDragStarted = useRef(false);
  const DRAG_THRESHOLD = 3;

  // Track window mouse events
  useEffect(() => {
    if (!isDragging || !mouseStartPos.current) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - mouseStartPos.current.x;
      const deltaY = e.clientY - mouseStartPos.current.y;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = (e) => {
  // Update position safely with latest values
  setPosition(prev => ({
    x: prev.x + dragOffset.x,
    y: prev.y + dragOffset.y
  }));

  // Reset drag state
  setIsDragging(false);
  setDragOffset({ x: 0, y: 0 });
  mouseStartPos.current = null;
  isDragStarted.current = false;

  // Remove dragging visual
  if (bubbleRef.current) {
    bubbleRef.current.classList.remove('bubble-dragging');
  }
};


    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (state !== 'chaos' || isEditing) return;

    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();
    isDragStarted.current = false;
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchMove = (e) => {
    if (!touchStartPos.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.current.x;
    const deltaY = touch.clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > DRAG_THRESHOLD && !isDragStarted.current) {
      isDragStarted.current = true;
      setIsDragging(true);
      e.preventDefault();
      
      if (bubbleRef.current) {
        bubbleRef.current.classList.add('bubble-dragging');
      }
    }
    
    if (isDragStarted.current) {
      e.preventDefault();
      setDragOffset({ x: deltaX, y: deltaY });
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartPos.current) return;
    
    const touchDuration = Date.now() - touchStartTime.current;
    const touch = e.changedTouches[0];
    
    if (isDragStarted.current) {
      // Update permanent position by adding drag offset
      setPosition(prev => ({
        x: prev.x + dragOffset.x,
        y: prev.y + dragOffset.y
      }));
      
      // Reset drag state
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      
      if (bubbleRef.current) {
        bubbleRef.current.classList.remove('bubble-dragging');
      }
    } else if (touchDuration < 300) {
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < DRAG_THRESHOLD) {
        handleBubbleClick(e);
      }
    }
    
    touchStartPos.current = null;
    touchStartTime.current = null;
    isDragStarted.current = false;
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    if (state !== 'chaos' || isEditing) return;
    
    e.preventDefault();
    
    mouseStartPos.current = { x: e.clientX, y: e.clientY };
    isDragStarted.current = true;
    setIsDragging(true);

    if (bubbleRef.current) {
      bubbleRef.current.classList.add('bubble-dragging');
    }
  };

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

  // Attach touch move with passive: false
  useEffect(() => {
    const element = bubbleRef.current;
    if (!element) return;

    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => element.removeEventListener('touchmove', handleTouchMove);
  }, []);

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
      draggable={false}
      onMouseDown={handleMouseDown}
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
        transform: `translate3d(${position.x + dragOffset.x}px, ${position.y + dragOffset.y}px, 0) scale(${isDragging ? 1.1 : 1}) rotate(${isDragging ? 2 : 0}deg)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        willChange: 'transform',
        backgroundColor: isDragging ? 'rgba(239, 68, 68, 0.2)' : undefined,
        cursor: state === 'chaos' && !isEditing 
          ? (isDragging ? 'grabbing' : 'grab') 
          : (isEditing ? 'text' : 'pointer')
      }}
      className={`
        relative backdrop-blur-sm rounded-2xl p-4 
        min-w-[200px] max-w-[300px] group overflow-visible select-none
        ${isExpanded ? 'max-w-[400px]' : ''}
        ${isEditing ? 'cursor-text' : 'cursor-pointer'}
        ${shouldGlow 
          ? `bg-gradient-to-br ${getTagColors(tag)} shadow-lg`
          : 'bg-zinc-800/80 border border-zinc-700/50 hover:border-purple-500/50'
        }
        ${isDragging ? 'bubble-dragging' : ''}
      `}
    >
      {/* ... rest of the component remains the same ... */}
    </div>
  );
};

export default Bubble;