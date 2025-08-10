"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import BottomNav from "../../components/BottomNav";

interface PrayerRequest {
  _id: string;
  name: string;
  request: string;
  createdAt: string;
}

export default function PrayerRequestPage() {
  // State for theme and form fields
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  // State for displaying prayer requests
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  
  const Header = dynamic(() => import("../../components/Header"), { ssr: false });

  // Fetch existing prayer requests on page load
  useEffect(() => {
    async function fetchPrayerRequests() {
      try {
        const response = await fetch("/api/prayer-requests");
        if (!response.ok) {
          throw new Error("Failed to fetch prayer requests");
        }
        const data = await response.json();
        setPrayerRequests(data.prayerRequests);
      } catch (error) {
        console.error("Error fetching prayer requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerRequests();
  }, [submitSuccess]); // Refetch when a new prayer request is successfully submitted

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitSuccess(false);
    setSubmitError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          request: prayerRequest,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit prayer request");
      }
      
      // Success! Clear form and show success message
      setName("");
      setEmail("");
      setPhoneNumber("");
      setPrayerRequest("");
      setSubmitSuccess(true);
      
      // Show success toast
      toast.success("🙏 Your prayer request has been submitted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 py-8">        
        <div className="w-full">
          {/* Scripture Banner */}
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-green-50"} p-6 rounded-lg mb-10 text-center border-l-4 border-green-700`}>
            <p className={`text-lg italic ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
              &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&rdquo;
            </p>
            <p className={`font-semibold mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>— Philippians 4:6</p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className={`${isDarkMode ? "bg-gray-800 border-green-600" : "bg-green-50 border-green-500"} border-l-4 p-4 mb-6 rounded`}>
              <div className="flex">
                <div className="ml-3">
                  <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                    Your prayer request has been submitted. The community will be praying for you.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className={`${isDarkMode ? "bg-gray-800 border-red-600" : "bg-red-50 border-red-500"} border-l-4 p-4 mb-6 rounded`}>
              <div className="flex">
                <div className="ml-3">
                  <p className={`text-sm ${isDarkMode ? "text-red-400" : "text-red-700"}`}>{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Submit Prayer Request Form */}
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-lg p-6 mb-10`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Submit Your Prayer Request</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className={`block ${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm font-bold mb-2`}>
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className={`block ${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm font-bold mb-2`}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className={`block ${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm font-bold mb-2`}>
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="request" className={`block ${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm font-bold mb-2`}>
                  Your Prayer Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="request"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 resize-none h-32 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  rows={5}
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-900 hover:bg-green-600 text-white"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
                </button>
              </div>
            </form>
          </div>
          
          {/* Prayer Requests Display */}
       
        </div>
      </div>
      
      <Footer isDarkMode={isDarkMode} />
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}
