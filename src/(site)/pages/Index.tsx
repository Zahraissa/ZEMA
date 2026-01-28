import BlogSection from "@/components/Blog";
import BrandArea from "@/components/BrandSection";
import EgazHabariSection from "@/components/EgazHabariSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MuhimuSection from "@/components/MuhimuSection";
import NewsSection from "@/components/NewsSection";
import SectionGuide from "@/components/SectionGuide";
import ServiceSection from "@/components/ServiceSection";
import GoogleTranslate from "./GoogleTranslate";
import { LanguageProvider } from "@/components/LanguageContext";

const Index = () => {
  return (
    <div className="min-h-screen ">
      {/*<GoogleTranslate />*/}
      <Header />
      <HeroSection />
      <MuhimuSection />
      <ServiceSection />
      <SectionGuide />
      <BlogSection />
      <BrandArea />
      <Footer />
    </div>
  );
};

export default Index;
