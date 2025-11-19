"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useState } from "react";
import Image from "next/image";

export default function UserMenu() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show anything while loading
  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  // Don't show if not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src={user.user_metadata.avatar_url || "/default-avatar.png"}
          alt={user.user_metadata.user_name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-sm font-medium hidden md:block">
          {user.user_metadata.user_name || user.email}
        </span>
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
            <a
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <hr className="my-2" />
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
