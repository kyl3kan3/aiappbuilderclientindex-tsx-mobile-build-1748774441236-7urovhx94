import React from "react";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
}

export const PhoneMockup: FC<PhoneMockupProps> = ({ children, className }) => {
  return (
    <div className={cn("mockup-phone w-64 h-[500px] bg-black rounded-[2rem] p-2 shadow-xl relative", className)}>
      <div className="mockup-status-bar h-6 absolute top-0 left-0 right-0 bg-black z-10 rounded-t-[2rem]"></div>
      <div className="h-full w-full bg-white overflow-hidden rounded-[1.7rem] relative">
        {children}
      </div>
    </div>
  );
};

interface AppHeaderProps {
  title: string;
  color?: string;
}

export const AppHeader: FC<AppHeaderProps> = ({ title, color = "bg-primary" }) => {
  return (
    <div className={`${color} text-white py-4 px-3 flex items-center justify-between`}>
      <h3 className="font-bold text-lg">{title}</h3>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </div>
  );
};

interface AppBottomNavProps {
  activeTab: string;
}

export const AppBottomNav: FC<AppBottomNavProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { id: 'workouts', label: 'Workouts', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
    { id: 'progress', label: 'Progress', icon: 'M18 20V10M12 20V4M6 20v-6' },
    { id: 'profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' }
  ];

  return (
    <div className="bg-white border-t border-gray-200 py-2 px-1 flex justify-between items-center">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d={tab.icon}></path>
          </svg>
          <span className="text-xs mt-0.5">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

interface UserProfileProps {
  initials: string;
  name: string;
  message: string;
}

export const UserProfile: FC<UserProfileProps> = ({ initials, name, message }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
        {initials}
      </div>
      <div className="ml-3">
        <div className="font-medium">Hello, {name}!</div>
        <div className="text-xs text-gray-500">{message}</div>
      </div>
    </div>
  );
};

interface ActivityChartProps {
  data: number[];
}

export const ActivityChart: FC<ActivityChartProps> = ({ data }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="bg-gray-50 rounded-xl p-3 mb-4">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Weekly Activity</h4>
      <div className="flex justify-between items-end h-20 mb-1">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div 
              className={`w-6 ${index < 5 ? 'bg-primary' : 'bg-primary-200'} rounded-sm`} 
              style={{ height: `${value}%` }}
            ></div>
            <span className={`text-xs text-gray-400 ${index === 6 ? 'font-medium' : ''}`}>{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneMockup;
