/**
 * Auth Card Scroll Utilities
 * 
 * Enhances keyboard accessibility for scrollable auth cards.
 * Ensures keyboard users can scroll the card content smoothly.
 * 
 * Usage:
 *   import { useAuthCardScroll } from '@/utils/authCardScroll'
 *   
 *   // In your component:
 *   const cardRef = useRef<HTMLDivElement>(null)
 *   useAuthCardScroll(cardRef)
 */

import { useEffect, RefObject } from 'react'

/**
 * Hook to enable keyboard scrolling in auth card
 * Adds arrow key navigation when card is focused
 */
export const useAuthCardScroll = (cardRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keys if the card or its children have focus
      if (!card.contains(document.activeElement)) return

      const scrollAmount = 40 // pixels to scroll per key press

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          card.scrollBy({ top: scrollAmount, behavior: 'smooth' })
          break
        case 'ArrowUp':
          e.preventDefault()
          card.scrollBy({ top: -scrollAmount, behavior: 'smooth' })
          break
        case 'PageDown':
          e.preventDefault()
          card.scrollBy({ top: card.clientHeight * 0.8, behavior: 'smooth' })
          break
        case 'PageUp':
          e.preventDefault()
          card.scrollBy({ top: -card.clientHeight * 0.8, behavior: 'smooth' })
          break
        case 'Home':
          // Only scroll to top if Ctrl/Cmd is pressed (convention)
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            card.scrollTo({ top: 0, behavior: 'smooth' })
          }
          break
        case 'End':
          // Only scroll to bottom if Ctrl/Cmd is pressed (convention)
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            card.scrollTo({ top: card.scrollHeight, behavior: 'smooth' })
          }
          break
      }
    }

    // Add event listener
    card.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      card.removeEventListener('keydown', handleKeyDown)
    }
  }, [cardRef])
}

/**
 * Check if an element is scrollable
 * Useful for debugging scroll issues
 */
export const isScrollable = (element: HTMLElement): boolean => {
  return element.scrollHeight > element.clientHeight
}

/**
 * Scroll to a specific element within the auth card
 * Useful for scrolling to error messages or specific form fields
 */
export const scrollToElement = (
  cardRef: RefObject<HTMLDivElement>,
  elementSelector: string,
  options?: ScrollIntoViewOptions
) => {
  const card = cardRef.current
  if (!card) return

  const element = card.querySelector(elementSelector)
  if (!element) return

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...options
  })
}

/**
 * Auto-scroll to first error in form (accessibility helper)
 */
export const scrollToFirstError = (cardRef: RefObject<HTMLDivElement>) => {
  scrollToElement(cardRef, '[aria-invalid="true"], .error, [role="alert"]', {
    behavior: 'smooth',
    block: 'start'
  })
}
