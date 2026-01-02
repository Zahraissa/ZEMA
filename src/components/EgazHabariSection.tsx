import React from 'react';
import { Calendar, ArrowRight, FileText, Newspaper } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  isMain?: boolean;
}

interface PublicNotice {
  id: number;
  title: string;
  date: string;
  fileUrl?: string;
}

const EgazHabariSection = () => {
  // Sample data - in a real app, this would come from an API
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "TRA TO EMPOWER INFORMAL BUSINESS OPERATORS TO REGISTER",
      date: "26 August, 2025",
      description: "The Commissioner General of the Tanzania Revenue Authority (TRA), Mr. Yusuph Juma Mwenda, has announced that TRA has...",
      image: "/assets/hero_bg_6_1.jpg",
      isMain: true
    },
    {
      id: 2,
      title: "TRA LAUNCHES TRADE FACILITATION DESK IN THE COUNTRY",
      date: "18 August, 2025",
      description: "",
      image: "/assets/hero_bg_8_1.png"
    },
    {
      id: 3,
      title: "TRA BOARD OF DIRECTORS MET TO EVALUATE 2024/25 PERFORMANCE",
      date: "14 August, 2025",
      description: "",
      image: "/assets/hero_bg_6_1.jpg"
    },
    {
      id: 4,
      title: "\"TRA ENABLES THE GOVERNMENT TO IMPLEMENT DEVELOPMENT PROJECTS\" - MINISTER MKUYA",
      date: "20 July, 2025",
      description: "",
      image: "/assets/hero_bg_8_1.png"
    }
  ];

  const publicNotices: PublicNotice[] = [
    {
      id: 1,
      title: "AMNESTY FOR OWNERS OF UNCUSTOMED VEHICLES",
      date: "01 August, 2025",
      fileUrl: "#"
    },
    {
      id: 2,
      title: "SUBMISSION OF QUARTERLY RETURNS BY BENEFICIARIES UNDER EAST AFRICAN COMMUNITY DUTY REMISSION SCHEME",
      date: "01 August, 2025",
      fileUrl: "#"
    },
    {
      id: 3,
      title: "NEW SYSTEM FOR REGISTRATION MOTOR VEHICLES, MOTOR CYCLES AND ISSUANCE OF DRIVING LICENSES",
      date: "19 February, 2025",
      fileUrl: "#"
    },
    {
      id: 4,
      title: "USER MANUAL FOR MOTOR VEHICLE REGISTRATION",
      date: "19 February, 2025",
      fileUrl: "#"
    },
    {
      id: 5,
      title: "TELEPHONE NUMBERS - TRANSIT GOODS AND OTHER GOODS UNDER CUSTOMS CONTROL",
      date: "01 December, 2024",
      fileUrl: "#"
    }
  ];

  const mainArticle = newsArticles.find(article => article.isMain);
  const otherArticles = newsArticles.filter(article => !article.isMain);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* News & Events Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center">
              <Newspaper className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-normal">News & Events</h2>
            </div>
            
            <div className="p-6">
              {/* Main Article */}
              {mainArticle && (
                <div className="mb-6">
                  <div className="relative rounded-lg overflow-hidden mb-4">
                    <img
                      src={mainArticle.image}
                      alt={mainArticle.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-lg font-normal mb-2 leading-tight">
                        {mainArticle.title}
                      </h3>
                      <div className="flex items-center text-sm mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{mainArticle.date}</span>
                      </div>
                      <p className="text-sm opacity-90 line-clamp-2">
                        {mainArticle.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Articles */}
              <div className="space-y-4 mb-6">
                {otherArticles.map((article) => (
                  <div key={article.id} className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-20 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-normal text-gray-900 line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Link */}
              <div className="text-right">
                <a
                  href="#"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-normal text-sm transition-colors"
                >
                  View More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Public Notice Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-normal">Public Notice</h2>
            </div>
            
            <div className="p-6">
              {/* Notices List */}
              <div className="space-y-4 mb-6">
                {publicNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => notice.fileUrl && window.open(notice.fileUrl, '_blank')}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <FileText className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-normal text-gray-900 line-clamp-2 mb-1">
                        {notice.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{notice.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Link */}
              <div className="text-right">
                <a
                  href="#"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-normal text-sm transition-colors"
                >
                  View More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EgazHabariSection;
