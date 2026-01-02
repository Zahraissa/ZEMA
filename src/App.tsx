// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
import React from "react";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";
import Index from "./(site)/pages/Index";
import About from "./(site)/pages/About";
import WhatWeDo from "./(site)/pages/What-we-do";
import Services from "./(site)/pages/Services";
import Contact from "./(site)/pages/Contact";
import News from "./(site)/pages/News";
import Gallery from "./(site)/pages/Gallery";
import NotFound from "./(site)/pages/NotFound";
import AboutManagement from "./cms/pages/AboutManagement";
import AddContent from "./cms/pages/AddContent";
import AddMember from "./cms/pages/AddMember";
import AddService from "./cms/pages/AddService";
import AddSlider from "./cms/pages/AddSlider";
import BandManagement from "./cms/pages/BandManagement";
import CreateArticle from "./cms/pages/CreateArticle";
import Dashboard from "./cms/pages/Dashboard";
import Login from "./cms/pages/Login";
import NewsManagement from "./cms/pages/NewsManagement";
import ServicesManagement from "./cms/pages/ServicesManagement";
import SliderManagement from "./cms/pages/SliderManagement";
import { CMSLayout } from "./components/CMSLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import MenuType from "./cms/pages/MenuType";
import MenuGroup from "./cms/pages/menuGroup";
import MenuItems from "./cms/pages/menuItems";
import { LanguageProvider } from "./components/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
