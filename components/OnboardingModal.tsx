import React from 'react';
import { User } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onNavigateToDashboard?: () => void;
}

export default function OnboardingModal({ isOpen, onClose, user }: OnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 text-center p-8">
        
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Sparkles className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Welcome, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
            {user.role === 'admin' 
                ? "You have full administrative access. Use the dashboard icon in the header to manage the store." 
                : "Ready to find the freshest groceries delivered to your door?"}
        </p>

        <button 
            onClick={onClose}
            className="w-full py-4 bg-[#155e37] text-white rounded-xl font-bold hover:bg-emerald-800 hover:scale-[1.02] transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
            Get Started
            <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}