'use client';

import { useState, useEffect } from 'react';
import LinkForm from '../components/LinkForm';
import LinkTable from '../components/LinkTable';
import Notification from '../components/Notification';
import Loader from '../components/Loader';

interface LinkData {
  id: string;
  code: string;
  url: string;
  clicks: number;
  createdAt: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      const data = await res.json();
      if (Array.isArray(data)) setLinks(data);
    } catch (err) {
      setNotification({ message: 'Failed to fetch links', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (url: string, code?: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create link');
      setLinks(prev => [...prev, data]);
      setNotification({ message: 'Link created successfully! 🎉', type: 'success' });
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await fetch(`/api/links/${code}`, { method: 'DELETE' });
      setLinks(prev => prev.filter(l => l.code !== code));
      setNotification({ message: 'Link deleted successfully', type: 'success' });
    } catch {
      setNotification({ message: 'Failed to delete link', type: 'error' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] p-4 sm:p-8 font-sans relative">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300 blur-[120px] opacity-30 pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300 blur-[120px] opacity-30 pointer-events-none animate-pulse" />

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 text-center">
          TinyLink
        </h1>
        <p className="text-gray-500 text-lg text-center mb-10">Shorten URLs faster & track clicks easily</p>

        <LinkForm onSubmit={handleCreate} loading={loading} error={notification?.type==='error'?notification.message:''} success={notification?.type==='success'?notification.message:''} />

        {loading ? <Loader /> : <LinkTable links={links} onDelete={handleDelete} />}

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </main>
  );
}