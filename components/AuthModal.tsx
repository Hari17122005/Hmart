import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { signInWithGoogle, loginWithEmail, registerWithEmail, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onSignup?: (user: UserType) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', 
    password: '',
    email: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let user: UserType;
        if (userDoc.exists()) {
            user = userDoc.data() as UserType;
        } else {
            user = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Google User',
                email: firebaseUser.email || '',
                role: 'user',
                profileImage: firebaseUser.photoURL || undefined
            };
        }
        if (onSignup) onSignup(user);
        else onLogin(user);
        onClose();
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Google Sign-In is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const firebaseUser = await loginWithEmail(formData.email, formData.password);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
            onLogin(userDoc.data() as UserType);
        } else {
            onLogin({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Test User',
                email: firebaseUser.email || formData.email,
                role: 'user'
            });
        }
        onClose();
      } else {
        if (!formData.username || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          return;
        }
        const firebaseUser = await registerWithEmail(formData.email, formData.password);
        const newUser: UserType = {
             id: firebaseUser.uid,
             name: formData.username,
             email: formData.email,
             role: formData.email === 'admin@hmart.com' ? 'admin' : 'user'
        };
        if (onSignup) {
          onSignup(newUser);
        } else {
          onLogin(newUser);
        }
        onClose();
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password login is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.");
      } else {
        setError(err.message || 'Authentication failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#155e37] dark:text-emerald-400 mb-2">H Mart</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {isLogin ? 'Welcome back! Please login.' : 'Create a new account.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4 mb-4">
             <button 
               onClick={handleGoogleLogin}
               type="button"
               className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 cursor-pointer"
             >
               <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
               <span className="text-gray-700 dark:text-gray-200 font-bold">Sign in with Google</span>
             </button>
             
             <div className="flex items-center gap-3">
                 <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                 <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">or sign in with email</span>
                 <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Email Field */}
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            {!isLogin && (
                <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
                </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#155e37] text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
            >
              {isLogin ? 'Login' : 'Create Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}