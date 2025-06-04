import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import lottie from 'lottie-web';

const RisingFlame = ({ 
  progress = 0, // 0 to 1 - controls animation progress
  opacity = 1, // Overall opacity control
  glow = false, // Enable/disable glow effect
  glowIntensity = 0.3, // Glow intensity when enabled
  height = '200px', // Height of the animation container
  className = '',
  style = {},
  onAnimationLoad = null, // Callback when animation loads
  ...motionProps
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load and setup Lottie animation
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Import the flame animation JSON
      import('../../assets/lottie/flame-rise.json')
        .then((animationData) => {
          if (animationRef.current) {
            animationRef.current.destroy();
          }

          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: false, // No autoloop - we control it manually
            autoplay: false, // No autoplay - we control it manually
            animationData: animationData.default || animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYEnd meet', // Anchor to bottom
              clearCanvas: true,
              progressiveLoad: true,
              hideOnTransparent: true
            }
          });

          animationRef.current.addEventListener('DOMLoaded', () => {
            setIsLoaded(true);
            setError(null);
            if (onAnimationLoad) {
              onAnimationLoad(animationRef.current);
            }
          });

          animationRef.current.addEventListener('error', (err) => {
            console.error('Lottie animation error:', err);
            setError('Failed to load flame animation');
          });

        })
        .catch((err) => {
          console.error('Failed to import flame animation:', err);
          setError('Animation file not found');
        });

    } catch (err) {
      console.error('Lottie setup error:', err);
      setError('Failed to setup animation');
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [onAnimationLoad]);

  // Control animation progress based on prop
  useEffect(() => {
    if (!animationRef.current || !isLoaded) return;

    try {
      // Clamp progress between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      // Get total frames and calculate target frame
      const totalFrames = animationRef.current.totalFrames;
      const targetFrame = clampedProgress * (totalFrames - 1);
      
      // Go to specific frame without playing
      animationRef.current.goToAndStop(targetFrame, true);
      
    } catch (err) {
      console.error('Error controlling animation progress:', err);
    }
  }, [progress, isLoaded]);

  // Dynamic glow styles based on progress and glow settings
  const getDynamicGlow = () => {
    if (!glow) return {};
    
    const intensity = glowIntensity * progress;
    return {
      filter: `drop-shadow(0 0 ${20 + (progress * 30)}px rgba(251, 146, 60, ${intensity})) drop-shadow(0 0 ${40 + (progress * 40)}px rgba(239, 68, 68, ${intensity * 0.6}))`,
      transform: `scale(${1 + (progress * 0.1)})` // Subtle scale increase
    };
  };

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 pointer-events-none z-30 ${className}`}
      style={{
        height,
        opacity,
        ...getDynamicGlow(),
        ...style
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.3 }}
      {...motionProps}
    >
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Lottie Animation Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Progress Debug Indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono">
          Progress: {(progress * 100).toFixed(1)}%
        </div>
      )}

      {/* Ambient Glow Overlay (optional enhancement) */}
      {glow && progress > 0.1 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-orange-500/5 via-transparent to-transparent pointer-events-none"
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2 + (progress * 2),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default RisingFlame;