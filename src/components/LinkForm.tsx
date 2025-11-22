'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';

interface LinkFormProps {
  onSubmit: (url: string, code?: string) => void;
  loading: boolean;
  error: string;
  success: string;
}

export default function LinkForm({ onSubmit, loading, error, success }: LinkFormProps) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [host, setHost] = useState('tiny.link'); // fallback for SSR

  useEffect(() => {
    setHost(window.location.host); // update only on client
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, code || undefined);
    setUrl('');
    setCode('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50 mb-10"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Destination URL</label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="url"
              required
              placeholder="https://example.com"
              className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Custom Code Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Custom Code <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="flex items-center">
            <span className="bg-gray-100 border border-r-0 border-gray-200 p-3 rounded-l-xl text-gray-500 select-none font-mono text-sm">
              {host}/
            </span>
            <input
              type="text"
              placeholder="my-link"
              maxLength={8}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-green-600 text-sm font-medium"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0px 8px 25px rgba(59,130,246,0.3)' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Creating...' : 'Shorten URL'}
        </motion.button>
      </form>
    </motion.div>
  );
}