import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MapPin, Search, Loader2, ExternalLink, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

export default function FindPharmacy() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location access to find nearby pharmacies.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const searchPharmacies = async () => {
    if (!location) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      setError("The Pharmacy Finder is currently disabled because no API key was provided during deployment. To enable this feature, please add a GEMINI_API_KEY to your environment variables.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Find the best pharmacies near my current location. Provide their names, addresses, and why they are recommended.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          }
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapsSources = chunks.filter(c => c.maps).map(c => c.maps);
      
      if (mapsSources.length === 0) {
        setError("No pharmacies found nearby. Try again later.");
      } else {
        setPharmacies(mapsSources);
      }
    } catch (err) {
      console.error("Maps Error:", err);
      setError("Failed to search for pharmacies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Nearby <span className="text-primary">Pharmacies</span></h1>
        <p className="text-gray-400 text-xl">Quickly locate the nearest pharmacy to pick up your prescriptions.</p>
      </div>

      <div className="glass-card p-8 text-center space-y-8">
        {!location && !error && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p>Getting your location...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400">
            <p className="text-lg font-bold">{error}</p>
          </div>
        )}

        {location && pharmacies.length === 0 && !isLoading && (
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-2xl inline-block">
              <MapPin className="w-16 h-16 text-primary mx-auto" />
            </div>
            <h2 className="text-2xl font-bold">Location Found</h2>
            <p className="text-gray-400">We're ready to search for pharmacies near you.</p>
            <button
              onClick={searchPharmacies}
              className="bg-primary text-dark font-bold py-4 px-12 rounded-2xl hover:scale-105 transition-transform flex items-center space-x-3 mx-auto"
            >
              <Search className="w-6 h-6" />
              <span>Search Now</span>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center space-y-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-xl font-bold">Searching Google Maps...</p>
          </div>
        )}

        {pharmacies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {pharmacies.map((pharmacy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pharmacy.title}</h3>
                  <Navigation className="w-5 h-5 text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                  {pharmacy.uri ? "Click below to view details and directions on Google Maps." : "Pharmacy details found."}
                </p>
                <a
                  href={pharmacy.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary font-bold hover:underline"
                >
                  <span>View on Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
            <div className="md:col-span-2 pt-8">
              <button
                onClick={searchPharmacies}
                className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
              >
                Refresh Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
