"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BottomNav from "../../components/BottomNav";
import { FaGlobe, FaPray, FaYoutube } from "react-icons/fa";

interface PrayerMeeting {
  type: "prayer_meeting";
  name: string;
  day: string;
  time: string;
  url: string;
  order: number;
}

interface Link {
  type: "link";
  key: string;
  url: string;
  description: string;
  order: number;
}

type LivestreamLink = PrayerMeeting | Link;

export default function Livestream() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [links, setLinks] = useState<LivestreamLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch links from the API
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("/api/livestream-links");
        if (!res.ok) {
          throw new Error("Failed to fetch livestream links");
        }
        const data = await res.json();
        setLinks(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching livestream links:", err);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
        // Fallback data in case of error
        setLinks([
          {
            type: "prayer_meeting",
            name: "Command Your Week",
            day: "Monday",
            time: "4:30 AM - 5:15 AM",
            url: "https://meet.google.com/hij-city-pev",
            order: 1,
          },
          {
            type: "prayer_meeting",
            name: "Tuesday Intercession Altar",
            day: "Tuesday",
            time: "6:00 PM - 7:30 PM",
            url: "https://meet.google.com/hij-city-pev",
            order: 2,
          },
          {
            type: "link",
            key: "youtubeChannelUrl",
            url: "https://www.youtube.com/@lattergloryministries3882",
            description: "YouTube channel URL",
            order: 3,
          },
          {
            type: "link",
            key: "website WUrl",
            url: "https://latterglory.ug",
            description: "Website URL",
            order: 4,
          },
        ]);
      }
    };

    fetchLinks();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Example: Embed a specific video or livestream from the channel
  const videoId = "BlXCX1rz9Wo"; // Example video ID from Glory Marie Ministries
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Filter prayer meetings and other links
  const prayerMeetings = links.filter((link): link is PrayerMeeting => link.type === "prayer_meeting");
  const otherLinks = links.filter((link): link is Link => link.type === "link");

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Header Component */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1">
        {/* YouTube Embed */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              src={embedUrl}
              title="YouTube Livestream"
              className="w-full h-full rounded-lg shadow-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Link Sections Grouped */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prayer Meetings */}
          {prayerMeetings.map((meeting) => (
            <div key={meeting.name} className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-2xl font-semibold flex items-center justify-left mb-4">
                <FaPray className="mr-2 text-green-500" />
                {meeting.name}
              </h2>
              <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Every {meeting.day} from <b>{meeting.time}</b>.
              </p>
              <a
                href={meeting.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Join on Google Meet
              </a>
            </div>
          ))}

          {/* Timezone Note */}
          {prayerMeetings.length > 0 && (
            <div className="md:col-span-2">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                All times are in East Africa Time (EAT, UTC+3).
              </p>
            </div>
          )}

          {/* Other Links */}
          {otherLinks.map((link) => (
            <div key={link.key} className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-2xl font-semibold flex items-left justify-left mb-4">
                {link.key === "youtubeChannelUrl" && <FaYoutube className="mr-2 text-red-600" />}
                {link.key === "websiteUrl" && <FaGlobe className="mr-2 text-[#320958]" />}
                {link.key === "youtubeChannelUrl" ? "Watch More on YouTube" : "Visit Our Website"}
              </h2>
              <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {link.description}
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block mt-3 px-5 py-2 text-white rounded-lg transition-colors ${
                  link.key === "youtubeChannelUrl"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#320958] hover:bg-[#2a0845]"
                }`}
              >
                {link.key === "youtubeChannelUrl" ? "Visit Our YouTube Channel" : "Visit latterglory.ug"}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}