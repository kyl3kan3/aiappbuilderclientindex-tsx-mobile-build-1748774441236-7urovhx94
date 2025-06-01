import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StepIndicator from "@/components/StepIndicator";
import AppTypeCard from "@/components/AppTypeCard";
import FeatureCard from "@/components/FeatureCard";
import { useAppState } from "@/hooks/useAppState";
import { appTypes } from "@/data/appTypes";
import { features } from "@/data/features";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  appName: z.string().min(2, {
    message: "App name must be at least 2 characters.",
  }),
  appDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  platforms: z.array(z.string()).min(1, {
    message: "Please select at least one platform.",
  }),
  appType: z.string().min(1, {
    message: "Please select an app type.",
  }),
  features: z.array(z.string()).min(1, {
    message: "Please select at least one feature.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Requirements() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appState, updateAppState } = useAppState();
  
  // Initialize form with values from app state if available
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: appState.appName || "FitTrack Pro",
      appDescription: appState.appDescription || "A fitness tracking app that helps users track workouts, set goals, and monitor their progress",
      platforms: appState.platforms || ["ios", "android"],
      appType: appState.appType || "fitness",
      features: appState.features || ["authentication", "workout_tracking", "progress_analytics", "goal_setting", "push_notifications"],
    },
  });

  const steps = [
    { id: 1, name: "Requirements", status: "current" as const },
    { id: 2, name: "App Design", status: "upcoming" as const },
    { id: 3, name: "Code Generation", status: "upcoming" as const },
    { id: 4, name: "Finalize", status: "upcoming" as const },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      // Update app state
      updateAppState(data);
      
      // Save to backend (optional for this demo)
      /*
      await apiRequest("POST", "/api/projects", {
        name: data.appName,
        description: data.appDescription,
        appType: data.appType,
        platforms: data.platforms,
        features: data.features,
        status: "requirements"
      });
      */
      
      // Show success message
      toast({
        title: "Requirements saved!",
        description: "Moving to app design step.",
      });
      
      // Navigate to the next step
      navigate("/design");
    } catch (error) {
      toast({
        title: "Failed to save requirements",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Workflow Progress */}
      <StepIndicator steps={steps} currentStep={1} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Column - App Configuration */}
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">App Requirements</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="appName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="platforms"
                      render={() => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <div className="flex space-x-4">
                            <FormField
                              control={form.control}
                              name="platforms"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("ios")}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, "ios"]);
                                        } else {
                                          field.onChange(currentValue.filter(val => val !== "ios"));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm cursor-pointer">iOS</FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="platforms"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("android")}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, "android"]);
                                        } else {
                                          field.onChange(currentValue.filter(val => val !== "android"));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm cursor-pointer">Android</FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">App Type</h2>
                  <FormField
                    control={form.control}
                    name="appType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {appTypes.map((type) => (
                            <AppTypeCard
                              key={type.id}
                              icon={type.icon}
                              title={type.title}
                              description={type.description}
                              isSelected={field.value === type.id}
                              onClick={() => field.onChange(type.id)}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Features</h2>
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          {features.map((feature) => (
                            <FeatureCard
                              key={feature.id}
                              id={feature.id}
                              name={feature.name}
                              isEssential={feature.isEssential}
                              checked={field.value?.includes(feature.id) || false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, feature.id]);
                                } else {
                                  field.onChange(currentValue.filter(val => val !== feature.id));
                                }
                              }}
                            />
                          ))}
                          
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <Button variant="ghost" type="button" className="text-primary text-sm font-medium">
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
                                className="mr-1"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              Add Custom Feature
                            </Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
                <Button type="submit">
                  Continue to Design <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                <div className="text-sm text-gray-500">Coming in Step 2</div>
              </div>
              
              <div className="app-preview rounded-lg bg-gray-50 p-8 flex justify-center items-center h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center text-primary mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900">App Preview</h3>
                  <p className="text-gray-500 mt-2 max-w-md">
                    Complete this step to move to the app design phase where you'll see a preview of your application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Complete Requirements</h3>
                    <p className="text-sm text-gray-500">Define your app type, core features, and platforms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">2</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Design Preview</h3>
                    <p className="text-sm text-gray-500">View AI-generated app layout and customize design</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">3</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Code Generation</h3>
                    <p className="text-sm text-gray-500">AI creates native code for your application</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">4</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Export & Build</h3>
                    <p className="text-sm text-gray-500">Download source code and build instructions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
