// src/app/contact/page.tsx
"use client";

import { useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify"; // Import the toast function
import Footer from "../../components/Footer";
import UpcomingEvents from "../../components/UpcomingEvents";
import BottomNav from "../../components/BottomNav";

export default function Contact() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const Header = dynamic(() => import("../../components/Header"), { ssr: false });

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contactInfo, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      setFormStatus("success");
      setName("");
      setContactInfo("");
      setMessage("");
      toast.success("🎉 Your message has been sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
      toast.error("❌ Failed to send your message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8"></h1>

        {/* Contact Form and Map */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Form */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  placeholder="Enter your name"
                  required
                  disabled={formStatus === "submitting"} // Disable input while submitting
                />
              </div>

              {/* Email or Phone Number */}
              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium mb-1">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  placeholder="Enter your email or phone number"
                  required
                  disabled={formStatus === "submitting"} // Disable input while submitting
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 resize-none h-32 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  placeholder="Enter your message"
                  required
                  disabled={formStatus === "submitting"} // Disable input while submitting
                />
              </div>

              {/* Submit Button with Progress Indicator */}
              <div className="relative">
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    formStatus === "submitting"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#320958] hover:bg-[#790DA3] text-white"
                  }`}
                >
                  {formStatus === "submitting" ? "Please wait..." : "Submit"}
                </button>
                {formStatus === "submitting" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Form Status Messages (Optional, since we're using toasts) */}
              {/* You can remove these if you prefer to rely solely on toasts */}
              {formStatus === "success" && (
                <p className="text-white text-center">Message sent successfully!</p>
              )}
              {formStatus === "error" && (
                <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
              )}
            </form>
          </div>

          {/* Google Map */}
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Our Location</h2>
            <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d127672.6584351763!2d32.4859279!3d0.2802993!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb003aee23f9%3A0x69bdecfa2733ba30!2sLATTER%20GLORY%20CHURCH%20KISAASI%20KAMPALA%20UG!5e0!3m2!1sen!2sug!4v1742403898547!5m2!1sen!2sug"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        <UpcomingEvents />
      </div>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}