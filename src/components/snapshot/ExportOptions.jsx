import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportOptions = ({ 
  onExport, 
  isExporting = false, 
  snapshotCount = 0, 
  disabled = false 
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Export options configuration
  const exportOptions = [
    {
      id: 'copy',
      icon: '📋',
      label: 'Copy',
      description: 'Copy to clipboard',
      shortcut: '⌘C'
    },
    {
      id: 'text',
      icon: '📄',
      label: 'Text',
      description: 'Download as .txt',
      shortcut: null
    },
    {
      id: 'json',
      icon: '⚙️',
      label: 'JSON',
      description: 'Download as .json',
      shortcut: null
    }
  ];

  // Handle export with success feedback
  const handleExport = async (format) => {
    if (disabled || isExporting) return;

    try {
      await onExport(format);
      
      // Show success message
      const messages = {
        copy: 'Copied to clipboard!',
        text: 'Text file downloaded!',
        json: 'JSON file downloaded!'
      };
      
      setSuccessMessage(messages[format] || 'Export completed!');
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setSuccessMessage('Export failed. Please try again.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Container variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Export Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-2xl"
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            📦
          </motion.span>
          <div>
            <h3 className="text-lg font-semibold text-zinc-300">
              Export Snapshots
            </h3>
            <p className="text-sm text-zinc-500">
              {snapshotCount} snapshot{snapshotCount !== 1 ? 's' : ''} ready for export
            </p>
          </div>
        </div>

        {/* Export status indicator */}
        <AnimatePresence>
          {isExporting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-xl"
            >
              <motion.div
                className="w-3 h-3 border-2 border-orange-400/30 border-t-orange-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-xs text-orange-300 font-medium">
                Exporting...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Buttons */}
      <motion.div
        className="flex flex-wrap gap-3"
        variants={containerVariants}
      >
        {exportOptions.map((option) => (
          <motion.button
            key={option.id}
            variants={buttonVariants}
            onClick={() => handleExport(option.id)}
            disabled={disabled || isExporting}
            className={`
              group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${disabled || isExporting
                ? 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 hover:border-orange-500/50 hover:text-orange-300 hover:bg-orange-500/10'
              }
            `}
            whileHover={!disabled && !isExporting ? { 
              scale: 1.02,
              transition: { duration: 0.2 }
            } : {}}
            whileTap={!disabled && !isExporting ? { 
              scale: 0.98,
              transition: { duration: 0.1 }
            } : {}}
          >
            {/* Icon */}
            <motion.span
              className="text-xl"
              animate={!disabled && !isExporting ? {
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {option.icon}
            </motion.span>

            {/* Content */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {option.label}
              </span>
              <span className="text-xs opacity-75">
                {option.description}
              </span>
            </div>

            {/* Keyboard shortcut */}
            {option.shortcut && (
              <div className="ml-auto">
                <kbd className="px-2 py-1 bg-zinc-700/50 text-zinc-400 text-xs rounded border border-zinc-600/50">
                  {option.shortcut}
                </kbd>
              </div>
            )}

            {/* Hover glow effect */}
            {!disabled && !isExporting && (
              <motion.div
                className="absolute inset-0 bg-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 20px rgba(251, 146, 60, 0.1)'
                }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-4 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-green-900/80 border border-green-500/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                >
                  ✅
                </motion.span>
                <div>
                  <p className="text-green-300 font-medium text-sm">
                    {successMessage}
                  </p>
                  <p className="text-green-400/70 text-xs">
                    Your snapshots are ready to use
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disabled state overlay */}
      {disabled && (
        <motion.div
          className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-zinc-400">
              No snapshots to export
            </p>
          </div>
        </motion.div>
      )}

      {/* Export info footer */}
      {!disabled && (
        <motion.div
          className="mt-4 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-2">
            <span className="text-sm text-blue-400 mt-0.5">ℹ️</span>
            <div className="text-xs text-zinc-400 leading-relaxed">
              <p className="mb-1">
                <strong className="text-zinc-300">Text:</strong> Simple format for notes and sharing
              </p>
              <p className="mb-1">
                <strong className="text-zinc-300">JSON:</strong> Structured data with timestamps and metadata
              </p>
              <p>
                <strong className="text-zinc-300">Copy:</strong> Quick paste into other apps
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExportOptions;