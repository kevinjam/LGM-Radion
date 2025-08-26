// src/app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Parser from "rss-parser";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UpcomingEvents from "../components/UpcomingEvents";
import BottomNav from "../components/BottomNav";

// Define interfaces for YouTube video data
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
}

export default function Home() {
  const [isLivePlaying, setIsLivePlaying] = useState(false); // For live radio
  const [liveCurrentTime, setLiveCurrentTime] = useState(0);
  const [liveDuration, setLiveDuration] = useState(0);
  const [isEpisodePlaying, setIsEpisodePlaying] = useState(false); // For episodes
  const [episodeCurrentTime, setEpisodeCurrentTime] = useState(0);
  const [episodeDuration, setEpisodeDuration] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  interface Episode {
    title: string;
    description: string;
    audioUrl: string;
    duration: string;
    pubDate: string;
  }

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<number | null>(null);
  const liveAudioRef = useRef<HTMLAudioElement>(null); // For live radio
  const episodeAudioRef = useRef<HTMLAudioElement>(null); // For episodes

  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null); 
  const [videoLoading, setVideoLoading] = useState(true);

  // Fetch and parse RSS feed using rss-parser
  useEffect(() => {
    const parser = new Parser();
    const fetchRSS = async () => {
      try {
        setLoading(true);
        const proxyUrl = `/api/rss/proxy?url=${encodeURIComponent(
          "https://rss.castbox.fm/everest/e57bc6de67a146ab89a245ae0fda60a5.xml"
        )}`;
        const feed = await parser.parseURL(proxyUrl);
        console.log("RSS Feed Data:", feed);

        if (feed.items && feed.items.length > 0) {
          const episodeData = feed.items.slice(0, 5).map((item: { title?: string; description?: string; enclosure?: { url: string }; itunes?: { duration: string }; pubDate?: string }) => ({
            title: item.title || "Untitled",
            description: item.description || "",
            audioUrl: item.enclosure?.url || "",
            duration: item.itunes?.duration || "N/A",
            pubDate: item.pubDate || "N/A",
          }));
          console.log("Parsed Episodes:", episodeData);
          setEpisodes(episodeData);
        } else {
          setError("No episodes found in the RSS feed.");
        }
      } catch (error) {
        console.error("Error fetching or parsing RSS feed:", error);
        setError("Failed to load episodes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, []);

   // Fetch latest YouTube video function
    const fetchLatestVideo = async () => {
      try {
        setVideoLoading(true);
        console.log('Fetching latest video...');
        const response = await fetch('/api/youtube/latest');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch latest video: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received video data:', data);
        setLatestVideo(data);
      } catch (error) {
        console.error('Error fetching latest video:', error);
        // Keep fallback data if available
      } finally {
        setVideoLoading(false);
      }
    };

      // Fetch latest YouTube video on component mount
  useEffect(() => {
    fetchLatestVideo();
  }, []);


  // Toggle play for the live radio
  const toggleLivePlay = () => {
    if (isLivePlaying) {
      liveAudioRef.current?.pause();
      setIsLivePlaying(false);
    } else {
      // Pause episode if playing
      if (isEpisodePlaying) {
        episodeAudioRef.current?.pause();
        setIsEpisodePlaying(false);
      }
      liveAudioRef.current?.play().catch((err) => {
        console.error("Error playing live audio:", err);
      });
      setIsLivePlaying(true);
    }
  };

  // Toggle play for individual episodes
  const toggleEpisodePlay = (index: number) => {
    if (currentEpisode === index && isEpisodePlaying) {
      episodeAudioRef.current?.pause();
      setIsEpisodePlaying(false);
    } else {
      // Pause live radio if playing
      if (isLivePlaying) {
        liveAudioRef.current?.pause();
        setIsLivePlaying(false);
      }
      if (episodeAudioRef.current && episodes[index].audioUrl) {
        episodeAudioRef.current.src = episodes[index].audioUrl;
        episodeAudioRef.current.play().catch((err) => {
          console.error("Error playing episode audio:", err);
          setError("Failed to play audio. Please try another episode.");
        });
        setIsEpisodePlaying(true);
        setCurrentEpisode(index);
      }
    }
  };

  // Update current time and duration for the live radio
  useEffect(() => {
    const audio = liveAudioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setLiveCurrentTime(audio.currentTime);
      setLiveDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  // Update current time and duration for the episode player
  useEffect(() => {
    const audio = episodeAudioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setEpisodeCurrentTime(audio.currentTime);
      setEpisodeDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Sound wave animation
  const WaveAnimation = () => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1 ${isDarkMode ? "bg-[#320958]" : "bg-[#790DA3]"} rounded animate-bounce ${
            isLivePlaying ? `animation-delay-${i * 100}` : ""
          }`}
          style={{
            height: `${10 + i * 5}px`,
            animation: isLivePlaying ? "bounce 0.6s infinite" : "none",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  // Function to get a random color for the circle background
  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-500",
      "bg-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Header Component */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Centered Box for Main Content */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center space-y-6 px-4">
          {/* Album Art and Player Overlay */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className={`absolute inset-0 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-xl overflow-hidden`}>
              <Image
                src="/icons/logo.png"
                alt="Lanter Glory Ministry"
                layout="fill"
                objectFit="cover"
                className="relative z-10 rounded-2xl"
              />
            </div>

            {/* Player Controls Overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? "bg-gray-800 bg-opacity-80" : "bg-white bg-opacity-80"} rounded-2xl z-20`}>
              <audio
                ref={liveAudioRef}
                src="http://stream.radiojar.com/6mx6zxgydzzuv"
              />

              {/* Song Info */}
              {/* <div className="text-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold">LGM Radio</h2>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-500"} text-sm`}>playing</p>
              </div> */}

<div className="flex flex-col items-center mt-4">
<h2 className="text-lg font-bold mt-1">LGM RADIO</h2>

      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="text-sm font-semibold text-red-500">LIVE</span>
      </div>
    </div>

              {/* Sound Waves */}
              {isLivePlaying && <WaveAnimation />}

              {/* Progress Bar */}
              <div className="w-3/4 flex items-center space-x-2 mt-4">
                <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{formatTime(liveCurrentTime)}</span>
                <div className={`flex-1 h-1 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#790DA3] to-[#530970]"
                    style={{
                      width: liveDuration ? `${(liveCurrentTime / liveDuration) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{formatTime(liveDuration || 0)}</span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center space-x-6 mt-4">
                <button className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xl hover:text-[#530970] transition-colors`}>↺</button>
                <button
                  onClick={toggleLivePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#530970] text-white text-xl hover:bg-[#530970] transition-colors shadow-md"
                >
                  {isLivePlaying ? "❚❚" : "▶"}
                </button>
                <button className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xl hover:text-[#530970] transition-colors`}>↻</button>
              </div>
            </div>
          </div>
        </main>

        {/* Episode Audio Element */}
        <audio ref={episodeAudioRef} />

        {/* Upcoming Events Component */}
        <UpcomingEvents />

        {/* Two-Box Layout (Latest Episodes and Radiojar Direct Messaging) */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 px-4">
          {/* Latest Episodes Box */}
          <div className={`w-full md:w-1/2 ${isDarkMode ? "bg-gray-800" : "bg-gradient-to-br from-green-100 to-blue-100"} p-3 rounded-lg shadow-md`}>
            <h3 className="text-lg font-bold mb-2 text-center">Latest Episodes</h3>
            {loading && (
              <p className="text-center text-gray-400">Loading episodes...</p>
            )}
            {error && (
              <p className="text-center text-red-400">{error}</p>
            )}
            {!loading && !error && episodes.length === 0 && (
              <p className="text-center text-gray-400">No episodes available.</p>
            )}
            {!loading && !error && episodes.length > 0 && (
              <div className="space-y-2">
                {episodes.map((episode, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-2 ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md hover:bg-opacity-90 transition-all`}
                  >
                    {/* Circle with First Letter */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${getRandomColor()} text-white font-bold text-sm md:text-base`}
                    >
                      {episode.title.charAt(0).toUpperCase()}
                    </div>
                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-medium truncate">{episode.title}</h4>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} truncate`}>
                        {new Date(episode.pubDate).toLocaleString("en-US", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          timeZone: "UTC",
                        })}{" "}
                        • {episode.duration}
                      </p>
                    </div>
                    {/* Play Button */}
                    <button
                      onClick={() => toggleEpisodePlay(index)}
                      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full ${
                        currentEpisode === index && isEpisodePlaying ? "bg-green-400" : "bg-gray-300"
                      } text-white hover:bg-[#790DA3] transition-colors`}
                    >
                      {currentEpisode === index && isEpisodePlaying ? (
                        <FaPause className="text-xs md:text-sm" />
                      ) : (
                        <FaPlay className="text-xs md:text-sm" />
                      )}
                    </button>
                    {/* Download Button */}
                    <a
                      href={episode.audioUrl}
                      download
                      className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-300 text-white hover:bg-gray-400 transition-colors"
                    >
                      <FaDownload className="text-xs md:text-sm" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Episode Player (Below Latest Episodes) */}
            {currentEpisode !== null && episodes[currentEpisode] && (
              <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex items-center space-x-3">
                  {/* Episode Title */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{episodes[currentEpisode].title}</h4>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} truncate`}>
                      {new Date(episodes[currentEpisode].pubDate).toLocaleString("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => toggleEpisodePlay(currentEpisode)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#790DA3] text-white hover:bg-[#790DA3] transition-colors"
                  >
                    {isEpisodePlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
                  </button>
                </div>
                {/* Progress Bar */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{formatTime(episodeCurrentTime)}</span>
                  <div className={`flex-1 h-1 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
                    <div
                      className="h-full bg-gradient-to-r from-[#790DA3] to-[#790DA3]"
                      style={{
                        width: episodeDuration ? `${(episodeCurrentTime / episodeDuration) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{formatTime(episodeDuration || 0)}</span>
                </div>
              </div>
            )}
          </div>

           {/* Latest YouTube Video Display */}
            <div
            className={`w-full md:w-1/2 p-3 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-md ${
              isDarkMode
                ? "bg-gradient-to-br from-green-900/50 to-purple-900/50"
                : "bg-gradient-to-br from-green-100/50 to-purple-200/50"
            } flex flex-col`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3>Latest Video from YouTube</h3>
              <button
                onClick={fetchLatestVideo}
                className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Refresh
              </button>
            </div>
            <div className="relative flex-1 min-h-[350px] flex flex-col p-4">
              {/* Latest YouTube Video */}
              {videoLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-6 w-6 text-red-500"
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
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Loading latest video...</p>
                  </div>
                </div>
              ) : latestVideo ? (
                <div className="space-y-4">
                  {/* Embedded Video Player */}
                  <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${latestVideo.id}?rel=0&modestbranding=1`}
                      title={latestVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Video Info */}
                  <div className="space-y-2">
                    <h4 className={`text-lg font-bold line-clamp-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {latestVideo.title}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} line-clamp-2`}>
                      {latestVideo.channelTitle}
                    </p>
                    
                    {/* Video Stats */}
                    {/* <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{latestVideo.viewCount} views</span>
                      <span>{latestVideo.publishedAt}</span>
                    </div> */}
                    
                    {/* Watch on YouTube Button */}
                     <a
                      href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        isDarkMode
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch on YouTube
                    </a>
                    
                    {/* Channel Link */}
                    {/* <a
                      href={latestVideo.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-center block text-sm ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} transition-colors duration-200`}
                    >
                      Visit Channel
                    </a> */}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto text-red-500">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Unable to load latest video. Visit our channel directly.
                    </p>
                    {/* <a
                      href="https://www.youtube.com/@lattergloryministries3882"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        isDarkMode
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      Visit Channel
                    </a> */}
                  </div>
                </div>
              )}
              
              {/* Always show a direct link to your channel */}
              {/* <div className="mt-4 text-center">
                <a
                  href="https://www.youtube.com/@lattergloryministries3882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Subscribe to Channel
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />

      {/* Add custom keyframes for wave animation */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </div>
  );
}