import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBubbleStore = create(
  persist(
    (set, get) => ({
      bubbles: [],
      activeBubble: null, // For Chaos → Stillness flow
      showSnapshotOverlay: true, // NEW: Control snapshot overlay visibility

      // Snapshot overlay management
      setShowSnapshotOverlay: (show) => {
        set({ showSnapshotOverlay: show });
      },

      toggleSnapshotOverlay: () => {
        set(state => ({ showSnapshotOverlay: !state.showSnapshotOverlay }));
      },

      // Active bubble management
      setActiveBubble: (bubble) => {
        set({ activeBubble: bubble });
      },

      clearActiveBubble: () => {
        set({ activeBubble: null });
      },

      createBubble: ({ text, tag }) => {
        const newBubble = {
          id: Date.now().toString(),
          text,
          tag,
          state: 'chaos',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isComplete: false, // Completion tracking
          completedAt: null, // Track when completion occurred
          readyToBurn: false, // Track if ready for burn progression
        };
        
        set(state => ({
          bubbles: [...state.bubbles, newBubble]
        }));
        
        return newBubble.id;
      },

      // Enhanced method for snapshot-to-bubble creation
      createBubbleFromSnapshot: ({ text, tag = "💭", autoClose = false }) => {
        const bubbleId = get().createBubble({ text, tag });
        
        // Optionally close overlay after creation
        if (autoClose) {
          set({ showSnapshotOverlay: false });
        }
        
        console.log('🔥 Bubble created from snapshot:', bubbleId);
        return bubbleId;
      },

      freezeBubble: (id) => {
        set(state => ({
          bubbles: state.bubbles.map(bubble =>
            bubble.id === id
              ? { ...bubble, state: 'vault', frozenAt: new Date().toISOString() }
              : bubble
          )
        }));
      },

      burnBubble: (id) => {
        set(state => ({
          bubbles: state.bubbles.map(bubble =>
            bubble.id === id
              ? { 
                  ...bubble, 
                  state: 'burned',
                  burnedAt: new Date().toISOString(),
                  isComplete: true, // Ensure completion state is set
                  readyToBurn: false // Reset burn ready state
                }
              : bubble
          )
        }));
      },

      reviveBubble: (id) => {
        set(state => ({
          bubbles: state.bubbles.map(bubble =>
            bubble.id === id
              ? { 
                  ...bubble, 
                  state: 'chaos', 
                  revivedAt: new Date().toISOString(),
                  // Keep completion state intact when reviving
                }
              : bubble
          )
        }));
      },

      deleteBubble: (id) => {
        set(state => ({
          bubbles: state.bubbles.filter(bubble => bubble.id !== id)
        }));
      },

      updateBubble: (id, updates) => {
        set((state) => ({
          bubbles: state.bubbles.map(bubble => 
            bubble.id === id 
              ? { 
                  ...bubble, 
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : bubble
          )
        }));
      },

      // Enhanced completion state management
      updateBubbleCompletion: (id, isComplete) => {
        set((state) => {
          const now = new Date().toISOString();
          return {
            bubbles: state.bubbles.map(bubble => 
              bubble.id === id 
                ? { 
                    ...bubble, 
                    isComplete,
                    completedAt: isComplete ? (bubble.completedAt || now) : null,
                    readyToBurn: isComplete,
                    updatedAt: now
                  }
                : bubble
            )
          };
        });
      },

      // Mark bubble as ready to burn with glow progression
      markBubbleReadyToBurn: (id) => {
        set((state) => {
          const now = new Date().toISOString();
          return {
            bubbles: state.bubbles.map(bubble => 
              bubble.id === id 
                ? { 
                    ...bubble, 
                    isComplete: true,
                    readyToBurn: true,
                    completedAt: bubble.completedAt || now,
                    updatedAt: now
                  }
                : bubble
            )
          };
        });
      },

      // Reset completion state (for unchecking all items)
      resetBubbleCompletion: (id) => {
        set((state) => ({
          bubbles: state.bubbles.map(bubble => 
            bubble.id === id 
              ? { 
                  ...bubble, 
                  isComplete: false,
                  readyToBurn: false,
                  completedAt: null,
                  updatedAt: new Date().toISOString()
                }
              : bubble
          )
        }));
      },

      // Get all completed bubbles ready to burn
      getReadyToBurnBubbles: () => {
        return get().bubbles.filter(bubble => 
          bubble.isComplete && bubble.readyToBurn && bubble.state === 'chaos'
        );
      },

      // Enhanced auto-burn with progression awareness
      autoBurnCompleted: (id, delayMs = 300000) => { // 5 minutes default
        const bubble = get().getBubbleById(id);
        if (bubble?.isComplete && bubble.readyToBurn && bubble.state === 'chaos') {
          console.log(`⏰ Auto-burn scheduled for bubble ${id} in ${delayMs/1000}s`);
          
          setTimeout(() => {
            const currentBubble = get().getBubbleById(id);
            // Only auto-burn if still complete and ready
            if (currentBubble?.isComplete && currentBubble.readyToBurn && currentBubble.state === 'chaos') {
              console.log(`🔥 Auto-burning bubble ${id} after delay`);
              get().burnBubble(id);
            }
          }, delayMs);
        }
      },

      // Check completion status of a bubble based on checklist
      checkBubbleCompletion: (id) => {
        const bubble = get().getBubbleById(id);
        if (!bubble) return false;

        // Parse checklist from text
        const checklistPattern = /^[\s]*-[\s]*\[[x\s]\][\s]*.+$/gim;
        const matches = bubble.text.match(checklistPattern) || [];
        const total = matches.length;
        const completed = matches.filter(match => match.includes('[x]')).length;
        
        // If no checklist, not considered complete
        if (total === 0) return false;
        
        // Complete if all items are checked
        const isComplete = completed === total;
        
        // Update completion state if it changed
        if (isComplete !== bubble.isComplete) {
          get().updateBubbleCompletion(id, isComplete);
        }
        
        return isComplete;
      },

      getBubbleById: (id) => {
        return get().bubbles.find(bubble => bubble.id === id) || null;
      },

      getChaosCount: () => {
        return get().bubbles.filter(b => b.state === 'chaos').length;
      },

      getVaultCount: () => {
        return get().bubbles.filter(b => b.state === 'vault').length;
      },

      // Enhanced completion statistics
      getCompletionStats: () => {
        const bubbles = get().bubbles;
        const totalBubbles = bubbles.length;
        const completedBubbles = bubbles.filter(b => b.isComplete).length;
        const burnedBubbles = bubbles.filter(b => b.state === 'burned').length;
        const readyToBurn = bubbles.filter(b => b.isComplete && b.readyToBurn && b.state === 'chaos').length;
        const chaosComplete = bubbles.filter(b => b.isComplete && b.state === 'chaos').length;
        
        return {
          total: totalBubbles,
          completed: completedBubbles,
          burned: burnedBubbles,
          readyToBurn,
          chaosComplete,
          completionRate: totalBubbles > 0 ? (burnedBubbles / totalBubbles) * 100 : 0,
          pendingBurnRate: totalBubbles > 0 ? (readyToBurn / totalBubbles) * 100 : 0
        };
      },

      // Bulk operations for completion management
      burnAllCompleted: () => {
        const completedBubbles = get().getReadyToBurnBubbles();
        completedBubbles.forEach(bubble => {
          get().burnBubble(bubble.id);
        });
        return completedBubbles.length;
      },

      clearAllBubbles: () => {
        set({ bubbles: [], activeBubble: null });
      },

      // Position Management
      updateBubblePosition: (id, position) => set((state) => ({
        bubbles: state.bubbles.map(bubble =>
          bubble.id === id
            ? { ...bubble, position }
            : bubble
        )
      })),

      // Zone Management
      moveBubbleToForge: (id) => set((state) => ({
        bubbles: state.bubbles.map(bubble =>
          bubble.id === id
            ? { 
                ...bubble, 
                state: 'forge',
                position: { x: 50, y: 50 }, // Reset position for ForgeZone
                updatedAt: Date.now()
              }
            : bubble
        )
      })),

      // Lock Management
    }),
    {
      name: 'bubble-storage',
      version: 4, // Increment for snapshot overlay support
      migrate: (persistedState, version) => {
        // Migration logic for existing bubbles
        if (version < 2) {
          return {
            ...persistedState,
            bubbles: persistedState.bubbles?.map(bubble => ({
              ...bubble,
              isComplete: false,
              completedAt: null,
              readyToBurn: false
            })) || []
          };
        }
        if (version < 3) {
          return {
            ...persistedState,
            bubbles: persistedState.bubbles?.map(bubble => ({
              ...bubble,
              createdAt: bubble.createdAt || bubble.timestamp,
              readyToBurn: bubble.readyToBurn || false
            })) || []
          };
        }
        if (version < 4) {
          return {
            ...persistedState,
            showSnapshotOverlay: true, // Default to showing overlay for new feature
            bubbles: persistedState.bubbles || []
          };
        }
        return persistedState;
      }
    }
  )
);

export { useBubbleStore };