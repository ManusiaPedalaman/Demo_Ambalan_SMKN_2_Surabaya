'use client';

import React, { useState, useEffect } from 'react';
import { DM_Sans } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor, Binary, Compass, Ruler, HeartPulse, Flame, Users,
  PlayCircle, HelpCircle, BookOpen, ArrowLeft, CheckCircle2,
  ChevronRight, ChevronDown, Trophy, RefreshCcw, Star, Menu,
  Maximize2, X, Image as ImageIcon
} from 'lucide-react';


import Link from 'next/link';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


import { pillarsData } from '../data/latihanData';

export default function Latihan() {

  const [activePillarId, setActivePillarId] = useState(pillarsData[0].id);
  const [activeSubCatId, setActiveSubCatId] = useState(pillarsData[0].subCategories[0].id);


  const [quizStep, setQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);


  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const activePillar = pillarsData.find(p => p.id === activePillarId) || pillarsData[0];
  const activeSubCategory = activePillar.subCategories.find(s => s.id === activeSubCatId) || activePillar.subCategories[0];
  const currentQuizData = activeSubCategory.quiz;


  const resetQuiz = () => {
    setQuizStep(0);
    setSelectedOption(null);
    setScoreCount(0);
    setIsQuizFinished(false);
  };


  useEffect(() => {
    setActiveSubCatId(activePillar.subCategories[0].id);
    resetQuiz();
  }, [activePillarId]);


  useEffect(() => {
    resetQuiz();
  }, [activeSubCatId]);


  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };






  const handleNextQuestion = () => {
    if (selectedOption === currentQuizData[quizStep].correct) {
      setScoreCount(prev => prev + 1);
    }
    if (quizStep < currentQuizData.length - 1) {
      setQuizStep(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizFinished(true);
    }
  };

  const finalScore = currentQuizData.length > 0
    ? Math.round((scoreCount / currentQuizData.length) * 100)
    : 0;

  return (
    <section className={`w-full min-h-screen bg-[#FAFAFA] pt-24 pb-20 ${dmSans.className}`}>
      <div className="w-full px-6 md:px-12 lg:px-[315px] mx-auto">



        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">


          <div className="lg:hidden w-full mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pilih Materi</h3>
            </div>

            {pillarsData.map((pillar) => {
              const isActive = activePillarId === pillar.id;
              return (
                <div key={pillar.id} className="border-b border-gray-50 last:border-0">

                  <button
                    onClick={() => setActivePillarId(pillar.id)}
                    className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${isActive ? 'bg-[#FDF8F3] text-[#C9A86A]' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <pillar.icon size={20} />
                      <span className="font-semibold">{pillar.title}</span>
                    </div>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </button>


                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="p-2 space-y-1">
                          {pillar.subCategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveSubCatId(sub.id);

                              }}
                              className={`w-full text-left px-4 py-3 rounded-lg text-sm ml-4 border-l-2 transition-all ${activeSubCatId === sub.id
                                ? 'border-[#C9A86A] text-[#C9A86A] bg-gray-50 font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                              {sub.title}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>


          <div className="hidden lg:block w-1/4 sticky top-24 z-20">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">
                Kategori Latihan
              </h3>
              <nav className="space-y-1">
                {pillarsData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePillarId(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activePillarId === item.id
                      ? 'bg-[#FDF8F3] text-[#C9A86A] shadow-sm ring-1 ring-[#C9A86A]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <item.icon size={18} className={activePillarId === item.id ? 'text-[#C9A86A]' : 'text-gray-400'} />
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>


          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillarId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >

                <div className="mb-8 hidden lg:block">
                  <h1 className="text-4xl font-bold text-[#231F1E] mb-2">{activePillar.title}</h1>
                  <p className="text-gray-500 text-sm">Pilih materi spesifik di bawah ini.</p>
                </div>


                <div className="hidden lg:flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                  {activePillar.subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCatId(sub.id)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${activeSubCatId === sub.id
                        ? 'bg-[#231F1E] text-white border-[#231F1E]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#C9A86A] hover:text-[#C9A86A]'
                        }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>


                <div className="lg:hidden mb-6 border-b pb-4 border-gray-200">
                  <h2 className="text-2xl font-bold text-[#231F1E]">{activeSubCategory.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">{activePillar.title}</p>
                </div>

                <motion.div
                  key={activeSubCatId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="text-[#C9A86A]" size={20} />
                      <h3 className="text-lg font-bold text-[#231F1E]">Penjelasan Materi</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeSubCategory.explanationFrames.map((frame, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                          <div className="w-8 h-1 bg-[#C9A86A] rounded-full mb-4"></div>
                          <h4 className="font-bold text-gray-900 mb-3 text-lg">{frame.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed text-justify">{frame.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>


                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <PlayCircle className="text-[#C9A86A]" size={20} />
                      <h3 className="text-lg font-bold text-[#231F1E]">Video Tutorial</h3>
                    </div>
                    <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg border-4 border-white relative">
                      {activeSubCategory.videoId ? (() => {

                        const getVideoId = (url: string) => {
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                          const match = url.match(regExp);
                          return (match && match[2].length === 11) ? match[2] : url;
                        };
                        const vidId = getVideoId(activeSubCategory.videoId);

                        return (
                          <iframe
                            width="100%" height="100%"
                            src={`https://www.youtube.com/embed/${vidId}`}
                            title={activeSubCategory.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        );
                      })() : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">Video belum tersedia</div>
                      )}
                    </div>
                  </div>


                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="text-[#C9A86A]" size={20} />
                      <h3 className="text-lg font-bold text-[#231F1E]">Gambar Tutorial</h3>
                    </div>

                    {activeSubCategory.imageTutorials && activeSubCategory.imageTutorials.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeSubCategory.imageTutorials.map((img: any, idx: number) => (
                          <div key={idx} className="group relative bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative bg-gray-100">
                              <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />


                              <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => setSelectedImage(img.url)}
                                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg shadow-lg transition-all transform hover:scale-110"
                                  title="Perbesar Layar"
                                >
                                  <Maximize2 size={20} />
                                </button>
                              </div>
                            </div>
                            <p className="mt-3 mb-1 text-center font-bold text-gray-700 text-sm">{img.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                        Belum ada gambar tutorial tersedia.
                      </div>
                    )}
                  </div>


                  <div className="bg-[#FFFBF2] p-6 md:p-10 rounded-3xl border border-[#F5E6D3] min-h-[400px] relative overflow-hidden">
                    {currentQuizData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">Belum ada kuis tersedia.</div>
                    ) : !isQuizFinished ? (
                      <motion.div
                        key={quizStep}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="text-[#C9A86A]" size={24} />
                            <h3 className="text-xl font-bold text-[#231F1E]">Uji Pemahaman</h3>
                          </div>
                          <span className="bg-white px-4 py-1 rounded-full text-sm font-bold text-[#C9A86A] border border-[#C9A86A]">
                            {quizStep + 1} / {currentQuizData.length}
                          </span>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-lg md:text-xl font-bold text-[#231F1E] leading-relaxed">
                            {currentQuizData[quizStep].question}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-8">
                          {currentQuizData[quizStep].options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const label = String.fromCharCode(65 + idx);
                            return (
                              <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={`relative flex items-center p-4 rounded-xl border text-left transition-all duration-200 group
                                                    ${isSelected
                                    ? 'bg-[#231F1E] border-[#231F1E] text-white shadow-lg scale-[1.01]'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#C9A86A] hover:text-[#C9A86A]'
                                  }
                                                `}
                              >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mr-4 transition-colors
                                                    ${isSelected ? 'bg-[#C9A86A] text-[#231F1E]' : 'bg-gray-100 text-gray-500 group-hover:bg-[#C9A86A] group-hover:text-white'}
                                                `}>
                                  {label}
                                </span>
                                <span className="text-sm md:text-base font-medium flex-grow">{opt}</span>
                                {isSelected && <CheckCircle2 size={20} className="text-[#C9A86A]" />}
                              </button>
                            );
                          })}
                        </div>

                        {selectedOption !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end"
                          >
                            <button
                              onClick={handleNextQuestion}
                              className="bg-[#C9A86A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b8965e] transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-1"
                            >
                              {quizStep === currentQuizData.length - 1 ? "Kumpulkan" : "Lanjut"}
                              <ChevronRight size={20} />
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center h-full py-10"
                      >
                        {finalScore === 100 ? (
                          <>
                            <motion.div
                              initial={{ rotate: -10, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                              className="relative mb-6"
                            >
                              <Trophy size={100} className="text-[#FFD700] fill-[#FFD700]" />
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-10 -left-10 w-[180px] h-[180px] bg-yellow-400/20 rounded-full blur-3xl -z-10"
                              />
                              <Star size={40} className="absolute -top-2 -right-8 text-[#C9A86A] fill-[#C9A86A] animate-bounce" />
                              <Star size={30} className="absolute top-10 -left-8 text-[#C9A86A] fill-[#C9A86A] animate-pulse" />
                            </motion.div>

                            <h2 className="text-4xl font-bold text-[#231F1E] mb-2">Luar Biasa!</h2>
                            <p className="text-gray-500 mb-6">Kamu menjawab semua pertanyaan dengan benar.</p>
                            <div className="text-6xl font-black text-[#C9A86A] mb-8">100</div>
                            <div className="px-6 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              Sempurna
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-6 relative">
                              <div className="w-32 h-32 rounded-full border-8 border-[#C9A86A] flex items-center justify-center">
                                <span className="text-4xl font-bold text-[#231F1E]">{finalScore}</span>
                              </div>
                            </div>

                            <h2 className="text-2xl font-bold text-[#231F1E] mb-2">Quiz Selesai</h2>
                            <p className="text-gray-500 mb-8">Kamu menjawab {scoreCount} dari {currentQuizData.length} soal dengan benar.</p>

                            <button
                              onClick={resetQuiz}
                              className="flex items-center gap-2 bg-[#231F1E] text-white px-8 py-3 rounded-full font-bold hover:bg-[#3d3635] transition-all shadow-lg"
                            >
                              <RefreshCcw size={18} />
                              Mulai Ulang
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>

                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Fullscreen Preview"
              className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}