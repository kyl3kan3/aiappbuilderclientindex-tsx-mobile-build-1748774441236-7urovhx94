import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  id: string;
  name: string;
  isEssential?: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function FeatureCard({
  id,
  name,
  isEssential,
  checked,
  onCheckedChange
}: FeatureCardProps) {
  return (
    <div className="flex items-center">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id} className="ml-3 flex items-center cursor-pointer">
        <span className="text-gray-900">{name}</span>
        {isEssential && (
          <Badge variant="outline" className="ml-2 bg-accent-100 text-accent-700 border-accent-200">
            Essential
          </Badge>
        )}
      </Label>
    </div>
  );
}
