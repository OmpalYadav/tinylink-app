'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-lg font-medium text-white ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <div className="flex items-center justify-between space-x-4">
            <p>{message}</p>
            <button onClick={onClose} className="text-white font-bold hover:opacity-80 transition">
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}