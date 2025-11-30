import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface PreloaderProps {
  onLoadComplete: () => void
}

const Preloader = ({ onLoadComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing')
  const logoRef = useRef<HTMLDivElement>(null)
  const circleRefs = useRef<(HTMLDivElement | null)[]>([])
  const particlesRef = useRef<HTMLDivElement>(null)

  const loadingStages = [
    { text: 'Initializing Khushiva AI', progress: 20 },
    { text: 'Loading AI Models', progress: 40 },
    { text: 'Connecting to Services', progress: 60 },
    { text: 'Preparing Interface', progress: 80 },
    { text: 'Almost Ready', progress: 95 },
    { text: 'Welcome!', progress: 100 },
  ]

  useEffect(() => {
    let currentStage = 0
    let animationFrame: number

    // GSAP Logo Animation
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { 
          scale: 0.5, 
          opacity: 0, 
          rotation: -180 
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
        }
      )

      // Continuous floating animation
      gsap.to(logoRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    // Animated circles with GSAP
    circleRefs.current.forEach((circle, index) => {
      if (circle) {
        gsap.fromTo(
          circle,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.6,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
          }
        )

        // Pulsing animation
        gsap.to(circle, {
          scale: 1.2,
          opacity: 0.3,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
          ease: 'sine.inOut',
        })
      }
    })

    // Particle animation
    if (particlesRef.current) {
      const particles = particlesRef.current.children
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: -100 - Math.random() * 50,
          x: (Math.random() - 0.5) * 100,
          opacity: 0,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          delay: Math.random() * 2,
          ease: 'power1.out',
        })
      })
    }

    // Progress simulation
    const progressInterval = setInterval(() => {
      if (currentStage < loadingStages.length) {
        const stage = loadingStages[currentStage]
        setLoadingText(stage.text)
        
        const startProgress = currentStage === 0 ? 0 : loadingStages[currentStage - 1].progress
        const targetProgress = stage.progress
        const duration = 800

        const animate = (timestamp: number) => {
          if (!animationFrame) animationFrame = timestamp
          const elapsed = timestamp - animationFrame
          const progressValue = Math.min(
            startProgress + ((targetProgress - startProgress) * elapsed) / duration,
            targetProgress
          )
          
          setProgress(Math.floor(progressValue))

          if (elapsed < duration) {
            requestAnimationFrame(animate)
          } else {
            currentStage++
            animationFrame = 0
            if (currentStage >= loadingStages.length) {
              setTimeout(() => {
                onLoadComplete()
              }, 500)
            }
          }
        }

        requestAnimationFrame(animate)
      }
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      gsap.killTweensOf([logoRef.current, ...circleRefs.current, particlesRef.current])
    }
  }, [onLoadComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/30 dark:to-blue-950/30"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }} />
        </div>

        {/* Particles */}
        <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-500/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '0%',
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center px-6">
          {/* Animated Circles Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                ref={(el) => (circleRefs.current[index] = el)}
                className="absolute rounded-full border-2 border-primary-500/30"
                style={{
                  width: `${120 + index * 60}px`,
                  height: `${120 + index * 60}px`,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            ref={logoRef}
            className="relative mb-8 sm:mb-12"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 rounded-3xl blur-2xl opacity-60 animate-pulse" />
              
              {/* Logo Container */}
              <div className="relative w-full h-full bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <svg 
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
              </div>

              {/* Rotating Ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-4 border-transparent"
                style={{
                  borderTopColor: '#8b5cf6',
                  borderRightColor: '#8b5cf6',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center"
          >
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent">
              Khushiva AI
            </span>
          </motion.h1>

          {/* Loading Text */}
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 font-medium"
          >
            {loadingText}
          </motion.p>

          {/* Progress Bar */}
          <div className="w-full max-w-md px-4">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            
            {/* Progress Percentage */}
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-500 font-medium">Loading...</span>
              <motion.span
                key={progress}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-primary-600 dark:text-primary-400 font-bold"
              >
                {progress}%
              </motion.span>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-600 dark:bg-primary-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-500 text-center max-w-sm"
          >
            Powered by Google Gemini 2.5 Flash
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Preloader
