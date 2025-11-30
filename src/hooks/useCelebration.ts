import { useState, useCallback } from 'react'

export type CelebrationType = 'success' | 'milestone' | 'achievement' | 'welcome'

interface UseCelebrationReturn {
  showCelebration: boolean
  celebrationType: CelebrationType
  triggerCelebration: (type?: CelebrationType) => void
  handleCelebrationComplete: () => void
}

/**
 * Custom hook to manage celebration animations throughout the app
 * 
 * @example
 * ```tsx
 * const { showCelebration, celebrationType, triggerCelebration, handleCelebrationComplete } = useCelebration()
 * 
 * // Trigger celebration
 * <button onClick={() => triggerCelebration('success')}>Celebrate!</button>
 * 
 * // Show celebration component
 * <CelebrationAnimation 
 *   show={showCelebration}
 *   trigger={celebrationType}
 *   onComplete={handleCelebrationComplete}
 * />
 * ```
 */
export const useCelebration = (): UseCelebrationReturn => {
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<CelebrationType>('success')

  const triggerCelebration = useCallback((type: CelebrationType = 'success') => {
    setCelebrationType(type)
    setShowCelebration(true)
  }, [])

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false)
  }, [])

  return {
    showCelebration,
    celebrationType,
    triggerCelebration,
    handleCelebrationComplete
  }
}
