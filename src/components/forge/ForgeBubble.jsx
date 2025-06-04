import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';

const ForgeBubble = ({ 
  id,
  onDragStart,
  onDragEnd
}) => {
  // Get bubble data from store
  const { 
    getBubbleById,
    updateBubble,
    updateBubblePosition,
    toggleBubbleLock,
    updateBubbleCompletion,
    parseChecklistStatus
  } = useBubbleStore();

  const bubble = getBubbleById(id);
  if (!bubble) return null;

  // Local state - use useRef for initial edit state to avoid re-renders
  const isNewBubble = useRef(!bubble.title && !bubble.content);
  const [isEditing, setIsEditing] = useState(isNewBubble.current);
  const [editableTitle, setEditableTitle] = useState(bubble.title);
  const [editableContent, setEditableContent] = useState(bubble.content);
  const contentRef = useRef(null);

  // Auto-focus title input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      const titleInput = document.querySelector(`#bubble-${id}-title`);
      if (titleInput) titleInput.focus();
    }
  }, [isEditing, id]);

  // Update completion status when content changes
  useEffect(() => {
    if (bubble.content) {
      const { isComplete } = parseChecklistStatus(bubble.content);
      if (isComplete !== bubble.isComplete) {
        updateBubbleCompletion(id, isComplete);
      }
    }
  }, [bubble.content, id]);

  // Handle position constraints
  const constrainPosition = (info) => {
    return {
      x: Math.max(0, Math.min(info.point.x, window.innerWidth - 300)),
      y: Math.max(0, Math.min(info.point.y, window.innerHeight - 200))
    };
  };

  // Event handlers
  const handleDragStart = (event, info) => {
    if (bubble.isLocked) return;
    onDragStart?.(event, info);
  };

  const handleDragEnd = (event, info) => {
    if (bubble.isLocked) return;
    const position = constrainPosition(info);
    updateBubblePosition(id, position);
    onDragEnd?.(event, info);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    toggleBubbleLock(id);
  };

  const handleDoubleClick = () => {
    if (!bubble.isLocked) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateBubble(id, {
      title: editableTitle.trim(),
      content: editableContent.trim()
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditableTitle(bubble.title);
      setEditableContent(bubble.content);
    }
  };

  return (
    <motion.div
      drag={!bubble.isLocked && !isEditing}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        x: bubble.position.x,
        y: bubble.position.y,
        scale: isEditing ? 1.02 : 1
      }}
      whileHover={{ scale: bubble.isLocked ? 1 : 1.02 }}
      className={`
        absolute w-[300px] bg-zinc-900/90 backdrop-blur-sm 
        rounded-xl p-4 cursor-move select-none
        ${bubble.isLocked ? 'border-2 border-orange-500/50' : 'border border-zinc-700/50'}
        ${bubble.isComplete ? 'ring-2 ring-green-500/30' : ''}
        ${isEditing ? 'cursor-text shadow-xl' : ''}
      `}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      {/* Lock indicator */}
      {bubble.isLocked && (
        <div className="absolute -top-2 -right-2 bg-orange-500/90 rounded-full p-1">
          <span className="text-xs">🔒</span>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <input
            id={`bubble-${id}-title`}
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
            placeholder="Title"
          />
          <textarea
            ref={contentRef}
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-zinc-800 px-2 py-1 rounded text-sm min-h-[100px] resize-none"
            placeholder="Content (supports markdown checklists)"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditableTitle(bubble.title);
                setEditableContent(bubble.content);
              }}
              className="px-2 py-1 text-xs bg-zinc-800 rounded hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs bg-orange-500/20 rounded hover:bg-orange-500/30"
            >
              Save (Ctrl+Enter)
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-medium mb-1">{bubble.title}</h3>
          <div className="text-sm text-zinc-400 whitespace-pre-wrap">
            {bubble.content}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ForgeBubble;