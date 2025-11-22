// src/app/page.tsx
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

  // Fetch all links from API
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

  // Create new link
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

      setLinks((prev) => [...prev, data]);
      setNotification({ message: 'Link created successfully! 🎉', type: 'success' });
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Delete a link
  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await fetch(`/api/links/${code}`, { method: 'DELETE' });
      setLinks((prev) => prev.filter((l) => l.code !== code));
      setNotification({ message: 'Link deleted successfully', type: 'success' });
    } catch {
      setNotification({ message: 'Failed to delete link', type: 'error' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12 font-sans relative overflow-hidden">
      {/* Background animated circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-300 blur-3xl opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-300 blur-3xl opacity-30 animate-pulse pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          TinyLink
        </h1>
        <p className="text-gray-500 text-center text-lg mb-10">
          Shorten URLs faster & track clicks easily
        </p>

        {/* Link Form */}
        <LinkForm
          onSubmit={handleCreate}
          loading={loading}
          error={notification?.type === 'error' ? notification.message : ''}
          success={notification?.type === 'success' ? notification.message : ''}
        />

        {/* Loader or Link Table */}
        {loading ? <Loader /> : <LinkTable links={links} onDelete={handleDelete} />}

        {/* Notification */}
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