import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AppTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function AppTypeCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick
}: AppTypeCardProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl bg-white/70 backdrop-blur p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 flex flex-col items-center cursor-pointer",
        isSelected 
          ? "border-primary/50 bg-primary/10" 
          : "hover:border-primary/30"
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          isSelected
            ? "bg-primary-100 text-primary"
            : "bg-gray-100 text-gray-500"
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 text-center mt-1">{description}</p>
    </div>
  );
}
