import React from "react";
import { Badge } from "@/components/ui/badge";

interface TechStackCategory {
  title: string;
  technologies: {
    name: string;
    color: string;
  }[];
}

interface TechStackDisplayProps {
  categories: TechStackCategory[];
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  indigo: "bg-indigo-100 text-indigo-800",
};

export default function TechStackDisplay({ categories }: TechStackDisplayProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.title}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{category.title}</h3>
          <div className="flex flex-wrap gap-2">
            {category.technologies.map((tech) => (
              <Badge
                key={tech.name}
                variant="outline"
                className={`${colorMap[tech.color]} border-transparent`}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm">
          <div className="text-green-600 mr-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <span className="text-gray-600">These technologies will be used to generate your app</span>
        </div>
      </div>
    </div>
  );
}
