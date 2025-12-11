"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
}

export default function AnnouncementModal({ announcement }: { announcement: Notification }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!announcement) return;

    const key = `announcement_dismissed_${announcement.id}`;
    const dismissed = localStorage.getItem(key);

    if (!dismissed) {
      setIsOpen(true);
    }
  }, [announcement]);

  if (!isOpen || !announcement) return null;

  const dismissPopup = () => {
    localStorage.setItem(`announcement_dismissed_${announcement.id}`, "true");
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={dismissPopup} />

      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full z-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {announcement.title}
        </h2>

        <p className="text-gray-700 leading-relaxed">
          {announcement.message}
        </p>

        <div className="flex justify-end mt-6">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            onClick={dismissPopup}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
