import React from 'react';
import { motion } from 'framer-motion';

const ChainedBackground = ({ 
  intensity = 0.6,
  chainedCount = 0,
  isVisible = true 
}) => {
  // Dynamic intensity based on chained count
  const dynamicIntensity = Math.min(1, intensity + (chainedCount * 0.02));
  
  // Particle positions for floating embers
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 15 + (i * 12) + Math.random() * 10,
    y: 20 + Math.random() * 60,
    size: 0.5 + Math.random() * 1,
    delay: Math.random() * 4
  }));

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary radial glow layers */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(251, 146, 60, ${0.08 + dynamicIntensity * 0.1}) 0%, rgba(239, 68, 68, ${0.04 + dynamicIntensity * 0.05}) 40%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
          x: [0, 20, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(220, 38, 38, ${0.06 + dynamicIntensity * 0.08}) 0%, rgba(251, 146, 60, ${0.03 + dynamicIntensity * 0.04}) 50%, transparent 80%)`
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4],
          x: [0, -15, 0],
          y: [0, 15, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Central energy vortex */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(239, 68, 68, ${0.04 + dynamicIntensity * 0.06}) 0%, rgba(220, 38, 38, ${0.02 + dynamicIntensity * 0.03}) 30%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating ember particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-orange-400/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: 'blur(0.5px)'
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.3, 1],
              x: [0, Math.sin(particle.id) * 10, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Chained energy when count is high */}
      {chainedCount > 5 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            background: [
              'radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.06) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Frosted glass texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.01) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.008) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.003) 50%, transparent 60%)
          `
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Grain texture for visual depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.05) 1px,
              rgba(255, 255, 255, 0.05) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.03) 1px,
              rgba(255, 255, 255, 0.03) 2px
            )
          `,
          backgroundSize: '3px 3px'
        }}
      />

      {/* Emotional intensity pulse */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(to top, rgba(239, 68, 68, ${0.03 + dynamicIntensity * 0.05}) 0%, transparent 100%)`
        }}
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Chain link pattern (subtle) */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-[0.01]"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")
          `
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, 40, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default ChainedBackground;