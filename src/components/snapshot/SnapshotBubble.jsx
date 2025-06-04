import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SnapshotBubble = ({ snapshot, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse checklist from text if it exists
  const parseChecklist = (text) => {
    const checklistPattern = /^[\s]*-[\s]*\[[x\s]\][\s]*.+$/gim;
    const matches = text.match(checklistPattern) || [];
    const total = matches.length;
    const completed = matches.filter(match => match.includes('[x]')).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage, hasChecklist: total > 0, items: matches };
  };

  const checklistStats = parseChecklist(snapshot.text);

  // Tag-based color mapping
  const getTagColors = (tag) => {
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

  // Truncate text for collapsed view
  const truncatedText = snapshot.text.length > 120 ? 
    snapshot.text.substring(0, 117) + "..." : 
    snapshot.text;

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Bubble animation variants
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Content rendering for expanded view
  const renderExpandedContent = () => {
    if (!checklistStats.hasChecklist) {
      return (
        <div className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
          {snapshot.text}
        </div>
      );
    }

    // Render checklist items
    const lines = snapshot.text.split('\n');
    return lines.map((line, lineIndex) => {
      const checklistMatch = line.match(/^([\s]*-[\s]*)\[([x\s])\]([\s]*.+)$/i);
      
      if (checklistMatch) {
        const [, prefix, checkState, content] = checklistMatch;
        const isChecked = checkState.toLowerCase() === 'x';
        
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-1">
            <div
              className={`
                w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 mt-0.5
                ${isChecked 
                  ? 'bg-orange-500 border-orange-500 text-white' 
                  : 'border-zinc-500'
                }
              `}
            >
              {isChecked && '✓'}
            </div>
            <span className={`text-gray-300 text-sm ${isChecked ? 'line-through opacity-60' : ''}`}>
              {content.trim()}
            </span>
          </div>
        );
      }
      
      return (
        <div key={lineIndex} className="text-gray-300 text-sm leading-relaxed">
          {line}
        </div>
      );
    });
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <motion.div
        className={`
          relative backdrop-blur-sm rounded-2xl p-4 sm:p-6 transition-all duration-300 
          cursor-pointer overflow-hidden bg-gradient-to-br ${getTagColors(snapshot.tag)}
        `}
        style={{
          boxShadow: '0 0 30px rgba(251, 146, 60, 0.15), 0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.99,
          transition: { duration: 0.1 }
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{
          height: isExpanded ? 'auto' : 'auto',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Completion glow overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl pointer-events-none"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Header with tag and timestamp */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <motion.span 
              className="text-xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {snapshot.tag}
            </motion.span>
            
            {checklistStats.hasChecklist && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                  {checklistStats.completed}/{checklistStats.total} completed
                </span>
                {checklistStats.percentage === 100 && (
                  <motion.span
                    className="text-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">
              {formatTimestamp(snapshot.timestamp)}
            </span>
            <motion.div
              className="w-2 h-2 bg-orange-500 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="relative z-10">
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderExpandedContent()}
            </motion.div>
          ) : (
            <div className="text-gray-300 text-sm leading-relaxed break-words">
              {truncatedText}
            </div>
          )}
        </div>

        {/* Progress bar for completed checklists */}
        {checklistStats.hasChecklist && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/50 overflow-hidden rounded-b-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${checklistStats.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
            
            {/* Completion sparkle */}
            {checklistStats.percentage === 100 && (
              <motion.div
                className="absolute inset-0 bg-green-400/30"
                animate={{
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        )}

        {/* Expand indicator */}
        {snapshot.text.length > 120 && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none">
            <motion.div
              className="text-xs text-zinc-400"
              animate={isExpanded ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? '▲' : '▼'}
            </motion.div>
          </div>
        )}

        {/* Completion badge */}
        <div className="absolute top-3 right-3 opacity-60">
          <div className="bg-orange-500/20 border border-orange-500/40 rounded-full px-2 py-1">
            <span className="text-xs text-orange-400 font-medium">✓ Complete</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SnapshotBubble;