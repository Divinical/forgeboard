import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ForgeEditor = ({
  editText,
  editTag,
  setEditText,
  setEditTag,
  hasChanges = false,
  onKeyDown
}) => {
  const textareaRef = useRef(null);

  // Tag options
  const tagOptions = [
    '💭', '💡', '🔥', '🔧', '📝', '⚡', '🎯'
  ];

  // Parse checklist from text
  const parseChecklist = (text) => {
    const checklistPattern = /^[\s]*-[\s]*\[[x\s]\][\s]*.+$/gim;
    const matches = text.match(checklistPattern) || [];
    return matches;
  };

  const checklistItems = parseChecklist(editText);
  const hasChecklist = checklistItems.length > 0;

  // Auto-focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Position cursor at end
      const len = editText.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Tag Selector */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {tagOptions.map((option) => (
          <button
            key={option}
            onClick={() => setEditTag(option)}
            className={`
              p-2 rounded-xl text-lg transition-all duration-300
              ${editTag === option 
                ? 'bg-orange-500/20 border border-orange-500/50 scale-110' 
                : 'bg-zinc-800/60 border border-zinc-700/50 hover:border-zinc-600 hover:scale-105'
              }
            `}
          >
            {option}
          </button>
        ))}
      </motion.div>

      {/* Main Text Editor */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Let your thoughts flow in the forge..."
          className="w-full h-full min-h-[300px] md:min-h-[400px] bg-zinc-800/80 border border-zinc-700 hover:border-orange-500/50 focus:border-orange-500 rounded-2xl p-6 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none text-lg leading-relaxed backdrop-blur-sm"
          style={{
            boxShadow: hasChanges 
              ? '0 0 20px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
          autoFocus
        />
      </motion.div>

      {/* Checklist Preview */}
      {hasChecklist && (
        <motion.div
          className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-sm font-medium text-zinc-300 mb-2">Checklist Preview:</h4>
          <div className="space-y-1">
            {checklistItems.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm text-zinc-400 font-mono">
                {item}
              </div>
            ))}
            {checklistItems.length > 3 && (
              <div className="text-xs text-zinc-500">
                +{checklistItems.length - 3} more items...
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts */}
      <motion.div
        className="text-center text-sm text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">⌘</kbd> + 
        <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs ml-1">Enter</kbd> to save • 
        <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs ml-1">Esc</kbd> to cancel
      </motion.div>
    </div>
  );
};

export default ForgeEditor;