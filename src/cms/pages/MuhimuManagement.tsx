import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Play, Download, Settings } from "lucide-react";
import AnnouncementManagement from "./muhimu/AnnouncementManagement";
import VideoManagement from "./muhimu/VideoManagement";
import DownloadManagement from "./muhimu/DownloadManagement";

const MuhimuManagement = () => {
  const [activeTab, setActiveTab] = useState("announcements");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-normal text-gray-900 mb-2">Muhimu Section Management</h1>
        <p className="text-gray-600">
          Manage important announcements, videos, and downloads for the Muhimu section
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Downloads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Important Announcements
              </CardTitle>
              <CardDescription>
                Manage announcements that appear in the Muhimu section. These are displayed in the first column.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Event Videos
              </CardTitle>
              <CardDescription>
                Manage YouTube videos for the Muhimu section. One video can be set as the main featured video.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Important Downloads
              </CardTitle>
              <CardDescription>
                Manage downloadable files for the Muhimu section. Track download counts and file information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DownloadManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-normal text-blue-900 mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Section Information
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• <strong>Announcements:</strong> Displayed in the first column with document icons</p>
          <p>• <strong>Videos:</strong> YouTube videos with one main featured video and smaller thumbnails</p>
          <p>• <strong>Downloads:</strong> Files with download tracking and file size information</p>
          <p>• <strong>Ordering:</strong> Use drag and drop to reorder items within each section</p>
          <p>• <strong>Status:</strong> Toggle active/inactive to control visibility on the frontend</p>
        </div>
      </div>
    </div>
  );
};

export default MuhimuManagement;
