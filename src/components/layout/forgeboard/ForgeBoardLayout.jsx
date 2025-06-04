import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChaosRealm from '../../chaos/ChaosRealm.jsx';
import ForgeZone from '../../forge/ForgeZone.jsx';
import FlameZone from '../../flame/FlameZone.jsx';
import SnapshotOverlay from '../../snapshot/SnapshotOverlay.jsx';
import { useBubbleStore } from '../../logic/useBubbleStore';
import { useOverflowManager } from '../../../utils/autoChainSystem';

// Import minimal layout components
import LayoutBackground from './LayoutBackground';

const ForgeBoardLayout = () => {
  const { bubbles, showSnapshotOverlay, setShowSnapshotOverlay } = useBubbleStore();
  
  // Initialize overflow management system
  const { isOverflowing, chaosCount } = useOverflowManager();

  // Show snapshot overlay on initial mount for new users
  useEffect(() => {
    if (bubbles.length === 0 && !showSnapshotOverlay) {
      setTimeout(() => {
        setShowSnapshotOverlay(true);
      }, 1000);
    }
  }, [bubbles.length, showSnapshotOverlay, setShowSnapshotOverlay]);

  // Filter bubbles by state
  const chaosBubbles = bubbles.filter(b => b.state === 'chaos');
  const vaultBubbles = bubbles.filter(b => b.state === 'vault'); // chained
  const forgeBubbles = bubbles.filter(b => b.state === 'forge');
  const burnedBubbles = bubbles.filter(b => b.state === 'burned');

  // Refs for smooth scrolling between sections
  const chaosRef = React.useRef(null);
  const forgeRef = React.useRef(null);
  const flameRef = React.useRef(null);

  // Scroll navigation functions
  const scrollToForge = () => {
    forgeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToFlame = () => {
    flameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Floating action button to open capture overlay
  const FloatingCaptureButton = () => (
    <motion.button
      onClick={() => setShowSnapshotOverlay(true)}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white p-3 sm:p-4 rounded-full shadow-2xl"
      style={{
        boxShadow: '0 0 30px rgba(251, 146, 60, 0.4)'
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 40px rgba(251, 146, 60, 0.6)'
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 30px rgba(251, 146, 60, 0.4)',
          '0 0 40px rgba(251, 146, 60, 0.6)',
          '0 0 30px rgba(251, 146, 60, 0.4)'
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.span
        className="text-base sm:text-xl"
        animate={{
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        📸
      </motion.span>
    </motion.button>
  );

  // Status bar with system info
  const StatusBar = () => (
    <motion.div
      className="fixed top-4 left-4 z-40 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/60 rounded-xl px-3 sm:px-4 py-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
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
          <span className="text-zinc-400 font-mono">
            {chaosBubbles.length} chaos
          </span>
        </div>

        {vaultBubbles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 hidden sm:inline">•</span>
            <span className="text-orange-400 font-mono">
              {vaultBubbles.length} chained
            </span>
          </div>
        )}

        {burnedBubbles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 hidden sm:inline">•</span>
            <span className="text-zinc-400 font-mono">
              {burnedBubbles.length} burned
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative w-full max-w-screen overflow-x-hidden">
      {/* Global Background Effects */}
      <LayoutBackground 
        activeTab="chaos" // Always show chaos-style background
        intensity={0.6}
      />

      {/* Snapshot Overlay - Global */}
      <SnapshotOverlay />

      {/* Status Bar */}
      <StatusBar />

      {/* Floating Capture Button */}
      <FloatingCaptureButton />

      {/* Main Vertical Flow - Single Scrollable Container */}
      <div className="relative z-10 min-h-screen w-full max-w-screen overflow-x-hidden">
        
        {/* Section 1: Chaos Realm - Top Section */}
        <motion.section
          ref={chaosRef}
          id="chaos-realm"
          className="min-h-screen relative w-full max-w-screen overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background: 'radial-gradient(ellipse at top center, rgba(147, 51, 234, 0.08) 0%, rgba(39, 39, 42, 0.95) 60%, rgb(24, 24, 27) 100%)'
          }}
        >
          {/* Chaos Realm Header */}
          <motion.div
            className="relative z-20 text-center pt-16 sm:pt-20 pb-6 sm:pb-8 px-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <motion.span
                className="text-3xl sm:text-4xl lg:text-5xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌀
              </motion.span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-300">
                Chaos Realm
              </h1>
            </div>
            
            <p className="text-base sm:text-lg text-zinc-400 italic max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
              Where raw thoughts swirl in beautiful disorder, waiting to be forged
            </p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent max-w-lg mx-auto"
            />
          </motion.div>

          <div className="absolute inset-0 pt-24 sm:pt-32 w-full max-w-screen overflow-x-hidden">
            <ChaosRealm 
              bubbles={chaosBubbles}
              onBubbleClick={(bubble) => console.log('Bubble clicked:', bubble)}
            />
          </div>

          {/* Scroll to Forge Button */}
          <motion.button
            onClick={scrollToForge}
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold shadow-2xl border border-orange-500/30"
            style={{
              boxShadow: '0 0 30px rgba(251, 146, 60, 0.4)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 40px rgba(251, 146, 60, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -3, 0],
              boxShadow: [
                '0 0 30px rgba(251, 146, 60, 0.4)',
                '0 0 40px rgba(251, 146, 60, 0.6)',
                '0 0 30px rgba(251, 146, 60, 0.4)'
              ]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                className="text-base sm:text-xl"
                animate={{
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧱
              </motion.span>
              <span className="text-sm sm:text-base">Enter the Forge</span>
              <motion.span
                className="text-sm sm:text-base"
                animate={{
                  y: [0, 2, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ↓
              </motion.span>
            </div>
          </motion.button>

          {/* Section Divider - Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent pointer-events-none" />
        </motion.section>

        {/* Section 2: Forge Zone - Middle Section */}
        <motion.section
          ref={forgeRef}
          id="forge-zone"
          className="min-h-screen relative w-full max-w-screen overflow-x-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.12) 0%, rgba(39, 39, 42, 0.98) 50%, rgb(24, 24, 27) 100%)'
          }}
        >
          {/* Forge Zone Header */}
          <motion.div
            className="relative z-20 text-center pt-16 sm:pt-20 pb-6 sm:pb-8 px-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <motion.span
                className="text-3xl sm:text-4xl lg:text-5xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧱
              </motion.span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-orange-300">
                The Forge
              </h2>
            </div>
            
            <p className="text-base sm:text-lg text-zinc-400 italic max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
              Shape, stack, and position your thoughts with precision and intention
            </p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent max-w-lg mx-auto"
            />
          </motion.div>

          <div className="relative z-10 pt-16 w-full max-w-screen overflow-x-hidden">
            <ForgeZone />
          </div>

          {/* Scroll to Flame Button */}
          <motion.button
            onClick={scrollToFlame}
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold shadow-2xl border border-red-500/30"
            style={{
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -3, 0],
              boxShadow: [
                '0 0 30px rgba(239, 68, 68, 0.4)',
                '0 0 40px rgba(239, 68, 68, 0.6)',
                '0 0 30px rgba(239, 68, 68, 0.4)'
              ]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                className="text-base sm:text-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔥
              </motion.span>
              <span className="text-sm sm:text-base">Sacred Flame</span>
              <motion.span
                className="text-sm sm:text-base"
                animate={{
                  y: [0, 2, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ↓
              </motion.span>
            </div>
          </motion.button>

          {/* Section Divider */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-transparent pointer-events-none" />
        </motion.section>

        {/* Section 3: Flame Zone - Bottom Section */}
        <motion.section
          ref={flameRef}
          id="burn-zone"
          className="relative pb-16 w-full max-w-screen overflow-x-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            background: 'radial-gradient(ellipse at bottom center, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 30%, rgba(39, 39, 42, 0.98) 60%, rgb(24, 24, 27) 100%)',
            minHeight: '100vh'
          }}
        >
          {/* Flame Zone Header */}
          <motion.div
            className="relative z-10 text-center pt-16 sm:pt-20 pb-12 sm:pb-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.span
                className="text-4xl sm:text-5xl lg:text-6xl"
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔥
              </motion.span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-red-300">
                Sacred Flame
              </h2>
            </div>
            
            <p className="text-lg sm:text-xl text-zinc-400 italic max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Where completed thoughts are transformed into eternal wisdom through ritual fire
            </p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 1 }}
              className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent max-w-2xl mx-auto"
            />
          </motion.div>

          {/* Flame Zone Component */}
          <div className="relative z-10 min-h-[60vh] flex items-center justify-center w-full max-w-screen overflow-x-hidden">
            <FlameZone />
          </div>

          {/* Ritual Completion Footer */}
          <motion.div
            className="relative z-10 text-center pt-12 sm:pt-16 pb-6 sm:pb-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="text-xl sm:text-2xl mb-3 sm:mb-4"
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
              <p className="text-sm sm:text-base text-zinc-500 italic px-4">
                Each thought you complete feeds the eternal flame of your growth
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Bottom Spacer */}
        <div className="h-16 bg-zinc-900 w-full max-w-screen" />
      </div>

      {/* Global Styles */}
      <style jsx>{`
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Ensure mobile viewport handling */
        @supports (height: 100dvh) {
          .min-h-screen {
            min-height: 100dvh;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.4);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.6);
        }

        /* Ensure sections stack properly */
        section {
          position: relative;
          z-index: 1;
        }

        /* Prevent horizontal scroll */
        body, html {
          overflow-x: hidden;
          max-width: 100vw;
        }
      `}</style>
    </div>
  );
};

export default ForgeBoardLayout;