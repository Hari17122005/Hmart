import React from 'react';
import { Truck, Clock, ShieldCheck } from 'lucide-react';

const FeaturesStrip: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Secure Payment</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">100% secure payment</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                <Truck className="w-8 h-8" />
            </div>
            <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Free Shipping</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">For orders over $50</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                <Clock className="w-8 h-8" />
            </div>
            <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">24/7 Support</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to help you</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FeaturesStrip;