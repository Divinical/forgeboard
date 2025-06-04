import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';

const BurnArchive = () => {
  const { bubbles } = useBubbleStore();
  const [sortBy, setSortBy] = useState('date'); // date, tag, length
  const [filterTag, setFilterTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Filter burned bubbles (completed thoughts)
  const burnedBubbles = bubbles.filter(bubble => bubble.state === 'burned');

  // Get unique tags for filtering
  const availableTags = useMemo(() => {
    const tags = [...new Set(burnedBubbles.map(b => b.tag))];
    return ['all', ...tags];
  }, [burnedBubbles]);

  // Apply filters and sorting
  const filteredAndSortedBubbles = useMemo(() => {
    let filtered = [...burnedBubbles];

    // Apply tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(bubble => bubble.tag === filterTag);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bubble => 
        bubble.text.toLowerCase().includes(term) ||
        bubble.tag.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.burnedAt || b.timestamp) - new Date(a.burnedAt || a.timestamp);
        case 'tag':
          return (a.tag || '').localeCompare(b.tag || '');
        case 'length':
          return (b.text || '').length - (a.text || '').length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [burnedBubbles, filterTag, searchTerm, sortBy]);

  // Export functions
  const exportAsImage = async (bubble) => {
    // Create a temporary canvas element for rendering
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 300;
    
    // Dark background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#fb923060';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Tag
    ctx.fillStyle = '#fb9234';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(bubble.tag, 30, 50);
    
    // Text content
    ctx.fillStyle = '#e4e4e7';
    ctx.font = '14px Arial';
    const lines = wrapText(ctx, bubble.text, 30, 350);
    lines.forEach((line, i) => {
      ctx.fillText(line, 30, 80 + (i * 20));
    });
    
    // Date
    ctx.fillStyle = '#71717a';
    ctx.font = '12px Arial';
    const date = new Date(bubble.burnedAt || bubble.timestamp).toLocaleDateString();
    ctx.fillText(`Completed: ${date}`, 30, canvas.height - 30);
    
    // Download
    const link = document.createElement('a');
    link.download = `forgeboard-${bubble.id}-${date}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportAllAsJSON = async () => {
    setIsExporting(true);
    try {
      const data = {
        export_date: new Date().toISOString(),
        total_burned: burnedBubbles.length,
        archive: burnedBubbles.map(bubble => ({
          id: bubble.id,
          text: bubble.text,
          tag: bubble.tag,
          created_at: bubble.createdAt || bubble.timestamp,
          burned_at: bubble.burnedAt || bubble.timestamp,
          completion_method: 'ritual_burn'
        }))
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forgeboard-archive-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper function for text wrapping
  const wrapText = (context, text, x, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines.slice(0, 8); // Limit to 8 lines
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-4 sm:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.span
            className="text-4xl"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🪦
          </motion.span>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-300">
            Burn Archive
          </h2>
        </div>
        
        <motion.p
          className="text-lg text-zinc-400 italic max-w-2xl mx-auto mb-6"
        >
          Sacred record of completed thoughts, forever preserved in digital stone
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"
        />
      </motion.div>

      {/* Controls */}
      <motion.div
        className="mb-8 space-y-4"
        variants={itemVariants}
      >
        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search burned thoughts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-700 hover:border-zinc-600 focus:border-orange-500 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none transition-all duration-300"
            />
          </div>
          
          <button
            onClick={exportAllAsJSON}
            disabled={isExporting || burnedBubbles.length === 0}
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : `Export All (${burnedBubbles.length})`}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-800/60 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="date">Sort by Date</option>
            <option value="tag">Sort by Tag</option>
            <option value="length">Sort by Length</option>
          </select>
          
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="bg-zinc-800/60 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          >
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : `${tag} Tag`}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      {burnedBubbles.length > 0 && (
        <motion.div
          className="mb-6 p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              {filteredAndSortedBubbles.length} of {burnedBubbles.length} thoughts archived
            </span>
            <span className="text-zinc-500">
              Total ritual completions: {burnedBubbles.length}
            </span>
          </div>
        </motion.div>
      )}

      {/* Archive Grid */}
      <AnimatePresence mode="popLayout">
        {filteredAndSortedBubbles.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {burnedBubbles.length === 0 ? (
              <>
                <motion.div
                  className="text-6xl mb-6"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🔥
                </motion.div>
                <h3 className="text-2xl font-bold text-zinc-400 mb-4">
                  No thoughts burned yet
                </h3>
                <p className="text-zinc-500 leading-relaxed max-w-md mx-auto">
                  Complete thoughts by dragging them to the flame zone. 
                  They'll appear here as permanent records of your progress.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-zinc-400 mb-2">
                  No matches found
                </h3>
                <p className="text-zinc-500">
                  Try different filters or search terms
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {filteredAndSortedBubbles.map((bubble, index) => (
              <ArchiveBubble
                key={bubble.id}
                bubble={bubble}
                index={index}
                onExportImage={() => exportAsImage(bubble)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Archive Bubble Component
const ArchiveBubble = ({ bubble, index, onExportImage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedText = bubble.text.length > 120 ? 
    bubble.text.substring(0, 117) + "..." : 
    bubble.text;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDate(bubble.burnedAt || bubble.timestamp);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative"
    >
      <div className="bg-zinc-800/60 border border-zinc-700/50 hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.02)'
        }}
      >
        {/* Archive Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-orange-900/40 border border-orange-600/40 rounded-full px-2 py-1">
            <span className="text-xs text-orange-400 font-medium">🔥 Burned</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.span
            className="text-2xl"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {bubble.tag}
          </motion.span>
          <div className="text-xs text-zinc-500 font-mono">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>

        {/* Content */}
        <div className="text-zinc-300 text-sm leading-relaxed mb-4">
          {isExpanded ? bubble.text : truncatedText}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExportImage();
            }}
            className="text-xs bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 px-3 py-1 rounded-lg transition-all duration-300"
          >
            📷 Export Image
          </button>
          
          <span className="text-xs text-zinc-500">
            {bubble.text.length} chars
          </span>
        </div>

        {/* Eternal flame indicator */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default BurnArchive;