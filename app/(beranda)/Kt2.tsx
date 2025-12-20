'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

interface Kt2Props {
  paddingTop?: string;
  paddingBottom?: string;
}

const Kt2: React.FC<Kt2Props> = ({
  paddingTop = "90px",
  paddingBottom = "90px"
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Optional: Stop observing after animation starts
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of element is visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes kenBurns {
          0% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.15);
          }
        }

        @keyframes drawLine {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(20px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }

        @keyframes floatMedium {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-15px) translateX(-10px);
          }
          66% {
            transform: translateY(-25px) translateX(15px);
          }
        }

        @keyframes floatFast {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.2);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
        }

        .animate-ken-burns {
          animation: kenBurns 20s ease-out infinite alternate;
        }

        .animate-draw-line {
          animation: drawLine 1.5s ease-out forwards;
          animation-delay: 0.8s;
        }

        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: floatMedium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: floatFast 3s ease-in-out infinite;
        }

        .animate-gradient-shift {
          animation: gradientShift 8s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-1200 {
          animation-delay: 1200ms;
        }

        .animation-delay-1500 {
          animation-delay: 1500ms;
        }

        /* Hidden state before animation triggers */
        .kt2-hidden {
          opacity: 0;
        }

        .kt2-visible {
          opacity: 1;
        }
      `}} />

      <section
        ref={sectionRef}
        // UPDATE: Padding kiri kanan 150px (lg), px-6 (mobile), px-12 (tablet)
        // Flex center digunakan untuk memposisikan konten di tengah vertikal & horizontal
        className={`relative w-full flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-[150px] ${dmSans.className}`}
        style={{
          paddingTop,
          paddingBottom
        }}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className={isVisible ? "animate-fade-in" : ""}>
            <Image
              src="/Image/ApiUnggun.webp"
              alt="Background"
              fill
              className={`object-cover ${isVisible ? "animate-ken-burns" : ""}`}
              style={{ transform: 'scale(2.05)' }}
              priority
              sizes="100vw"
            />
          </div>
          {/* Gradient Overlay - Modern style */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>

          {/* Animated Gradient Accent */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-lime-400/10 ${isVisible ? "animate-gradient-shift" : ""}`}></div>
        </div>

        {/* Content Container 
            UPDATE: Max-width 6xl dan mx-auto untuk sentralisasi konten di dalam padding 
        */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title with staggered animation */}
            <h2
              className={`text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-5 lg:mb-6 leading-tight ${isVisible ? "animate-slide-up animation-delay-200" : "kt2-hidden"}`}
            >
              Berkaryalah.
            </h2>

            {/* Subtitle with staggered animation */}
            <p
              className={`text-white/90 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-7 lg:mb-8 leading-relaxed px-2 ${isVisible ? "animate-slide-up animation-delay-400" : "kt2-hidden"}`}
            >
              Tumbuh menjadi generasi tangguh
              <br />
              bersama Pramuka.
            </p>

            {/* Decorative Line with draw animation */}
            <div
              className={`flex justify-center ${isVisible ? "animate-slide-up animation-delay-600" : "kt2-hidden"}`}
            >
              <svg
                width="200"
                height="20"
                viewBox="0 0 200 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 ${isVisible ? "animate-draw-line" : ""}`}
              >
                <path
                  d="M2 10C50 2 150 18 198 10"
                  stroke="#C9A86A"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: isVisible ? 0 : 200,
                    transition: 'stroke-dashoffset 1.5s ease-out 0.8s',
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Decorative Elements - Animated Floating Dots */}
        <div className={`absolute top-8 left-4 sm:top-10 sm:left-10 w-2 h-2 bg-orange-500 rounded-full opacity-60 ${isVisible ? "animate-float-slow" : ""}`}></div>
        <div className={`absolute top-16 right-6 sm:top-20 sm:right-16 w-2 sm:w-3 h-2 sm:h-3 bg-orange-400 rounded-full opacity-50 ${isVisible ? "animate-float-medium animation-delay-1000" : ""}`}></div>
        <div className={`absolute bottom-24 left-6 sm:bottom-32 sm:left-20 w-2 h-2 bg-orange-600 rounded-full opacity-70 ${isVisible ? "animate-float-fast" : ""}`}></div>
        <div className={`absolute bottom-16 right-10 sm:bottom-20 sm:right-24 w-2 h-2 bg-orange-500 rounded-full opacity-60 ${isVisible ? "animate-float-slow animation-delay-500" : ""}`}></div>
        <div className={`absolute top-1/3 left-3 sm:left-8 w-2 h-2 bg-orange-400 rounded-full opacity-50 ${isVisible ? "animate-float-medium animation-delay-1500" : ""}`}></div>
        <div className={`absolute top-1/2 right-5 sm:right-12 w-2 sm:w-3 h-2 sm:h-3 bg-orange-600 rounded-full opacity-40 ${isVisible ? "animate-float-fast animation-delay-800" : ""}`}></div>

        {/* Additional modern decorative elements */}
        <div className={`absolute top-20 right-1/4 w-1 h-1 bg-lime-400 rounded-full opacity-70 ${isVisible ? "animate-twinkle" : ""}`}></div>
        <div className={`absolute bottom-32 left-1/3 w-1 h-1 bg-lime-400 rounded-full opacity-60 ${isVisible ? "animate-twinkle animation-delay-1200" : ""}`}></div>
      </section>
    </>
  )
}

export default Kt2