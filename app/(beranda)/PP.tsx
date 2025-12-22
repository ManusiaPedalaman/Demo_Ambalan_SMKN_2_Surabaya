'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Flame, Users, Crown, Trophy } from 'lucide-react'
import { DM_Sans } from 'next/font/google'

const PP = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
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

  const cards = [
    {
      icon: Flame,
      title: 'Kemandirian',
      description: 'Pramuka Penegak dilatih untuk mandiri dalam berpikir, bersikap, dan bertindak melalui berbagai kegiatan lapangan.'
    },
    {
      icon: Users,
      title: 'Kepedulian Sosial',
      description: 'Selalu aktif dalam kegiatan sosial, membantu masyarakat, dan menumbuhkan jiwa gotong royong.'
    },
    {
      icon: Crown,
      title: 'Kepemimpinan',
      description: 'Membentuk calon pemimpin yang tangguh, berani mengambil keputusan, dan mampu bekerja dalam tim.'
    },
    {
      icon: Trophy,
      title: 'Kreativitas & Inovasi',
      description: 'Penegak selalu ditantang untuk berekspresi, berinovasi, dan mengembangkan potensi di berbagai bidang.'
    }
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        
        .dm-sans {
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative py-24 px-6 md:px-12 lg:px-20 bg-cover bg-bottom bg-no-repeat overflow-hidden dm-sans"
        style={{
          backgroundImage: "url('/Image/PP.webp')",
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60"></div>


        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-cyan-900/20 opacity-50"></div>


        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E)"
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className={`mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

            <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight ">
              Pramuka Penegak
            </h2>
            <div className="w-24 h-1 rounded-full mb-6" style={{ background: 'linear-gradient(to right, #C9A86A, #C9A86A)' }}></div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              Penegak adalah generasi muda yang siap mengabdi, berkarya, dan memimpin.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/30 transition-shadow duration-500 hover:-translate-y-2 ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'
                  }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: 'hover: 0 20px 25px -5px #C9A86A'
                }}
              >

                <div className="absolute inset-0 rounded-2xl shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>


                <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" style={{ background: 'linear-gradient(to right, #C9A86A, #C9A86A)' }}></div>

                <div className="relative">

                  <div className="mb-8">
                    <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-500 border border-white/10 group-hover:scale-110 group-hover:rotate-3" style={{
                      background: 'linear-gradient(to bottom right, #00afec1a, rgba(0, 175, 236, 0.05))'
                    }}>
                      <card.icon className="w-8 h-8 transition-colors duration-500" style={{ color: '#C9A86A' }} strokeWidth={1.5} />
                    </div>
                  </div>


                  <h3 className="text-white text-2xl font-bold mb-4 group-hover:transition-colors duration-500" style={{ color: '' }}>
                    {card.title}
                  </h3>


                  <div className="w-12 h-0.5 rounded-full mb-4 group-hover:w-20 transition-all duration-500" style={{ background: 'linear-gradient(to right, #C9A86A, transparent)' }}></div>


                  <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-500 text-justify">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>


          <div className={`mt-16 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}></div>
        </div>
      </section>
    </>
  )
}

export default PP