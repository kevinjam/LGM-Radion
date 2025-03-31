import { useState, useEffect } from "react";

interface Advert {
  name: string;
  description: string;
  time: string;
  date: string;
}

export default function UpcomingEvents() {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");
        // Check if the response is ok (status code 200-299)  
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setAdverts(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load upcoming events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 mb-6 text-center">
        <p className="text-gray-500">Loading upcoming events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 mb-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!adverts || adverts.length === 0) {
    return (
      <div className="w-full px-4 mb-6 text-center">
        <p className="text-gray-500">No upcoming events available.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 mb-6">
      <h3 className="text-xl font-semibold mb-2 text-center">Upcoming Events</h3>
      <div className="flex space-x-4 overflow-x-auto">
        {adverts.map((advert, index) => (
          <div
            key={index}
            className="flex-shrink-0 p-4 bg-[#320958] rounded-lg text-white"
          >
            <p className="text-sm">
              {advert.date} {advert.time}
            </p>
            <p className="text-lg font-medium">{advert.name}</p>
            <p className="text-sm">{advert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}