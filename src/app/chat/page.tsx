// src/app/chat/page.tsx
"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BottomNav from "../../components/BottomNav";

export default function ChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false); // Track if the iframe loaded

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Header Component */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 py-6">
        <div
          className={`flex-1 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-md ${
            isDarkMode
              ? "bg-gradient-to-br from-green-900/50 to-purple-900/50"
              : "bg-gradient-to-br from-green-100/50 to-purple-200/50"
          } flex flex-col overflow-hidden`}
        >
          <h1
            className={`text-2xl md:text-3xl font-bold text-center tracking-wide bg-clip-text text-transparent ${
              isDarkMode
                ? "bg-gradient-to-r from-green-400 to-purple-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                : "bg-gradient-to-r from-green-600 to-purple-600 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]"
            } py-4`}
          >
            Live Chat
          </h1>
          <div className="relative flex-1 min-h-[400px]">
            {/* Iframe Container */}
            <iframe
              src="https://chat.radiojar.com/6mx6zxgydzzuv/"
              width="100%"
              height="100%"
              scrolling="no"
              frameBorder="0"
              className="absolute inset-0"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeLoaded(false)}
            ></iframe>
            {/* Loading Overlay */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Loading chat...</p>
                </div>
              </div>
            )}
            {/* Error Message */}
            {iframeLoaded === false && (
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
                <p className="text-red-500 text-sm">Failed to load chat. Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}