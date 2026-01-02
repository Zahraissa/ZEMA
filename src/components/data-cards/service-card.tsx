import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceType } from "@/interfaces/service-type";

interface ServiceCardProps {
    service: ServiceType
    onClick: () => void
  }

 export default function ServiceCard({ service, onClick }: ServiceCardProps) {

    const getCategoryColors = (category: string) => {
      switch(category) {
        case "Business":
          return { bg: "from-blue-50 to-blue-100", accent: "bg-blue-500", text: "text-blue-700", border: "border-blue-200" };
        case "Health":
          return { bg: "from-green-50 to-green-100", accent: "bg-green-500", text: "text-green-700", border: "border-green-200" };
        case "Identity":
          return { bg: "from-purple-50 to-purple-100", accent: "bg-purple-500", text: "text-purple-700", border: "border-purple-200" };
        case "Property":
          return { bg: "from-amber-50 to-amber-100", accent: "bg-amber-500", text: "text-amber-700", border: "border-amber-200" };
        case "Security":
          return { bg: "from-red-50 to-red-100", accent: "bg-red-500", text: "text-red-700", border: "border-red-200" };
        case "Social":
          return { bg: "from-teal-50 to-teal-100", accent: "bg-teal-500", text: "text-teal-700", border: "border-teal-200" };
        case "Education":
          return { bg: "from-indigo-50 to-indigo-100", accent: "bg-indigo-500", text: "text-indigo-700", border: "border-indigo-200" };
        case "Immigration":
          return { bg: "from-sky-50 to-sky-100", accent: "bg-sky-500", text: "text-sky-700", border: "border-sky-200" };
        case "Family":
          return { bg: "from-pink-50 to-pink-100", accent: "bg-pink-500", text: "text-pink-700", border: "border-pink-200" };
        default:
          return { bg: "from-slate-50 to-slate-100", accent: "bg-slate-500", text: "text-slate-700", border: "border-slate-200" };
      }
    };

    const colors = getCategoryColors(service.category!);

    return (
      <Card
        className={`group overflow-hidden transition-all duration-500 cursor-pointer relative hover:border-transparent shadow-xl border-none hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 dark:bg-neutral-800`}
        onClick={onClick}
      >
        {/* Gradient overlay that appears on hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${colors.bg} transition-opacity duration-500 pointer-events-none`}></div>

        {/* Accent line at top */}
        <div className={`h-1 w-0 group-hover:w-full ${colors.accent} transition-all duration-700 ease-out`}></div>

        <CardHeader className="p-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2.5 ${colors.accent} text-white transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {<service.icon className="h-5 w-5" />}
              </div>
              <CardTitle className={`text-2xl font-normal tracking-tight group-hover:${colors.text} transition-colors duration-300`}>
                {service.title}
              </CardTitle>
            </div>
            <Badge variant="outline" className={`${colors.border} group-hover:${colors.bg} transition-colors duration-300`}>
              {service.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 relative z-10">
          <CardDescription className="line-clamp-2 text-sm leading-relaxed group-hover:text-black/80 transition-colors duration-300">
            {service.description}
          </CardDescription>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-normal">
            <Clock className={`h-3.5 w-3.5 group-hover:${colors.text} transition-colors duration-300`} />
            <span className={`group-hover:${colors.text} transition-colors duration-300`}>
              {service.processingTime}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 group-hover:${colors.text} group-hover:bg-white/50 transition-all duration-300 relative overflow-hidden`}
          >
            <span className="relative z-10">View Details</span>
            <ArrowRight className="h-3.5 w-3.5 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1" />
            <span className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></span>
          </Button>
        </CardFooter>
      </Card>
    )
  }
