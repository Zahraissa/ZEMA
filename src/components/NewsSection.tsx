import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaRegClock } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { publicAPI, WelcomeMessage } from '../services/api';

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [welcomeMessages, setWelcomeMessages] = useState<WelcomeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch welcome messages from API
  const fetchWelcomeMessages = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching
      const response = await publicAPI.getActiveWelcomeMessages();
      if (response.success) {
        setWelcomeMessages(response.data);
        console.log('NewsSection: Updated welcome messages:', response.data);
      } else {
        setError('Failed to fetch welcome messages');
      }
    } catch (err) {
      console.error('Error fetching welcome messages:', err);
      setError('Failed to load welcome messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWelcomeMessages();
    
    // Listen for welcome message updates
    const handleWelcomeMessageUpdate = () => {
      console.log('NewsSection: Received welcome message update event');
      fetchWelcomeMessages();
    };
    
    window.addEventListener('welcomeMessageUpdated', handleWelcomeMessageUpdate);
    
    return () => {
      window.removeEventListener('welcomeMessageUpdated', handleWelcomeMessageUpdate);
    };
  }, []);

  // Simple carousel auto-slide
  useEffect(() => {
    if (welcomeMessages.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % welcomeMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [welcomeMessages.length]);

  // Show loading state
  if (loading) {
    return (
      <section className="bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-800">Welcome Messages</h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading welcome messages...</div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-800">Welcome Messages</h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (welcomeMessages.length === 0) {
    return (
      <section className="bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-800">Welcome Messages</h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">No welcome messages available</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-800">Welcome Messages</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Left Section */}
          <div className="w-full lg:w-2/3">
            <div className="w-full">
              {welcomeMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                      <div className="w-full h-[450px] sm:h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                        {message.image_url ? (
                          <img
                            key={`${message.id}-${message.image_url}`}
                            src={`${message.image_url}?t=${message.updated_at}`}
                            alt={message.name}
                            className="w-full h-[550px] object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <p className="text-lg sm:text-xl md:text-2xl font-normal text-gray-700 mb-2">
                        {message.name}
                      </p>
                      <p className="text-base sm:text-lg md:text-xl font-normal text-gray-600 mb-3 sm:mb-4">
                        {message.position}
                      </p>
                      <hr className="border-gray-300 mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Carousel Navigation */}
              {welcomeMessages.length > 1 && (
                <div className="flex justify-end mt-4 space-x-2">
                  {welcomeMessages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentSlide ? 'bg-blue-700' : 'bg-gray-400'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/4">
            <div className="space-y-4 sm:space-y-6">
              {/* Call Box */}
              <div className="flex items-center border-l-2 border-cyan-700 bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <div className="mr-3 sm:mr-4 text-xl sm:text-2xl text-blue-600 rounded-full p-3 sm:p-4 bg-blue-100">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-gray-600 text-sm sm:text-base">Call</p>
                  <a
                    href="tel:+25577900529"
                    className="text-base sm:text-lg font-normal text-gray-800 hover:text-blue-600"
                  >
                    +255 77900529
                  </a>
                </div>
              </div>

              {/* Email Box */}
              <div className="flex items-center border-l-2 border-cyan-700 bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <div className="mr-3 sm:mr-4 text-xl sm:text-2xl text-blue-600 rounded-full p-3 sm:p-4 bg-blue-100">
                  <MdOutlineMail />
                </div>
                <div>
                  <p className="text-gray-600 text-sm sm:text-base">Email</p>
                  <a
                    href="mailto:info@egaz.co.tz"
                    className="text-base sm:text-lg font-normal text-gray-800 hover:text-blue-600"
                  >
                    info@egaz.co.tz
                  </a>
                </div>
              </div>

              {/* Opening Hours Box */}
              <div className="flex items-center border-l-2 border-cyan-700 bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <div className="mr-3 sm:mr-4 text-xl sm:text-2xl text-blue-600 rounded-full p-3 sm:p-4 bg-blue-100">
                  <FaRegClock />
                </div>
                <div>
                  <p className="text-gray-600 text-sm sm:text-base">Opening hours</p>
                  <p className="text-base sm:text-lg font-normal text-gray-800">Monday - Friday: 07:30 AM to 03:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;