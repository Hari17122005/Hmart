import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, ShoppingBag, Save, Edit2, Camera } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
}

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'addresses' | 'orders'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdateUser({
                  ...user,
                  profileImage: reader.result as string
              });
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700 p-6 flex flex-col">
            <div className="text-center mb-6 relative group">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 overflow-hidden relative border-2 border-emerald-100 dark:border-emerald-800">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-10 h-10" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>

            <nav className="space-y-2">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-white dark:bg-gray-800 shadow-sm text-emerald-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <User className="w-4 h-4" /> Personal Details
                </button>
                <button 
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'addresses' ? 'bg-white dark:bg-gray-800 shadow-sm text-emerald-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <MapPin className="w-4 h-4" /> Saved Addresses
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-gray-800 shadow-sm text-emerald-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <ShoppingBag className="w-4 h-4" /> Order History
                </button>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10">
                <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-8 overflow-y-auto h-full pt-16 md:pt-8">
                {activeTab === 'details' && (
                    <div className="h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-2 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors" 
                                    title="Edit Details"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Details</h2>
                        </div>
                        
                        {isEditing ? (
                            <form onSubmit={handleSave} className="flex flex-col h-full">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                                        <input 
                                            type="email" 
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-auto">
                                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="p-3 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                        <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Full Name</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="p-3 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="p-3 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                        <Phone className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{user.phone || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Saved Addresses</h2>
                        {user.savedAddresses && user.savedAddresses.length > 0 ? (
                            <div className="space-y-4">
                                {user.savedAddresses.map((addr, idx) => (
                                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                                        <p className="text-gray-700 dark:text-gray-300">{addr}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10">
                                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No saved addresses found.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Purchase History</h2>
                        {/* Mock Orders for Demo */}
                        <div className="space-y-4">
                            {[1, 2].map((order) => (
                                <div key={order} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-900 dark:text-white">Order #{2390 + order}</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Delivered</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">Jan {10 + order}, 2024</p>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{3 + order} Items</span>
                                        <span className="font-bold text-emerald-600">${(45.50 * order).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}