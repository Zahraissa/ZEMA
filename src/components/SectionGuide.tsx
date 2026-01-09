import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Building, FileText, HelpCircle, Info, Link, Download, Eye, Star } from "lucide-react";
import { GuideCard } from "@/components/data-cards/guide-card";
import { useState, useEffect } from "react";
import { publicAPI, Guide } from "../services/api";
// import Link from "next/link";

// export default function GuidesSection() {
//   const [guides, setGuides] = useState<Guide[]>([]);
//   const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGuides = async () => {
//       try {
//         setLoading(true);
//         console.log('Fetching guides...');
        
//         const [guidesResponse, featuredResponse, categoriesResponse] = await Promise.all([
//           publicAPI.getActiveGuides(),
//           publicAPI.getFeaturedGuides(),
//           publicAPI.getGuideCategories()
//         ]);

//         console.log('Guides response:', guidesResponse);
//         console.log('Featured response:', featuredResponse);
//         console.log('Categories response:', categoriesResponse);

//         if (guidesResponse.success) {
//           setGuides(guidesResponse.data);
//         } else {
//           console.error('Guides API error:', guidesResponse.message);
//         }
//         if (featuredResponse.success) {
//           setFeaturedGuides(featuredResponse.data);
//         } else {
//           console.error('Featured guides API error:', featuredResponse.message);
//         }
//         if (categoriesResponse.success) {
//           setCategories(categoriesResponse.data);
//         } else {
//           console.error('Categories API error:', categoriesResponse.message);
//         }
//       } catch (error) {
//         console.error('Error fetching guides:', error);
//         console.error('Error details:', {
//           message: error.message,
//           stack: error.stack,
//           name: error.name
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGuides();
//   }, []);

//   const handleDownload = async (guideId: number, fileName: string) => {
//     try {
//       const blob = await publicAPI.downloadGuide(guideId);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error('Error downloading guide:', error);
//     }
//   };

//   const getCategoryIcon = (category: string) => {
//     switch (category.toLowerCase()) {
//       case 'document requirements':
//         return <FileText className="h-4 w-4" />;
//       case 'application process':
//         return <HelpCircle className="h-4 w-4" />;
//       case 'service fees':
//         return <Info className="h-4 w-4" />;
//       case 'service locations':
//         return <Building className="h-4 w-4" />;
//       default:
//         return <FileText className="h-4 w-4" />;
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     switch (category.toLowerCase()) {
//       case 'document requirements':
//         return 'blue';
//       case 'application process':
//         return 'green';
//       case 'service fees':
//         return 'blue';
//       case 'service locations':
//         return 'green';
//       default:
//         return 'green';
//     }
//   };

//   // Get guides by category for the grid
//   const getGuidesByCategory = (category: string) => {
//     return guides.filter(guide => guide.category === category).slice(0, 1);
//   };

//   const mainCategories = [
//     "Document Requirements",
//     "Application Process", 
//     "Service Fees",
//     "Service Locations"
//   ];

//   return (
//     <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 from-white to-slate-50/50 dark:bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-800">
//       <div className="container mx-auto px-4 px-4">
//           <h5 className="text-2xl font-normal tracking-tighter p-5 sm:text-4xl">
//               DIRECTOR MESSAGE
//           </h5>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {loading ? (
//             // Loading skeleton
//             Array.from({ length: 4 }).map((_, index) => (
//               <div key={index} className="animate-pulse">
//                 <div className="h-32 bg-red-300 rounded-lg"></div>
//               </div>
//             ))
//           ) : (
//             mainCategories.map((category) => {
//               const categoryGuides = getGuidesByCategory(category);
//               const guide = categoryGuides[0];

//               return (
//                   <>
//                   <div className="bg-white rounded-lg shadow-lg p-6">
//                     <GuideCard
//                       key={category}
//                       title={guide ? guide.title : category}
//                       description={guide ? guide.description : `Learn about ${category.toLowerCase()}`}
//                       icon={getCategoryIcon(category)}
//                       color={getCategoryColor(category)}
//                       onClick={guide ? () => handleDownload(guide.id, guide.file_name || 'guide') : undefined}
//                       featured={guide?.featured}
//                       hasFile={!!guide?.file_name}
//                     />
//                   </div>
//                 </>
//               );
//             })
//           )}

//         </div>
//       </div>
//     </section>
//   );
// }
export default function DirectorMessage() {
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">

        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* Maelezo */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2 text-gray-900 dark:text-white">
             <center>DIRECTOR MESSAGE</center> 
            </h2>

            <p className="italic text-black-600 dark:text-gray-300 mb-4">
              Dear Visitors,
            </p>

            <p className="text-black-600 dark:text-gray-300 mb-4 leading-relaxed">
              On behalf of the Zanzibar Environmental Management Authority (ZEMA), I am very much delighted to have this opportunity to welcome you to our official website.<br/>
              Through this website you will find useful information regarding environment issues in Zanzibar such as Environment Policy of 2013, Environmental Management Act, 2015, Regulations and other environmental procedures.<br/>
              We do hope on this website, you will find all the undertakings of ZEMA as a regulatory body of our environment as well as the service we provide to realize the harmony of our environment and its sustainable development.<br/>
              We advance our sincere thanks for your visit and don’t hesitate to contact us for any extra information regarding environmental management in Zanzibar.
            </p>

            <p className="text-black-600 dark:text-black-300 mb-4 leading-relaxed">
              I thank you,<br/>
              <b>Sheha M Juma<br/>Director General - ZEMA</b>
            </p>
          </div>

          {/* Picha */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="w-full max-w-sm h-[420px] bg-gray-200 dark:bg-neutral-800 overflow-hidden shadow-[0_0_2px_2px_blue,0_0_10px_10px_#ffd700]">
              <img
                src="img/DG.png"
                alt="Director"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

