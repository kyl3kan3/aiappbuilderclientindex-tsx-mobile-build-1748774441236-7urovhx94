import React from "react";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Server, Monitor, Zap, CheckCircle } from 'lucide-react';

interface ErrorLog {
  timestamp: string;
  type: 'SERVER_ERROR' | 'CLIENT_ERROR' | 'API_ERROR' | 'VALIDATION_ERROR';
  source: string;
  message: string;
  stack?: string;
  requestInfo?: any;
}

interface ErrorSummary {
  total: number;
  server_errors: number;
  client_errors: number;
  api_errors: number;
  validation_errors: number;
}

export function ErrorMonitor() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [summary, setSummary] = useState<ErrorSummary>({
    total: 0,
    server_errors: 0,
    client_errors: 0,
    api_errors: 0,
    validation_errors: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchErrorLogs = async (type?: string) => {
    setLoading(true);
    try {
      const url = type ? `/api/errors?type=${type}` : '/api/errors';
      const response = await fetch(url);
      const data = await response.json();
      setLogs(data.logs || []);
      setSummary(data.summary || summary);
    } catch (error) {
      console.error('Failed to fetch error logs:', error);
      // Report this client error to the server
      reportClientError(error, 'ErrorMonitor.fetchErrorLogs');
    }
    setLoading(false);
  };

  const reportClientError = async (error: any, source: string) => {
    try {
      await fetch('/api/errors/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message || 'Unknown error',
            stack: error.stack,
          },
          source,
          additional: { url: window.location.href }
        }),
      });
    } catch (reportError) {
      console.error('Failed to report client error:', reportError);
    }
  };

  const clearLogs = async () => {
    try {
      await fetch('/api/errors', { method: 'DELETE' });
      await fetchErrorLogs();
    } catch (error) {
      reportClientError(error, 'ErrorMonitor.clearLogs');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchErrorLogs();
    }
  }, [isOpen]);

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'SERVER_ERROR': return <Server className="w-4 h-4 text-red-500" />;
      case 'CLIENT_ERROR': return <Monitor className="w-4 h-4 text-yellow-500" />;
      case 'API_ERROR': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'VALIDATION_ERROR': return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case 'SERVER_ERROR': return 'bg-red-100 text-red-800 border-red-200';
      case 'CLIENT_ERROR': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'API_ERROR': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'VALIDATION_ERROR': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white shadow-lg"
        >
          {summary.total > 0 ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {summary.total > 0 ? `${summary.total} Errors` : 'No Errors'}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 z-50">
      <Card className="h-full shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Monitor
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              ×
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              Total: {summary.total}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Server: {summary.server_errors}
            </Badge>
            <Badge variant="outline" className="text-xs text-yellow-600">
              Client: {summary.client_errors}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <Tabs defaultValue="all" className="h-full">
            <TabsList className="grid w-full grid-cols-3 mx-4">
              <TabsTrigger value="all" onClick={() => fetchErrorLogs()}>
                All
              </TabsTrigger>
              <TabsTrigger value="server" onClick={() => fetchErrorLogs('SERVER_ERROR')}>
                Server
              </TabsTrigger>
              <TabsTrigger value="client" onClick={() => fetchErrorLogs('CLIENT_ERROR')}>
                Client
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="h-full">
              <ScrollArea className="h-64 px-4">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading...</div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No errors found</div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getErrorColor(log.type)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getErrorIcon(log.type)}
                          <span className="text-xs font-medium">
                            {log.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium mb-1">{log.source}</div>
                        <div className="text-xs text-gray-600">{log.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="server" className="h-full">
              <ScrollArea className="h-64 px-4">
                {logs.filter(log => log.type === 'SERVER_ERROR').map((log, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-red-50 border-red-200 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Server className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-medium text-red-700">SERVER ERROR</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-1 text-red-800">{log.source}</div>
                    <div className="text-xs text-red-600">{log.message}</div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="client" className="h-full">
              <ScrollArea className="h-64 px-4">
                {logs.filter(log => log.type === 'CLIENT_ERROR').map((log, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-yellow-50 border-yellow-200 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-700">CLIENT ERROR</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-1 text-yellow-800">{log.source}</div>
                    <div className="text-xs text-yellow-600">{log.message}</div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="p-4 border-t">
            <Button onClick={clearLogs} variant="outline" size="sm" className="w-full">
              Clear All Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}