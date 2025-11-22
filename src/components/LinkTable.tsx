'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Copy, Trash2, BarChart2 } from 'lucide-react';

interface LinkData {
  id: string;
  code: string;
  url: string;
  clicks: number;
}

interface LinkTableProps {
  links: LinkData[];
  onDelete: (code: string) => void;
}

export default function LinkTable({ links, onDelete }: LinkTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (shortCode: string, id: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Short Link
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Original URL
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {links.length > 0 ? (
                links.map((link) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    whileHover={{ scale: 1.01, boxShadow: '0px 4px 15px rgba(0,0,0,0.05)' }}
                    className="group transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/${link.code}`}
                          target="_blank"
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          /{link.code} <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.code, link.id)}
                          className="p-1.5 rounded-md hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors relative"
                          title="Copy Link"
                        >
                          {copiedId === link.id ? <span className="text-green-500">✓</span> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap max-w-xs truncate text-sm text-gray-500"
                      title={link.url}
                    >
                      {link.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {link.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <a
                          href={`/code/${link.code}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition"
                        >
                          <BarChart2 className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => onDelete(link.code)}
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    No links yet. Create your first magic link! ✨
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}