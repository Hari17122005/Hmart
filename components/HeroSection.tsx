import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, ShieldCheck, Leaf, Image as ImageIcon } from 'lucide-react';
import { Category, HeroSlide, SideBanner } from '../types';

interface HeroSectionProps {
    onCategorySelect?: (category: string) => void;
    slides: HeroSlide[];
    sideBanners?: SideBanner[];
    onViewOffers?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCategorySelect, slides, sideBanners, onViewOffers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      {/* Main Banner Slider */}
      <div className="lg:col-span-2 relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-md group bg-gray-200 dark:bg-gray-800">
        {slides.length > 0 ? slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0">
              <img 
                src={slide.image}
                alt="Banner"
                className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${
                  index === currentSlide ? 'scale-110' : 'scale-100'
                }`}
                onError={(e) => {
                    // Fallback if image breaks
                    e.currentTarget.style.display = 'none';
                }}
              />
              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className={`relative z-10 p-8 md:p-12 flex flex-col justify-center h-full max-w-lg transition-all duration-700 delay-300 ${
              index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full w-fit mb-4 bg-yellow-400 text-yellow-900">
                <Truck className="w-5 h-5" />
                {slide.badge}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-sm">
                {slide.title}
              </h2>
              <p className="text-gray-200 mb-8 text-sm md:text-base font-medium max-w-md leading-relaxed">
                {slide.subtitle}
              </p>
              
              {/* Only show button for the 3rd slide (index 2) which is "Hot Offers" */}
              {index === 2 && slide.cta && (
                  <button 
                    onClick={onViewOffers}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-emerald-900/20 w-fit flex items-center gap-2 transform hover:-translate-y-1 active:scale-95"
                  >
                    {slide.cta} <ArrowRight className="w-4 h-4" />
                  </button>
              )}
            </div>
          </div>
        )) : (
            <div className="flex items-center justify-center h-full flex-col text-gray-500">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p>No slides configured</p>
            </div>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
            {slides.length > 0 && slides.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                      currentSlide === idx ? 'w-8 bg-yellow-400' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                />
            ))}
        </div>
      </div>

      {/* Side Banners - Interactive */}
      <div className="flex flex-col gap-6">
        {sideBanners && sideBanners.length > 0 ? (
            sideBanners.map(banner => (
                <div 
                    key={banner.id}
                    onClick={() => onCategorySelect?.(banner.categoryLink)}
                    className={`flex-1 rounded-3xl overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all duration-300 border ${
                        banner.theme === 'yellow' 
                            ? 'bg-yellow-50 border-yellow-100' 
                            : 'bg-emerald-50 border-emerald-100'
                    }`}
                >
                    <div className="absolute right-0 bottom-0 w-32 h-32">
                         <img 
                            src={banner.image} 
                            alt={banner.title}
                            className="w-full h-full object-cover opacity-90 rounded-tl-[3rem] group-hover:scale-110 transition-transform duration-500"
                         />
                    </div>
                    <div className="p-6 relative z-10">
                        <span className={`font-bold text-xs uppercase tracking-wider ${
                            banner.theme === 'yellow' ? 'text-yellow-700' : 'text-emerald-700'
                        }`}>
                            {banner.subTitle}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800 mt-2 mb-4 whitespace-pre-line">
                            {banner.title}
                        </h3>
                        <span className={`text-sm font-bold group-hover:underline flex items-center gap-1 group-hover:gap-2 transition-all ${
                            banner.theme === 'yellow' ? 'text-yellow-700' : 'text-emerald-700'
                        }`}>
                          {banner.cta} <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            ))
        ) : (
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-gray-400">
                No Banners
            </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;