import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "tailwindcss/tailwind.css";
import { publicAPI } from "@/services/api";
import { NewsArticle } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      // Fetch all published news instead of just featured
      const response = await publicAPI.getPublishedNews(1);
      console.log("Blog API Response:", response);
      console.log("Blog Posts Data:", response.data.data);
      setBlogPosts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      // Fallback to empty array if API fails
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/assets/service_bg_4.jpg"; // Fallback image
    return `${STORAGE_BASE_URL}${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return "Unknown";
    return fullName.split(" ")[0]; // Get the first word (first name)
  };

  const getDisplayTitle = (title?: string) => {
    if (!title || title.trim() === "") {
      return "Untitled Article";
    }
    // Ensure title is properly trimmed and limited to very short length for compact display
    const trimmedTitle = title.trim();
    return trimmedTitle.length > 30 ? trimmedTitle.substring(0, 30) + "..." : trimmedTitle;
  };
  if (loading) {
    return (
      <section
        className="relative overflow-hidden py-16 bg-gray-100"
        id="blog-sec"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left">
            <div className="md:w-7/12 mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-normal text-gray-900">
                Latest News
              </h2>
            </div>
            <div className="md:w-auto">
              <Link
                to="/news"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-normal rounded-lg hover:bg-green-700 transition-colors"
              >
                See More
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <section
        className="relative overflow-hidden py-16 bg-gray-100"
        id="blog-sec"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left">
            <div className="md:w-7/12 mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-normal text-gray-900">
                Latest News
              </h2>
            </div>
            <div className="md:w-auto">
              <Link
                to="/news"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-normal rounded-lg hover:bg-green-700 transition-colors"
              >
               See more
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600">
                No articles or news available at the moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden py-16 bg-gray-100"
      id="blog-sec"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left">
          <div className="md:w-7/12 mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900">
              Latest News
            </h2>
          </div>
          <div className="md:w-auto">
            <Link
              to="/news"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-normal rounded-lg hover:bg-green-700 transition-colors"
            >
              See more
            </Link>
          </div>
        </div>
        <div className="relative">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
              1400: { slidesPerView: 4 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {blogPosts.map((post, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col h-[470px]">
                  {/* Image on top */}
                  <div className="relative flex-shrink-0 h-72 w-full overflow-hidden">
                    <img
                      src={getImageUrl(post.image)}
                      alt="blog image"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/service_bg_4.jpg";
                      }}
                    />
                    {/* Clear overlay button */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content below, fills remaining space */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span className="text-gray-600">
                        {formatDate(post.publish_date)}
                      </span>
                      {/* <span className="text-gray-500">By {getFirstName(post.author || 'Unknown')}</span> */}
                    </div>

                    <h3 className="text-xl font-normal mb-4 flex-grow leading-tight min-h-[3rem] flex items-start">
                      <Link 
                        to={`/news/${post.id}`} 
                        className="hover:text-blue-600 transition-colors block w-full"
                        title={post.title} // Show full title on hover
                      >
                        {getDisplayTitle(post.title)}
                      </Link>
                    </h3>

                    <Link
                      to={`/news/${post.id}`}
                      className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-normal rounded-lg hover:bg-green-700 transition-colors mt-auto"
                    >
                      See more
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
