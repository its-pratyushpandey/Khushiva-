import { useEffect, RefObject } from 'react'
import { gsap } from 'gsap'

interface UseGSAPAnimationsOptions {
  ref: RefObject<HTMLElement>
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'rotateIn' | 'custom'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  stagger?: number
  delay?: number
  duration?: number
}

export const useGSAPAnimations = ({
  ref,
  animation = 'fadeIn',
  from,
  to,
  stagger = 0,
  delay = 0,
  duration = 0.6,
}: UseGSAPAnimationsOptions) => {
  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      const element = ref.current

      let animationFrom: gsap.TweenVars = {}
      let animationTo: gsap.TweenVars = {
        duration,
        delay,
        ease: 'power3.out',
      }

      switch (animation) {
        case 'fadeIn':
          animationFrom = { opacity: 0, y: 20 }
          animationTo = { ...animationTo, opacity: 1, y: 0 }
          break
        case 'slideIn':
          animationFrom = { x: -50, opacity: 0 }
          animationTo = { ...animationTo, x: 0, opacity: 1 }
          break
        case 'scaleIn':
          animationFrom = { scale: 0.8, opacity: 0 }
          animationTo = { ...animationTo, scale: 1, opacity: 1 }
          break
        case 'rotateIn':
          animationFrom = { rotation: -180, opacity: 0, scale: 0.5 }
          animationTo = { ...animationTo, rotation: 0, opacity: 1, scale: 1 }
          break
        case 'custom':
          if (from) animationFrom = from
          if (to) animationTo = { ...animationTo, ...to }
          break
      }

      if (stagger > 0 && element) {
        gsap.from(element.children, {
          ...animationFrom,
          stagger,
          ...animationTo,
        })
      } else {
        gsap.from(element, animationFrom)
        gsap.to(element, animationTo)
      }
    }, ref)

    return () => ctx.revert()
  }, [ref, animation, from, to, stagger, delay, duration])
}

export const useGSAPHover = (
  ref: RefObject<HTMLElement>,
  hoverAnimation: gsap.TweenVars = { scale: 1.05, duration: 0.3 }
) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => {
      gsap.to(element, hoverAnimation)
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, hoverAnimation])
}

export const useGSAPScroll = (
  ref: RefObject<HTMLElement>,
  animation: gsap.TweenVars = { y: -10, opacity: 0.8 }
) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const scrollY = window.scrollY || element.scrollTop
      const maxScroll = 200

      const progress = Math.min(scrollY / maxScroll, 1)

      gsap.to(element, {
        ...animation,
        duration: 0.3,
        overwrite: true,
        ease: 'none',
      })
    }

    element.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)

    return () => {
      element.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ref, animation])
}
