"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineSun } from "react-icons/ai";
import AcUnitIcon from '@mui/icons-material/AcUnit';
interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <header
        className={`w-full p-4 text-white ${
          isDarkMode
            ? "bg-gradient-to-r from-[#320958] via-[#530970] to-[#790DA3]"
            : "bg-gradient-to-r from-[#530970] via-[#790DA3] to-[#320958]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Left Section: Hamburger Menu and Title for Mobile */}
          <div className="flex items-center space-x-2">
            {/* Hamburger Menu */}
            <button
              className="md:hidden text-white text-2xl focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen && isClient ? "✕" : "☰"}
            </button>

            {/* Title for Mobile */}
            <h1 className="text-xl font-bold md:hidden text-white">
              LGM Radio
            </h1>

            {/* Desktop Logo */}
            <Link href="/" className="hidden md:flex text-white hover:text-gray-200 transition-colors items-center">
              <Image
                src="/icons/logo.png"
                alt="Latter Glory Radio"
                width={150}
                height={40}
                className="inline mr-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
              Radio
            </Link>
            <Link href="/podcast" className="text-white hover:text-gray-200 transition-colors">
              Podcast
            </Link>
            <Link href="/resources" className="text-white hover:text-gray-200 transition-colors">
              Resources
            </Link>
              <Link href="/prayer" className="text-white hover:text-gray-200 transition-colors">
              Prayer Requests
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-200 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Right Section: Dark Mode Toggle and Timer */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleDarkMode} className="text-white text-xl focus:outline-none">
            {/* {isDarkMode ? <AiOutlineSun size={24} /> : <MdOutlineDarkMode size={24} />} */}
            {isDarkMode ? <AiOutlineSun size={24} /> : <AcUnitIcon />}
            </button>
            {/* <button className="text-white text-2xl focus:outline-none">⏰</button> */}
          </div>
        </div>
      </header>

      {isClient && isMenuOpen && (
        <nav className={`md:hidden w-full ${isDarkMode ? "bg-[#320958]" : "bg-[#530970]"} shadow-md p-4 text-white`}>
          <div className="max-w-4xl mx-auto w-full flex flex-col space-y-4">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Image
                src="/icons/logo.png"
                alt="LGM Radio"
                width={150}
                height={40}
                className="inline mr-2"
              />
            </Link>
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Radio
            </Link>
            <Link
              href="/podcast"
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Podcast
            </Link>
            <Link
              href="/resources"
              className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/prayer"
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Prayer Requests
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
