import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Ban, Image, Star, Eye, Pencil, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number, e?: React.MouseEvent) => void;
  onView: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onView, isAdmin, onEdit }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Reset error state if product image changes
  useEffect(() => {
    setImageError(false);
  }, [product.image, product.images]);

  // Determine available images
  const images = useMemo(() => {
      const imgs = (product.images && product.images.length > 0) 
        ? product.images 
        : (product.image ? [product.image] : []);
      return imgs.filter(Boolean);
  }, [product]);

  // Slideshow effect on hover
  useEffect(() => {
    let interval: number;
    if (isHovered && images.length > 1) {
      interval = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500); // Slide every 1.5s
    } else if (!isHovered) {
      setCurrentImageIndex(0); // Reset to main image when not hovered
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // Render stars based on rating
  const rating = product.rating || 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Determine price to display
  const finalPrice = product.isHotDeal && product.salePrice ? product.salePrice : product.price;
  const originalPrice = product.price;
  const discount = product.isHotDeal && product.salePrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-50 dark:border-gray-700/50 hover:border-emerald-100 dark:hover:border-emerald-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer relative hover:-translate-y-1`}
      onClick={() => onView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-yellow-400 text-yellow-900 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">
                {product.badge}
            </span>
          )}
          {product.isHotDeal && (
              <span className="bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Tag className="w-2 h-2" /> {discount}% OFF
              </span>
          )}
      </div>

      {/* Action Overlay */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1.5">
         {isAdmin && onEdit && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onEdit(product);
             }}
             className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md transition-colors"
             title="Edit Product"
           >
              <Pencil className="w-3.5 h-3.5" />
           </button>
         )}
         <button className="bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md text-gray-500 hover:text-emerald-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
         </button>
      </div>

      {/* Image Container with Sliding Effect */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        {images.length > 0 && !imageError ? (
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ 
                width: `${images.length * 100}%`,
                transform: `translateX(-${currentImageIndex * (100 / images.length)}%)`
            }}
          >
            {images.map((img, idx) => (
               <div key={`${product.id}-img-${idx}`} className="h-full relative" style={{ width: `${100 / images.length}%` }}>
                   <img
                    src={img}
                    alt={product.name}
                    className={`w-full h-full object-cover ${product.inStock ? 'group-hover:scale-105 transition-transform duration-[2000ms]' : 'grayscale opacity-50'}`}
                    loading="lazy"
                    onError={() => {
                        if (idx === 0) setImageError(true);
                    }}
                  />
               </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-full mb-1 shadow-sm">
                <Image className="w-6 h-6 opacity-30 text-emerald-600" />
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-50">No Preview</span>
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[1px] z-10">
            <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="mb-2">
           <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wide block mb-0.5">{product.category}</span>
           <h3 className={`font-bold text-gray-800 dark:text-gray-100 leading-tight mb-1 truncate text-xs md:text-sm ${!product.inStock && 'text-gray-400'}`}>
            {product.name}
           </h3>
           <div className="flex items-center gap-1">
              <div className="flex text-yellow-400 text-[10px]">
                 {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < fullStars ? 'fill-current' : (i === fullStars && hasHalfStar ? 'fill-current opacity-50' : 'text-gray-200 dark:text-gray-700')}`} 
                    />
                 ))}
              </div>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">({rating})</span>
           </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
           <div>
              <div className="flex items-baseline gap-1">
                 <span className={`text-base md:text-lg font-bold ${product.isHotDeal ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    ${finalPrice.toFixed(2)}
                 </span>
                 {(product.isHotDeal || finalPrice < originalPrice * 1.2) && (
                     <span className="text-[10px] text-gray-400 line-through">
                        ${(product.isHotDeal ? originalPrice : finalPrice * 1.2).toFixed(2)}
                     </span>
                 )}
              </div>
           </div>

           {product.inStock ? (
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onAddToCart(product, 1, e);
               }}
               className="bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 hover:text-white px-3 py-1.5 rounded-full transition-all font-bold flex items-center gap-1 group/btn shadow-sm hover:shadow-md"
             >
               <span className="text-[10px] md:text-xs font-bold">Add</span>
               <Plus className="w-3 h-3 md:w-4 md:h-4" />
             </button>
           ) : (
             <button disabled className="bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full p-1.5 cursor-not-allowed">
               <Ban className="w-4 h-4" />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;