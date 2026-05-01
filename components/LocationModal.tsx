import React, { useState, useEffect } from 'react';
import { X, Navigation, Search, Home, Briefcase, MapPin, ArrowLeft, Plus, Trash2, Map, Minus, Locate } from 'lucide-react';

interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  title: string;
  address: string;
  details?: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  currentLocation: string;
}

export default function LocationModal({ isOpen, onClose, onSelectLocation, currentLocation }: LocationModalProps) {
  const [step, setStep] = useState<'list' | 'map' | 'details'>('list');
  const [search, setSearch] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [tempLocation, setTempLocation] = useState('');
  const [mapDragging, setMapDragging] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    houseNo: '',
    landmark: '',
    tag: 'Home' as 'Home' | 'Work' | 'Other'
  });
  
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem('hmart_saved_addresses');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'Home', title: 'Home', address: '1234 Grocery St, Market City', details: 'Apt 4B' },
      { id: '2', type: 'Work', title: 'Work', address: '55 Business Park, Tech Hub', details: 'Floor 3' }
    ];
  });

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('list');
      setSearch('');
    }
  }, [isOpen]);

  // Persist addresses
  useEffect(() => {
    localStorage.setItem('hmart_saved_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  if (!isOpen) return null;

  const handleDetect = () => {
    setDetecting(true);
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           setTimeout(() => {
              // Simulating reverse geocoding result based on lat/lng
              setTempLocation("5th Avenue, Market District");
              setDetecting(false);
              setStep('map');
           }, 1000);
         },
         (error) => {
           console.error(error);
           setDetecting(false);
           alert("Unable to retrieve your location. Please check your browser permissions.");
         }
       );
    } else {
        setDetecting(false);
        alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (search.trim()) {
          setTempLocation(search);
          setStep('map');
      }
  };

  const handleSaveAddress = () => {
    const fullAddress = `${addressDetails.houseNo ? addressDetails.houseNo + ', ' : ''}${tempLocation}`;
    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      type: addressDetails.tag,
      title: addressDetails.tag,
      address: tempLocation,
      details: addressDetails.houseNo + (addressDetails.landmark ? `, ${addressDetails.landmark}` : '')
    };

    setSavedAddresses(prev => [...prev, newAddress]);
    onSelectLocation(fullAddress);
    onClose();
  };

  const deleteAddress = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  };

  // --- SUB-VIEWS ---

  const renderMapView = () => (
    <div className="flex flex-col h-[500px]">
        <div 
            className="relative flex-1 bg-[#e5e3df] overflow-hidden group cursor-grab active:cursor-grabbing"
            onMouseDown={() => setMapDragging(true)}
            onMouseUp={() => setMapDragging(false)}
            onMouseLeave={() => setMapDragging(false)}
        >
            {/* Vector Map Style Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-200"
                style={{ 
                    backgroundImage: 'url("https://images.unsplash.com/photo-1577086664693-894553052526?q=80&w=1000&auto=format&fit=crop")',
                    filter: 'grayscale(0.2) contrast(1.1)',
                    transform: mapDragging ? 'scale(1.02)' : 'scale(1)'
                }}
            ></div>
            
            {/* Map Grid Overlay for technical feel */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                 <button className="p-2 bg-white rounded shadow-md text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <Plus className="w-5 h-5" />
                 </button>
                 <button className="p-2 bg-white rounded shadow-md text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <Minus className="w-5 h-5" />
                 </button>
            </div>

            {/* Recenter Button */}
            <div className="absolute bottom-24 right-4 z-10">
                 <button 
                    onClick={handleDetect} 
                    className="p-3 bg-white rounded-full shadow-lg text-emerald-600 hover:bg-gray-50 active:scale-95 transition-all group"
                    title="Use Current Location"
                >
                    <Locate className="w-6 h-6 fill-current group-hover:animate-pulse" />
                 </button>
            </div>

            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center -mt-10 pointer-events-none z-20">
                <div className="relative">
                    <MapPin className="w-12 h-12 text-red-600 fill-red-600 drop-shadow-2xl animate-bounce" />
                    <div className="w-4 h-1.5 bg-black/40 rounded-[100%] absolute -bottom-1 left-1/2 -translate-x-1/2 blur-[2px]"></div>
                </div>
                <div className="bg-gray-900/80 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold mt-2 max-w-[180px] text-center backdrop-blur-md border border-white/10">
                    <p className="truncate">{tempLocation || "Locating..."}</p>
                    <p className="text-[10px] text-gray-300 font-normal mt-0.5">Move map to adjust</p>
                </div>
            </div>

            {/* Back Button */}
            <button 
                onClick={() => setStep('list')}
                className="absolute top-4 left-4 bg-white p-2.5 rounded-full shadow-md hover:bg-gray-100 transition-colors z-20"
            >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-t-2xl -mt-4 relative z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Selected Location</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{tempLocation}</p>
                </div>
                <button className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase hover:underline">Change</button>
            </div>
            
            <button 
                onClick={() => setStep('details')}
                className="w-full py-4 bg-[#155e37] text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/20 active:scale-[0.99]"
            >
                Confirm Location & Proceed
            </button>
        </div>
    </div>
  );

  const renderDetailsView = () => (
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-sm z-10">
             <button onClick={() => setStep('map')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
             </button>
             <h3 className="font-bold text-lg text-gray-900 dark:text-white">Enter Address Details</h3>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-start gap-3 mb-8 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">Delivery Location</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{tempLocation}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative group">
                    <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        House / Flat / Block No.<span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Apt 4B, House 12"
                        className="w-full p-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-gray-900 dark:text-white transition-colors"
                        value={addressDetails.houseNo}
                        onChange={e => setAddressDetails({...addressDetails, houseNo: e.target.value})}
                        autoFocus
                    />
                </div>

                <div className="relative group">
                    <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Landmark (Optional)
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Near Central Park"
                        className="w-full p-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-gray-900 dark:text-white transition-colors"
                        value={addressDetails.landmark}
                        onChange={e => setAddressDetails({...addressDetails, landmark: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Save Address As</label>
                    <div className="flex gap-3">
                        {['Home', 'Work', 'Other'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setAddressDetails({...addressDetails, tag: tag as any})}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                                    addressDetails.tag === tag 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-sm' 
                                    : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                {tag === 'Home' && <Home className="w-4 h-4" />}
                                {tag === 'Work' && <Briefcase className="w-4 h-4" />}
                                {tag === 'Other' && <MapPin className="w-4 h-4" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button 
                onClick={handleSaveAddress}
                disabled={!addressDetails.houseNo}
                className="w-full py-4 bg-[#155e37] text-white rounded-xl font-bold text-base hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.99]"
            >
                Save Address
            </button>
        </div>
    </div>
  );

  // --- MAIN RENDER ---

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {step === 'list' && (
            <>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10 relative shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Select Location</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Enter pincode or city..." 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                    </form>

                    <button 
                        onClick={handleDetect}
                        className="w-full flex items-center gap-4 text-emerald-700 dark:text-emerald-400 font-bold p-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700"
                    >
                        <div className={`p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full group-hover:scale-110 transition-transform ${detecting ? 'animate-pulse' : ''}`}>
                            <Navigation className={`w-6 h-6 ${detecting ? 'animate-spin' : ''}`} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-base">{detecting ? 'Detecting Location...' : 'Use Current Location'}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">Using GPS</span>
                        </div>
                    </button>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                            Saved Addresses
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full font-bold">{savedAddresses.length}</span>
                        </h4>
                        <div className="space-y-3">
                            {savedAddresses.map(addr => (
                                <div 
                                    key={addr.id}
                                    onClick={() => { 
                                        onSelectLocation(`${addr.details ? addr.details + ', ' : ''}${addr.address}`); 
                                        onClose(); 
                                    }} 
                                    className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all text-left group cursor-pointer relative border border-gray-100 dark:border-gray-700/50 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm"
                                >
                                    <div className={`p-2.5 rounded-xl transition-colors mt-0.5 ${
                                        addr.type === 'Home' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                        addr.type === 'Work' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                    {addr.type === 'Home' ? <Home className="w-5 h-5" /> : 
                                     addr.type === 'Work' ? <Briefcase className="w-5 h-5" /> : 
                                     <MapPin className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 pr-8">
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-0.5">{addr.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{addr.details ? `${addr.details}, ` : ''}{addr.address}</p>
                                    </div>
                                    {currentLocation.includes(addr.address.split(',')[0]) && (
                                        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800"></div>
                                    )}
                                    <button 
                                        onClick={(e) => deleteAddress(e, addr.id)}
                                        className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                        title="Delete Address"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            
                            {savedAddresses.length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
                                    <div className="bg-gray-50 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <MapPin className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm">No saved addresses yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}

        {step === 'map' && renderMapView()}
        {step === 'details' && renderDetailsView()}

      </div>
    </div>
  );
}