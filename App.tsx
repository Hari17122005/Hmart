import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, Sparkles, Clock, SlidersHorizontal, ArrowUpDown, Sun, Moon, User as UserIcon, LayoutGrid, MessageCircle, MapPin, ChevronDown, LogOut, Settings, BarChart3, Tag, Menu, Trash2, LayoutDashboard } from 'lucide-react';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartSidebar from './components/CartSidebar';
import Assistant from './components/Assistant';
import HeroSection from './components/HeroSection';
import LocationModal from './components/LocationModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import OnboardingModal from './components/OnboardingModal';
import EditProductModal from './components/EditProductModal';
import UserProfileModal from './components/UserProfileModal';
import { MOCK_PRODUCTS, CATEGORIES, DEFAULT_USERS, DEFAULT_SLIDES, DEFAULT_SIDE_BANNERS } from './constants';
import { Product, CartItem, Category, SortOption, User, HeroSlide, SideBanner } from './types';
import { db } from './services/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Animation Component - Slowed Down
const FlyingItem: React.FC<{ src: string, start: {x: number, y: number}, end: {x: number, y: number}, onComplete: () => void }> = ({ src, start, end, onComplete }) => {
  return (
    <motion.div
      initial={{ 
        position: 'fixed',
        top: start.y,
        left: start.x,
        x: '-50%',
        y: '-50%',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.9,
        scale: 1,
        rotate: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
      animate={{
        top: end.y,
        left: end.x,
        scale: 0.1,
        rotate: 360,
        opacity: 0
      }}
      transition={{ 
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onAnimationComplete={onComplete}
    />
  );
};

const App: React.FC = () => {
  // Global App State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [sideBanners, setSideBanners] = useState<SideBanner[]>(DEFAULT_SIDE_BANNERS);

  // Store Settings
  const [storeName, setStoreName] = useState("H Mart");
  const [storeLogo, setStoreLogo] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState('Market City, ST');
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  // Auth & User State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Animation States
  // Added 'end' to state type definition to persist target location
  const [flyingItems, setFlyingItems] = useState<{id: number, src: string, start: {x: number, y: number}, end: {x: number, y: number}}[]>([]);
  const [cartBump, setCartBump] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const hotOffersRef = useRef<HTMLDivElement>(null);
  
  // New state for sorting and filtering
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hari_supermarket_recently_viewed');
    if (saved) {
      try {
        setRecentlyViewedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recently viewed', e);
      }
    }
  }, []);

  // Fetch initial products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
           id: doc.id,
           ...doc.data()
        })) as Product[];
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          // Fallback to MOCK_PRODUCTS if database is completely empty
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.error("Failed to load products from API:", err);
        setProducts(MOCK_PRODUCTS);
      }
    };
    loadProducts();
  }, []);

  const clearRecentlyViewed = () => {
      setRecentlyViewedIds([]);
      localStorage.removeItem('hari_supermarket_recently_viewed');
  };

  const getFilteredProducts = (category: string) => {
    let result = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !showInStockOnly || product.inStock;
      return matchesCategory && matchesSearch && matchesStock;
    });

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'featured': default: break;
    }
    return result;
  };

  const searchResults = useMemo(() => {
      if (!searchQuery.trim()) return [];
      return products.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
  }, [searchQuery, products]);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p);
  }, [recentlyViewedIds, products]);

  // Updated logic: Filter for products that are explicitly flagged as Hot Deals
  const hotOfferProducts = useMemo(() => {
      return products.filter(p => p.isHotDeal).slice(0, 8); // Limit to 8
  }, [products]);

  const getCartIconPos = () => {
      if (cartIconRef.current) {
          const rect = cartIconRef.current.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return { x: window.innerWidth - 50, y: 50 };
  };

  const addToCart = (product: Product, quantity: number = 1, e?: React.MouseEvent) => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    if (!product.inStock) return;
    
    if (e && cartIconRef.current) {
        const startX = e.clientX;
        const startY = e.clientY;
        const endPos = getCartIconPos(); // Calculate position once at start
        setFlyingItems(prev => [...prev, { 
            id: Date.now(), 
            src: product.image, 
            start: { x: startX, y: startY },
            end: endPos
        }]);
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity: quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== product.id);
      const newIds = [product.id, ...filtered].slice(0, 4);
      localStorage.setItem('hari_supermarket_recently_viewed', JSON.stringify(newIds));
      return newIds;
    });
    // Clear search when product selected
    setSearchQuery(''); 
  };

  const handleLogin = async (newUser: User) => { 
    setUser(newUser); 
    setIsAuthModalOpen(false); 
    setIsOnboardingOpen(true); 

    // Sync user profile to Firestore
    try {
      await setDoc(doc(db, 'users', newUser.id), {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage || null,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error syncing user to Firestore:", error);
    }
  };
  const handleSignup = (newUser: User) => { setUsers(prev => [...prev, newUser]); handleLogin(newUser); };
  const handleLogout = () => { setUser(null); setIsAccountMenuOpen(false); setIsAdminDashboardOpen(false); setCartItems([]); };
  const handleAddProduct = (newProduct: Product) => { setProducts(prev => [newProduct, ...prev]); };
  const handleRemoveProduct = (id: string) => { setProducts(prev => prev.filter(p => p.id !== id)); };
  const handleUpdateProduct = (updatedProduct: Product) => {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const handleAddUser = (newUser: User) => { setUsers(prev => [...prev, newUser]); };
  const handleRemoveUser = (id: string) => { setUsers(prev => prev.filter(u => u.id !== id)); };
  const handleAddCategory = (cat: string) => { setCategories(prev => [...prev, cat]); };
  const handleUpdateHero = (slides: HeroSlide[]) => { setHeroSlides(slides); };
  const handleUpdateSideBanners = (banners: SideBanner[]) => { setSideBanners(banners); };
  const handleQuickEdit = (updatedProduct: Product) => { handleUpdateProduct(updatedProduct); };
  const handleOpenCart = () => { if (!user) { setIsAuthModalOpen(true); return; } setIsCartOpen(true); };
  const handleOpenAssistant = () => { if (!user) { setIsAuthModalOpen(true); return; } setIsAssistantOpen(true); };
  const handleScrollToOffers = () => { if (hotOffersRef.current) { hotOffersRef.current.scrollIntoView({ behavior: 'smooth' }); } };
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300 font-sans" onClick={() => setIsAccountMenuOpen(false)}>
      {flyingItems.map(item => (
          <FlyingItem key={item.id} src={item.src} start={item.start} end={item.end}
            onComplete={() => { setFlyingItems(prev => prev.filter(i => i.id !== item.id)); setCartBump(true); setTimeout(() => setCartBump(false), 200); }}
          />
      ))}

      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-md py-2 bg-[#155e37] dark:bg-gray-900' : 'py-3 bg-[#155e37] dark:bg-gray-900'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer group" onClick={() => setSelectedCategory('All')}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-emerald-600 group-hover:scale-105 transition-transform overflow-hidden">
                 {storeLogo ? <img src={storeLogo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-[#155e37]">H</span>}
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black text-white tracking-tight leading-none italic group-hover:text-emerald-200 transition-colors whitespace-nowrap">{storeName}</h1>
              </div>
            </div>

            <div className={`order-3 md:order-2 w-full md:w-auto flex-1 md:max-w-md relative ${mobileSearchOpen ? 'block' : 'hidden md:block'}`}>
               <div className="w-full flex rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-lg border-2 border-transparent focus-within:border-yellow-400 transition-colors h-10 md:h-auto z-20 relative">
                  <input 
                    type="text" 
                    placeholder="Search fresh items..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="flex-1 px-4 md:px-6 py-2 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm" 
                  />
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 w-10 md:w-12 flex items-center justify-center transition-colors"><Search className="w-4 h-4 md:w-5 md:h-5" /></button>
               </div>
               
               {/* Search Dropdown */}
               {searchQuery && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-10 max-h-[300px] overflow-y-auto">
                       {searchResults.length > 0 ? (
                           searchResults.map(p => (
                               <div key={p.id} onClick={() => handleViewProduct(p)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0">
                                   <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                   <div className="flex-1 min-w-0">
                                       <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{p.name}</p>
                                       <p className="text-xs text-gray-500 dark:text-gray-400">${p.price} / {p.unit}</p>
                                   </div>
                                   <div className="text-xs font-bold text-emerald-600">View</div>
                               </div>
                           ))
                       ) : (
                           <div className="p-4 text-center text-gray-500 text-sm">No items found</div>
                       )}
                   </div>
               )}
            </div>

            <div className="order-2 md:order-3 flex items-center justify-end gap-1 md:gap-4 text-white flex-shrink-0">
              <button className="md:hidden p-2 hover:bg-white/10 rounded-full" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}><Search className="w-5 h-5" /></button>
              <button onClick={() => setIsLocationModalOpen(true)} className="flex items-center gap-2 hover:bg-white/10 p-1.5 md:px-3 rounded-lg transition-colors group" title="Change Location">
                 <MapPin className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                 <div className="flex-col items-start leading-none hidden lg:flex">
                    <span className="text-[10px] opacity-80 uppercase tracking-wide">Delivering to</span>
                    <span className="font-bold text-sm truncate max-w-[100px]">{location}</span>
                 </div>
              </button>
              <div className="w-px h-6 bg-white/10 hidden md:block"></div>
              <button onClick={toggleTheme} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Toggle Theme">{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
              
              {/* Admin Dashboard Icon */}
              {user?.role === 'admin' && (
                  <button onClick={() => setIsAdminDashboardOpen(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block" title="Admin Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                  </button>
              )}

              <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); if (user) { setIsAccountMenuOpen(!isAccountMenuOpen); } else { setIsAuthModalOpen(true); } }} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1.5 md:px-3 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/10">
                         {user && user.email.includes('google') ? <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-sm max-w-[80px] truncate hidden lg:block">{user ? user.name : 'Login'}</span>
                    {user && <ChevronDown className="w-3 h-3 opacity-70 hidden lg:block" />}
                  </button>
                  {isAccountMenuOpen && user && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button onClick={() => setIsProfileModalOpen(true)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><UserIcon className="w-4 h-4" /> My Profile</button>
                        {user.role === 'admin' && <button onClick={() => setIsAdminDashboardOpen(true)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Settings className="w-4 h-4" /> Dashboard</button>}
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
                    </div>
                  )}
              </div>
              <div ref={cartIconRef}>
                <button onClick={handleOpenCart} className={`relative p-2 flex items-center gap-2 group transition-transform ${cartBump ? 'scale-125 text-yellow-400' : ''}`}>
                    <div className="relative"><ShoppingCart className="w-6 h-6" />{cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-gray-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">{cartCount}</span>}</div>
                    <span className="hidden lg:block font-bold text-sm group-hover:text-yellow-400 transition-colors">Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-6">
         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1.5 flex gap-1 overflow-x-auto no-scrollbar">
            <button onClick={() => setSelectedCategory('All')} className={`relative flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 z-10 ${selectedCategory === 'All' ? 'text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                {selectedCategory === 'All' && <span className="absolute inset-0 bg-emerald-600 rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-200"></span>}<LayoutGrid className="w-4 h-4" /> All
            </button>
            {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`relative flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 text-center whitespace-nowrap ${selectedCategory === cat ? 'text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                {selectedCategory === cat && <span className="absolute inset-0 bg-emerald-600 rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-200"></span>}{cat}
                </button>
            ))}
         </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {selectedCategory === 'All' && !searchQuery && (
            <HeroSection onCategorySelect={setSelectedCategory} slides={heroSlides} sideBanners={sideBanners} onViewOffers={handleScrollToOffers} />
        )}

        {(selectedCategory !== 'All' || searchQuery) && (
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 mt-4">
                <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{searchQuery ? `Search: "${searchQuery}"` : selectedCategory}</h2></div>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors select-none shadow-sm"><input type="checkbox" checked={showInStockOnly} onChange={() => setShowInStockOnly(!showInStockOnly)} className="w-4 h-4 text-emerald-600 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-500 dark:bg-gray-700" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock</span></label>
                            <div className="relative group">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors cursor-pointer shadow-sm">
                                <option value="featured">Sort by: Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A-Z</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"><ArrowUpDown className="w-4 h-4 text-gray-400 dark:text-gray-500" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Dynamic Hot Offers Section */}
        {selectedCategory === 'All' && !searchQuery && hotOfferProducts.length > 0 && (
            <div ref={hotOffersRef} className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400"><Tag className="w-5 h-5" /></div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Hot Offers</h3>
                </div>
                <div className="grid grid-cols-3 min-[480px]:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                    {hotOfferProducts.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} onView={handleViewProduct} isAdmin={user?.role === 'admin'} onEdit={user?.role === 'admin' ? setEditingProduct : undefined} />
                    ))}
                </div>
            </div>
        )}

        {selectedCategory === 'All' && !searchQuery ? (
            <div className="space-y-12">
                {categories.map(category => {
                    let productsInCategory = products.filter(p => p.category === category);
                    productsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    if (productsInCategory.length === 0) return null;
                    return (
                        <div key={category} className="scroll-mt-24" id={category.replace(/\s+/g, '-').toLowerCase()}>
                             <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category}</h2>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded">Top Rated</span>
                                </div>
                                <button onClick={() => setSelectedCategory(category)} className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline flex items-center gap-1">View All <ArrowUpDown className="w-3 h-3 rotate-90" /></button>
                             </div>
                             <div className="grid grid-cols-2 min-[400px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {productsInCategory.slice(0, 10).map(product => (
                                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} onView={handleViewProduct} isAdmin={user?.role === 'admin'} onEdit={user?.role === 'admin' ? setEditingProduct : undefined} />
                                ))}
                             </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <>
                {getFilteredProducts(selectedCategory).length > 0 ? (
                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {getFilteredProducts(selectedCategory).map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} onView={handleViewProduct} isAdmin={user?.role === 'admin'} onEdit={user?.role === 'admin' ? setEditingProduct : undefined} />
                    ))}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6"><SlidersHorizontal className="w-10 h-10 text-gray-400 dark:text-gray-500" /></div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No items found</h3>
                    <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setShowInStockOnly(false); setSortBy('featured'); }} className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline bg-emerald-50 dark:bg-emerald-900/20 px-8 py-3 rounded-xl transition-colors">Clear All Filters</button>
                </div>
                )}
            </>
        )}

        {recentlyViewedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 relative">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400"><Clock className="w-5 h-5" /></div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recently Viewed</h3>
                </div>
                <button onClick={clearRecentlyViewed} className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear History
                </button>
            </div>
            <div className="grid grid-cols-2 min-[400px]:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
              {recentlyViewedProducts.map(product => (
                <ProductCard key={`recent-${product.id}`} product={product} onAddToCart={addToCart} onView={handleViewProduct} isAdmin={user?.role === 'admin'} onEdit={user?.role === 'admin' ? setEditingProduct : undefined} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 {storeLogo ? <img src={storeLogo} alt="Logo" className="w-10 h-10 rounded-xl object-cover" /> : <div className="w-10 h-10 bg-[#155e37] rounded-xl flex items-center justify-center text-white font-bold text-xl">H</div>}
                <span className="font-bold text-gray-900 dark:text-white text-2xl">{storeName}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                {storeName} makes online grocery shopping fast and easy. Get groceries delivered to your door in minutes.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Shop Categories</h4>
              <ul className="space-y-3 text-gray-500 dark:text-gray-400">
                {categories.map(cat => (
                    <li key={cat}><button onClick={() => setSelectedCategory(cat)} className="hover:text-[#155e37] dark:hover:text-emerald-400 transition-colors">{cat}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Customer Service</h4>
              <ul className="space-y-3 text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#155e37] dark:hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#155e37] dark:hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#155e37] dark:hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-3"><span className="text-xl">📍</span><span>1234 Grocery St, Market City</span></li>
                <li className="flex items-center gap-3"><span className="text-xl">✉️</span><span>support@{storeName.toLowerCase().replace(' ', '')}.com</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-gray-400 dark:text-gray-500 text-sm">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <ProductDetailsModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      <EditProductModal isOpen={!!editingProduct} product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleQuickEdit} onDelete={() => { if (editingProduct) { handleRemoveProduct(editingProduct.id); setEditingProduct(null); } }} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onAddToCart={addToCart} />
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} currentLocation={location} onSelectLocation={setLocation} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onSignup={handleSignup} />
      {user && <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} user={user} />}
      {user && <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} onUpdateUser={setUser} />}
      
      <AdminDashboard 
        isOpen={isAdminDashboardOpen} 
        onClose={() => setIsAdminDashboardOpen(false)} 
        products={products} 
        onAddProduct={handleAddProduct} 
        onRemoveProduct={handleRemoveProduct} 
        users={users} 
        onAddUser={handleAddUser} 
        onRemoveUser={handleRemoveUser} 
        heroSlides={heroSlides} 
        onUpdateHero={handleUpdateHero} 
        categories={categories} 
        onAddCategory={handleAddCategory} 
        sideBanners={sideBanners} 
        onUpdateSideBanners={handleUpdateSideBanners}
        storeName={storeName}
        storeLogo={storeLogo}
        onUpdateStoreSettings={(name, logo) => { setStoreName(name); setStoreLogo(logo); }}
        onUpdateProduct={handleUpdateProduct}
      />

      <button onClick={handleOpenAssistant} className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group flex items-center justify-center">
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="absolute right-full mr-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">Ask {storeName} AI</span>
      </button>

      <Assistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
};

export default App;