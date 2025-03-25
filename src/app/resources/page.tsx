"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BottomNav from "../../components/BottomNav";
import { FaGlobe, FaPray, FaYoutube } from "react-icons/fa";

export default function Livestream() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const youtubeChannelUrl = "https://www.youtube.com/@lattergloryministries3882";
  const websiteUrl = "https://www.latterglory.ug";
  const prayerMeetUrl = "https://meet.google.com/hij-city-pev";

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Example: Embed a specific video or livestream from the channel
  const videoId = "BlXCX1rz9Wo"; // Example video ID from Glory Marie Ministries
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Header Component */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1">
        {/* Title and Description */}
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Join Our Livestream</h1>
         
        </div> */}

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

          {/* YouTube Channel Link */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold flex items-center justify-center mb-4">
              <FaYoutube className="mr-2 text-red-600" />
              Watch More on YouTube
            </h2>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Stay connected with our latest videos and sermons.
            </p>
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Visit Our YouTube Channel
            </a>
          </div>

          {/* Website Link */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold flex items-center justify-center mb-4">
              <FaGlobe className="mr-2 text-blue-500" />
              Visit Our Website
            </h2>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Explore our ministry and all the resources we offer.
            </p>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit latterglory.ug
            </a>
          </div>

          {/* Prayer Meeting Link */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold flex items-center justify-center mb-4">
              <FaPray className="mr-2 text-green-500" />
              Join Our Monday Morning Prayer
            </h2>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Let&apos;s command our week every Monday from <b>4:30 AM - 5:15 AM </b>
            </p>
            <a
              href={prayerMeetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Join Prayer on Google Meet 
            </a>
          </div>

 {/* Tuesday Intercession Altar Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold flex items-center justify-center mb-4">
              <FaPray className="mr-2 text-green-500" />
              Join Our Tuesday Intercession Altar
            </h2>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Every Tuesday from <b>6:00 PM - 7:30 PM</b>.
            </p>
            <a
              href={prayerMeetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
               Join Tuesday Intercession (Google Meet)
            </a>
          </div>

        </div>
      </div>

      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}
