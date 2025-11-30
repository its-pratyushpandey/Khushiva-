import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface CelebrationAnimationProps {
  show: boolean
  onComplete?: () => void
  trigger?: 'success' | 'milestone' | 'achievement' | 'welcome'
  duration?: number
}

const CelebrationAnimation = ({ 
  show, 
  onComplete, 
  trigger = 'success',
  duration = 3000 
}: CelebrationAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show || !containerRef.current) return

    const container = containerRef.current

    // Create confetti particles
    const confettiCount = window.innerWidth < 640 ? 30 : window.innerWidth < 1024 ? 50 : 80
    const confettiColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#F06292', '#7986CB'
    ]

    // Generate confetti
    if (confettiRef.current) {
      confettiRef.current.innerHTML = ''
      
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div')
        confetti.className = 'absolute w-2 h-2 sm:w-3 sm:h-3'
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
        confetti.style.left = `${Math.random() * 100}%`
        confetti.style.top = '-10%'
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%'
        confetti.style.opacity = '0.9'
        confettiRef.current.appendChild(confetti)

        // GSAP animation for confetti
        const angle = (Math.random() - 0.5) * 180
        const velocity = 300 + Math.random() * 400
        const rotation = Math.random() * 720 - 360
        const scale = 0.5 + Math.random() * 0.5

        gsap.timeline()
          .to(confetti, {
            y: window.innerHeight + 100,
            x: `+=${Math.sin(angle * Math.PI / 180) * velocity}`,
            rotation: rotation,
            scale: scale,
            opacity: 0,
            duration: 2 + Math.random() * 2,
            ease: 'power2.in',
            delay: Math.random() * 0.3
          })
      }
    }

    // Generate stars/sparkles
    if (starsRef.current) {
      starsRef.current.innerHTML = ''
      const starCount = window.innerWidth < 640 ? 15 : window.innerWidth < 1024 ? 25 : 40
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.className = 'absolute'
        star.innerHTML = '✨'
        star.style.fontSize = `${12 + Math.random() * 20}px`
        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`
        star.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))'
        starsRef.current.appendChild(star)

        // GSAP animation for stars
        gsap.timeline()
          .fromTo(star, 
            {
              scale: 0,
              rotation: 0,
              opacity: 0
            },
            {
              scale: 1,
              rotation: 360,
              opacity: 1,
              duration: 0.6,
              delay: Math.random() * 0.5,
              ease: 'back.out(1.7)'
            }
          )
          .to(star, {
            y: -50 - Math.random() * 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power1.out'
          }, '-=0.3')
      }
    }

    // Firework bursts
    const createFirework = (x: number, y: number, color: string) => {
      const burst = document.createElement('div')
      burst.className = 'absolute w-4 h-4 rounded-full'
      burst.style.left = `${x}%`
      burst.style.top = `${y}%`
      burst.style.backgroundColor = color
      burst.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`
      container.appendChild(burst)

      const particles = 12
      for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div')
        particle.className = 'absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full'
        particle.style.backgroundColor = color
        particle.style.left = `${x}%`
        particle.style.top = `${y}%`
        container.appendChild(particle)

        const angle = (i / particles) * Math.PI * 2
        const distance = 80 + Math.random() * 120

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 1 + Math.random() * 0.5,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        })
      }

      gsap.to(burst, {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => burst.remove()
      })
    }

    // Trigger fireworks at random positions
    const fireworkInterval = setInterval(() => {
      const x = 20 + Math.random() * 60
      const y = 20 + Math.random() * 60
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      createFirework(x, y, color)
    }, 400)

    // Cleanup and callback
    const timer = setTimeout(() => {
      clearInterval(fireworkInterval)
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(fireworkInterval)
    }
  }, [show, duration, onComplete])

  if (!show) return null

  const getMessage = () => {
    switch (trigger) {
      case 'milestone':
        return '🎯 Milestone Achieved!'
      case 'achievement':
        return '🏆 Achievement Unlocked!'
      case 'welcome':
        return '🎉 Welcome!'
      default:
        return '✨ Success!'
    }
  }

  const getGradient = () => {
    switch (trigger) {
      case 'milestone':
        return 'from-purple-500 via-pink-500 to-red-500'
      case 'achievement':
        return 'from-yellow-400 via-orange-500 to-red-500'
      case 'welcome':
        return 'from-blue-500 via-cyan-500 to-teal-500'
      default:
        return 'from-green-400 via-emerald-500 to-teal-500'
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          style={{ perspective: '1000px' }}
        >
          {/* Confetti Container */}
          <div ref={confettiRef} className="absolute inset-0" />
          
          {/* Stars Container */}
          <div ref={starsRef} className="absolute inset-0" />

          {/* Center Message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotateY: -180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotateY: [180, 0],
                opacity: [0, 1, 1]
              }}
              exit={{ 
                scale: 0,
                rotateY: 180,
                opacity: 0
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className={`absolute inset-0 bg-gradient-to-r ${getGradient()} blur-3xl rounded-full`}
              />

              {/* Message Card */}
              <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl px-6 sm:px-10 md:px-16 py-4 sm:py-6 md:py-8 shadow-2xl border-2 border-white/20 dark:border-gray-700/20">
                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent text-center whitespace-nowrap`}
                >
                  {getMessage()}
                </motion.div>

                {/* Animated underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`h-1 sm:h-1.5 bg-gradient-to-r ${getGradient()} rounded-full mt-2 sm:mt-3 md:mt-4`}
                />
              </div>

              {/* Orbiting particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
                  }}
                  animate={{
                    x: [
                      0,
                      Math.cos((i / 8) * Math.PI * 2) * (window.innerWidth < 640 ? 80 : 120),
                      0
                    ],
                    y: [
                      0,
                      Math.sin((i / 8) * Math.PI * 2) * (window.innerWidth < 640 ? 80 : 120),
                      0
                    ],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Radial burst effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 3, 5],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut'
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-r ${getGradient()} rounded-full blur-2xl`}
          />

          {/* Corner sparkles */}
          {[
            { top: '10%', left: '10%' },
            { top: '10%', right: '10%' },
            { bottom: '10%', left: '10%' },
            { bottom: '10%', right: '10%' }
          ].map((position, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl sm:text-4xl md:text-5xl"
              style={position}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              ⭐
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CelebrationAnimation
