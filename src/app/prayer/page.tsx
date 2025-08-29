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
      
      // Smooth scroll to success message without affecting header
      const successElement = document.getElementById('success-message');
      if (successElement) {
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setSubmitError(errorMessage);
      // Scroll to error message
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-inherit border-b border-gray-200 dark:border-gray-700">
        <Header isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
         

          {/* Scripture Banner */}
          <div className={`${isDarkMode ? "bg-gradient-to-r from-purple-900 to-indigo-900" : "bg-gradient-to-r from-purple-100 to-indigo-100"} p-8 rounded-2xl text-center shadow-lg border ${isDarkMode ? "border-purple-800" : "border-purple-200"}`}>
            <div className="max-w-3xl mx-auto">
              <p className={`text-lg md:text-xl italic leading-relaxed ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&rdquo;
              </p>
              <p className={`font-semibold mt-4 text-lg ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>— Philippians 4:6</p>
            </div>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div id="success-message" className={`${isDarkMode ? "bg-green-900/50 border-green-500" : "bg-green-50 border-green-400"} border-l-4 p-6 rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-500`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-green-500" : "bg-green-400"}`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-green-300" : "text-green-800"}`}>
                    Prayer Request Submitted!
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                    Your prayer request has been submitted. Our community will be praying for you.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div id="error-message" className={`${isDarkMode ? "bg-red-900/50 border-red-500" : "bg-red-50 border-red-400"} border-l-4 p-6 rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-500`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-red-500" : "bg-red-400"}`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                    Submission Failed
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-700"}`}>{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Submit Prayer Request Form */}
          <div className={`${isDarkMode ? "bg-gray-800/50" : "bg-white"} backdrop-blur-sm shadow-xl rounded-2xl p-8 border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Submit Your Prayer Request</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className={`block ${isDarkMode ? "text-gray-200" : "text-gray-700"} text-sm font-semibold`}>
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className={`block ${isDarkMode ? "text-gray-200" : "text-gray-700"} text-sm font-semibold`}>
                  Email Address <span className={`text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className={`block ${isDarkMode ? "text-gray-200" : "text-gray-700"} text-sm font-semibold`}>
                  Phone Number <span className={`text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="(555) 123-4567"
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="request" className={`block ${isDarkMode ? "text-gray-200" : "text-gray-700"} text-sm font-semibold`}>
                  Your Prayer Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="request"
                  placeholder="Please share what you would like us to pray for. Your request will be handled with care and confidentiality."
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none min-h-[120px] ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  rows={6}
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !prayerRequest.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                    isSubmitting || !name.trim() || !prayerRequest.trim()
                      ? "bg-gray-400 cursor-not-allowed text-gray-200 scale-100"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting Prayer...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z" />
                      </svg>
                      <span>Submit Prayer Request</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </main>
      
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}
