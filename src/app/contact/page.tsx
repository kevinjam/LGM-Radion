// src/app/contact/page.tsx
"use client";

import { useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
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

        {/* Contact Form and Locations */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Church Locations - Moved above form on mobile */}
          <div className="w-full md:w-1/2 order-first md:order-last">
            <h2 className="text-xl font-semibold mb-4">Our Church Locations</h2>
            <div className="space-y-6">
              {/* Rubaga (Main Church) */}
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-[#320958] dark:text-[#790DA3]">Rubaga (Main Church)</h3>
                <p><strong>Location:</strong> Kabuusu, Rubaga</p>
                <p><strong>Service Times:</strong> Sunday 9:00 AM - 12:00 PM</p>
                <p>
                  <strong>Contact:</strong>{" "}
                  <a
                    href="tel:+256782664592"
                    className="text-[#320958] hover:text-[#790DA3] underline"
                  >
                    +256 782 664 592
                  </a>
                </p>
                <a
                  href="https://www.google.com/maps/place/faith+family+church/@0.2976623,32.5476881,17z/data=!3m1!4b1!4m6!3m5!1s0x177dbcc6e6400001:0xec025891350a6e8c!8m2!3d0.2976623!4d32.5525644!16s%2Fg%2F11txmzl0rp?entry=ttu&g_ep=EgoyMDI1MDMyMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#320958] hover:text-[#790DA3] underline"
                >
                  View on Map
                </a>
              </div>

              {/* Ntinda */}
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-[#320958] dark:text-[#790DA3]">Ntinda</h3>
                <p><strong>Location:</strong> Meet at Eliana Hotel, Ntinda</p>
                <p><strong>Service Times:</strong> Sunday 8:00 AM - 9:30 AM</p>
                <p>
                  <strong>Contact:</strong>{" "}
                  <a
                    href="tel:+256703648648"
                    className="text-[#320958] hover:text-[#790DA3] underline"
                  >
                    +256 703 648 648
                  </a>
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Eliana+Hotel,+Ntinda,+Kampala,+Uganda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#320958] hover:text-[#790DA3] underline"
                >
                  View on Map
                </a>
              </div>

              {/* Nakawuka */}
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-[#320958] dark:text-[#790DA3]">Nakawuka</h3>
                <p><strong>Location:</strong> Meet at The Adrace Resort, Nakawuka</p>
                <p><strong>Service Times:</strong> Sunday 8:00 AM - 10:00 AM</p>
                <p>
                  <strong>Contact:</strong>{" "}
                  <a
                    href="tel:+256700321048"
                    className="text-[#320958] hover:text-[#790DA3] underline"
                  >
                    +256 700 321 048
                  </a>
                </p>
                <a
                  href="https://www.google.com/maps/place/The+Adrace+Executive+Resort/@0.1906182,32.4555223,17z/data=!3m1!4b1!4m6!3m5!1s0x177d99e9d1ec0319:0xaa7726d8b73aaa5e!8m2!3d0.1906182!4d32.4581026!16s%2Fg%2F11j13k0dxv?entry=ttu&g_ep=EgoyMDI1MDMyMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#320958] hover:text-[#790DA3] underline"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-1/2 order-last md:order-first">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={formStatus === "submitting"}
                />
              </div>
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
                  disabled={formStatus === "submitting"}
                />
              </div>
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
                  disabled={formStatus === "submitting"}
                />
              </div>
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
            </form>
          </div>
        </div>

        {/* Upcoming Events */}
        <UpcomingEvents />
      </div>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Bottom Navigation Menu (Mobile Only) */}
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}