import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Truck, Gift, Tag, ChevronRight } from 'lucide-react';
import { CartItem, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: (product: Product, quantity?: number, e?: React.MouseEvent) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart
}: CartSidebarProps) {
  const [promoCode, setPromoCode] = useState('');
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
  const progressPercent = Math.min(100, (total / freeShippingThreshold) * 100);

  // Suggest 3 items related to current cart categories
  const cartCategories = new Set(items.map(item => item.category));
  const suggestedProducts = MOCK_PRODUCTS
    .filter(p => 
      !items.find(i => i.id === p.id) && // Not already in cart
      (cartCategories.size === 0 || cartCategories.has(p.category)) // Match category
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[480px] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Your Cart 
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        {items.length}
                    </span>
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                   <div className="flex items-center gap-2 mb-2 text-sm">
                      <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {remainingForFreeShipping > 0 ? (
                          <span className="text-gray-700 dark:text-gray-300">
                             Add <span className="font-bold text-emerald-600 dark:text-emerald-400">${remainingForFreeShipping.toFixed(2)}</span> for <span className="font-bold text-emerald-600 dark:text-emerald-400">Free Shipping</span>
                          </span>
                      ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                             🎉 You've unlocked Free Shipping!
                          </span>
                      )}
                   </div>
                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${progressPercent}%` }}
                      >
                         <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                   </div>
                </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 relative">
                    <ShoppingBag className="w-10 h-10 opacity-30" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
                <div>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Your cart is empty</p>
                    <p className="text-sm max-w-[200px] mx-auto">Looks like you haven't added anything yet. Explore our fresh categories!</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-[#155e37] text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="group flex gap-4 p-3 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-600 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start">
                                <div>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${item.price.toFixed(2)} / {item.unit}</p>
                                </div>
                                <button 
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                                <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 rounded shadow-sm hover:text-red-500 transition-colors"
                                title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                                >
                                {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                                </button>
                                <span className="text-sm font-bold w-4 text-center text-gray-700 dark:text-gray-200">{item.quantity}</span>
                                <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 rounded shadow-sm hover:text-emerald-600 transition-colors"
                                >
                                <Plus className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-gray-900 dark:text-white block">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                    Qty: {item.quantity}
                                </span>
                            </div>
                            </div>
                        </div>
                        </div>
                    ))}
                  </div>

                  {/* Smart Upsell Section */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                     <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-yellow-500" /> You might also like
                     </h3>
                     <div className="grid grid-cols-3 gap-3">
                         {suggestedProducts.map(p => (
                             <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-2 flex flex-col gap-2 hover:shadow-md transition-shadow group cursor-pointer" onClick={(e) => onAddToCart(p, 1, e)}>
                                 <div className="aspect-square rounded-lg bg-gray-50 dark:bg-gray-700 overflow-hidden relative">
                                    <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                                    <button className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="w-3 h-3 text-emerald-600" />
                                    </button>
                                 </div>
                                 <div>
                                     <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">${p.price}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                  </div>
                </>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20">
               {/* Promo Code Input */}
               <div className="flex gap-2 mb-6">
                   <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Promo Code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                   </div>
                   <button className="bg-gray-900 dark:bg-gray-700 text-white px-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                       Apply
                   </button>
               </div>

              <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
                    <span>Shipping</span>
                    {total >= freeShippingThreshold ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
                    ) : (
                        <span>$5.00</span>
                    )}
                 </div>
                 <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">Total</span>
                    <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        ${(total + (total >= freeShippingThreshold ? 0 : 5)).toFixed(2)}
                    </span>
                 </div>
              </div>
              <button className="group w-full py-4 bg-[#155e37] text-white rounded-xl font-bold text-lg hover:bg-emerald-800 active:transform active:scale-[0.98] transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2">
                Checkout Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
      </div>
    </>
  );
}