import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    User,
    MessageCircle,
    Search,
    ArrowRight,
    Facebook,
    Twitter,
    Instagram,
    Share2, HomeIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicAPI } from "@/services/api";
import { NewsArticle } from "@/services/api";
import { STORAGE_BASE_URL } from '@/config';

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      fetchArticleDetails();
      fetchRelatedArticles();
    }
  }, [id]);

  const fetchArticleDetails = async () => {
    try {
      setLoading(true);
      // Assuming you have an API endpoint to get a single article by ID
      const response = await publicAPI.getPublishedNews(1);
      const articles = response.data.data || [];
      const foundArticle = articles.find((art: NewsArticle) => art.id === parseInt(id || '0'));
      setArticle(foundArticle || null);
    } catch (error) {
      console.error('Error fetching article details:', error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await publicAPI.getPublishedNews(1);
      const articles = response.data.data || [];
      // Get 3 random articles as related articles
      const shuffled = articles.sort(() => 0.5 - Math.random());
      setRelatedArticles(shuffled.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related articles:', error);
      setRelatedArticles([]);
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Comment submitted:', commentForm);
    setCommentForm({ name: '', email: '', message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Article not found.</p>
            <Link to="/news" className="text-blue-600 hover:underline mt-2 inline-block">
              Back to News
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const dateInfo = formatDate(article.publish_date);

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

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">News Details</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">{article.title}</span>
                    </nav>

                </div>
            </div>
        </section>

      {/* News Details */}
      <section className="news-details py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="news-details__left bg-white rounded-lg shadow-md p-8">
                {/* Article Image */}
                <div className="news-details__img-box relative mb-8">
                  <div className="news-details__img">
                    <img 
                      src={getImageUrl(article.image)} 
                      alt={article.title}
                      className="w-full h-98 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/service_bg_4.jpg';
                      }}
                    />
                  </div>
                  <div className="news-details__date absolute top-4 right-4 bg-blue-600 text-white text-center p-3 rounded-lg">
                    <p className="text-lg font-normal">{dateInfo.day}</p>
                    <p className="text-sm">{dateInfo.month}</p>
                  </div>
                </div>

                {/* Article Content */}
                <div className="news-details__content">
            
                  {/* Article Title */}
                  <h3 className="news-details__title-1 text-3xl font-normal mb-6 text-gray-900">
                    {article.title}
                  </h3>

                  {/* Article Description */}
                  <div className="news-details__text space-y-4 text-gray-700 leading-relaxed">
                    <p>{article.description}</p>
                  </div>
                </div>

                {/* Tags and Social Share */}
                <div className="news-details__bottom flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 pt-8 border-t border-gray-200">
                  <div className="news-details__tags mb-4 sm:mb-0">
                    <span className="font-normal text-gray-900 mr-4">Tags:</span>
                    <Badge variant="outline" className="mr-2">Government</Badge>
                    <Badge variant="outline" className="mr-2">Council</Badge>
                  </div>
                  <div className="news-details__social-list flex space-x-3">
                    <a href="#" className="text-blue-600 transition-colors hover:rounded-full hover:text-blue-400">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-blue-600 transition-colors hover:rounded-full hover:text-blue-500">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-blue-600 transition-colors hover:rounded-full hover:text-pink-400 ">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-blue-600 transition-colors hover:rounded-full hover:text-violet-400">
                      <Share2 className="w-5 h-5" />
                    </a>
                  </div>
                </div>

   
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sidebar space-y-8">
                {/* Search */}
                <div className="sidebar__single sidebar__search">
                  <form className="sidebar__search-form flex">
                    <Input 
                      type="search" 
                      placeholder="Search here"
                      className="rounded-r-none"
                    />
                    <Button type="submit" className="rounded-l-none">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                </div>

                {/* Latest Posts */}
                <div className="sidebar__single sidebar__post">
                  <h3 className="sidebar__title text-xl font-normal mb-4">Latest posts</h3>
                  <ul className="sidebar__post-list space-y-4">
                    {relatedArticles.map((relatedArticle, index) => (
                      <li key={index} className="flex space-x-3">
                        <div className="sidebar__post-image">
                          <img 
                            src={getImageUrl(relatedArticle.image)} 
                            alt={relatedArticle.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                        <div className="sidebar__post-content flex-1">
                          <h3 className="text-sm">
                            <Link to={`/news/${relatedArticle.id}`} className="text-gray-900 hover:text-blue-600 transition-colors">
                              {relatedArticle.title}
                            </Link>
                          </h3>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsDetails;
