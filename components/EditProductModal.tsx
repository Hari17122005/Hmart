import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Upload, Plus, Image } from 'lucide-react';
import { Product } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => void;
  onDelete?: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSave, onDelete }: EditProductModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');

  useEffect(() => {
    if (product) {
        // Ensure images array is initialized if missing, so the gallery works
        const initialImages = (product.images && product.images.length > 0) 
            ? product.images 
            : (product.image ? [product.image] : []);
            
        setEditedProduct({ 
            ...product,
            images: initialImages
        });
        setHighlightsInput(product.highlights ? product.highlights.join(', ') : '');
        setUrlInput('');
    }
  }, [product]);

  if (!isOpen || !editedProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      const updatedProduct = {
          ...editedProduct,
          highlights: highlightsInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      onSave(updatedProduct);
      onClose();
    }
  };

  const handleDelete = () => {
      if(onDelete && confirm('Are you sure you want to delete this product?')) {
          onDelete();
      }
  };

  const addImageUrl = () => {
      if (!urlInput.trim()) return;
      
      setEditedProduct(prev => {
          if (!prev) return null;
          const newImages = [...(prev.images || []), urlInput.trim()];
          return {
              ...prev,
              images: newImages,
              image: newImages[0] // Main image is always first
          };
      });
      setUrlInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setEditedProduct(prev => {
                if (!prev) return null;
                const newImages = [...(prev.images || []), base64String];
                return {
                    ...prev,
                    image: newImages[0], // Main image is always first
                    images: newImages
                };
            });
        };
        reader.readAsDataURL(file);
    }
  };

  const removeImage = (indexToRemove: number) => {
      setEditedProduct(prev => {
          if (!prev) return null;
          const currentImages = prev.images || [];
          const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
          
          return {
              ...prev,
              images: updatedImages,
              image: updatedImages.length > 0 ? updatedImages[0] : ''
          };
      });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600">
                    <Save className="w-5 h-5" />
                </span>
                Quick Edit Product
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2 p-1">
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <input 
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        value={editedProduct.name}
                        onChange={e => setEditedProduct({...editedProduct, name: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                        <input 
                            type="number"
                            step="0.01"
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            value={editedProduct.price}
                            onChange={e => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Status</label>
                        <select 
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            value={editedProduct.inStock ? 'true' : 'false'}
                            onChange={e => setEditedProduct({...editedProduct, inStock: e.target.value === 'true'})}
                        >
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlights</label>
                    <input 
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        value={highlightsInput}
                        onChange={e => setHighlightsInput(e.target.value)}
                        placeholder="Comma separated values"
                    />
                </div>

                {/* Image Management Section */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Images Gallery</label>
                    <p className="text-xs text-gray-400 mb-3">Upload multiple images. The first image will be used as the main product cover.</p>
                    
                    {/* Add Image URL Input */}
                    <div className="flex gap-2 mb-4">
                        <input 
                            className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900 dark:text-white"
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            placeholder="Add Image URL..."
                        />
                        <button 
                            type="button"
                            onClick={addImageUrl}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 rounded-xl font-bold text-sm transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image Grid & Upload */}
                    <div className="grid grid-cols-4 gap-3">
                        {/* Upload Button */}
                        <div className="relative aspect-square bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 mb-1" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Upload</span>
                        </div>

                        {/* Existing Images */}
                        {editedProduct.images && editedProduct.images.length > 0 ? (
                            editedProduct.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group bg-white dark:bg-gray-900">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[9px] text-center font-bold py-0.5">
                                            MAIN
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-400 text-xs flex-col gap-2 p-4 text-center">
                                <Image className="w-6 h-6 opacity-50" />
                                <span>No Images Available</span>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex gap-4">
             {onDelete && (
                 <button 
                    type="button"
                    onClick={handleDelete}
                    className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"
                    title="Delete Product"
                 >
                     <Trash2 className="w-5 h-5" />
                 </button>
             )}
            <button 
                type="submit" 
                form="edit-form"
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
                <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}