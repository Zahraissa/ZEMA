import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Play, Download } from "lucide-react";
import { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import { publicAPI, MuhimuData, MuhimuDownload } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

interface Announcement {
  id: number;
  title: string;
  published: string;
  file_url?: string;
  file_name?: string;
}

interface Video {
  id: number;
  title: string;
  description?: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  is_main: boolean;
  duration?: string;
}

interface Download {
  id: number;
  title: string;
  published: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  file_type?: string;
  download_count: number;
}

const MuhimuSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMuhimuData();
  }, []);

  const fetchMuhimuData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicAPI.getMuhimu();
      if (response.success) {
        setAnnouncements(response.data.announcements || []);
        setDownloads(response.data.downloads || []);
      } else {
        setError(response.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching muhimu data:", err);
      setError(err instanceof Error ? err.message : "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadId: number, fileUrl: string) => {
    try {
      await publicAPI.incrementMuhimuDownload(downloadId);
      // Refresh the data to update download counts
      fetchMuhimuData();

      // Trigger file download
      let fullUrl = fileUrl;
      if (!fileUrl.startsWith('http')) {
        // Remove /storage/ prefix if present
        const cleanUrl = fileUrl.startsWith('/storage/') 
          ? fileUrl.replace('/storage/', '') 
          : fileUrl;
        fullUrl = `${STORAGE_BASE_URL}${cleanUrl}`;
      }
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = "";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error handling download:", err);
      // Still try to download the file even if increment fails
      let fullUrl = fileUrl;
      if (!fileUrl.startsWith('http')) {
        // Remove /storage/ prefix if present
        const cleanUrl = fileUrl.startsWith('/storage/') 
          ? fileUrl.replace('/storage/', '') 
          : fileUrl;
        fullUrl = `${STORAGE_BASE_URL}${cleanUrl}`;
      }
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = "";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleVideoClick = (youtubeUrl: string) => {
    if (youtubeUrl) {
      window.open(youtubeUrl, "_blank");
    }
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    if (announcement.file_url) {
      let fullUrl = announcement.file_url;
      if (!announcement.file_url.startsWith('http')) {
        // Remove /storage/ prefix if present
        const cleanUrl = announcement.file_url.startsWith('/storage/') 
          ? announcement.file_url.replace('/storage/', '') 
          : announcement.file_url;
        fullUrl = `${STORAGE_BASE_URL}${cleanUrl}`;
      }
      window.open(fullUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-normal text-gray-800 mb-4">
              Fetching data...
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex space-x-3">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-normal text-gray-800 mb-4">
              Error encountered while fetching Content
            </h3>
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={fetchMuhimuData}
              className="bg-green-500 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Important Announcements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="flex space-x-1 mr-3">
                  <div className="w-3 h-1 bg-blue-600 rounded"></div>
                </div>
                <h2 className="text-2xl font-normal text-gray-800">
                  Important Announcements
                </h2>
              </div>
              <p className="text-gray-600 text-sm">
                  Read announcements and official reports to stay informed about the activities being implemented by BLRA.
              </p>
            </div>

            {/* Announcements List */}
            <div className="space-y-4 mb-6">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleAnnouncementClick(announcement)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-normal text-gray-900 line-clamp-2">
                        {announcement.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Published {announcement.published}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No announcements available
                  </p>
                </div>
              )}
            </div>

           
          </div>
          {/* Column 3: Important Downloads */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="flex space-x-1 mr-3">
                  <div className="w-3 h-1 bg-blue-600 rounded"></div>
                </div>
                <h2 className="text-2xl font-normal text-gray-800">
                  Important Downloads
                </h2>
              </div>
              <p className="text-gray-600 text-sm">
                Download important documents
              </p>
            </div>

            {/* Downloads List */}
            <div className="space-y-4 mb-6">
              {downloads.length > 0 ? (
                downloads.map((download) => (
                  <div
                    key={download.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 hover:translate-x-1 rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      handleDownload(download.id, download.file_url)
                    }
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Download className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-normal text-gray-900 line-clamp-2">
                        {download.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Published {download.published}
                        {download.file_size && ` • ${download.file_size}`}
                        {download.download_count > 0 &&
                          ` • ${download.download_count} downloads`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Download className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No downloads available
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MuhimuSection;
