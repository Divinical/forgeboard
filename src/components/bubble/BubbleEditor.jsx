import React from 'react';
import { motion } from 'framer-motion';

const BubbleEditor = ({ editText, setEditText, handleSave, handleCancel, handleKeyDown }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-zinc-900/80 border border-zinc-600 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
        rows={Math.max(3, editText.split('\n').length)}
        placeholder="Edit your thought..."
        autoFocus
      />
      
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-zinc-600 hover:bg-zinc-500 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        <kbd className="px-1 py-0.5 bg-zinc-800 rounded">⌘</kbd> + 
        <kbd className="px-1 py-0.5 bg-zinc-800 rounded ml-1">Enter</kbd> to save
      </div>
    </motion.div>
  );
};

export default BubbleEditor;