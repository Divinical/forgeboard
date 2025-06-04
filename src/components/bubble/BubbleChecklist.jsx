import React from 'react';

const BubbleChecklist = ({ text, checklistStats, updateBubble, id, isEditing }) => {
  // Render checklist items with interactive checkboxes
  const renderInteractiveText = (text) => {
    if (!checklistStats.hasChecklist) {
      return <span>{text}</span>;
    }

    const lines = text.split('\n');
    return lines.map((line, index) => {
      const checklistMatch = line.match(/^([\s]*-[\s]*)\[([x\s])\]([\s]*.+)$/i);
      
      if (checklistMatch) {
        const [, prefix, checkState, content] = checklistMatch;
        const isChecked = checkState.toLowerCase() === 'x';
        
        return (
          <div key={index} className="flex items-start gap-2 my-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isEditing) {
                  const newLine = `${prefix}[${isChecked ? ' ' : 'x'}]${content}`;
                  const newText = lines.map((l, i) => i === index ? newLine : l).join('\n');
                  updateBubble(id, { text: newText });
                }
              }}
              className={`
                w-4 h-4 rounded border-2 flex items-center justify-center text-xs transition-all duration-200 flex-shrink-0 mt-0.5
                ${isChecked 
                  ? 'bg-purple-500 border-purple-500 text-white' 
                  : 'border-zinc-500 hover:border-purple-400'
                }
              `}
              disabled={isEditing}
            >
              {isChecked && '✓'}
            </button>
            <span className={`${isChecked ? 'line-through opacity-60' : ''}`}>
              {content.trim()}
            </span>
          </div>
        );
      }
      
      return <div key={index}>{line}</div>;
    });
  };

  return renderInteractiveText(text);
};

export default BubbleChecklist;