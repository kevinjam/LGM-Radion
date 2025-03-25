// src/components/Footer.tsx
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`w-full p-4 ${isDarkMode ? "bg-gray-800" : "bg-[#530970]"} text-white`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
        <p className="text-sm">
        <p>&copy; {new Date().getFullYear()} Latter Glory Ministries. All rights reserved.</p>
            </p>
          <div className="flex justify-center md:justify-start space-x-2 mt-1">
            <Link href="/podcast" className="text-white hover:underline text-sm">
              PODCAST
            </Link>
            <Link 
              target="_blank"
            href="https://latterglory.ug/" className="text-white hover:underline text-sm">
              BLOG
            </Link>
          </div>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/LGMUG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://x.com/FFC_LGM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}