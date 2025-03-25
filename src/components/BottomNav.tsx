// src/components/BottomNav.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from '@mui/icons-material/Home';
import MicIcon from '@mui/icons-material/Mic';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
interface BottomNavProps {
  isDarkMode: boolean;
}

export default function BottomNav({ isDarkMode }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`md:hidden w-full p-2 ${isDarkMode ? "bg-[#320958]" : "bg-[#320958]"} fixed bottom-0 flex justify-around items-center shadow-t-lg`}>
      <Link
        href="/"
        className={`text-center transition-colors ${
          pathname === "/" ? "text-white" : "text-white hover:text-pink-200"
        }`}
      >
        <span className="text-xl block">
        <HomeIcon className="text-xl block sx={{ fontSize: 24 }}" />
        </span>
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/podcast"
        className={`text-center transition-colors ${
          pathname === "/podcast" ? "text-white" : "text-white hover:text-[#790DA3]"
        }`}
      >
        <span className="text-xl block">
        <MicIcon className="text-xl block sx={{ fontSize: 24 }}" />
        </span>
        <span className="text-xs">Podcast</span>
      </Link>
     

      <Link href="/resources" className={`flex flex-col items-center ${isDarkMode ? "text-gray-300" : "text-white"} hover:text-[#790DA3]`}>
      <VideoLibraryIcon className="text-xl block sx={{ fontSize: 24 }}" />
          <span className="text-xs">Resources</span>
        </Link>
      
      <Link
        href="/contact"
        className={`text-center transition-colors ${
          pathname === "/contact" ? "text-white" : "text-white hover:text-white"
        }`}
      >
        <span className="text-xl block"><PersonIcon className="text-xl block sx={{ fontSize: 24 }}" /></span>
        <span className="text-xs">Contact Us</span>
      </Link>
    </nav>
  );
}