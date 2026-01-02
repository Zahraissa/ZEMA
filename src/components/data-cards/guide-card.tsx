import React from "react";
import { ArrowRight, Star, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface GuideCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "amber";
  onClick?: () => void;
  featured?: boolean;
  hasFile?: boolean;
}

const colorStyles = {
  blue: {
    gradient: "from-blue-50 to-blue-100",
    accent: "bg-blue-500",
    hover: "text-blue-700",
    button: "group-hover:text-blue-700",
  },
  green: {
    gradient: "from-green-50 to-green-100",
    accent: "bg-green-500",
    hover: "text-green-700",
    button: "group-hover:text-green-700",
  },
  purple: {
    gradient: "from-purple-50 to-purple-100",
    accent: "bg-purple-500",
    hover: "text-purple-700",
    button: "group-hover:text-purple-700",
  },
  amber: {
    gradient: "from-amber-50 to-amber-100",
    accent: "bg-amber-500",
    hover: "text-amber-700",
    button: "group-hover:text-amber-700",
  },
};

export function GuideCard({ title, description, icon, color, onClick, featured = false, hasFile = false }: GuideCardProps) {
  const styles = colorStyles[color];

  return (
    <Card
      className="group overflow-hidden transition-all duration-500 cursor-pointer relative border hover:border-transparent hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 border-none"
      onClick={onClick}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-normal flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        </div>
      )}

      {/* File indicator */}
      {hasFile && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-normal flex items-center gap-1">
            <Download className="h-3 w-3" />
            Download
          </div>
        </div>
      )}

      {/* Gradient overlay that appears on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${styles.gradient} transition-opacity duration-500 pointer-events-none`}></div>

      {/* Accent line at top */}
      <div className={`h-1 w-0 group-hover:w-full ${styles.accent} transition-all duration-700 ease-out`}></div>

      <CardHeader className="p-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2.5 ${styles.accent} text-white transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            {icon}
          </div>
          <CardTitle className={`text-xl font-normal tracking-tight group-hover:${styles.hover} transition-colors duration-300`}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 relative z-10">
        <CardDescription className="text-base leading-relaxed group-hover:text-black/80 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex justify-end relative z-10">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 ${styles.button} group-hover:bg-white/50 transition-all duration-300 relative overflow-hidden`}
        >
          <span className="relative z-10">
            {hasFile ? "Download" : "Read Guide"}
          </span>
          {hasFile ? (
            <Download className="h-4 w-4 relative z-10 transform transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <ArrowRight className="h-4 w-4 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1" />
          )}
          <span className={`absolute inset-0 ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></span>
        </Button>
      </CardFooter>
    </Card>
  );
}
