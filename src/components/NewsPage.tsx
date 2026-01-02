import React, { useState, useEffect } from 'react';
import { publicAPI } from '@/services/api';
import { NewsArticle } from '@/services/api';
import { STORAGE_BASE_URL } from '@/config';

const NewsPage = () => {
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
      <section className="news-page py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading news articles...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-page py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => {
            const dateInfo = formatDate(article.publish_date);
            return (
              <div key={index} className="news-one__single bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="news-one__img-box relative">
                  <div className="news-one__img">
                    <img 
                      src={getImageUrl(article.image)} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
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
                        />
                      </div>
                      <div className="news-one__user-text">
                        <p className="text-sm text-gray-600">
                          by <br />
                          <span className="font-normal">{getFirstName(article.author || 'Admin')}</span>
                        </p>
                      </div>
                    </div>
                    <div className="news-one__meta flex items-center">
                      <div className="icon mr-2">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text">
                        <p className="text-sm text-gray-500">2 Comments</p>
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
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-normal transition-colors"
                    >
                      Read More
                      <svg 
                        className="ml-2 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {newsArticles.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600">No news articles available at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPage;
