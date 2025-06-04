import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbleStore } from '../logic/useBubbleStore';

// Import modularized snapshot components
import SnapshotBubble from './SnapshotBubble';
import SnapshotEmpty from './SnapshotEmpty';
import ExportOptions from './ExportOptions';
import SnapshotTagFilter from './SnapshotTagFilter';

const SnapshotPanel = () => {
  const { bubbles } = useBubbleStore();
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Filter snapshots (burned/completed thoughts)
  const snapshots = bubbles.filter(bubble => bubble.state === 'burned');
  
  // Apply tag filtering if any tags are selected
  const filteredSnapshots = selectedTags.length > 0 
    ? snapshots.filter(snapshot => selectedTags.includes(snapshot.tag))
    : snapshots;

  // Get unique tags from all snapshots
  const availableTags = [...new Set(snapshots.map(bubble => bubble.tag))];

  // Panel variants for smooth transitions
  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Grid container variants
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  // Export handlers
  const handleExport = async (format) => {
    setIsExporting(true);
    
    try {
      switch (format) {
        case 'text':
          await exportAsText(filteredSnapshots);
          break;
        case 'json':
          await exportAsJSON(filteredSnapshots);
          break;
        case 'copy':
          await copyToClipboard(filteredSnapshots);
          break;
        default:
          console.warn('Unknown export format:', format);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export utilities
  const exportAsText = (snapshots) => {
    const content = snapshots.map(snapshot => 
      `${snapshot.tag} ${snapshot.text}\n---\nCompleted: ${new Date(snapshot.timestamp).toLocaleDateString()}\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forgeboard-snapshots-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = (snapshots) => {
    const data = {
      export_date: new Date().toISOString(),
      total_snapshots: snapshots.length,
      snapshots: snapshots.map(snapshot => ({
        id: snapshot.id,
        text: snapshot.text,
        tag: snapshot.tag,
        completed_at: snapshot.timestamp,
        created_at: snapshot.createdAt || snapshot.timestamp
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forgeboard-snapshots-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (snapshots) => {
    const content = snapshots.map(snapshot => 
      `${snapshot.tag} ${snapshot.text}`
    ).join('\n\n');
    
    await navigator.clipboard.writeText(content);
    
    // Could add toast notification here
    console.log('Snapshots copied to clipboard');
  };

  // Tag filter handlers
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-4 sm:p-6"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Panel Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.span
            className="text-4xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            📸
          </motion.span>
          <h2 className="text-3xl lg:text-4xl font-bold text-orange-300">
            Thought Snapshots
          </h2>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-zinc-400 italic max-w-2xl mx-auto"
        >
          Preserved moments of completed thoughts, ready for reflection
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent mt-6"
        />
      </motion.div>

      {/* Export Options - Top Position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-6"
      >
        <ExportOptions 
          onExport={handleExport}
          isExporting={isExporting}
          snapshotCount={filteredSnapshots.length}
          disabled={snapshots.length === 0}
        />
      </motion.div>

      {/* Tag Filter */}
      {availableTags.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <SnapshotTagFilter 
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
          />
        </motion.div>
      )}

      {/* Snapshot Count Badge */}
      {snapshots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-800/60 border border-orange-600/50 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-sm text-orange-300 font-medium">
              {filteredSnapshots.length} snapshot{filteredSnapshots.length === 1 ? '' : 's'}
              {selectedTags.length > 0 && ` filtered`}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {snapshots.length === 0 ? (
          <motion.div key="empty">
            <SnapshotEmpty />
          </motion.div>
        ) : (
          <motion.div
            key="snapshots"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredSnapshots.map((snapshot, index) => (
              <SnapshotBubble 
                key={snapshot.id}
                snapshot={snapshot}
                index={index}
              />
            ))}
            
            {/* No results after filtering */}
            {filteredSnapshots.length === 0 && selectedTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-zinc-400 mb-2">
                  No snapshots match your filters
                </h3>
                <p className="text-zinc-500 mb-4">
                  Try different tags or clear filters to see all snapshots
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 rounded-xl text-sm font-medium transition-all duration-300"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Stats */}
      {snapshots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mt-8"
        >
          <div className="text-xs text-zinc-500 font-mono bg-zinc-800/30 px-4 py-2 rounded-full border border-zinc-700/30">
            Total completed thoughts: {snapshots.length}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SnapshotPanel;