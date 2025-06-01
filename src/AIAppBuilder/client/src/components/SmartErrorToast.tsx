import React from "react";
import { useEffect, useState } from 'react';
import { AlertTriangle, Brain, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface SmartErrorToastProps {
  error: Error;
  context?: string;
  onDismiss: () => void;
  show: boolean;
}

interface ErrorExplanation {
  summary: string;
  possibleCauses: string[];
  suggestedFixes: string[];
  preventionTips: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SmartErrorToast({ error, context, onDismiss, show }: SmartErrorToastProps) {
  const [explanation, setExplanation] = useState<ErrorExplanation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { explainError, isLoading } = useErrorHandler();

  useEffect(() => {
    if (show && error) {
      explainError(error.message, context).then(setExplanation);
    }
  }, [show, error, context, explainError]);

  if (!show) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-right-5 duration-300">
      <Card className={`border-l-4 ${explanation ? getSeverityColor(explanation.severity) : 'border-l-red-500'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-sm font-medium">Error Detected</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {explanation && (
            <Badge variant="outline" className="w-fit text-xs">
              {explanation.severity.toUpperCase()} SEVERITY
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is analyzing the error...</span>
            </div>
          ) : explanation ? (
            <div className="space-y-3">
              <CardDescription className="text-sm">
                {explanation.summary}
              </CardDescription>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-700 flex items-center">
                  <Brain className="h-3 w-3 mr-1" />
                  Quick Fixes
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  {explanation.suggestedFixes.slice(0, 2).map((fix, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-3 w-3 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full text-xs"
              >
                {showDetails ? 'Hide Details' : 'Show More Details'}
              </Button>

              {showDetails && (
                <div className="space-y-3 pt-2 border-t">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Possible Causes</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      {explanation.possibleCauses.map((cause, index) => (
                        <li key={index}>• {cause}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Prevention Tips</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      {explanation.preventionTips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <CardDescription className="text-sm">
              {error.message}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}