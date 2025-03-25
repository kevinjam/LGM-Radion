// src/app/podcast/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Parser from "rss-parser";
import { FaPlay, FaPause, FaDownload, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BottomNav from "../../components/BottomNav";

export default function Podcast() {
  interface Episode {
    title: string;
    description: string;
    audioUrl: string;
    duration: string;
    pubDate: string;
    image: string;
    genre: string;
  }

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<{
    title: string;
    description: string;
    audioUrl: string;
    duration: string;
    pubDate: string;
    image: string;
    genre: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genre");
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 8; // 2 rows of 4 episodes
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch and parse RSS feed using rss-parser
  useEffect(() => {
    const parser = new Parser();
    const fetchRSS = async () => {
      try {
        setLoading(true);
        const proxyUrl = `/api/rss/proxy?url=${encodeURIComponent(
          "https://rss.castbox.fm/everest/e57bc6de67a146ab89a245ae0fda60a5.xml"
        )}`;
        // console.log("Fetching RSS feed from:", proxyUrl);

        const response = await fetch(proxyUrl);
        // console.log("RSS Fetch Response Status:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
        }

        const feedText = await response.text();
        // console.log("RSS Feed Response Text:", feedText);

        const feed = await parser.parseString(feedText);
        // console.log("Parsed RSS Feed:", feed);

        if (feed.items && feed.items.length > 0) {
          const episodeData = feed.items.map((item: Parser.Item, index: number) => {
//             const imageUrl = item.itunes?.image?.href
//   ? `/images/castbox-${index}.png` // Local image
//   : "/images/placeholder.jpg";
            // const imageUrl = item.itunes?.image?.href
            //   ? `/api/image/proxy?url=${encodeURIComponent(item.itunes.image.href)}`
            //   : "/images/placeholder.jpg";
            return {
              title: item.title || "Untitled",
              description: item.content || "",
              audioUrl: item.enclosure?.url || "",
              duration: (item as Parser.Item & { itunes?: { duration?: string } }).itunes?.duration || "N/A",
              pubDate: item.pubDate || "N/A",
              image: (item as Parser.Item & { itunes?: { image?: string } }).itunes?.image || "/images/placeholder.jpg",
              genre: assignGenre(index),
            };
          });
          setEpisodes(episodeData);
          setFilteredEpisodes(episodeData);
        } else {
          setError("No episodes found in the RSS feed.");
        }
      } catch (error: unknown) {
        // console.error("Error fetching or parsing RSS feed:", error.message, error.stack);
        setError(`Failed to load episodes: ${error}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, []);

  // Function to assign a genre (for demo purposes)
  const assignGenre = (index: number) => {
    const genres = ["Sermons", "Worship", "Bible Study", "Christian Living", "Prayer", "Testimonies"];
    return genres[index % genres.length];
  };

  // Toggle play for individual episodes
  const toggleEpisodePlay = (index: number) => {
    if (currentEpisode === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current && episodes[index].audioUrl) {
        audioRef.current.src = episodes[index].audioUrl;
        audioRef.current.play().catch(() => {
        //   console.error("Error playing audio");
          setError("Failed to play audio. Please try another episode.");
        });
        setIsPlaying(true);
        setCurrentEpisode(index);
      } else {
        setError("No audio URL available for this episode.");
      }
    }
  };

  // Update current time and duration for the episode player
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);


  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search

    const filtered = episodes.filter((episode) =>
      episode.title.toLowerCase().includes(query)
    );
    setFilteredEpisodes(filtered);
  };

  // Handle genre filter
  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1); // Reset to first page on filter

    if (genre === "All Genre") {
      setFilteredEpisodes(episodes);
    } else {
      const filtered = episodes.filter((episode) => episode.genre === genre);
      setFilteredEpisodes(filtered);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(startIndex, startIndex + episodesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

    const fetchRSS = async () => {
        try {
            setLoading(true);
            const parser = new Parser();
            const proxyUrl = `/api/rss/proxy?url=${encodeURIComponent(
                "https://rss.castbox.fm/everest/e57bc6de67a146ab89a245ae0fda60a5.xml"
            )}`;

            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
            }

            const feedText = await response.text();
            const feed = await parser.parseString(feedText);

            if (feed.items && feed.items.length > 0) {
                const episodeData = feed.items.map((item: Parser.Item, index: number) => {
                    return {
                        title: item.title || "Untitled",
                        description: item.content || "",
                        audioUrl: item.enclosure?.url || "",
                        duration: (item as Parser.Item & { itunes?: { duration?: string } }).itunes?.duration || "N/A",
                        pubDate: item.pubDate || "N/A",
                        image: (item as Parser.Item & { itunes?: { image?: string } }).itunes?.image || "/images/placeholder.jpg",
                        genre: assignGenre(index),
                    };
                });
                setEpisodes(episodeData);
                setFilteredEpisodes(episodeData);
            } else {
                setError("No episodes found in the RSS feed.");
            }
        } catch (error: unknown) {
            setError(`Failed to load episodes: ${error}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Header Component */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Latest Popular Podcast Episodes</h1>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            The channel aims at bringing close the message of the KINGDOM of GOD to everyone around the world.
            </p>
          </div>
        </div>

        {/* Search Bar and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search episodes..."
              className={`w-full p-2 pl-10 border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
            />
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All Genre", "Sermons", "Worship", "Bible Study", "Christian Living", "Prayer", "Testimonies"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleGenreFilter(filter)}
                className={`px-4 py-2 rounded-full border ${
                  selectedGenre === filter
                    ? "bg-[#790DA3] text-white border-[#790DA3]"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                } transition-colors`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Episode Grid */}
        {loading && <p className="text-center text-gray-500">Loading episodes...</p>}
        {error && (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchRSS()}
              className="mt-2 px-4 py-2 bg-[#790DA3] text-white rounded-lg hover:bg-[#530970]"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && filteredEpisodes.length === 0 && (
          <p className="text-center text-gray-500">No episodes found.</p>
        )}
        {!loading && !error && filteredEpisodes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentEpisodes.map((episode, index) => (
                <div
                  key={startIndex + index}
                  className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  {/* Image Section */}
                  <div className="relative">
                  <Image
  src={episode.image}
  alt={episode.title}
  width={200}
  height={200}
  className="w-full h-48 object-cover"
  unoptimized // Disable image optimization
  onError={(e) => {
    // console.error(`Failed to load image for episode ${episode.title}: ${episode.image}`);
    e.currentTarget.src = "/images/placeholder.jpg";
  }}
//   onLoad={() => console.log(`Successfully loaded image for episode ${episode.title}: ${episode.image}`)}
/>
                    {/* green Circle with Episode Count */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="relative">
                        <div className="w-16 h-16 bg-[#790DA3] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">eps. {startIndex + index + 1}</span>
                        </div>
                        <div className="absolute inset-0 border-4 border-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="p-4 mt-6">
                    <h3 className="text-lg font-semibold truncate">{episode.title}</h3>
                    <p className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {episode.description.replace(/<[^>]+>/g, "")}
                    </p>
                    <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {episode.duration}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(episode.pubDate).toLocaleString("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-2 flex items-center space-x-2">
                      <div className={`flex-1 h-1 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
                        <div
                          className="h-full bg-[#790DA3]"
                          style={{
                            width:
                              currentEpisode === startIndex + index && duration
                                ? `${(currentTime / duration) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>
                      <button
                        onClick={() => toggleEpisodePlay(startIndex + index)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#790DA3] text-white hover:bg-[#530970] transition-colors"
                      >
                        {currentEpisode === startIndex + index && isPlaying ? (
                          <FaPause className="text-sm" />
                        ) : (
                          <FaPlay className="text-sm" />
                        )}
                      </button>
                      <a
                        href={episode.audioUrl}
                        download
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
                      >
                        <FaDownload className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                <FaChevronLeft className="mr-2" /> Previous
              </button>
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#790DA3] text-white hover:bg-[#530970]"
                } transition-colors`}
              >
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Audio Element for Playback */}
      <audio ref={audioRef} />

      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}