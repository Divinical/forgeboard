import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CompletionGlowProgression = ({ 
  isComplete, 
  completedAt, 
  bubbleId,
  onBurnNow,
  className = ""
}) => {
  const [progressStage, setProgressStage] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showBurnButton, setShowBurnButton] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Calculate time elapsed since completion
  useEffect(() => {
    if (!isComplete || !completedAt) {
      setProgressStage(0);
      setSecondsElapsed(0);
      setShowBurnButton(false);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const completionTime = new Date(completedAt);
      const elapsed = Math.floor((now - completionTime) / 1000);
      
      setSecondsElapsed(elapsed);
      
      // Determine progression stage
      if (elapsed >= 120) {
        setProgressStage(3); // Full flame aura
        setShowBurnButton(true);
      } else if (elapsed >= 60) {
        setProgressStage(2); // Flicker layer
      } else if (elapsed >= 30) {
        setProgressStage(1); // Soft orange border
      } else {
        setProgressStage(0); // Just completed
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, completedAt]);

  // Shake effect for stage 3
  useEffect(() => {
    if (progressStage === 3) {
      const shakeInterval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 200);
      }, 8000); // Shake every 8 seconds

      return () => clearInterval(shakeInterval);
    }
  }, [progressStage]);

  // Stage 0: Just completed - subtle glow
  const Stage0Glow = () => (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0.4],
        scale: [1, 1.01, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)'
      }}
    />
  );

  // Stage 1: 30s - Soft orange border
  const Stage1Border = () => (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        borderColor: [
          'rgba(249, 115, 22, 0.4)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(249, 115, 22, 0.4)'
        ]
      }}
      transition={{
        borderColor: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      style={{
        border: '2px solid rgba(249, 115, 22, 0.4)',
        boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)'
      }}
    />
  );

  // Stage 2: 60s - Flicker layer with particles
  const Stage2Flicker = () => (
    <>
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ 
          opacity: [0.3, 0.8, 0.2, 0.9, 0.4],
          scale: [1, 1.02, 1, 1.01, 1]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
          border: '2px solid rgba(249, 115, 22, 0.6)',
          boxShadow: '0 0 30px rgba(249, 115, 22, 0.5)'
        }}
      />
      
      {/* Floating ember particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  );

  // Stage 3: 120s+ - Full flame aura
  const Stage3FlameAura = () => (
    <>
      {/* Main flame aura */}
      <motion.div
        className="absolute -inset-2 rounded-3xl pointer-events-none"
        animate={{ 
          opacity: [0.4, 0.9, 0.6, 1, 0.4],
          scale: isShaking ? [1, 1.03, 1] : [1, 1.02, 1],
          rotate: isShaking ? [0, 1, -1, 0] : 0
        }}
        transition={{
          opacity: {
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: isShaking ? 0.2 : 2,
            repeat: isShaking ? 0 : Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 0.2,
            ease: "easeInOut"
          }
        }}
        style={{
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(249, 115, 22, 0.4) 40%, transparent 80%)',
          border: '3px solid rgba(239, 68, 68, 0.7)',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(249, 115, 22, 0.3)'
        }}
      />

      {/* Intense ember field */}
      <div className="absolute -inset-4 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(249, 115, 22, 0.9)'
              } 0%, transparent 70%)`
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.sin(i) * 8, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.3, 1.5, 0.3]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Persistent urgency tooltip */}
      <motion.div
        className="absolute -top-16 left-1/2 transform -translate-x-1/2 pointer-events-none z-50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0.7, 1, 0.7],
          y: isShaking ? [0, -2, 0] : 0
        }}
        transition={{
          opacity: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          y: {
            duration: 0.2,
            ease: "easeInOut"
          }
        }}
      >
        <div className="bg-red-900/95 border border-red-500/70 rounded-xl px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-lg"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔥
            </motion.span>
            <div className="text-left">
              <p className="text-sm font-bold text-red-300">
                Still holding on?
              </p>
              <p className="text-xs text-red-400/80">
                {Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s elapsed
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  // Floating burn button for stage 3
  const BurnNowButton = () => (
    <motion.button
      onClick={() => onBurnNow?.(bubbleId)}
      className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold px-6 py-3 rounded-2xl border border-red-500/50 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: isShaking ? 1.05 : 1, 
        y: 0 
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      whileHover={{ 
        scale: 1.08,
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      style={{
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)'
      }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔥
        </motion.span>
        <span className="text-sm">Burn Now</span>
      </div>
    </motion.button>
  );

  if (!isComplete) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <AnimatePresence mode="wait">
        {progressStage === 0 && <Stage0Glow key="stage0" />}
        {progressStage === 1 && <Stage1Border key="stage1" />}
        {progressStage === 2 && <Stage2Flicker key="stage2" />}
        {progressStage === 3 && <Stage3FlameAura key="stage3" />}
      </AnimatePresence>

      {/* Burn button for stage 3 */}
      <AnimatePresence>
        {showBurnButton && progressStage === 3 && (
          <div className="pointer-events-auto">
            <BurnNowButton key="burn-button" />
          </div>
        )}
      </AnimatePresence>

      {/* Sound trigger preparation - can be enhanced later */}
      {progressStage === 3 && isShaking && (
        <div className="sr-only" aria-live="polite">
          Thought ready to burn after {Math.floor(secondsElapsed / 60)} minutes
        </div>
      )}

      {/* Development debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono pointer-events-auto z-50">
          <div>Stage: {progressStage}</div>
          <div>Elapsed: {secondsElapsed}s</div>
          <div>Shaking: {isShaking ? 'Y' : 'N'}</div>
        </div>
      )}
    </div>
  );
};

export default CompletionGlowProgression;