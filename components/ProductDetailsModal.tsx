import React, { useEffect, useState } from 'react';
import { X, Clock, Bookmark, ChevronDown, Check, Tag, Gift, CreditCard, SlidersHorizontal, ChevronUp, Image, Star, MessageSquare } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number, e?: React.MouseEvent) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  isOpen, 
  onClose,
  onAddToCart 
}) => {
  const [selectedPack, setSelectedPack] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'packs' | 'custom'>('packs');
  const [customQuantity, setCustomQuantity] = useState(1);
  
  // Functional Discounts State
  const [bankDiscountActive, setBankDiscountActive] = useState(false);
  const [specialDiscountActive, setSpecialDiscountActive] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset state on open
      setSelectedPack(0);
      setActiveImageIndex(0);
      setIsOffersOpen(false);
      setActiveTab('packs');
      setCustomQuantity(1);
      setBankDiscountActive(false);
      setSpecialDiscountActive(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Constants & Formatting
  const baseMrpMultiplier = 1.3;
  const baseDiscount = 23;
  const displayUnit = product.unit;
  
  // Check if unit allows decimals (weights/volumes)
  const isDecimalUnit = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'gallon'].includes(displayUnit.toLowerCase());
  const quantityStep = isDecimalUnit ? 0.5 : 1;
  const minQuantity = isDecimalUnit ? 0.5 : 1;

  // Calculate Extra Discount
  const totalExtraDiscountPercent = (bankDiscountActive ? 10 : 0) + (specialDiscountActive ? 5 : 0);

  const packOptions = [
    { 
      id: 0, 
      size: `1 ${displayUnit}`, 
      quantity: 1,
      price: product.price * (1 - totalExtraDiscountPercent/100), 
      mrp: product.price * baseMrpMultiplier, 
      discount: baseDiscount + totalExtraDiscountPercent
    },
    { 
      id: 1, 
      size: `2 ${displayUnit}s`, 
      quantity: 2,
      price: (product.price * 2) * (1 - totalExtraDiscountPercent/100), 
      mrp: (product.price * 2) * baseMrpMultiplier, 
      discount: baseDiscount + totalExtraDiscountPercent
    }
  ];

  // Custom size calculation
  const customPrice = (product.price * customQuantity) * (1 - totalExtraDiscountPercent/100);
  const customMrp = (product.price * customQuantity) * baseMrpMultiplier;

  // Determine current display values based on active tab
  const currentPrice = activeTab === 'packs' ? packOptions[selectedPack].price : customPrice;
  const currentMrp = activeTab === 'packs' ? packOptions[selectedPack].mrp : customMrp;
  const currentQuantity = activeTab === 'packs' ? packOptions[selectedPack].quantity : customQuantity;

  // Determine images to show
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.image ? [product.image] : []);

  const activeSrc = images[activeImageIndex];

  // Sort reviews by rating (desc) and take top 2
  const topReviews = product.reviews 
    ? [...product.reviews].sort((a, b) => b.rating - a.rating).slice(0, 2)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content - Adjusted to max-w-4xl for medium overall size */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors shadow-sm"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Left Column: Image Gallery & Reviews - Width set to 1/2 for medium image size */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-gray-50 dark:bg-gray-900/50 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[95vh] no-scrollbar">
            
            <div className="flex justify-between items-start mb-4">
               {/* Delivery Badge */}
               <div className="flex items-center gap-1 bg-white dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
                   <Clock className="w-3 h-3" /> 10 MINS DELIVERY
               </div>
            </div>

            {/* Main Image Container (1:1 Rounded Square) */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 mb-6 group">
                {activeSrc ? (
                    <img 
                        src={activeSrc} 
                        alt={product.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${!product.inStock ? 'grayscale opacity-50' : 'group-hover:scale-110'}`}
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-300 dark:text-gray-600">
                        <Image className="w-16 h-16 mb-2 opacity-30" />
                        <span className="text-xs font-bold uppercase tracking-wider">No Preview</span>
                    </div>
                )}
                {!product.inStock && activeSrc && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
                        <span className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold text-sm shadow-xl tracking-wide uppercase">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation Pane - Centered & Organized */}
            {images.length > 1 && (
                <div className="flex justify-center w-full mb-6">
                  <div className="flex gap-3 overflow-x-auto py-2 px-4 no-scrollbar bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-full">
                    {images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                          activeImageIndex === idx 
                            ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900 scale-105 opacity-100' 
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img 
                          src={src} 
                          alt={`View ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
            )}

            {/* Reviews Section - Compact & Limited to Top 2 */}
            <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Top Reviews</h3>
                </div>
                
                {topReviews.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topReviews.map((review: Review) => (
                            <div key={review.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs text-gray-900 dark:text-white">{review.user}</span>
                                        <span className="text-[9px] text-gray-400 font-medium">{review.date}</span>
                                    </div>
                                    <div className="flex text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded text-[10px]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 italic">No reviews yet for this product.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Details - Width set to 1/2 with increased text sizes */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-white dark:bg-gray-800 overflow-y-auto no-scrollbar">
            {/* Header / Brand */}
            <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-md uppercase tracking-wide">
                    {product.category}
                </span>
                {product.isHotDeal && (
                   <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-md uppercase tracking-wide flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Hot Deal
                   </span>
                )}
            </div>

            {/* Increased text size */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                {product.name}
            </h1>

            {/* Price Block */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-end gap-3 mb-2">
                    {/* Increased price size */}
                    <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                        ${currentPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl text-gray-400 font-medium line-through mb-2 decoration-2">
                        ${currentMrp.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        <Gift className="w-4 h-4" />
                        Save {Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}%
                    </div>
                </div>
            </div>

            {/* Promo Banner / Hot Discounts */}
            <div className="mb-8">
               <button 
                 onClick={() => setIsOffersOpen(!isOffersOpen)}
                 className="w-full bg-gradient-to-r from-[#eefbe7] to-white dark:from-emerald-900/20 dark:to-gray-800 border border-[#dff0d8] dark:border-emerald-800/50 text-[#3c763d] dark:text-emerald-400 px-5 py-4 rounded-xl flex justify-between items-center cursor-pointer hover:shadow-md transition-all group"
               >
                  {/* Increased text size */}
                  <span className="font-bold text-lg flex items-center gap-3">
                    <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Tag className="w-4 h-4" />
                    </div>
                    Available Offers
                  </span>
                  {isOffersOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
               </button>
               
               {/* Expandable Offers List */}
               {isOffersOpen && (
                 <div className="mt-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    <div 
                        className={`flex gap-3 items-start cursor-pointer p-3 rounded-lg transition-all border ${bankDiscountActive ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}`} 
                        onClick={() => setBankDiscountActive(!bankDiscountActive)}
                    >
                       <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${bankDiscountActive ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
                           {bankDiscountActive && <Check className="w-3.5 h-3.5 text-white" />}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Bank Offer (10%)</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">10% Instant Discount on HDFC Bank</p>
                       </div>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2"></div>
                    <div 
                        className={`flex gap-3 items-start cursor-pointer p-3 rounded-lg transition-all border ${specialDiscountActive ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}`} 
                        onClick={() => setSpecialDiscountActive(!specialDiscountActive)}
                    >
                       <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${specialDiscountActive ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
                           {specialDiscountActive && <Check className="w-3.5 h-3.5 text-white" />}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Special Price (5%)</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Get extra 5% off</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Selection Tabs */}
            <div className="bg-gray-100 dark:bg-gray-700/50 p-1.5 rounded-xl flex mb-6">
               <button 
                 onClick={() => setActiveTab('packs')}
                 className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all ${activeTab === 'packs' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 Pack Sizes
               </button>
               <button 
                 onClick={() => setActiveTab('custom')}
                 className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'custom' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 <SlidersHorizontal className="w-4 h-4" /> Custom Size
               </button>
            </div>

            {/* Pack Size / Custom Selection */}
            <div className="mb-8 flex-1">
              {activeTab === 'packs' ? (
                <div className="space-y-3">
                    {packOptions.map((option, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedPack(idx)}
                            className={`relative border-2 rounded-xl p-4 cursor-pointer flex justify-between items-center transition-all group ${
                                selectedPack === idx 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm' 
                                : 'border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                            }`}
                        >
                            <div className="flex flex-col">
                                {/* Increased Size */}
                                <span className="font-bold text-lg text-gray-900 dark:text-white mb-0.5">{option.size}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">${option.price.toFixed(2)}</span>
                                    <span className="text-xs text-gray-400 line-through">${option.mrp.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                                    {Math.round(option.discount)}% OFF
                                </span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPack === idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {selectedPack === idx && <Check className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Choose quantity</span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {customQuantity} <span className="text-base font-normal text-gray-500 dark:text-gray-400">{displayUnit}{customQuantity > 1 && 's'}</span>
                      </span>
                   </div>
                   
                   <div className="relative mb-8">
                       <input 
                          type="range" 
                          min={minQuantity}
                          max="10" 
                          step={quantityStep}
                          value={customQuantity}
                          onChange={(e) => setCustomQuantity(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                       />
                       <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                          <span>{minQuantity}</span>
                          <span>5</span>
                          <span>10</span>
                       </div>
                   </div>

                   <div className="bg-white dark:bg-gray-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-400 uppercase">Estimated Price</span>
                         <span className="font-black text-xl text-gray-900 dark:text-white">${customPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                         <Check className="w-3 h-3" /> In Stock
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-auto">
                <button
                    onClick={(e) => onAddToCart(product, currentQuantity, e)}
                    disabled={!product.inStock}
                    className="w-full bg-[#da251d] hover:bg-[#b01e17] text-white font-black py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xl tracking-widest transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <span>Add to Basket</span>
                    <span className="bg-white/20 px-3 py-0.5 rounded text-white text-base font-bold">
                        ${currentPrice.toFixed(2)}
                    </span>
                </button>
            </div>

            {/* Highlights */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-400 dark:text-gray-500 mb-3 text-xs uppercase tracking-widest">Product Highlights</h3>
                <div className="flex flex-wrap gap-2">
                    {product.highlights && product.highlights.length > 0 ? (
                        product.highlights.map((highlight, idx) => (
                            <span key={idx} className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100 dark:border-gray-700 shadow-sm">
                                {highlight}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400 italic">No highlights available</span>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;