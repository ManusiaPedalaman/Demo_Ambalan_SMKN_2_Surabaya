'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

interface DDPProps {
  backgroundImage?: string;
}

const DDP: React.FC<DDPProps> = ({
  backgroundImage = '/Image/Container.webp',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  const darmaItems = [
    { number: 1, text: "Takwa kepada Tuhan Yang Maha Esa." },
    { number: 2, text: "Cinta alam dan kasih sayang sesama manusia." },
    { number: 3, text: "Patriot yang sopan dan kesatria." },
    { number: 4, text: "Patuh dan suka bermusyawarah." },
    { number: 5, text: "Rela menolong dan tabah." },
    { number: 6, text: "Rajin, terampil, dan gembira." },
    { number: 7, text: "Hemat, cermat, dan bersahaja." },
    { number: 8, text: "Disiplin, berani, dan setia." },
    { number: 9, text: "Bertanggungjawab dan dapat dipercaya." },
    { number: 10, text: "Suci dalam pikiran, perkataan, dan perbuatan." }
  ];

  const leftColumn = darmaItems.slice(0, 5);
  const rightColumn = darmaItems.slice(5, 10);

  const DarmaItem = ({ item, index, delayOffset }: { item: any, index: number, delayOffset: number }) => (
    <div
      className={`flex items-start gap-4 md:gap-5 transition-all duration-700 transform ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
        }`}
      style={{
        transitionDelay: `${(index + delayOffset) * 100}ms`
      }}
    >
      <div className="flex-shrink-0 w-8 md:w-10 text-right">
        <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white leading-none">
          {item.number}.
        </span>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg font-medium leading-snug pt-1">
          {item.text}
        </p>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 px-6 md:px-12 lg:px-[150px] overflow-hidden bg-white dark:bg-[#1E1C1B] ${dmSans.className}`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/Image/Vector.webp"
          alt="Background Pattern"
          fill
          className="object-cover opacity-25 dark:opacity-10"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">

        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] dark:text-white mb-4 tracking-tight">
            Dasa Darma Pramuka
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium">
            Pramuka Itu :
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 lg:gap-24">

          <div className="flex-1 space-y-6 md:space-y-8">
            {leftColumn.map((item, index) => (
              <DarmaItem
                key={item.number}
                item={item}
                index={index}
                delayOffset={0}
              />
            ))}
          </div>

          <div className="flex-1 space-y-6 md:space-y-8">
            {rightColumn.map((item, index) => (
              <DarmaItem
                key={item.number}
                item={item}
                index={index}
                delayOffset={2}
              />
            ))}
          </div>

        </div>
      </div>
    </section >
  );
};

export default DDP;