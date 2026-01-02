import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    User,
    Search,
    Filter,
    ArrowRight,
    MessageCircle, HomeIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicAPI } from "@/services/api";
import { NewsArticle } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

const News = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getPublishedNews(1);
      console.log('News API Response:', response);
      setNewsArticles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching news articles:', error);
      setNewsArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/assets/service_bg_4.jpg';
    return `${STORAGE_BASE_URL}${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Admin';
    return fullName.split(' ')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
       {/* Page Header */}
        <section className="relative bg-green-500 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">News & Articles</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">news and articles</span>
                    </nav>

                </div>
            </div>
        </section>

      {/* News Grid Section */}
      <section className="news-page py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-600 text-lg">No news articles available at the moment.</p>
              </div>
            ) : (
              newsArticles.map((article, index) => {
                const dateInfo = formatDate(article.publish_date);
                return (
                  <div key={index} className="news-one__single bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
                    <div className="news-one__img-box relative">
                      <div className="news-one__img aspect-[5/4] overflow-hidden">
                        <img 
                          src={getImageUrl(article.image)} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/service_bg_4.jpg';
                          }}
                        />
                      </div>
                      <div className="news-one__date absolute top-4 right-4 bg-blue-600 text-white text-center p-3 rounded-lg">
                        <p className="text-lg font-normal">{dateInfo.day}</p>
                        <p className="text-sm">{dateInfo.month}</p>
                      </div>
                    </div>
                    <div className="news-one__content p-6">
                      <div className="news-one__user-and-meta flex justify-between items-center mb-4">
                        <div className="news-one__user flex items-center">
                          <div className="news-one__user-img w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src="/assets/images/blog/news-one-user-img.jpg" 
                              alt="User"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/leader-portrait.jpg';
                              }}
                            />
                          </div>
                          <div className="news-one__user-text">
                            {/* <p className="text-sm text-gray-600">
                              by <br />
                              <span className="font-normal">{getFirstName(article.author || 'Admin')}</span>
                            </p> */}
                          </div>
                        </div>
                        <div className="news-one__meta flex items-center">
                          <div className="icon mr-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="text">
                            <p className="text-sm text-gray-500">{dateInfo.day}/{dateInfo.month}/{new Date().getFullYear()}</p>
                          </div>
                        </div>
                      </div>
                      <h3 className="news-one__title text-xl font-normal mb-4">
                        <a 
                          href={`/news/${article.id}`} 
                          className="hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </a>
                      </h3>
                      <div className="news-one__btn">
                        <a 
                          href={`/news/${article.id}`}
                          className="inline-flex items-center bg-green-400 hover:text-green-800 rounded border-green-100 p-2  font-normal transition-colors"
                        >
                          Read More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News; 