import React, { useState } from 'react';
import { X, Package, Trash2, Plus, DollarSign, Users, BarChart3, Upload, Search, ArrowRight, Layout, Image as ImageIcon, UserPlus, Flame, Settings as SettingsIcon, Tag, Save } from 'lucide-react';
import { Product, HeroSlide, SideBanner, User } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
  users: User[];
  onAddUser: (user: User) => void;
  onRemoveUser: (id: string) => void;
  heroSlides: HeroSlide[];
  onUpdateHero: (slides: HeroSlide[]) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  sideBanners?: SideBanner[];
  onUpdateSideBanners?: (banners: SideBanner[]) => void;
  // New props for store settings
  storeName?: string;
  storeLogo?: string;
  onUpdateStoreSettings?: (name: string, logo: string) => void;
  // New props for Hot Deals
  onUpdateProduct?: (product: Product) => void;
}

export default function AdminDashboard({ 
    isOpen, 
    onClose, 
    products, 
    onAddProduct, 
    onRemoveProduct, 
    users, 
    onAddUser, 
    onRemoveUser, 
    heroSlides, 
    onUpdateHero, 
    categories, 
    onAddCategory, 
    sideBanners, 
    onUpdateSideBanners, 
    storeName = "H Mart", 
    storeLogo = "", 
    onUpdateStoreSettings, 
    onUpdateProduct 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'hero' | 'categories' | 'settings' | 'hot-deals'>('overview');
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Store Settings State
  const [settingsName, setSettingsName] = useState(storeName);
  const [settingsLogo, setSettingsLogo] = useState(storeLogo);
  
  // Product View State
  const [productViewMode, setProductViewMode] = useState<'categories' | 'list'>('categories');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState<string>('');

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: categories[0],
    unit: 'kg',
    image: '',
    images: [],
    description: '',
    inStock: true,
    badge: 'Fresh',
    highlights: []
  });
  const [highlightsInput, setHighlightsInput] = useState('');

  const [newUser, setNewUser] = useState({
      username: '',
      password: '',
      email: ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [editingSlides, setEditingSlides] = useState<HeroSlide[]>(heroSlides);
  const [editingSideBanners, setEditingSideBanners] = useState<SideBanner[]>(sideBanners || []);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      Promise.all(files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })).then(base64Images => {
        setNewProduct(prev => ({
            ...prev,
            image: prev.image || base64Images[0], 
            images: [...(prev.images || []), ...base64Images]
        }));
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => setSettingsLogo(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.image) {
      onAddProduct({
        id: Date.now().toString(),
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category || categories[0],
        unit: newProduct.unit || 'kg',
        image: newProduct.image,
        images: newProduct.images,
        description: newProduct.description || 'Fresh item added by admin.',
        inStock: true,
        badge: newProduct.badge || '',
        highlights: highlightsInput.split(',').map(h => h.trim()).filter(Boolean)
      });
      setIsAddMode(false);
      setNewProduct({
        name: '', price: 0, category: categories[0], unit: 'kg', image: '', images: [], description: '', inStock: true, badge: 'Fresh', highlights: []
      });
      setHighlightsInput('');
    }
  };

  const handleSaveSettings = () => {
      if(onUpdateStoreSettings) {
          onUpdateStoreSettings(settingsName, settingsLogo);
          alert("Store settings saved!");
      }
  };

  const toggleHotDeal = (product: Product) => {
      if (onUpdateProduct) {
          onUpdateProduct({
              ...product,
              isHotDeal: !product.isHotDeal,
              salePrice: !product.isHotDeal ? Number((product.price * 0.8).toFixed(2)) : undefined
          });
      }
  };

  const updateSalePrice = (product: Product, newPrice: number) => {
      if (onUpdateProduct) {
          onUpdateProduct({
              ...product,
              salePrice: newPrice
          });
      }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedAdminCategory ? p.category === selectedAdminCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-black text-xl text-[#155e37] dark:text-emerald-400 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" /> Admin
                </h2>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><BarChart3 className="w-5 h-5" /> Overview</button>
                <button onClick={() => { setActiveTab('products'); setProductViewMode('categories'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Package className="w-5 h-5" /> Products</button>
                <button onClick={() => setActiveTab('hot-deals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'hot-deals' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Flame className="w-5 h-5" /> Hot Deals</button>
                <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Layout className="w-5 h-5" /> Categories</button>
                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Users className="w-5 h-5" /> Users</button>
                <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'hero' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><ImageIcon className="w-5 h-5" /> Hero & Banners</button>
                <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><SettingsIcon className="w-5 h-5" /> Store Settings</button>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                 <button onClick={onClose} className="w-full py-2 text-sm font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">Exit Dashboard</button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">$24,500.00</h4>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">{users.length}</h4>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Products</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">{products.length}</h4>
                            </div>
                        </div>
                    </div>
                )}

                {/* USER MANAGEMENT */}
                {activeTab === 'users' && (
                    <div className="space-y-8">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border dark:border-gray-700">
                            <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add New User</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input 
                                    placeholder="Username" 
                                    className="p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={newUser.username}
                                    onChange={e => setNewUser({...newUser, username: e.target.value})}
                                />
                                <input 
                                    placeholder="Email" 
                                    type="email"
                                    className="p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={newUser.email}
                                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <input 
                                        placeholder="Password" 
                                        type="password"
                                        className="flex-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={newUser.password}
                                        onChange={e => setNewUser({...newUser, password: e.target.value})}
                                    />
                                    <button 
                                        onClick={() => {
                                            if(newUser.username && newUser.email && newUser.password) {
                                                onAddUser({
                                                    id: Date.now().toString(),
                                                    name: newUser.username,
                                                    email: newUser.email,
                                                    password: newUser.password,
                                                    role: 'user'
                                                });
                                                setNewUser({ username: '', email: '', password: '' });
                                            }
                                        }}
                                        className="bg-emerald-600 text-white px-6 rounded-xl font-bold hover:bg-emerald-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">All Users</h3>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-bold text-gray-500">
                                        <tr>
                                            <th className="p-4">User</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td className="p-4">
                                                    <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => onRemoveUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* CATEGORIES MANAGEMENT */}
                {activeTab === 'categories' && (
                    <div className="max-w-2xl">
                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Manage Categories</h3>
                        
                        <div className="flex gap-4 mb-8">
                            <input 
                                type="text" 
                                placeholder="New Category Name" 
                                className="flex-1 p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <button 
                                onClick={() => {
                                    if(newCategory) {
                                        onAddCategory(newCategory);
                                        setNewCategory('');
                                    }
                                }} 
                                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700"
                            >
                                Add
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((cat, idx) => (
                                <div key={idx} className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl flex justify-between items-center shadow-sm">
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{cat}</span>
                                    <span className="text-xs text-gray-400">{products.filter(p => p.category === cat).length} Products</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* HERO & BANNERS */}
                {activeTab === 'hero' && (
                    <div className="space-y-12">
                        {/* Hero Slides Config */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hero Slides Configuration</h3>
                                <button onClick={() => onUpdateHero(editingSlides)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Save className="w-4 h-4" /> Save Slides</button>
                            </div>
                            <div className="space-y-6">
                                {editingSlides.map((slide, index) => (
                                    <div key={slide.id} className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm">
                                        <h4 className="font-bold text-gray-500 uppercase text-xs mb-4">Slide {index + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
                                                    <input className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" value={slide.title} onChange={e => {
                                                        const newSlides = [...editingSlides];
                                                        newSlides[index].title = e.target.value;
                                                        setEditingSlides(newSlides);
                                                    }} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subtitle</label>
                                                    <textarea className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" rows={2} value={slide.subtitle} onChange={e => {
                                                        const newSlides = [...editingSlides];
                                                        newSlides[index].subtitle = e.target.value;
                                                        setEditingSlides(newSlides);
                                                    }} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Badge Text</label>
                                                    <input className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" value={slide.badge} onChange={e => {
                                                        const newSlides = [...editingSlides];
                                                        newSlides[index].badge = e.target.value;
                                                        setEditingSlides(newSlides);
                                                    }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Image URL</label>
                                                <input className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2" value={slide.image} onChange={e => {
                                                    const newSlides = [...editingSlides];
                                                    newSlides[index].image = e.target.value;
                                                    setEditingSlides(newSlides);
                                                }} />
                                                <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                                                    <img src={slide.image} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Side Banners Config */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Side Banners Configuration</h3>
                                <button onClick={() => onUpdateSideBanners && onUpdateSideBanners(editingSideBanners)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Save className="w-4 h-4" /> Save Banners</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {editingSideBanners.map((banner, index) => (
                                    <div key={banner.id} className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm">
                                        <h4 className="font-bold text-gray-500 uppercase text-xs mb-4">Banner {index + 1}</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
                                                <input className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" value={banner.title} onChange={e => {
                                                    const newBanners = [...editingSideBanners];
                                                    newBanners[index].title = e.target.value;
                                                    setEditingSideBanners(newBanners);
                                                }} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subtitle</label>
                                                <input className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" value={banner.subTitle} onChange={e => {
                                                    const newBanners = [...editingSideBanners];
                                                    newBanners[index].subTitle = e.target.value;
                                                    setEditingSideBanners(newBanners);
                                                }} />
                                            </div>
                                             <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Image URL</label>
                                                <div className="flex gap-2">
                                                     <input className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" value={banner.image} onChange={e => {
                                                        const newBanners = [...editingSideBanners];
                                                        newBanners[index].image = e.target.value;
                                                        setEditingSideBanners(newBanners);
                                                    }} />
                                                    <img src={banner.image} className="w-10 h-10 rounded object-cover border" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-xl">
                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Store Identity</h4>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Store Name</label>
                                <input type="text" className="w-full p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={settingsName} onChange={(e) => setSettingsName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Store Logo (Square recommended)</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border dark:border-gray-700">
                                        {settingsLogo ? <img src={settingsLogo} alt="Logo" className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                                    </div>
                                    <label className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Upload Logo <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                    </label>
                                </div>
                            </div>
                            <button onClick={handleSaveSettings} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700">Save Changes</button>
                        </div>
                    </div>
                )}

                {activeTab === 'hot-deals' && (
                    <div className="space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
                             <Flame className="w-5 h-5" /> Manage products in the "Hot Offers" section. Set a sale price to activate the discount badge.
                        </div>
                        <div className="space-y-2">
                            {products.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{product.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">${product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {product.isHotDeal && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sale Price:</span>
                                                <input 
                                                    type="number" 
                                                    className="w-24 p-1 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    value={product.salePrice}
                                                    onChange={(e) => updateSalePrice(product, parseFloat(e.target.value))}
                                                />
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => toggleHotDeal(product)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${product.isHotDeal ? 'bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                                        >
                                            {product.isHotDeal ? 'Active Deal' : 'Add to Deals'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PRODUCT MANAGEMENT LOGIC */}
                {activeTab === 'products' && !isAddMode && productViewMode === 'categories' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Select Category</h3>
                            <button onClick={() => setIsAddMode(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((cat, idx) => (
                                <div key={idx} onClick={() => { setSelectedAdminCategory(cat); setProductViewMode('list'); }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-all group">
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{cat}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{products.filter(p => p.category === cat).length} Items</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && !isAddMode && productViewMode === 'list' && (
                    <div className="space-y-4">
                        <button onClick={() => setProductViewMode('categories')} className="text-sm font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2 hover:text-gray-800 dark:hover:text-white"><ArrowRight className="w-4 h-4 rotate-180" /> Back</button>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{selectedAdminCategory}</h3>
                        <table className="w-full text-left bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border dark:border-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Badge</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(p => (
                                    <tr key={p.id} className="border-t dark:border-gray-700">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={p.image} className="w-10 h-10 rounded object-cover" alt="" />
                                            <span className="font-bold text-sm text-gray-900 dark:text-white">{p.name}</span>
                                        </td>
                                        <td className="p-4 text-gray-900 dark:text-white">${p.price}</td>
                                        <td className="p-4"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{p.badge || '-'}</span></td>
                                        <td className="p-4 text-right"><button onClick={() => onRemoveProduct(p.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded"><Trash2 className="w-4 h-4" /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isAddMode && (
                     <div className="max-w-2xl mx-auto">
                        <button onClick={() => setIsAddMode(false)} className="mb-4 text-sm font-bold text-gray-500 dark:text-gray-400">Cancel</button>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">Add New Product</h3>
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div><label className="text-xs font-bold uppercase block mb-1 text-gray-500 dark:text-gray-400">Name</label><input className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold uppercase block mb-1 text-gray-500 dark:text-gray-400">Price</label><input type="number" className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} /></div>
                                    <div>
                                        <label className="text-xs font-bold uppercase block mb-1 text-gray-500 dark:text-gray-400">Badge (Fresh, etc)</label>
                                        <input className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g. Fresh" value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})} />
                                    </div>
                                </div>
                                <div><label className="text-xs font-bold uppercase block mb-1 text-gray-500 dark:text-gray-400">Category</label><select className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1 text-gray-500 dark:text-gray-400">Highlights (comma separated)</label>
                                    <input className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Farm Fresh, Organic, etc." value={highlightsInput} onChange={e => setHighlightsInput(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1 text-gray-500 dark:text-gray-400">Main Image</label>
                                    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Upload Image</span>
                                    </div>
                                    {newProduct.image && <img src={newProduct.image} className="mt-2 h-20 rounded" alt="preview" />}
                                </div>
                                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Save Product</button>
                            </form>
                        </div>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}