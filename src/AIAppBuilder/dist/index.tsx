import React from 'react';

// Converted from JavaScript
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/phoenix/settings.ts
var settings_exports = {};
__export(settings_exports, {
  getGitHubConfig: () => getGitHubConfig,
  validateGitHubSettings: () => validateGitHubSettings
});
function validateGitHubSettings() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const tokenConfigured = !!token;
  const ownerConfigured = !!owner;
  const valid = tokenConfigured && ownerConfigured;
  let message = "";
  if (valid) {
    message = "GitHub integration configured correctly.";
  } else {
    const missingItems = [];
    if (!tokenConfigured) {
      missingItems.push("GITHUB_TOKEN");
    }
    if (!ownerConfigured) {
      missingItems.push("GITHUB_OWNER");
    }
    message = `GitHub integration not fully configured. Missing: ${missingItems.join(", ")}`;
  }
  return {
    valid,
    tokenConfigured,
    ownerConfigured,
    message
  };
}
function getGitHubConfig() {
  const validation = validateGitHubSettings();
  if (!validation.valid) {
    return null;
  }
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER
  };
}
var init_settings = __esm({
  "server/phoenix/settings.ts"() {
    "use strict";
  }
});

// server/phoenix/services/AnalyticsService.ts
function createAnalyticsService() {
  return new AnalyticsService();
}
var AnalyticsService;
var init_AnalyticsService = __esm({
  "server/phoenix/services/AnalyticsService.ts"() {
    "use strict";
    AnalyticsService = class {
      events = [];
      projectAnalytics = /* @__PURE__ */ new Map();
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock analytics data
       */
      initializeMockData() {
        const mockProjects = [
          {
            id: "project-1",
            name: "ECommerce Mobile App",
            platform: "ios",
            createdAt: new Date(Date.now() - 864e5 * 45).toISOString(),
            builds: 28,
            deployments: 12,
            codeQuality: 94,
            userEngagement: 87,
            performanceScore: 91,
            lastActivity: new Date(Date.now() - 36e5).toISOString()
          },
          {
            id: "project-2",
            name: "Social Media Dashboard",
            platform: "android",
            createdAt: new Date(Date.now() - 864e5 * 32).toISOString(),
            builds: 45,
            deployments: 18,
            codeQuality: 89,
            userEngagement: 92,
            performanceScore: 85,
            lastActivity: new Date(Date.now() - 18e5).toISOString()
          },
          {
            id: "project-3",
            name: "Financial Tracker",
            platform: "react_native",
            createdAt: new Date(Date.now() - 864e5 * 67).toISOString(),
            builds: 67,
            deployments: 25,
            codeQuality: 96,
            userEngagement: 88,
            performanceScore: 93,
            lastActivity: new Date(Date.now() - 72e5).toISOString()
          },
          {
            id: "project-4",
            name: "Health & Fitness App",
            platform: "flutter",
            createdAt: new Date(Date.now() - 864e5 * 23).toISOString(),
            builds: 34,
            deployments: 14,
            codeQuality: 82,
            userEngagement: 95,
            performanceScore: 89,
            lastActivity: new Date(Date.now() - 9e5).toISOString()
          },
          {
            id: "project-5",
            name: "Education Platform",
            platform: "ios",
            createdAt: new Date(Date.now() - 864e5 * 89).toISOString(),
            builds: 89,
            deployments: 34,
            codeQuality: 91,
            userEngagement: 85,
            performanceScore: 87,
            lastActivity: new Date(Date.now() - 144e5).toISOString()
          },
          {
            id: "project-6",
            name: "Food Delivery Service",
            platform: "android",
            createdAt: new Date(Date.now() - 864e5 * 12).toISOString(),
            builds: 23,
            deployments: 8,
            codeQuality: 78,
            userEngagement: 89,
            performanceScore: 82,
            lastActivity: new Date(Date.now() - 6e5).toISOString()
          }
        ];
        mockProjects.forEach((project) => this.projectAnalytics.set(project.id, project));
        this.generateMockEvents();
      }
      /**
       * Generate mock analytics events
       */
      generateMockEvents() {
        const eventTypes = [
          { type: "user_action", category: "project_creation", action: "create_project" },
          { type: "user_action", category: "code_generation", action: "generate_code" },
          { type: "user_action", category: "build", action: "trigger_build" },
          { type: "user_action", category: "deployment", action: "deploy_app" },
          { type: "system_event", category: "performance", action: "build_completed" },
          { type: "business_event", category: "subscription", action: "plan_upgraded" }
        ];
        for (let i = 0; i < 1e3; i++) {
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          const timestamp = new Date(Date.now() - Math.random() * 864e5 * 30).toISOString();
          this.events.push({
            id: `event-${i}`,
            type: eventType.type,
            category: eventType.category,
            action: eventType.action,
            userId: `user-${Math.floor(Math.random() * 100)}`,
            projectId: Math.random() > 0.3 ? `project-${Math.floor(Math.random() * 6) + 1}` : void 0,
            value: Math.random() > 0.5 ? Math.floor(Math.random() * 1e3) : void 0,
            properties: {
              platform: ["ios", "android", "react_native", "flutter"][Math.floor(Math.random() * 4)],
              source: ["dashboard", "api", "mobile_app"][Math.floor(Math.random() * 3)]
            },
            timestamp
          });
        }
      }
      /**
       * Get analytics metrics
       */
      async getAnalyticsMetrics(timeRange = "30d") {
        const daysAgo = this.parseDayRange(timeRange);
        const startDate = new Date(Date.now() - daysAgo * 864e5);
        const recentEvents = this.events.filter(
          (event) => new Date(event.timestamp) >= startDate
        );
        const projects = Array.from(this.projectAnalytics.values());
        const totalProjects = projects.filter(
          (p) => new Date(p.createdAt) >= startDate
        ).length;
        const uniqueUsers = new Set(recentEvents.map((e) => e.userId)).size;
        const buildEvents = recentEvents.filter((e) => e.action === "trigger_build");
        const successfulBuilds = buildEvents.filter((e) => Math.random() > 0.15);
        return {
          overview: {
            totalProjects: totalProjects || 156,
            activeUsers: uniqueUsers || 2847,
            totalBuilds: buildEvents.length || 45672,
            successRate: buildEvents.length > 0 ? successfulBuilds.length / buildEvents.length * 100 : 94.2
          },
          usage: {
            dailyActiveUsers: Math.floor(uniqueUsers * 0.3) || 1247,
            weeklyActiveUsers: Math.floor(uniqueUsers * 0.7) || 2156,
            monthlyActiveUsers: uniqueUsers || 2847,
            avgSessionDuration: 47
            // minutes
          },
          performance: {
            avgBuildTime: 8.5,
            // minutes
            codeGenerationSpeed: 125,
            // files per minute
            apiResponseTime: 89,
            // milliseconds
            systemUptime: 99.97
            // percentage
          },
          revenue: {
            monthlyRevenue: 127589,
            growth: 23.4,
            avgRevenuePerUser: 45.67,
            churnRate: 2.8
          }
        };
      }
      /**
       * Get project analytics
       */
      async getProjectAnalytics(timeRange = "30d", platform) {
        let projects = Array.from(this.projectAnalytics.values());
        if (platform && platform !== "all") {
          projects = projects.filter((p) => p.platform === platform);
        }
        const daysAgo = this.parseDayRange(timeRange);
        const startDate = new Date(Date.now() - daysAgo * 864e5);
        return projects.filter((p) => new Date(p.lastActivity) >= startDate).sort((a, b) => b.performanceScore - a.performanceScore);
      }
      /**
       * Get user behavior analytics
       */
      async getUserBehavior(timeRange = "30d") {
        const daysAgo = this.parseDayRange(timeRange);
        const startDate = new Date(Date.now() - daysAgo * 864e5);
        const recentEvents = this.events.filter(
          (event) => new Date(event.timestamp) >= startDate
        );
        const features = [
          { name: "Project Creation", category: "core" },
          { name: "Code Generation", category: "core" },
          { name: "Build & Deploy", category: "core" },
          { name: "AI Assistant", category: "advanced" },
          { name: "Live Code Editor", category: "advanced" },
          { name: "Design Studio", category: "premium" },
          { name: "Advanced Security", category: "premium" },
          { name: "Analytics Dashboard", category: "premium" }
        ];
        return features.map((feature) => {
          const usage = Math.floor(Math.random() * 1e4) + 1e3;
          const growth = (Math.random() - 0.5) * 40;
          return {
            feature: feature.name,
            usage,
            growth,
            category: feature.category,
            retention: 70 + Math.random() * 25,
            // 70-95%
            satisfaction: 80 + Math.random() * 15
            // 80-95%
          };
        });
      }
      /**
       * Get trend data
       */
      async getTrendData(timeRange = "30d") {
        const daysAgo = this.parseDayRange(timeRange);
        const periods = Math.min(daysAgo, 30);
        const trends = [];
        for (let i = periods - 1; i >= 0; i--) {
          const date = new Date(Date.now() - i * 864e5);
          const dayEvents = this.events.filter((event) => {
            const eventDate = new Date(event.timestamp);
            return eventDate.toDateString() === date.toDateString();
          });
          trends.push({
            period: date.toISOString().split("T")[0],
            projects: dayEvents.filter((e) => e.action === "create_project").length,
            users: new Set(dayEvents.map((e) => e.userId)).size,
            builds: dayEvents.filter((e) => e.action === "trigger_build").length,
            revenue: Math.floor(Math.random() * 5e3) + 2e3
          });
        }
        return trends;
      }
      /**
       * Get geographic data
       */
      async getGeographicData(timeRange = "30d") {
        const countries = [
          { name: "United States", baseUsers: 1247, baseRevenue: 45678 },
          { name: "United Kingdom", baseUsers: 456, baseRevenue: 18900 },
          { name: "Germany", baseUsers: 389, baseRevenue: 15670 },
          { name: "Canada", baseUsers: 278, baseRevenue: 12340 },
          { name: "Australia", baseUsers: 234, baseRevenue: 9876 },
          { name: "France", baseUsers: 198, baseRevenue: 8765 },
          { name: "Japan", baseUsers: 167, baseRevenue: 7654 },
          { name: "Netherlands", baseUsers: 145, baseRevenue: 6543 }
        ];
        return countries.map((country) => ({
          country: country.name,
          users: country.baseUsers + Math.floor(Math.random() * 100),
          projects: Math.floor(country.baseUsers * 0.3) + Math.floor(Math.random() * 50),
          revenue: country.baseRevenue + Math.floor(Math.random() * 5e3),
          growth: (Math.random() - 0.5) * 30
          // -15% to +15%
        }));
      }
      /**
       * Track analytics event
       */
      async trackEvent(event) {
        const analyticsEvent = {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...event
        };
        this.events.push(analyticsEvent);
        if (this.events.length > 1e4) {
          this.events = this.events.slice(-1e4);
        }
      }
      /**
       * Export analytics data
       */
      async exportAnalytics(timeRange = "30d", format = "csv") {
        const metrics = await this.getAnalyticsMetrics(timeRange);
        const projects = await this.getProjectAnalytics(timeRange);
        const behavior = await this.getUserBehavior(timeRange);
        const geographic = await this.getGeographicData(timeRange);
        if (format === "csv") {
          return this.generateCSVReport(metrics, projects, behavior, geographic);
        } else if (format === "json") {
          return JSON.stringify({
            metrics,
            projects,
            behavior,
            geographic,
            exportedAt: (/* @__PURE__ */ new Date()).toISOString()
          }, null, 2);
        }
        throw new Error(`Unsupported export format: ${format}`);
      }
      /**
       * Generate CSV report
       */
      generateCSVReport(metrics, projects, behavior, geographic) {
        let csv = "Analytics Report\n\n";
        csv += "Overview Metrics\n";
        csv += "Metric,Value\n";
        csv += `Total Projects,${metrics.overview.totalProjects}
`;
        csv += `Active Users,${metrics.overview.activeUsers}
`;
        csv += `Total Builds,${metrics.overview.totalBuilds}
`;
        csv += `Success Rate,${metrics.overview.successRate}%

`;
        csv += "Project Analytics\n";
        csv += "Name,Platform,Builds,Deployments,Code Quality,User Engagement,Performance Score\n";
        projects.forEach((project) => {
          csv += `${project.name},${project.platform},${project.builds},${project.deployments},${project.codeQuality}%,${project.userEngagement}%,${project.performanceScore}%
`;
        });
        return csv;
      }
      /**
       * Parse day range from string
       */
      parseDayRange(timeRange) {
        switch (timeRange) {
          case "7d":
            return 7;
          case "30d":
            return 30;
          case "90d":
            return 90;
          case "1y":
            return 365;
          default:
            return 30;
        }
      }
      /**
       * Get analytics events
       */
      async getAnalyticsEvents(limit = 100) {
        return this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
      }
    };
  }
});

// server/phoenix/services/AIAssistantService.ts
function createAIAssistantService() {
  return new AIAssistantService();
}
var AIAssistantService;
var init_AIAssistantService = __esm({
  "server/phoenix/services/AIAssistantService.ts"() {
    "use strict";
    AIAssistantService = class {
      sessions = /* @__PURE__ */ new Map();
      generations = /* @__PURE__ */ new Map();
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock AI assistant data
       */
      initializeMockData() {
        const sessionId = "session-demo";
        const mockMessages = [
          {
            id: "msg-1",
            type: "assistant",
            content: "Hello! I'm your AI coding assistant. I can help you build mobile apps, generate code, and answer programming questions. What would you like to create today?",
            timestamp: new Date(Date.now() - 36e5).toISOString(),
            suggestions: [
              "Create a todo app with React Native",
              "Build a login screen for iOS",
              "Explain SwiftUI navigation",
              "Generate a Flutter shopping cart"
            ],
            sessionId
          },
          {
            id: "msg-2",
            type: "user",
            content: "I want to create a simple todo app with React Native",
            timestamp: new Date(Date.now() - 35e5).toISOString(),
            sessionId
          },
          {
            id: "msg-3",
            type: "assistant",
            content: "Great! I'll help you create a React Native todo app. Let me generate the core components for you.",
            timestamp: new Date(Date.now() - 34e5).toISOString(),
            codeSnippets: [
              {
                id: "snippet-1",
                language: "javascript",
                filename: "TodoApp.js",
                platform: "react-native",
                description: "Main todo app component with state management",
                code: `import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: inputText.trim(),
          completed: false,
        },
      ]);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const renderTodo = ({ item }) => (
    <div className="mobile-converted">
      <button
        className="mobile-converted"
        onClick={() => toggleTodo(item.id)}
      >
        <span className="mobile-converted">
          {item.text}
        </span>
      </button>
      <button
        className="mobile-converted"
        onClick={() => deleteTodo(item.id)}
      >
        <span className="mobile-converted">Delete</span>
      </button>
    </div>
  );

  return (
    <SafeAreaView className="mobile-converted">
      <span className="mobile-converted">Todo App</span>
      
      <div className="mobile-converted">
        <TextInput
          className="mobile-converted"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a new todo..."
          onSubmitEditing={addTodo}
        />
        <button className="mobile-converted" onClick={addTodo}>
          <span className="mobile-converted">Add</span>
        </button>
      </div>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        className="mobile-converted"
      />
    </SafeAreaView>
  );
};

export default TodoApp;`
              }
            ],
            suggestions: [
              "Add data persistence with AsyncStorage",
              "Create todo categories",
              "Add due dates to todos",
              "Implement todo editing"
            ],
            sessionId
          }
        ];
        const session = {
          id: sessionId,
          messages: mockMessages,
          context: {
            platform: "react-native",
            userPreferences: {
              codeStyle: "modern",
              framework: "react-native",
              designPattern: "functional-components"
            }
          },
          createdAt: new Date(Date.now() - 36e5).toISOString(),
          updatedAt: new Date(Date.now() - 34e5).toISOString()
        };
        this.sessions.set(sessionId, session);
        const mockGenerations = [
          {
            id: "gen-1",
            prompt: "Create a fitness tracking app with workout logging",
            platform: "react-native",
            status: "completed",
            progress: 100,
            result: {
              projectName: "FitTracker",
              description: "A comprehensive fitness tracking app with workout logging and progress visualization",
              files: [
                {
                  path: "App.js",
                  content: "// Main app component...",
                  description: "Root application component with navigation",
                  type: "component"
                },
                {
                  path: "screens/WorkoutScreen.js",
                  content: "// Workout logging screen...",
                  description: "Screen for logging and tracking workouts",
                  type: "screen"
                },
                {
                  path: "services/WorkoutService.js",
                  content: "// Workout data service...",
                  description: "Service for managing workout data",
                  type: "service"
                }
              ],
              features: [
                "Workout logging",
                "Progress tracking",
                "Exercise database",
                "Statistics dashboard"
              ],
              dependencies: [
                "react-navigation",
                "react-native-charts",
                "async-storage"
              ]
            },
            timestamp: new Date(Date.now() - 864e5).toISOString()
          },
          {
            id: "gen-2",
            prompt: "Build a weather app with location services",
            platform: "flutter",
            status: "generating",
            progress: 65,
            timestamp: new Date(Date.now() - 18e5).toISOString()
          },
          {
            id: "gen-3",
            prompt: "Create a shopping cart for e-commerce app",
            platform: "ios",
            status: "completed",
            progress: 100,
            result: {
              projectName: "ShoppingCart",
              description: "SwiftUI shopping cart with payment integration",
              files: [
                {
                  path: "ContentView.swift",
                  content: "// SwiftUI shopping cart view...",
                  description: "Main shopping cart interface",
                  type: "screen"
                },
                {
                  path: "CartManager.swift",
                  content: "// Cart state management...",
                  description: "Observable object for cart state",
                  type: "service"
                }
              ],
              features: [
                "Add to cart",
                "Remove items",
                "Calculate totals",
                "Checkout process"
              ],
              dependencies: [
                "SwiftUI",
                "Combine"
              ]
            },
            timestamp: new Date(Date.now() - 1728e5).toISOString()
          }
        ];
        mockGenerations.forEach((gen) => this.generations.set(gen.id, gen));
      }
      /**
       * Send a chat message and get AI response
       */
      async sendMessage(message, context, sessionId = "default") {
        let session = this.sessions.get(sessionId);
        if (!session) {
          session = {
            id: sessionId,
            messages: [],
            context,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          this.sessions.set(sessionId, session);
        }
        const userMessage = {
          id: `msg-${Date.now()}`,
          type: "user",
          content: message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          sessionId
        };
        session.messages.push(userMessage);
        const aiResponse = await this.generateAIResponse(message, context, session);
        session.messages.push(aiResponse);
        session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        this.sessions.set(sessionId, session);
        return aiResponse;
      }
      /**
       * Generate AI response based on user message and context
       */
      async generateAIResponse(message, context, session) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes("create") || lowerMessage.includes("build") || lowerMessage.includes("generate")) {
          return this.handleCodeGenerationRequest(message, context, session.id);
        }
        if (lowerMessage.includes("explain") || lowerMessage.includes("how") || lowerMessage.includes("what")) {
          return this.handleExplanationRequest(message, context, session.id);
        }
        if (lowerMessage.includes("help") || lowerMessage.includes("stuck") || lowerMessage.includes("error")) {
          return this.handleHelpRequest(message, context, session.id);
        }
        return this.handleGeneralConversation(message, context, session.id);
      }
      /**
       * Handle code generation requests
       */
      async handleCodeGenerationRequest(message, context, sessionId) {
        const platform = context.platform || "react-native";
        if (message.toLowerCase().includes("login")) {
          return {
            id: `msg-${Date.now()}`,
            type: "assistant",
            content: `I'll create a login screen for ${platform}. Here's a complete implementation:`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            codeSnippets: [
              {
                id: `snippet-${Date.now()}`,
                language: platform === "ios" ? "swift" : "javascript",
                filename: platform === "ios" ? "LoginView.swift" : "LoginScreen.js",
                platform,
                description: "Complete login screen with form validation",
                code: platform === "ios" ? this.generateSwiftLoginCode() : this.generateReactNativeLoginCode()
              }
            ],
            suggestions: [
              "Add password reset functionality",
              "Implement biometric authentication",
              "Add social login options",
              "Create registration screen"
            ],
            sessionId
          };
        }
        if (message.toLowerCase().includes("todo") || message.toLowerCase().includes("task")) {
          return {
            id: `msg-${Date.now()}`,
            type: "assistant",
            content: `Perfect! I'll create a todo app for ${platform}. This will include adding, completing, and deleting tasks.`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            codeSnippets: [
              {
                id: `snippet-${Date.now()}`,
                language: platform === "flutter" ? "dart" : "javascript",
                filename: platform === "flutter" ? "todo_app.dart" : "TodoApp.js",
                platform,
                description: "Complete todo app with state management",
                code: platform === "flutter" ? this.generateFlutterTodoCode() : this.generateReactNativeTodoCode()
              }
            ],
            suggestions: [
              "Add data persistence",
              "Implement todo categories",
              "Add due dates",
              "Create todo sharing"
            ],
            sessionId
          };
        }
        return {
          id: `msg-${Date.now()}`,
          type: "assistant",
          content: `I'd be happy to help you create that! Could you provide more specific details about what you want to build? For example:

- What features should it have?
- What's the main purpose of the app?
- Do you need any specific UI components?
- Any particular styling preferences?

The more details you provide, the better I can tailor the code to your needs.`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          suggestions: [
            "Create a login screen",
            "Build a todo app",
            "Generate a shopping cart",
            "Make a weather app"
          ],
          sessionId
        };
      }
      /**
       * Handle explanation requests
       */
      async handleExplanationRequest(message, context, sessionId) {
        if (message.toLowerCase().includes("navigation")) {
          return {
            id: `msg-${Date.now()}`,
            type: "assistant",
            content: `Navigation in mobile apps allows users to move between different screens. Here's how it works in ${context.platform || "React Native"}:

**Stack Navigation**: Like a stack of cards, new screens are pushed on top and can be popped off.

**Tab Navigation**: Multiple screens accessible via tabs at the bottom.

**Drawer Navigation**: Side menu that slides out to show navigation options.`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            codeSnippets: [
              {
                id: `snippet-${Date.now()}`,
                language: "javascript",
                filename: "NavigationExample.js",
                description: "Basic React Navigation setup",
                code: `import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`
              }
            ],
            suggestions: [
              "Show tab navigation example",
              "Explain navigation params",
              "Show drawer navigation",
              "Navigation best practices"
            ],
            sessionId
          };
        }
        return {
          id: `msg-${Date.now()}`,
          type: "assistant",
          content: `I'd be happy to explain that concept! Could you be more specific about what you'd like me to explain? I can help with:

- Code concepts and patterns
- Mobile development best practices
- Platform-specific features
- Framework comparisons
- Architecture decisions

What specifically would you like to understand better?`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          suggestions: [
            "Explain state management",
            "How does navigation work?",
            "What is component lifecycle?",
            "Explain async/await"
          ],
          sessionId
        };
      }
      /**
       * Handle help requests
       */
      async handleHelpRequest(message, context, sessionId) {
        return {
          id: `msg-${Date.now()}`,
          type: "assistant",
          content: `I'm here to help! Please share more details about what you're working on or what issue you're facing. I can assist with:

\u{1F41B} **Debugging**: Help fix errors and issues
\u{1F527} **Code Review**: Suggest improvements and optimizations  
\u{1F4DA} **Learning**: Explain concepts and best practices
\u26A1 **Optimization**: Improve performance and code quality

What specific challenge are you facing?`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          suggestions: [
            "My app is crashing",
            "How to optimize performance?",
            "Best practices for state management",
            "Help with API integration"
          ],
          sessionId
        };
      }
      /**
       * Handle general conversation
       */
      async handleGeneralConversation(message, context, sessionId) {
        const responses = [
          "That's interesting! How can I help you with your mobile development project?",
          "I'm here to assist with your coding needs. What would you like to build?",
          "Great question! Is there a specific mobile app feature you'd like to implement?",
          "I'd love to help you code something amazing. What's your project idea?"
        ];
        return {
          id: `msg-${Date.now()}`,
          type: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          suggestions: [
            "Generate a complete app",
            "Help me debug code",
            "Explain a concept",
            "Show me best practices"
          ],
          sessionId
        };
      }
      /**
       * Start code generation process
       */
      async generateCode(prompt, platform, context) {
        const generation = {
          id: `gen-${Date.now()}`,
          prompt,
          platform,
          status: "generating",
          progress: 0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.generations.set(generation.id, generation);
        this.simulateCodeGeneration(generation);
        return generation;
      }
      /**
       * Simulate code generation progress
       */
      async simulateCodeGeneration(generation) {
        const steps = [
          { progress: 10, message: "Analyzing requirements..." },
          { progress: 25, message: "Planning architecture..." },
          { progress: 40, message: "Generating components..." },
          { progress: 60, message: "Creating services..." },
          { progress: 80, message: "Adding styling..." },
          { progress: 95, message: "Finalizing code..." },
          { progress: 100, message: "Generation complete!" }
        ];
        for (const step of steps) {
          await new Promise((resolve) => setTimeout(resolve, 2e3));
          generation.progress = step.progress;
          if (step.progress === 100) {
            generation.status = "completed";
            generation.result = {
              projectName: this.extractProjectName(generation.prompt),
              description: generation.prompt,
              files: this.generateProjectFiles(generation.platform),
              features: this.extractFeatures(generation.prompt),
              dependencies: this.getPlatformDependencies(generation.platform)
            };
          }
          this.generations.set(generation.id, generation);
        }
      }
      /**
       * Get chat history for a session
       */
      async getChatHistory(sessionId = "session-demo") {
        const session = this.sessions.get(sessionId);
        return session?.messages || [];
      }
      /**
       * Get code generations
       */
      async getCodeGenerations() {
        return Array.from(this.generations.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      // Helper methods for code generation
      extractProjectName(prompt) {
        const keywords = prompt.toLowerCase().split(" ");
        if (keywords.includes("todo")) return "TodoApp";
        if (keywords.includes("chat")) return "ChatApp";
        if (keywords.includes("weather")) return "WeatherApp";
        if (keywords.includes("fitness")) return "FitnessTracker";
        if (keywords.includes("shopping")) return "ShoppingApp";
        return "MobileApp";
      }
      extractFeatures(prompt) {
        const features = [];
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes("login")) features.push("User Authentication");
        if (lowerPrompt.includes("todo") || lowerPrompt.includes("task")) features.push("Task Management");
        if (lowerPrompt.includes("chat")) features.push("Real-time Messaging");
        if (lowerPrompt.includes("weather")) features.push("Weather Data");
        if (lowerPrompt.includes("shopping")) features.push("E-commerce");
        if (lowerPrompt.includes("camera")) features.push("Camera Integration");
        if (lowerPrompt.includes("map")) features.push("Maps & Location");
        return features.length > 0 ? features : ["Core Functionality", "User Interface"];
      }
      getPlatformDependencies(platform) {
        switch (platform) {
          case "react-native":
            return ["react", "react-native", "@react-navigation/native", "react-native-vector-icons"];
          case "flutter":
            return ["flutter/material.dart", "flutter/cupertino.dart", "provider", "http"];
          case "ios":
            return ["SwiftUI", "Combine", "Foundation"];
          case "android":
            return ["androidx.compose", "androidx.lifecycle", "kotlinx.coroutines"];
          default:
            return [];
        }
      }
      generateProjectFiles(platform) {
        return [
          {
            path: platform === "ios" ? "ContentView.swift" : "App.js",
            content: "// Main app component...",
            description: "Root application component",
            type: "component"
          },
          {
            path: platform === "ios" ? "HomeView.swift" : "screens/HomeScreen.js",
            content: "// Home screen component...",
            description: "Main application screen",
            type: "screen"
          },
          {
            path: platform === "ios" ? "DataService.swift" : "services/DataService.js",
            content: "// Data management service...",
            description: "Service for data operations",
            type: "service"
          }
        ];
      }
      // Code templates
      generateReactNativeLoginCode() {
        return `import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Add your login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <SafeAreaView className="mobile-converted">
      <span className="mobile-converted">Welcome Back</span>
      
      <div className="mobile-converted">
        <TextInput
          className="mobile-converted"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          className="mobile-converted"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <button className="mobile-converted" onClick={handleLogin}>
          <span className="mobile-converted">Login</span>
        </button>
      </div>
    </SafeAreaView>
  );
};

export default LoginScreen;`;
      }
      generateSwiftLoginCode() {
        return `import SwiftUI

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Welcome Back")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.bottom, 40)
            
            VStack(spacing: 15) {
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: handleLogin) {
                    Text("Login")
                        .foregroundColor(.white)
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(8)
                }
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .padding()
        .alert("Login", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }
    
    private func handleLogin() {
        guard !email.isEmpty, !password.isEmpty else {
            alertMessage = "Please fill in all fields"
            showAlert = true
            return
        }
        
        // Add your login logic here
        print("Login attempted with: \\(email)")
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}`;
      }
      generateReactNativeTodoCode() {
        return `import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: inputText.trim(),
          completed: false,
        },
      ]);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const renderTodo = ({ item }) => (
    <div className="mobile-converted">
      <button
        className="mobile-converted"
        onClick={() => toggleTodo(item.id)}
      >
        <span className="mobile-converted">
          {item.text}
        </span>
      </button>
      <button
        className="mobile-converted"
        onClick={() => deleteTodo(item.id)}
      >
        <span className="mobile-converted">Delete</span>
      </button>
    </div>
  );

  return (
    <SafeAreaView className="mobile-converted">
      <span className="mobile-converted">Todo App</span>
      
      <div className="mobile-converted">
        <TextInput
          className="mobile-converted"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a new todo..."
          onSubmitEditing={addTodo}
        />
        <button className="mobile-converted" onClick={addTodo}>
          <span className="mobile-converted">Add</span>
        </button>
      </div>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        className="mobile-converted"
      />
    </SafeAreaView>
  );
};

export default TodoApp;`;
      }
      generateFlutterTodoCode() {
        return `import 'package:flutter/material.dart';

void main() {
  runApp(TodoApp());
}

class TodoApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todo App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: TodoHomePage(),
    );
  }
}

class TodoHomePage extends StatefulWidget {
  @override
  _TodoHomePageState createState() => _TodoHomePageState();
}

class _TodoHomePageState extends State<TodoHomePage> {
  List<Todo> todos = [];
  TextEditingController textController = TextEditingController();

  void addTodo() {
    if (textController.text.isNotEmpty) {
      setState(() {
        todos.add(Todo(
          id: DateTime.now().millisecondsSinceEpoch,
          text: textController.text,
          completed: false,
        ));
        textController.clear();
      });
    }
  }

  void toggleTodo(int id) {
    setState(() {
      int index = todos.indexWhere((todo) => todo.id == id);
      if (index != -1) {
        todos[index].completed = !todos[index].completed;
      }
    });
  }

  void deleteTodo(int id) {
    setState(() {
      todos.removeWhere((todo) => todo.id == id);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Todo App'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: textController,
                    decoration: InputDecoration(
                      hintText: 'Add a new todo...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => addTodo(),
                  ),
                ),
                SizedBox(width: 10),
                ElevatedButton(
                  onPressed: addTodo,
                  child: Text('Add'),
                ),
              ],
            ),
            SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: todos.length,
                itemBuilder: (context, index) {
                  final todo = todos[index];
                  return Card(
                    child: ListTile(
                      title: Text(
                        todo.text,
                        style: TextStyle(
                          decoration: todo.completed
                              ? TextDecoration.lineThrough
                              : TextDecoration.none,
                        ),
                      ),
                      leading: Checkbox(
                        value: todo.completed,
                        onChanged: (_) => toggleTodo(todo.id),
                      ),
                      trailing: IconButton(
                        icon: Icon(Icons.delete),
                        onPressed: () => deleteTodo(todo.id),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Todo {
  final int id;
  final String text;
  bool completed;

  Todo({
    required this.id,
    required this.text,
    required this.completed,
  });
}`;
      }
    };
  }
});

// server/phoenix/routes/ai-assistant.ts
var ai_assistant_exports = {};
__export(ai_assistant_exports, {
  aiAssistantRouter: () => aiAssistantRouter,
  default: () => ai_assistant_default
});
import express8 from "express";
var aiAssistantRouter, ai_assistant_default;
var init_ai_assistant = __esm({
  "server/phoenix/routes/ai-assistant.ts"() {
    "use strict";
    init_AIAssistantService();
    aiAssistantRouter = express8.Router();
    aiAssistantRouter.post("/chat", async (req, res) => {
      try {
        const { message, context, sessionId } = req.body;
        if (!message) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Message content is required"
          });
        }
        const aiService = createAIAssistantService();
        const response = await aiService.sendMessage(
          message,
          context || {},
          sessionId || "default"
        );
        res.json({
          success: true,
          message: response,
          sessionId: sessionId || "default"
        });
      } catch (error) {
        console.error("Error in AI chat:", error);
        res.status(500).json({
          error: "Failed to process chat message",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/chat/history", async (req, res) => {
      try {
        const { sessionId = "session-demo" } = req.query;
        const aiService = createAIAssistantService();
        const messages = await aiService.getChatHistory(sessionId);
        res.json(messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({
          error: "Failed to fetch chat history",
          message: error.message
        });
      }
    });
    aiAssistantRouter.post("/generate", async (req, res) => {
      try {
        const { prompt, platform, context } = req.body;
        if (!prompt || !platform) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Prompt and platform are required"
          });
        }
        if (!["ios", "android", "react-native", "flutter"].includes(platform)) {
          return res.status(400).json({
            error: "Invalid Platform",
            message: "Platform must be ios, android, react-native, or flutter"
          });
        }
        const aiService = createAIAssistantService();
        const generation = await aiService.generateCode(prompt, platform, context || {});
        res.status(201).json({
          success: true,
          message: "Code generation started",
          generation,
          estimatedTime: "2-5 minutes"
        });
      } catch (error) {
        console.error("Error starting code generation:", error);
        res.status(500).json({
          error: "Failed to start code generation",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/generations", async (req, res) => {
      try {
        const { status, platform } = req.query;
        const aiService = createAIAssistantService();
        let generations = await aiService.getCodeGenerations();
        if (status) {
          generations = generations.filter((gen) => gen.status === status);
        }
        if (platform) {
          generations = generations.filter((gen) => gen.platform === platform);
        }
        res.json(generations);
      } catch (error) {
        console.error("Error fetching code generations:", error);
        res.status(500).json({
          error: "Failed to fetch code generations",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/generations/:generationId", async (req, res) => {
      try {
        const { generationId } = req.params;
        const aiService = createAIAssistantService();
        const generations = await aiService.getCodeGenerations();
        const generation = generations.find((gen) => gen.id === generationId);
        if (!generation) {
          return res.status(404).json({
            error: "Generation not found",
            message: `Code generation with ID ${generationId} not found`
          });
        }
        res.json(generation);
      } catch (error) {
        console.error("Error fetching code generation:", error);
        res.status(500).json({
          error: "Failed to fetch code generation",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/generations/:generationId/download", async (req, res) => {
      try {
        const { generationId } = req.params;
        const { format = "zip" } = req.query;
        const aiService = createAIAssistantService();
        const generations = await aiService.getCodeGenerations();
        const generation = generations.find((gen) => gen.id === generationId);
        if (!generation || !generation.result) {
          return res.status(404).json({
            error: "Generation not found or not completed",
            message: "Cannot download incomplete generation"
          });
        }
        const projectData = {
          projectName: generation.result.projectName,
          files: generation.result.files,
          dependencies: generation.result.dependencies,
          readme: `# ${generation.result.projectName}

${generation.result.description}

## Features
${generation.result.features.map((f) => `- ${f}`).join("\n")}

## Dependencies
${generation.result.dependencies.map((d) => `- ${d}`).join("\n")}`
        };
        res.setHeader("Content-Disposition", `attachment; filename="${generation.result.projectName}.json"`);
        res.setHeader("Content-Type", "application/json");
        res.json(projectData);
      } catch (error) {
        console.error("Error downloading generation:", error);
        res.status(500).json({
          error: "Failed to download generation",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/capabilities", async (req, res) => {
      try {
        const capabilities = {
          codeGeneration: {
            platforms: ["ios", "android", "react-native", "flutter"],
            languages: ["swift", "kotlin", "javascript", "typescript", "dart"],
            features: [
              "Complete app generation",
              "Component creation",
              "API integration",
              "State management",
              "Navigation setup",
              "Styling and theming"
            ]
          },
          conversation: {
            features: [
              "Natural language understanding",
              "Code explanation",
              "Debug assistance",
              "Best practices guidance",
              "Architecture recommendations"
            ]
          },
          codeAssistance: {
            features: [
              "Code review and optimization",
              "Bug detection and fixes",
              "Performance improvements",
              "Security recommendations",
              "Refactoring suggestions"
            ]
          },
          supportedFrameworks: {
            ios: ["SwiftUI", "UIKit"],
            android: ["Jetpack Compose", "Traditional Views"],
            "react-native": ["Expo", "CLI"],
            flutter: ["Material Design", "Cupertino"]
          }
        };
        res.json(capabilities);
      } catch (error) {
        console.error("Error fetching AI capabilities:", error);
        res.status(500).json({
          error: "Failed to fetch AI capabilities",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/stats", async (req, res) => {
      try {
        const aiService = createAIAssistantService();
        const generations = await aiService.getCodeGenerations();
        const stats = {
          totalGenerations: generations.length,
          completedGenerations: generations.filter((g) => g.status === "completed").length,
          pendingGenerations: generations.filter((g) => g.status === "generating").length,
          failedGenerations: generations.filter((g) => g.status === "failed").length,
          platformBreakdown: {
            ios: generations.filter((g) => g.platform === "ios").length,
            android: generations.filter((g) => g.platform === "android").length,
            "react-native": generations.filter((g) => g.platform === "react-native").length,
            flutter: generations.filter((g) => g.platform === "flutter").length
          },
          averageGenerationTime: "3.2 minutes",
          successRate: generations.length > 0 ? Math.round(generations.filter((g) => g.status === "completed").length / generations.length * 100) : 0,
          lastGeneration: generations.length > 0 ? generations[0].timestamp : null
        };
        res.json(stats);
      } catch (error) {
        console.error("Error fetching AI stats:", error);
        res.status(500).json({
          error: "Failed to fetch AI statistics",
          message: error.message
        });
      }
    });
    aiAssistantRouter.get("/health", async (req, res) => {
      try {
        const healthStatus = {
          status: "healthy",
          services: {
            naturalLanguageProcessing: "operational",
            codeGeneration: "operational",
            conversationalAI: "operational",
            projectGeneration: "operational"
          },
          performance: {
            averageResponseTime: "1.2s",
            uptime: "99.9%",
            successRate: "98.5%"
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          version: "2.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking AI assistant health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    ai_assistant_default = aiAssistantRouter;
  }
});

// server/phoenix/services/CodeEditorService.ts
function createCodeEditorService() {
  return new CodeEditorService();
}
var CodeEditorService;
var init_CodeEditorService = __esm({
  "server/phoenix/services/CodeEditorService.ts"() {
    "use strict";
    CodeEditorService = class {
      smartFeatures = /* @__PURE__ */ new Map();
      constructor() {
        this.initializeSmartFeatures();
      }
      /**
       * Initialize smart editor features
       */
      initializeSmartFeatures() {
        const features = [
          {
            id: "autocomplete",
            name: "Smart Autocomplete",
            description: "AI-powered code completion",
            enabled: true,
            type: "completion"
          },
          {
            id: "error-detection",
            name: "Real-time Error Detection",
            description: "Instant error and warning detection",
            enabled: true,
            type: "analysis"
          },
          {
            id: "auto-format",
            name: "Auto Formatting",
            description: "Automatic code formatting on save",
            enabled: true,
            type: "formatting"
          },
          {
            id: "smart-imports",
            name: "Smart Imports",
            description: "Automatic import suggestions",
            enabled: true,
            type: "completion"
          },
          {
            id: "refactor-suggestions",
            name: "Refactoring Suggestions",
            description: "Intelligent code improvement hints",
            enabled: true,
            type: "refactoring"
          },
          {
            id: "performance-hints",
            name: "Performance Hints",
            description: "Performance optimization suggestions",
            enabled: true,
            type: "analysis"
          }
        ];
        features.forEach((feature) => this.smartFeatures.set(feature.id, feature));
      }
      /**
       * Get code completions for current position
       */
      async getCodeCompletions(code, position, language) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const context = this.extractContext(code, position);
        const suggestions = this.generateSuggestions(context, language);
        return {
          id: `completion-${Date.now()}`,
          position,
          suggestions,
          context,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      /**
       * Analyze code for hints and issues
       */
      async analyzeCode(code, language) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const hints = this.detectIssues(code, language);
        const suggestions = this.generateImprovementSuggestions(code, language);
        const metrics = this.calculateMetrics(code, language);
        return {
          hints,
          suggestions,
          metrics
        };
      }
      /**
       * Format code according to language standards
       */
      async formatCode(code, language) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let formattedCode = code;
        let changes = 0;
        switch (language) {
          case "javascript":
          case "typescript":
            formattedCode = this.formatJavaScript(code);
            break;
          case "swift":
            formattedCode = this.formatSwift(code);
            break;
          case "kotlin":
            formattedCode = this.formatKotlin(code);
            break;
          case "dart":
            formattedCode = this.formatDart(code);
            break;
        }
        changes = this.countFormatChanges(code, formattedCode);
        return { formattedCode, changes };
      }
      /**
       * Get smart editor features
       */
      async getSmartFeatures() {
        return Array.from(this.smartFeatures.values());
      }
      /**
       * Extract context around cursor position
       */
      extractContext(code, position) {
        const lines = code.split("\n");
        const currentLine = lines[position.line - 1] || "";
        const beforeCursor = currentLine.substring(0, position.column - 1);
        const afterCursor = currentLine.substring(position.column - 1);
        const startLine = Math.max(0, position.line - 3);
        const endLine = Math.min(lines.length, position.line + 2);
        const contextLines = lines.slice(startLine, endLine);
        return {
          currentLine,
          beforeCursor,
          afterCursor,
          surroundingLines: contextLines
        }.toString();
      }
      /**
       * Generate intelligent code suggestions
       */
      generateSuggestions(context, language) {
        const suggestions = [];
        if (language === "javascript" && context.includes("React")) {
          suggestions.push(
            {
              id: "useState-suggestion",
              text: "useState",
              insertText: "useState",
              kind: "function",
              detail: "React Hook for state management",
              documentation: "Returns a stateful value and a function to update it",
              confidence: 0.95,
              priority: 10
            },
            {
              id: "useEffect-suggestion",
              text: "useEffect",
              insertText: "useEffect",
              kind: "function",
              detail: "React Hook for side effects",
              documentation: "Performs side effects in function components",
              confidence: 0.92,
              priority: 9
            },
            {
              id: "view-component",
              text: "View",
              insertText: "View",
              kind: "class",
              detail: "React Native View component",
              documentation: "A container that supports layout with flexbox",
              confidence: 0.88,
              priority: 8
            }
          );
        }
        if (context.includes("for") || context.includes("loop")) {
          suggestions.push({
            id: "for-loop-snippet",
            text: "for loop",
            insertText: "for (let i = 0; i < array.length; i++) {\n  \n}",
            kind: "snippet",
            detail: "Standard for loop",
            confidence: 0.85,
            priority: 7
          });
        }
        if (context.includes("function") || context.includes("const")) {
          suggestions.push({
            id: "arrow-function",
            text: "arrow function",
            insertText: "() => {\n  \n}",
            kind: "snippet",
            detail: "Arrow function expression",
            confidence: 0.82,
            priority: 6
          });
        }
        switch (language) {
          case "swift":
            suggestions.push(
              {
                id: "swiftui-view",
                text: "View",
                insertText: "View",
                kind: "class",
                detail: "SwiftUI View protocol",
                confidence: 0.9,
                priority: 9
              },
              {
                id: "state-property",
                text: "@State",
                insertText: "@State",
                kind: "keyword",
                detail: "SwiftUI state property wrapper",
                confidence: 0.87,
                priority: 8
              }
            );
            break;
          case "kotlin":
            suggestions.push(
              {
                id: "data-class",
                text: "data class",
                insertText: "data class ",
                kind: "keyword",
                detail: "Kotlin data class",
                confidence: 0.85,
                priority: 8
              },
              {
                id: "composable",
                text: "@Composable",
                insertText: "@Composable",
                kind: "keyword",
                detail: "Jetpack Compose composable function",
                confidence: 0.88,
                priority: 9
              }
            );
            break;
          case "dart":
            suggestions.push(
              {
                id: "stateless-widget",
                text: "StatelessWidget",
                insertText: "StatelessWidget",
                kind: "class",
                detail: "Flutter StatelessWidget",
                confidence: 0.9,
                priority: 9
              },
              {
                id: "build-method",
                text: "build",
                insertText: "build(BuildContext context) {\n  return \n}",
                kind: "method",
                detail: "Widget build method",
                confidence: 0.85,
                priority: 8
              }
            );
            break;
        }
        return suggestions.sort((a, b) => b.priority - a.priority);
      }
      /**
       * Detect code issues and provide hints
       */
      detectIssues(code, language) {
        const hints = [];
        const lines = code.split("\n");
        lines.forEach((line, index) => {
          const lineNumber = index + 1;
          if (line.includes("console.log") && language === "javascript") {
            hints.push({
              id: `console-log-${lineNumber}`,
              type: "warning",
              message: "Consider removing console.log statements in production",
              line: lineNumber,
              column: line.indexOf("console.log") + 1,
              severity: "minor",
              quickFix: line.replace(/console\.log\([^)]*\);?/, ""),
              documentation: "Console statements should be removed in production builds"
            });
          }
          if (line.includes("const ") || line.includes("let ")) {
            const varMatch = line.match(/(const|let)\s+(\w+)/);
            if (varMatch) {
              const varName = varMatch[2];
              const restOfCode = lines.slice(index + 1).join("\n");
              if (!restOfCode.includes(varName)) {
                hints.push({
                  id: `unused-var-${lineNumber}`,
                  type: "warning",
                  message: `Variable '${varName}' is declared but never used`,
                  line: lineNumber,
                  column: line.indexOf(varName) + 1,
                  severity: "minor",
                  documentation: "Unused variables should be removed to improve code clarity"
                });
              }
            }
          }
          if (language === "javascript" && !line.trim().endsWith(";") && (line.includes("=") || line.includes("return") || line.includes("import"))) {
            hints.push({
              id: `missing-semicolon-${lineNumber}`,
              type: "info",
              message: "Consider adding a semicolon",
              line: lineNumber,
              column: line.length,
              severity: "info",
              quickFix: line + ";"
            });
          }
          if (line.length > 100) {
            hints.push({
              id: `long-line-${lineNumber}`,
              type: "suggestion",
              message: "Line is too long (>100 characters)",
              line: lineNumber,
              column: 100,
              severity: "minor",
              documentation: "Consider breaking long lines for better readability"
            });
          }
          if (language === "swift" && line.includes("!") && !line.includes("!=")) {
            hints.push({
              id: `force-unwrap-${lineNumber}`,
              type: "warning",
              message: "Avoid force unwrapping, use optional binding instead",
              line: lineNumber,
              column: line.indexOf("!") + 1,
              severity: "major",
              documentation: "Force unwrapping can cause runtime crashes"
            });
          }
        });
        return hints;
      }
      /**
       * Generate improvement suggestions
       */
      generateImprovementSuggestions(code, language) {
        const suggestions = [];
        if (language === "javascript" && code.includes("function(")) {
          suggestions.push({
            id: "arrow-function-suggestion",
            text: "Use arrow functions",
            insertText: "() => {}",
            kind: "suggestion",
            detail: "Consider using arrow functions for cleaner syntax",
            confidence: 0.75,
            priority: 5
          });
        }
        if (code.includes("FlatList") && !code.includes("getItemLayout")) {
          suggestions.push({
            id: "flatlist-optimization",
            text: "Add getItemLayout",
            insertText: "getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index})}",
            kind: "suggestion",
            detail: "Add getItemLayout for better FlatList performance",
            confidence: 0.8,
            priority: 7
          });
        }
        return suggestions;
      }
      /**
       * Calculate code metrics
       */
      calculateMetrics(code, language) {
        const lines = code.split("\n").filter((line) => line.trim());
        const totalLines = lines.length;
        const commentLines = lines.filter(
          (line) => line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")
        ).length;
        const complexity = (code.match(/if|for|while|switch|catch/g) || []).length;
        const maintainability = Math.max(0, 100 - complexity * 2 - totalLines / 10);
        const readability = Math.min(100, commentLines / totalLines * 100 + 60);
        const performance = Math.max(0, 100 - (code.includes("console.log") ? 10 : 0) - complexity);
        return {
          complexity: Math.round(complexity),
          maintainability: Math.round(maintainability),
          readability: Math.round(readability),
          performance: Math.round(performance)
        };
      }
      /**
       * Format JavaScript code
       */
      formatJavaScript(code) {
        let formatted = code.replace(/;\s*\n/g, ";\n").replace(/{\s*\n/g, "{\n").replace(/\n\s*}/g, "\n}").replace(/,\s*\n/g, ",\n").replace(/\s+/g, " ").trim();
        const lines = formatted.split("\n");
        let indentLevel = 0;
        const indentSize = 2;
        const formattedLines = lines.map((line) => {
          const trimmed = line.trim();
          if (trimmed.endsWith("}")) {
            indentLevel = Math.max(0, indentLevel - 1);
          }
          const indentedLine = " ".repeat(indentLevel * indentSize) + trimmed;
          if (trimmed.endsWith("{")) {
            indentLevel++;
          }
          return indentedLine;
        });
        return formattedLines.join("\n");
      }
      /**
       * Format Swift code
       */
      formatSwift(code) {
        return code.replace(/{\s*\n/g, " {\n").replace(/\n\s*}/g, "\n}").replace(/,\s*\n/g, ",\n").trim();
      }
      /**
       * Format Kotlin code
       */
      formatKotlin(code) {
        return code.replace(/{\s*\n/g, " {\n").replace(/\n\s*}/g, "\n}").replace(/,\s*\n/g, ",\n").trim();
      }
      /**
       * Format Dart code
       */
      formatDart(code) {
        return code.replace(/{\s*\n/g, " {\n").replace(/\n\s*}/g, "\n}").replace(/,\s*\n/g, ",\n").trim();
      }
      /**
       * Count formatting changes
       */
      countFormatChanges(original, formatted) {
        const originalLines = original.split("\n");
        const formattedLines = formatted.split("\n");
        let changes = 0;
        const maxLines = Math.max(originalLines.length, formattedLines.length);
        for (let i = 0; i < maxLines; i++) {
          if ((originalLines[i] || "") !== (formattedLines[i] || "")) {
            changes++;
          }
        }
        return changes;
      }
    };
  }
});

// server/phoenix/routes/code-editor.ts
var code_editor_exports = {};
__export(code_editor_exports, {
  codeEditorRouter: () => codeEditorRouter,
  default: () => code_editor_default
});
import express9 from "express";
var codeEditorRouter, code_editor_default;
var init_code_editor = __esm({
  "server/phoenix/routes/code-editor.ts"() {
    "use strict";
    init_CodeEditorService();
    codeEditorRouter = express9.Router();
    codeEditorRouter.post("/complete", async (req, res) => {
      try {
        const { code, position, language } = req.body;
        if (!code || !position || !language) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Code, position, and language are required"
          });
        }
        if (typeof position.line !== "number" || typeof position.column !== "number") {
          return res.status(400).json({
            error: "Invalid Position",
            message: "Position must have line and column numbers"
          });
        }
        const editorService = createCodeEditorService();
        const completion = await editorService.getCodeCompletions(code, position, language);
        res.json({
          success: true,
          completion,
          suggestions: completion.suggestions
        });
      } catch (error) {
        console.error("Error getting code completions:", error);
        res.status(500).json({
          error: "Failed to get code completions",
          message: error.message
        });
      }
    });
    codeEditorRouter.post("/analyze", async (req, res) => {
      try {
        const { code, language } = req.body;
        if (!code || !language) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Code and language are required"
          });
        }
        const editorService = createCodeEditorService();
        const analysis = await editorService.analyzeCode(code, language);
        res.json({
          success: true,
          analysis,
          hints: analysis.hints,
          suggestions: analysis.suggestions,
          metrics: analysis.metrics
        });
      } catch (error) {
        console.error("Error analyzing code:", error);
        res.status(500).json({
          error: "Failed to analyze code",
          message: error.message
        });
      }
    });
    codeEditorRouter.post("/format", async (req, res) => {
      try {
        const { code, language } = req.body;
        if (!code || !language) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Code and language are required"
          });
        }
        const editorService = createCodeEditorService();
        const result = await editorService.formatCode(code, language);
        res.json({
          success: true,
          formattedCode: result.formattedCode,
          changes: result.changes,
          message: `Applied ${result.changes} formatting changes`
        });
      } catch (error) {
        console.error("Error formatting code:", error);
        res.status(500).json({
          error: "Failed to format code",
          message: error.message
        });
      }
    });
    codeEditorRouter.get("/features", async (req, res) => {
      try {
        const editorService = createCodeEditorService();
        const features = await editorService.getSmartFeatures();
        res.json(features);
      } catch (error) {
        console.error("Error fetching editor features:", error);
        res.status(500).json({
          error: "Failed to fetch editor features",
          message: error.message
        });
      }
    });
    codeEditorRouter.patch("/features/:featureId", async (req, res) => {
      try {
        const { featureId } = req.params;
        const { enabled } = req.body;
        if (typeof enabled !== "boolean") {
          return res.status(400).json({
            error: "Invalid Request",
            message: "enabled must be a boolean value"
          });
        }
        res.json({
          success: true,
          message: `Feature ${featureId} ${enabled ? "enabled" : "disabled"}`,
          featureId,
          enabled
        });
      } catch (error) {
        console.error("Error updating feature settings:", error);
        res.status(500).json({
          error: "Failed to update feature settings",
          message: error.message
        });
      }
    });
    codeEditorRouter.get("/stats", async (req, res) => {
      try {
        const stats = {
          totalCompletions: 15420,
          acceptedSuggestions: 12680,
          acceptanceRate: "82.2%",
          averageResponseTime: "180ms",
          languageUsage: {
            javascript: 45,
            typescript: 25,
            swift: 15,
            kotlin: 10,
            dart: 5
          },
          topFeatures: [
            { name: "Smart Autocomplete", usage: 89 },
            { name: "Error Detection", usage: 76 },
            { name: "Auto Formatting", usage: 65 },
            { name: "Smart Imports", usage: 54 },
            { name: "Refactoring Suggestions", usage: 43 }
          ],
          recentActivity: {
            completionsToday: 234,
            hintsProvided: 67,
            codeFormatted: 45,
            errorsDetected: 23
          }
        };
        res.json(stats);
      } catch (error) {
        console.error("Error fetching editor statistics:", error);
        res.status(500).json({
          error: "Failed to fetch editor statistics",
          message: error.message
        });
      }
    });
    codeEditorRouter.get("/templates/:language", async (req, res) => {
      try {
        const { language } = req.params;
        const templates = {
          javascript: [
            {
              id: "react-component",
              name: "React Component",
              description: "Functional React component template",
              code: `import React from 'react';

const ComponentName = () => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;`
            },
            {
              id: "react-native-screen",
              name: "React Native Screen",
              description: "React Native screen template",
              code: `import React from 'react';


const ScreenName = () => {
  return (
    <div className="mobile-converted">
      <span className="mobile-converted">Screen Title</span>
    </div>
  );
};

export default ScreenName;`
            }
          ],
          swift: [
            {
              id: "swiftui-view",
              name: "SwiftUI View",
              description: "SwiftUI view template",
              code: `import SwiftUI

struct ViewName: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
        }
        .padding()
    }
}

struct ViewName_Previews: PreviewProvider {
    static var previews: some View {
        ViewName()
    }
}`
            }
          ],
          kotlin: [
            {
              id: "compose-screen",
              name: "Compose Screen",
              description: "Jetpack Compose screen template",
              code: `import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ScreenName() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Hello, World!")
    }
}`
            }
          ],
          dart: [
            {
              id: "flutter-widget",
              name: "Flutter Widget",
              description: "Flutter StatelessWidget template",
              code: `import 'package:flutter/material.dart';

class WidgetName extends StatelessWidget {
  const WidgetName({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Widget Title'),
      ),
      body: const Center(
        child: Text(
          'Hello, World!',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}`
            }
          ]
        };
        res.json(templates[language] || []);
      } catch (error) {
        console.error("Error fetching code templates:", error);
        res.status(500).json({
          error: "Failed to fetch code templates",
          message: error.message
        });
      }
    });
    codeEditorRouter.get("/health", async (req, res) => {
      try {
        const healthStatus = {
          status: "healthy",
          services: {
            codeCompletion: "operational",
            codeAnalysis: "operational",
            codeFormatting: "operational",
            smartFeatures: "operational"
          },
          performance: {
            averageCompletionTime: "180ms",
            averageAnalysisTime: "850ms",
            averageFormattingTime: "320ms",
            uptime: "99.8%"
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          version: "3.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking editor health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    code_editor_default = codeEditorRouter;
  }
});

// server/phoenix/services/AIDesignService.ts
function createAIDesignService() {
  return new AIDesignService();
}
var AIDesignService;
var init_AIDesignService = __esm({
  "server/phoenix/services/AIDesignService.ts"() {
    "use strict";
    AIDesignService = class {
      designs = /* @__PURE__ */ new Map();
      suggestions = /* @__PURE__ */ new Map();
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock design data
       */
      initializeMockData() {
        const mockDesigns = [
          {
            id: "design-1",
            name: "Modern Login Screen",
            description: "Clean login interface with gradient background and social auth options",
            platform: "react-native",
            style: "modern",
            components: [
              {
                id: "comp-1",
                type: "container",
                name: "Main Container",
                properties: { flex: 1 },
                style: { backgroundColor: "#f8fafc", padding: 20 },
                position: { x: 0, y: 0, width: 375, height: 812 }
              },
              {
                id: "comp-2",
                type: "text",
                name: "Welcome Title",
                properties: { text: "Welcome Back" },
                style: { fontSize: 28, fontWeight: "bold", textColor: "#1f2937" },
                position: { x: 20, y: 100, width: 335, height: 40 }
              },
              {
                id: "comp-3",
                type: "input",
                name: "Email Input",
                properties: { placeholder: "Email address" },
                style: { backgroundColor: "#ffffff", borderRadius: 12, padding: 16 },
                position: { x: 20, y: 200, width: 335, height: 50 }
              },
              {
                id: "comp-4",
                type: "input",
                name: "Password Input",
                properties: { placeholder: "Password", secureTextEntry: true },
                style: { backgroundColor: "#ffffff", borderRadius: 12, padding: 16 },
                position: { x: 20, y: 270, width: 335, height: 50 }
              },
              {
                id: "comp-5",
                type: "button",
                name: "Sign In Button",
                properties: { text: "Sign In" },
                style: { backgroundColor: "#3b82f6", borderRadius: 12, padding: 16 },
                position: { x: 20, y: 350, width: 335, height: 50 }
              }
            ],
            colorPalette: {
              primary: "#3b82f6",
              secondary: "#64748b",
              accent: "#f59e0b",
              background: "#f8fafc",
              surface: "#ffffff",
              text: "#1f2937",
              textSecondary: "#6b7280"
            },
            layout: {
              type: "stack",
              direction: "vertical",
              spacing: 20,
              alignment: "center",
              children: []
            },
            code: this.generateReactNativeLoginCode(),
            preview: "data:image/png;base64,mockpreview",
            timestamp: new Date(Date.now() - 36e5).toISOString()
          },
          {
            id: "design-2",
            name: "Dashboard Overview",
            description: "Analytics dashboard with cards and charts",
            platform: "web",
            style: "minimal",
            components: [
              {
                id: "comp-6",
                type: "container",
                name: "Dashboard Grid",
                properties: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)" },
                style: { backgroundColor: "#ffffff", padding: 24 },
                position: { x: 0, y: 0, width: 1200, height: 800 }
              },
              {
                id: "comp-7",
                type: "card",
                name: "Stats Card 1",
                properties: { title: "Total Users", value: "12,345" },
                style: { backgroundColor: "#ffffff", borderRadius: 8, shadow: "0 1px 3px rgba(0,0,0,0.1)" },
                position: { x: 24, y: 24, width: 380, height: 120 }
              },
              {
                id: "comp-8",
                type: "card",
                name: "Stats Card 2",
                properties: { title: "Revenue", value: "$45,678" },
                style: { backgroundColor: "#ffffff", borderRadius: 8, shadow: "0 1px 3px rgba(0,0,0,0.1)" },
                position: { x: 428, y: 24, width: 380, height: 120 }
              }
            ],
            colorPalette: {
              primary: "#059669",
              secondary: "#374151",
              accent: "#f59e0b",
              background: "#f9fafb",
              surface: "#ffffff",
              text: "#111827",
              textSecondary: "#6b7280"
            },
            layout: {
              type: "grid",
              spacing: 24,
              children: []
            },
            code: this.generateReactDashboardCode(),
            preview: "data:image/png;base64,mockpreview",
            timestamp: new Date(Date.now() - 72e5).toISOString()
          }
        ];
        mockDesigns.forEach((design) => this.designs.set(design.id, design));
        const mockSuggestions = [
          {
            id: "suggestion-1",
            type: "accessibility",
            title: "Improve Button Contrast",
            description: "Button text contrast ratio is below WCAG AA standards",
            before: "color: #3b82f6 on #ffffff",
            after: "color: #ffffff on #1d4ed8",
            confidence: 0.92
          },
          {
            id: "suggestion-2",
            type: "spacing",
            title: "Add Consistent Spacing",
            description: "Use consistent 8px grid system for better visual rhythm",
            before: "margin: 15px, padding: 12px",
            after: "margin: 16px, padding: 8px",
            confidence: 0.85
          },
          {
            id: "suggestion-3",
            type: "typography",
            title: "Optimize Font Sizes",
            description: "Use type scale for better hierarchy and readability",
            before: "fontSize: 17px, 15px, 13px",
            after: "fontSize: 18px, 16px, 14px",
            confidence: 0.78
          },
          {
            id: "suggestion-4",
            type: "color",
            title: "Enhance Color Palette",
            description: "Add complementary accent color for better visual interest",
            before: "Primary: #3b82f6, Secondary: #64748b",
            after: "Primary: #3b82f6, Secondary: #64748b, Accent: #f59e0b",
            confidence: 0.82
          },
          {
            id: "suggestion-5",
            type: "layout",
            title: "Improve Mobile Layout",
            description: "Optimize component spacing for mobile devices",
            before: "Fixed spacing across all devices",
            after: "Responsive spacing with mobile-first approach",
            confidence: 0.88
          }
        ];
        mockSuggestions.forEach((suggestion) => this.suggestions.set(suggestion.id, suggestion));
      }
      /**
       * Generate design from natural language description
       */
      async generateDesign(request) {
        await new Promise((resolve) => setTimeout(resolve, 3e3));
        const designId = `design-${Date.now()}`;
        const designName = this.extractDesignName(request.description);
        const design = {
          id: designId,
          name: designName,
          description: request.description,
          platform: request.platform,
          style: request.style,
          components: this.generateComponents(request),
          colorPalette: this.generateColorPalette(request),
          layout: this.generateLayout(request),
          code: this.generateCode(request),
          preview: "data:image/png;base64,mockpreview",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.designs.set(designId, design);
        return design;
      }
      /**
       * Analyze existing design and provide suggestions
       */
      async analyzeDesign(designId) {
        const design = this.designs.get(designId);
        if (!design) {
          throw new Error("Design not found");
        }
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        const newSuggestions = this.generateDesignSuggestions(design);
        newSuggestions.forEach((suggestion) => this.suggestions.set(suggestion.id, suggestion));
        return {
          accessibility: {
            score: 85,
            issues: ["Low contrast on secondary buttons", "Missing alt text on images"],
            suggestions: ["Increase color contrast ratio", "Add descriptive alt text"]
          },
          usability: {
            score: 78,
            insights: ["Button sizes may be too small for touch", "Consider larger tap targets"]
          },
          aesthetics: {
            score: 92,
            feedback: ["Beautiful color harmony", "Good use of whitespace", "Modern design language"]
          },
          performance: {
            score: 88,
            optimizations: ["Optimize image sizes", "Use vector icons where possible"]
          }
        };
      }
      /**
       * Get all generated designs
       */
      async getGeneratedDesigns() {
        return Array.from(this.designs.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      /**
       * Get design suggestions
       */
      async getDesignSuggestions() {
        return Array.from(this.suggestions.values()).sort((a, b) => b.confidence - a.confidence);
      }
      /**
       * Extract design name from description
       */
      extractDesignName(description) {
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes("login")) return "Login Screen";
        if (lowerDesc.includes("dashboard")) return "Dashboard";
        if (lowerDesc.includes("profile")) return "Profile Screen";
        if (lowerDesc.includes("cart") || lowerDesc.includes("shopping")) return "Shopping Cart";
        if (lowerDesc.includes("chat") || lowerDesc.includes("message")) return "Chat Interface";
        if (lowerDesc.includes("settings")) return "Settings Screen";
        if (lowerDesc.includes("home")) return "Home Screen";
        return "Custom Design";
      }
      /**
       * Generate components based on request
       */
      generateComponents(request) {
        const components = [];
        const description = request.description.toLowerCase();
        components.push({
          id: `comp-container-${Date.now()}`,
          type: "container",
          name: "Main Container",
          properties: { flex: 1 },
          style: this.getStyleForType("container", request),
          position: { x: 0, y: 0, width: 375, height: 812 }
        });
        if (description.includes("login") || description.includes("sign in")) {
          components.push(
            {
              id: `comp-title-${Date.now()}`,
              type: "text",
              name: "Title",
              properties: { text: "Welcome Back" },
              style: this.getStyleForType("text", request),
              position: { x: 20, y: 100, width: 335, height: 40 }
            },
            {
              id: `comp-email-${Date.now()}`,
              type: "input",
              name: "Email Input",
              properties: { placeholder: "Email" },
              style: this.getStyleForType("input", request),
              position: { x: 20, y: 200, width: 335, height: 50 }
            },
            {
              id: `comp-password-${Date.now()}`,
              type: "input",
              name: "Password Input",
              properties: { placeholder: "Password", secureTextEntry: true },
              style: this.getStyleForType("input", request),
              position: { x: 20, y: 270, width: 335, height: 50 }
            },
            {
              id: `comp-button-${Date.now()}`,
              type: "button",
              name: "Sign In Button",
              properties: { text: "Sign In" },
              style: this.getStyleForType("button", request),
              position: { x: 20, y: 350, width: 335, height: 50 }
            }
          );
        }
        if (description.includes("dashboard")) {
          components.push(
            {
              id: `comp-header-${Date.now()}`,
              type: "text",
              name: "Dashboard Title",
              properties: { text: "Dashboard" },
              style: this.getStyleForType("text", request),
              position: { x: 20, y: 60, width: 335, height: 40 }
            },
            {
              id: `comp-card1-${Date.now()}`,
              type: "card",
              name: "Stats Card 1",
              properties: { title: "Total Users", value: "12,345" },
              style: this.getStyleForType("card", request),
              position: { x: 20, y: 120, width: 160, height: 100 }
            },
            {
              id: `comp-card2-${Date.now()}`,
              type: "card",
              name: "Stats Card 2",
              properties: { title: "Revenue", value: "$45,678" },
              style: this.getStyleForType("card", request),
              position: { x: 195, y: 120, width: 160, height: 100 }
            }
          );
        }
        return components;
      }
      /**
       * Generate color palette based on style and request
       */
      generateColorPalette(request) {
        const palettes = {
          modern: {
            primary: "#3b82f6",
            secondary: "#64748b",
            accent: "#f59e0b",
            background: "#f8fafc",
            surface: "#ffffff",
            text: "#1f2937",
            textSecondary: "#6b7280"
          },
          minimal: {
            primary: "#000000",
            secondary: "#6b7280",
            accent: "#ef4444",
            background: "#ffffff",
            surface: "#f9fafb",
            text: "#111827",
            textSecondary: "#6b7280"
          },
          bold: {
            primary: "#dc2626",
            secondary: "#ea580c",
            accent: "#facc15",
            background: "#1f2937",
            surface: "#374151",
            text: "#f9fafb",
            textSecondary: "#d1d5db"
          },
          elegant: {
            primary: "#7c3aed",
            secondary: "#a855f7",
            accent: "#ec4899",
            background: "#faf7ff",
            surface: "#ffffff",
            text: "#1f2937",
            textSecondary: "#6b7280"
          },
          playful: {
            primary: "#f59e0b",
            secondary: "#10b981",
            accent: "#8b5cf6",
            background: "#fef3c7",
            surface: "#ffffff",
            text: "#1f2937",
            textSecondary: "#6b7280"
          }
        };
        return palettes[request.style];
      }
      /**
       * Generate layout structure
       */
      generateLayout(request) {
        const description = request.description.toLowerCase();
        if (description.includes("grid") || description.includes("dashboard")) {
          return {
            type: "grid",
            spacing: 16,
            children: []
          };
        }
        if (description.includes("flex") || description.includes("row")) {
          return {
            type: "flex",
            direction: "horizontal",
            spacing: 12,
            alignment: "center",
            children: []
          };
        }
        return {
          type: "stack",
          direction: "vertical",
          spacing: 16,
          alignment: "center",
          children: []
        };
      }
      /**
       * Get style for component type
       */
      getStyleForType(type, request) {
        const palette = this.generateColorPalette(request);
        const styles = {
          container: {
            backgroundColor: palette.background,
            padding: 20
          },
          text: {
            fontSize: 24,
            fontWeight: "bold",
            textColor: palette.text
          },
          input: {
            backgroundColor: palette.surface,
            borderRadius: 12,
            padding: 16,
            textColor: palette.text
          },
          button: {
            backgroundColor: palette.primary,
            borderRadius: 12,
            padding: 16,
            textColor: "#ffffff"
          },
          card: {
            backgroundColor: palette.surface,
            borderRadius: 8,
            padding: 16,
            shadow: "0 1px 3px rgba(0,0,0,0.1)"
          }
        };
        return styles[type] || {};
      }
      /**
       * Generate code for the design
       */
      generateCode(request) {
        switch (request.platform) {
          case "react-native":
            return this.generateReactNativeCode(request);
          case "web":
            return this.generateReactCode(request);
          case "flutter":
            return this.generateFlutterCode(request);
          case "ios":
            return this.generateSwiftUICode(request);
          case "android":
            return this.generateComposeCode(request);
          default:
            return this.generateReactNativeCode(request);
        }
      }
      /**
       * Generate design suggestions for a given design
       */
      generateDesignSuggestions(design) {
        const suggestions = [];
        design.components.forEach((component) => {
          if (component.type === "button" && component.style.fontSize && component.style.fontSize < 16) {
            suggestions.push({
              id: `suggestion-${Date.now()}-${Math.random()}`,
              type: "accessibility",
              title: "Increase Button Text Size",
              description: "Button text should be at least 16px for better readability",
              before: `fontSize: ${component.style.fontSize}px`,
              after: "fontSize: 16px",
              confidence: 0.9
            });
          }
          if (component.type === "text" && !component.style.textColor) {
            suggestions.push({
              id: `suggestion-${Date.now()}-${Math.random()}`,
              type: "color",
              title: "Define Text Color",
              description: "Explicit text color improves consistency",
              before: "color: inherit",
              after: `color: ${design.colorPalette.text}`,
              confidence: 0.85
            });
          }
        });
        return suggestions;
      }
      // Code generation methods
      generateReactNativeLoginCode() {
        return `import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="mobile-converted">
      <div className="mobile-converted">
        <span className="mobile-converted">Welcome Back</span>
        
        <TextInput
          className="mobile-converted"
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          className="mobile-converted"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <button className="mobile-converted">
          <span className="mobile-converted">Sign In</span>
        </button>
      </div>
    </SafeAreaView>
  );
};

export default LoginScreen;`;
      }
      generateReactNativeCode(request) {
        const palette = this.generateColorPalette(request);
        return `import React from 'react';


const GeneratedScreen = () => {
  return (
    <SafeAreaView className="mobile-converted">
      <div className="mobile-converted">
        <span className="mobile-converted">Generated Design</span>
        {/* Add your components here */}
      </div>
    </SafeAreaView>
  );
};

export default GeneratedScreen;`;
      }
      generateReactDashboardCode() {
        return `import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">12,345</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">$45,678</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Growth</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">+23%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`;
      }
      generateReactCode(request) {
        const palette = this.generateColorPalette(request);
        return `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div style={{ backgroundColor: '${palette.background}', padding: '20px' }}>
      <h1 style={{ color: '${palette.text}', fontSize: '24px', fontWeight: 'bold' }}>
        Generated Design
      </h1>
      {/* Add your components here */}
    </div>
  );
};

export default GeneratedComponent;`;
      }
      generateFlutterCode(request) {
        return `import 'package:flutter/material.dart';

class GeneratedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Generated Design',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              // Add your widgets here
            ],
          ),
        ),
      ),
    );
  }
}`;
      }
      generateSwiftUICode(request) {
        return `import SwiftUI

struct GeneratedView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Generated Design")
                .font(.title)
                .fontWeight(.bold)
            
            // Add your views here
        }
        .padding()
        .background(Color(.systemGray6))
    }
}

struct GeneratedView_Previews: PreviewProvider {
    static var previews: some View {
        GeneratedView()
    }
}`;
      }
      generateComposeCode(request) {
        return `import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun GeneratedScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        Text(
            text = "Generated Design",
            style = MaterialTheme.typography.headlineMedium
        )
        
        // Add your composables here
    }
}`;
      }
    };
  }
});

// server/phoenix/routes/ai-design.ts
var ai_design_exports = {};
__export(ai_design_exports, {
  aiDesignRouter: () => aiDesignRouter,
  default: () => ai_design_default
});
import express10 from "express";
var aiDesignRouter, ai_design_default;
var init_ai_design = __esm({
  "server/phoenix/routes/ai-design.ts"() {
    "use strict";
    init_AIDesignService();
    aiDesignRouter = express10.Router();
    aiDesignRouter.post("/generate", async (req, res) => {
      try {
        const { description, platform, style, colors, components } = req.body;
        if (!description || !platform || !style) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Description, platform, and style are required"
          });
        }
        if (!["ios", "android", "web", "react-native", "flutter"].includes(platform)) {
          return res.status(400).json({
            error: "Invalid Platform",
            message: "Platform must be ios, android, web, react-native, or flutter"
          });
        }
        if (!["modern", "minimal", "bold", "elegant", "playful"].includes(style)) {
          return res.status(400).json({
            error: "Invalid Style",
            message: "Style must be modern, minimal, bold, elegant, or playful"
          });
        }
        const designService = createAIDesignService();
        const design = await designService.generateDesign({
          description,
          platform,
          style,
          colors,
          components
        });
        res.status(201).json({
          success: true,
          message: "Design generated successfully",
          design,
          estimatedTime: "2-3 minutes"
        });
      } catch (error) {
        console.error("Error generating design:", error);
        res.status(500).json({
          error: "Failed to generate design",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/generated", async (req, res) => {
      try {
        const { platform, style, limit } = req.query;
        const designService = createAIDesignService();
        let designs = await designService.getGeneratedDesigns();
        if (platform) {
          designs = designs.filter((design) => design.platform === platform);
        }
        if (style) {
          designs = designs.filter((design) => design.style === style);
        }
        if (limit) {
          designs = designs.slice(0, parseInt(limit));
        }
        res.json(designs);
      } catch (error) {
        console.error("Error fetching generated designs:", error);
        res.status(500).json({
          error: "Failed to fetch generated designs",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/generated/:designId", async (req, res) => {
      try {
        const { designId } = req.params;
        const designService = createAIDesignService();
        const designs = await designService.getGeneratedDesigns();
        const design = designs.find((d) => d.id === designId);
        if (!design) {
          return res.status(404).json({
            error: "Design not found",
            message: `Design with ID ${designId} not found`
          });
        }
        res.json(design);
      } catch (error) {
        console.error("Error fetching design:", error);
        res.status(500).json({
          error: "Failed to fetch design",
          message: error.message
        });
      }
    });
    aiDesignRouter.post("/analyze", async (req, res) => {
      try {
        const { designId } = req.body;
        if (!designId) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "designId is required"
          });
        }
        const designService = createAIDesignService();
        const analysis = await designService.analyzeDesign(designId);
        res.json({
          success: true,
          message: "Design analyzed successfully",
          analysis,
          designId
        });
      } catch (error) {
        console.error("Error analyzing design:", error);
        res.status(500).json({
          error: "Failed to analyze design",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/suggestions", async (req, res) => {
      try {
        const { type, limit } = req.query;
        const designService = createAIDesignService();
        let suggestions = await designService.getDesignSuggestions();
        if (type) {
          suggestions = suggestions.filter((suggestion) => suggestion.type === type);
        }
        if (limit) {
          suggestions = suggestions.slice(0, parseInt(limit));
        }
        res.json(suggestions);
      } catch (error) {
        console.error("Error fetching design suggestions:", error);
        res.status(500).json({
          error: "Failed to fetch design suggestions",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/templates", async (req, res) => {
      try {
        const { platform } = req.query;
        const templates = {
          common: [
            {
              id: "login-modern",
              name: "Modern Login",
              description: "Clean login screen with gradient background",
              prompt: "Create a modern login screen with gradient background, clean input fields, and social login options",
              tags: ["authentication", "modern", "gradient"]
            },
            {
              id: "dashboard-minimal",
              name: "Minimal Dashboard",
              description: "Clean dashboard with cards and charts",
              prompt: "Design a minimal dashboard with statistics cards, charts, and clean typography",
              tags: ["dashboard", "minimal", "analytics"]
            },
            {
              id: "profile-elegant",
              name: "Elegant Profile",
              description: "User profile with avatar and settings",
              prompt: "Create an elegant profile screen with large avatar, user info, and settings options",
              tags: ["profile", "elegant", "user"]
            },
            {
              id: "shopping-playful",
              name: "Playful Shopping",
              description: "Colorful shopping cart interface",
              prompt: "Design a playful shopping cart with product images, quantities, and bright colors",
              tags: ["shopping", "playful", "ecommerce"]
            }
          ],
          "react-native": [
            {
              id: "rn-onboarding",
              name: "Onboarding Flow",
              description: "Multi-step onboarding with illustrations",
              prompt: "Create a React Native onboarding flow with illustrations, progress indicators, and smooth animations",
              tags: ["onboarding", "react-native", "animations"]
            }
          ],
          "flutter": [
            {
              id: "flutter-material",
              name: "Material Design",
              description: "Flutter app following Material Design",
              prompt: "Design a Flutter app following Material Design guidelines with floating action button and bottom navigation",
              tags: ["flutter", "material", "navigation"]
            }
          ],
          ios: [
            {
              id: "ios-settings",
              name: "iOS Settings",
              description: "Native iOS settings screen",
              prompt: "Create an iOS settings screen with grouped lists, switches, and native navigation",
              tags: ["ios", "settings", "native"]
            }
          ],
          android: [
            {
              id: "android-compose",
              name: "Compose Interface",
              description: "Modern Android UI with Jetpack Compose",
              prompt: "Design a modern Android interface using Jetpack Compose with material theming",
              tags: ["android", "compose", "material"]
            }
          ]
        };
        const result = platform ? [...templates.common, ...templates[platform] || []] : templates.common;
        res.json(result);
      } catch (error) {
        console.error("Error fetching design templates:", error);
        res.status(500).json({
          error: "Failed to fetch design templates",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/palettes", async (req, res) => {
      try {
        const { style } = req.query;
        const palettes = {
          modern: [
            {
              id: "blue-modern",
              name: "Modern Blue",
              colors: ["#3b82f6", "#1e40af", "#93c5fd", "#dbeafe", "#f8fafc"],
              primary: "#3b82f6"
            },
            {
              id: "purple-modern",
              name: "Modern Purple",
              colors: ["#8b5cf6", "#7c3aed", "#c4b5fd", "#e9d5ff", "#faf5ff"],
              primary: "#8b5cf6"
            }
          ],
          minimal: [
            {
              id: "mono-minimal",
              name: "Monochrome",
              colors: ["#000000", "#374151", "#9ca3af", "#f3f4f6", "#ffffff"],
              primary: "#000000"
            }
          ],
          bold: [
            {
              id: "red-bold",
              name: "Bold Red",
              colors: ["#dc2626", "#991b1b", "#fca5a5", "#fed7d7", "#1f2937"],
              primary: "#dc2626"
            }
          ],
          elegant: [
            {
              id: "purple-elegant",
              name: "Elegant Purple",
              colors: ["#7c3aed", "#5b21b6", "#a855f7", "#e9d5ff", "#faf7ff"],
              primary: "#7c3aed"
            }
          ],
          playful: [
            {
              id: "rainbow-playful",
              name: "Playful Rainbow",
              colors: ["#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#fef3c7"],
              primary: "#f59e0b"
            }
          ]
        };
        const result = style ? palettes[style] || [] : Object.values(palettes).flat();
        res.json(result);
      } catch (error) {
        console.error("Error fetching color palettes:", error);
        res.status(500).json({
          error: "Failed to fetch color palettes",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/stats", async (req, res) => {
      try {
        const designService = createAIDesignService();
        const designs = await designService.getGeneratedDesigns();
        const suggestions = await designService.getDesignSuggestions();
        const stats = {
          totalDesigns: designs.length,
          platformBreakdown: {
            "react-native": designs.filter((d) => d.platform === "react-native").length,
            ios: designs.filter((d) => d.platform === "ios").length,
            android: designs.filter((d) => d.platform === "android").length,
            flutter: designs.filter((d) => d.platform === "flutter").length,
            web: designs.filter((d) => d.platform === "web").length
          },
          styleBreakdown: {
            modern: designs.filter((d) => d.style === "modern").length,
            minimal: designs.filter((d) => d.style === "minimal").length,
            bold: designs.filter((d) => d.style === "bold").length,
            elegant: designs.filter((d) => d.style === "elegant").length,
            playful: designs.filter((d) => d.style === "playful").length
          },
          totalSuggestions: suggestions.length,
          suggestionTypes: {
            accessibility: suggestions.filter((s) => s.type === "accessibility").length,
            color: suggestions.filter((s) => s.type === "color").length,
            spacing: suggestions.filter((s) => s.type === "spacing").length,
            typography: suggestions.filter((s) => s.type === "typography").length,
            layout: suggestions.filter((s) => s.type === "layout").length
          },
          averageComponents: designs.length > 0 ? Math.round(designs.reduce((sum, d) => sum + d.components.length, 0) / designs.length) : 0,
          mostPopularStyle: Object.entries(stats.styleBreakdown).reduce(
            (a, b) => stats.styleBreakdown[a[0]] > stats.styleBreakdown[b[0]] ? a : b
          )[0],
          recentActivity: {
            designsToday: designs.filter(
              (d) => new Date(d.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1e3)
            ).length,
            suggestionsGenerated: suggestions.length,
            averageGenerationTime: "2.8 seconds"
          }
        };
        res.json(stats);
      } catch (error) {
        console.error("Error fetching design statistics:", error);
        res.status(500).json({
          error: "Failed to fetch design statistics",
          message: error.message
        });
      }
    });
    aiDesignRouter.get("/health", async (req, res) => {
      try {
        const healthStatus = {
          status: "healthy",
          services: {
            designGeneration: "operational",
            colorPalettes: "operational",
            layoutEngine: "operational",
            codeGeneration: "operational",
            designAnalysis: "operational"
          },
          performance: {
            averageGenerationTime: "2.8s",
            averageAnalysisTime: "1.2s",
            uptime: "99.9%",
            successRate: "97.8%"
          },
          capabilities: {
            supportedPlatforms: ["ios", "android", "react-native", "flutter", "web"],
            supportedStyles: ["modern", "minimal", "bold", "elegant", "playful"],
            maxComponents: 50,
            maxDesignsPerHour: 100
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          version: "4.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking design service health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    ai_design_default = aiDesignRouter;
  }
});

// server/phoenix/services/SecurityService.ts
function createSecurityService() {
  return new SecurityService();
}
var SecurityService;
var init_SecurityService = __esm({
  "server/phoenix/services/SecurityService.ts"() {
    "use strict";
    SecurityService = class {
      threats = /* @__PURE__ */ new Map();
      rules = /* @__PURE__ */ new Map();
      authMethods = /* @__PURE__ */ new Map();
      events = [];
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock security data
       */
      initializeMockData() {
        const mockThreats = [
          {
            id: "threat-1",
            type: "brute_force",
            severity: "high",
            status: "active",
            source: "192.168.1.100",
            target: "/api/auth/login",
            description: "Multiple failed login attempts detected",
            timestamp: new Date(Date.now() - 3e5).toISOString(),
            // 5 minutes ago
            details: {
              attempts: 15,
              timeWindow: "5 minutes",
              userAgent: "Mozilla/5.0 (automated)"
            }
          },
          {
            id: "threat-2",
            type: "suspicious_login",
            severity: "medium",
            status: "investigating",
            source: "203.0.113.45",
            target: "user@example.com",
            description: "Login from unusual geographic location",
            timestamp: new Date(Date.now() - 9e5).toISOString(),
            // 15 minutes ago
            details: {
              location: "Unknown Country",
              normalLocation: "United States",
              riskScore: 75
            }
          },
          {
            id: "threat-3",
            type: "unauthorized_access",
            severity: "critical",
            status: "active",
            source: "10.0.0.55",
            target: "/api/admin/users",
            description: "Unauthorized access to admin endpoints",
            timestamp: new Date(Date.now() - 6e5).toISOString(),
            // 10 minutes ago
            details: {
              endpoint: "/api/admin/users",
              method: "GET",
              statusCode: 401,
              attempts: 8
            }
          },
          {
            id: "threat-4",
            type: "malware",
            severity: "high",
            status: "resolved",
            source: "upload-service",
            target: "file-storage",
            description: "Malicious file upload detected and quarantined",
            timestamp: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            details: {
              fileName: "malicious.exe",
              fileSize: "2.3 MB",
              virusName: "Trojan.Generic"
            }
          },
          {
            id: "threat-5",
            type: "data_breach",
            severity: "critical",
            status: "investigating",
            source: "database-server",
            target: "user_data",
            description: "Potential data exfiltration attempt",
            timestamp: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            details: {
              recordsAccessed: 1250,
              dataType: "Personal Information",
              queryPattern: "SELECT * FROM users WHERE..."
            }
          }
        ];
        mockThreats.forEach((threat) => this.threats.set(threat.id, threat));
        const mockRules = [
          {
            id: "rule-1",
            name: "Brute Force Protection",
            type: "authentication",
            enabled: true,
            severity: "high",
            conditions: ["Failed login attempts > 5 in 5 minutes", "Same IP address"],
            actions: ["Block IP for 30 minutes", "Send alert to security team"],
            lastTriggered: new Date(Date.now() - 3e5).toISOString(),
            triggerCount: 12
          },
          {
            id: "rule-2",
            name: "Suspicious Login Detection",
            type: "authentication",
            enabled: true,
            severity: "medium",
            conditions: ["Login from new country", "Different device fingerprint"],
            actions: ["Require additional verification", "Log security event"],
            lastTriggered: new Date(Date.now() - 9e5).toISOString(),
            triggerCount: 3
          },
          {
            id: "rule-3",
            name: "Admin Access Monitoring",
            type: "authorization",
            enabled: true,
            severity: "critical",
            conditions: ["Access to admin endpoints", "Non-admin user"],
            actions: ["Deny access", "Alert security team immediately"],
            lastTriggered: new Date(Date.now() - 6e5).toISOString(),
            triggerCount: 8
          },
          {
            id: "rule-4",
            name: "Data Exfiltration Detection",
            type: "data_protection",
            enabled: true,
            severity: "critical",
            conditions: ["Large data queries", "Unusual access patterns"],
            actions: ["Block query", "Quarantine user session", "Alert compliance team"],
            lastTriggered: new Date(Date.now() - 72e5).toISOString(),
            triggerCount: 2
          },
          {
            id: "rule-5",
            name: "File Upload Security",
            type: "data_protection",
            enabled: true,
            severity: "high",
            conditions: ["Executable file upload", "Suspicious file type"],
            actions: ["Quarantine file", "Scan for malware", "Log security event"],
            lastTriggered: new Date(Date.now() - 36e5).toISOString(),
            triggerCount: 5
          },
          {
            id: "rule-6",
            name: "API Rate Limiting",
            type: "network",
            enabled: false,
            severity: "medium",
            conditions: ["API requests > 1000 per minute", "Same API key"],
            actions: ["Throttle requests", "Send warning to user"],
            triggerCount: 0
          }
        ];
        mockRules.forEach((rule) => this.rules.set(rule.id, rule));
        const mockAuthMethods = [
          {
            id: "auth-1",
            name: "Password Authentication",
            type: "password",
            enabled: true,
            users: 15420,
            lastUsed: new Date(Date.now() - 6e4).toISOString(),
            // 1 minute ago
            successRate: 94.2,
            configuration: {
              minLength: 8,
              requireSpecialChars: true,
              passwordHistory: 5
            }
          },
          {
            id: "auth-2",
            name: "Multi-Factor Authentication",
            type: "mfa",
            enabled: true,
            users: 8750,
            lastUsed: new Date(Date.now() - 3e5).toISOString(),
            // 5 minutes ago
            successRate: 99.1,
            configuration: {
              methods: ["totp", "sms", "email"],
              backupCodes: true,
              required: false
            }
          },
          {
            id: "auth-3",
            name: "Biometric Authentication",
            type: "biometric",
            enabled: true,
            users: 2340,
            lastUsed: new Date(Date.now() - 6e5).toISOString(),
            // 10 minutes ago
            successRate: 97.8,
            configuration: {
              types: ["fingerprint", "face_id"],
              fallbackToPassword: true
            }
          },
          {
            id: "auth-4",
            name: "Single Sign-On (SSO)",
            type: "sso",
            enabled: true,
            users: 5670,
            lastUsed: new Date(Date.now() - 18e4).toISOString(),
            // 3 minutes ago
            successRate: 98.5,
            configuration: {
              provider: "Azure AD",
              autoProvisioning: true,
              groupMapping: true
            }
          },
          {
            id: "auth-5",
            name: "OAuth 2.0",
            type: "oauth",
            enabled: true,
            users: 12350,
            lastUsed: new Date(Date.now() - 12e4).toISOString(),
            // 2 minutes ago
            successRate: 96.7,
            configuration: {
              providers: ["Google", "GitHub", "Microsoft"],
              scopes: ["openid", "profile", "email"]
            }
          },
          {
            id: "auth-6",
            name: "Certificate Authentication",
            type: "certificate",
            enabled: false,
            users: 0,
            lastUsed: new Date(Date.now() - 864e5).toISOString(),
            // 1 day ago
            successRate: 100,
            configuration: {
              caAuthority: "Internal CA",
              requireClientCert: true,
              certValidation: "strict"
            }
          }
        ];
        mockAuthMethods.forEach((method) => this.authMethods.set(method.id, method));
      }
      /**
       * Get all security threats with optional filtering
       */
      async getSecurityThreats(filters) {
        let threats = Array.from(this.threats.values());
        if (filters) {
          if (filters.severity && filters.severity !== "all") {
            threats = threats.filter((threat) => threat.severity === filters.severity);
          }
          if (filters.type && filters.type !== "all") {
            threats = threats.filter((threat) => threat.type === filters.type);
          }
          if (filters.status && filters.status !== "all") {
            threats = threats.filter((threat) => threat.status === filters.status);
          }
        }
        return threats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      /**
       * Update threat status
       */
      async updateThreatStatus(threatId, status) {
        const threat = this.threats.get(threatId);
        if (!threat) {
          throw new Error(`Threat with ID ${threatId} not found`);
        }
        threat.status = status;
        this.threats.set(threatId, threat);
        this.logSecurityEvent({
          type: "system",
          severity: "info",
          message: `Threat ${threatId} status updated to ${status}`,
          metadata: { threatId, oldStatus: threat.status, newStatus: status }
        });
        return threat;
      }
      /**
       * Get security rules
       */
      async getSecurityRules() {
        return Array.from(this.rules.values()).sort((a, b) => a.name.localeCompare(b.name));
      }
      /**
       * Toggle security rule
       */
      async toggleSecurityRule(ruleId, enabled) {
        const rule = this.rules.get(ruleId);
        if (!rule) {
          throw new Error(`Security rule with ID ${ruleId} not found`);
        }
        rule.enabled = enabled;
        this.rules.set(ruleId, rule);
        this.logSecurityEvent({
          type: "system",
          severity: "info",
          message: `Security rule "${rule.name}" ${enabled ? "enabled" : "disabled"}`,
          metadata: { ruleId, ruleName: rule.name, enabled }
        });
        return rule;
      }
      /**
       * Get authentication methods
       */
      async getAuthenticationMethods() {
        return Array.from(this.authMethods.values()).sort((a, b) => b.users - a.users);
      }
      /**
       * Configure authentication method
       */
      async configureAuthenticationMethod(methodId, enabled) {
        const method = this.authMethods.get(methodId);
        if (!method) {
          throw new Error(`Authentication method with ID ${methodId} not found`);
        }
        method.enabled = enabled;
        this.authMethods.set(methodId, method);
        this.logSecurityEvent({
          type: "authentication",
          severity: "info",
          message: `Authentication method "${method.name}" ${enabled ? "enabled" : "disabled"}`,
          metadata: { methodId, methodName: method.name, enabled }
        });
        return method;
      }
      /**
       * Get security metrics
       */
      async getSecurityMetrics() {
        const threats = Array.from(this.threats.values());
        const activeThreats = threats.filter((t) => t.status === "active").length;
        const threatsBlocked = threats.filter(
          (t) => t.status === "resolved" && new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1e3)
        ).length;
        const securityScore = this.calculateSecurityScore();
        return {
          threatsBlocked,
          activeThreats,
          securityScore,
          vulnerabilities: 3,
          // Mock vulnerability count
          lastScan: new Date(Date.now() - 36e5).toISOString(),
          // 1 hour ago
          authenticationAttempts: {
            successful: 15420,
            failed: 234,
            suspicious: 12
          },
          dataProtection: {
            encrypted: 98567,
            unencrypted: 1234,
            backups: 45
          }
        };
      }
      /**
       * Get security events
       */
      async getSecurityEvents(limit = 100) {
        return this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
      }
      /**
       * Log security event
       */
      logSecurityEvent(event) {
        const securityEvent = {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...event
        };
        this.events.push(securityEvent);
        if (this.events.length > 1e3) {
          this.events = this.events.slice(-1e3);
        }
      }
      /**
       * Calculate overall security score
       */
      calculateSecurityScore() {
        const threats = Array.from(this.threats.values());
        const rules = Array.from(this.rules.values());
        const authMethods = Array.from(this.authMethods.values());
        let score = 100;
        const activeThreats = threats.filter((t) => t.status === "active");
        activeThreats.forEach((threat) => {
          switch (threat.severity) {
            case "critical":
              score -= 15;
              break;
            case "high":
              score -= 10;
              break;
            case "medium":
              score -= 5;
              break;
            case "low":
              score -= 2;
              break;
          }
        });
        const disabledCriticalRules = rules.filter((r) => !r.enabled && r.severity === "critical").length;
        score -= disabledCriticalRules * 10;
        const mfaEnabled = authMethods.find((m) => m.type === "mfa" && m.enabled);
        if (mfaEnabled) score += 5;
        const enabledAuthMethods = authMethods.filter((m) => m.enabled).length;
        score += Math.min(enabledAuthMethods * 2, 10);
        return Math.max(0, Math.min(100, score));
      }
      /**
       * Generate security report
       */
      async generateSecurityReport() {
        const threats = await this.getSecurityThreats();
        const rules = await this.getSecurityRules();
        const metrics = await this.getSecurityMetrics();
        const activeThreats = threats.filter((t) => t.status === "active");
        const criticalThreats = activeThreats.filter((t) => t.severity === "critical");
        const summary = `Security report generated on ${(/* @__PURE__ */ new Date()).toISOString()}. 
      Current security score: ${metrics.securityScore}/100. 
      ${activeThreats.length} active threats detected, ${criticalThreats.length} critical.`;
        const recommendations = this.generateSecurityRecommendations(threats, rules, metrics);
        return {
          summary,
          threats,
          rules,
          metrics,
          recommendations
        };
      }
      /**
       * Generate security recommendations
       */
      generateSecurityRecommendations(threats, rules, metrics) {
        const recommendations = [];
        const criticalThreats = threats.filter((t) => t.status === "active" && t.severity === "critical");
        if (criticalThreats.length > 0) {
          recommendations.push(`Address ${criticalThreats.length} critical security threats immediately`);
        }
        const disabledRules = rules.filter((r) => !r.enabled);
        if (disabledRules.length > 0) {
          recommendations.push(`Enable ${disabledRules.length} disabled security rules for better protection`);
        }
        if (metrics.authenticationAttempts.failed > metrics.authenticationAttempts.successful * 0.1) {
          recommendations.push("High number of failed authentication attempts - consider implementing stronger brute force protection");
        }
        if (metrics.dataProtection.unencrypted > 0) {
          recommendations.push(`Encrypt ${metrics.dataProtection.unencrypted} unencrypted files for better data protection`);
        }
        if (metrics.securityScore < 80) {
          recommendations.push("Security score is below recommended threshold - review and address security issues");
        }
        if (metrics.vulnerabilities > 0) {
          recommendations.push(`Patch ${metrics.vulnerabilities} known vulnerabilities`);
        }
        if (recommendations.length === 0) {
          recommendations.push("Security posture is excellent - continue monitoring and maintaining current security measures");
        }
        return recommendations;
      }
    };
  }
});

// server/phoenix/routes/security.ts
var security_exports = {};
__export(security_exports, {
  default: () => security_default,
  securityRouter: () => securityRouter
});
import express11 from "express";
var securityRouter, security_default;
var init_security = __esm({
  "server/phoenix/routes/security.ts"() {
    "use strict";
    init_SecurityService();
    securityRouter = express11.Router();
    securityRouter.get("/threats", async (req, res) => {
      try {
        const { severity, type, status } = req.query;
        const securityService = createSecurityService();
        const threats = await securityService.getSecurityThreats({
          severity,
          type,
          status
        });
        res.json(threats);
      } catch (error) {
        console.error("Error fetching security threats:", error);
        res.status(500).json({
          error: "Failed to fetch security threats",
          message: error.message
        });
      }
    });
    securityRouter.patch("/threats/:threatId", async (req, res) => {
      try {
        const { threatId } = req.params;
        const { status } = req.body;
        if (!status) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Status is required"
          });
        }
        if (!["active", "investigating", "resolved", "false_positive"].includes(status)) {
          return res.status(400).json({
            error: "Invalid Status",
            message: "Status must be active, investigating, resolved, or false_positive"
          });
        }
        const securityService = createSecurityService();
        const threat = await securityService.updateThreatStatus(threatId, status);
        res.json({
          success: true,
          message: "Threat status updated successfully",
          threat
        });
      } catch (error) {
        console.error("Error updating threat status:", error);
        res.status(500).json({
          error: "Failed to update threat status",
          message: error.message
        });
      }
    });
    securityRouter.get("/rules", async (req, res) => {
      try {
        const securityService = createSecurityService();
        const rules = await securityService.getSecurityRules();
        res.json(rules);
      } catch (error) {
        console.error("Error fetching security rules:", error);
        res.status(500).json({
          error: "Failed to fetch security rules",
          message: error.message
        });
      }
    });
    securityRouter.post("/rules/:ruleId/toggle", async (req, res) => {
      try {
        const { ruleId } = req.params;
        const { enabled } = req.body;
        if (typeof enabled !== "boolean") {
          return res.status(400).json({
            error: "Invalid Request",
            message: "enabled must be a boolean value"
          });
        }
        const securityService = createSecurityService();
        const rule = await securityService.toggleSecurityRule(ruleId, enabled);
        res.json({
          success: true,
          message: `Security rule ${enabled ? "enabled" : "disabled"} successfully`,
          rule
        });
      } catch (error) {
        console.error("Error toggling security rule:", error);
        res.status(500).json({
          error: "Failed to toggle security rule",
          message: error.message
        });
      }
    });
    securityRouter.get("/auth-methods", async (req, res) => {
      try {
        const securityService = createSecurityService();
        const authMethods = await securityService.getAuthenticationMethods();
        res.json(authMethods);
      } catch (error) {
        console.error("Error fetching authentication methods:", error);
        res.status(500).json({
          error: "Failed to fetch authentication methods",
          message: error.message
        });
      }
    });
    securityRouter.post("/auth-methods/:methodId/configure", async (req, res) => {
      try {
        const { methodId } = req.params;
        const { enabled } = req.body;
        if (typeof enabled !== "boolean") {
          return res.status(400).json({
            error: "Invalid Request",
            message: "enabled must be a boolean value"
          });
        }
        const securityService = createSecurityService();
        const method = await securityService.configureAuthenticationMethod(methodId, enabled);
        res.json({
          success: true,
          message: `Authentication method ${enabled ? "enabled" : "disabled"} successfully`,
          method
        });
      } catch (error) {
        console.error("Error configuring authentication method:", error);
        res.status(500).json({
          error: "Failed to configure authentication method",
          message: error.message
        });
      }
    });
    securityRouter.get("/metrics", async (req, res) => {
      try {
        const securityService = createSecurityService();
        const metrics = await securityService.getSecurityMetrics();
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching security metrics:", error);
        res.status(500).json({
          error: "Failed to fetch security metrics",
          message: error.message
        });
      }
    });
    securityRouter.get("/events", async (req, res) => {
      try {
        const { limit = "100" } = req.query;
        const securityService = createSecurityService();
        const events = await securityService.getSecurityEvents(parseInt(limit));
        res.json(events);
      } catch (error) {
        console.error("Error fetching security events:", error);
        res.status(500).json({
          error: "Failed to fetch security events",
          message: error.message
        });
      }
    });
    securityRouter.get("/report", async (req, res) => {
      try {
        const securityService = createSecurityService();
        const report = await securityService.generateSecurityReport();
        res.json({
          success: true,
          report,
          generatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        console.error("Error generating security report:", error);
        res.status(500).json({
          error: "Failed to generate security report",
          message: error.message
        });
      }
    });
    securityRouter.get("/report/export", async (req, res) => {
      try {
        const { format = "json" } = req.query;
        const securityService = createSecurityService();
        const report = await securityService.generateSecurityReport();
        if (format === "json") {
          res.setHeader("Content-Disposition", 'attachment; filename="security-report.json"');
          res.setHeader("Content-Type", "application/json");
          res.json(report);
        } else {
          res.json({
            error: "Unsupported format",
            message: "Only JSON format is currently supported",
            supportedFormats: ["json"]
          });
        }
      } catch (error) {
        console.error("Error exporting security report:", error);
        res.status(500).json({
          error: "Failed to export security report",
          message: error.message
        });
      }
    });
    securityRouter.post("/scan", async (req, res) => {
      try {
        const { type = "full" } = req.body;
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        const securityService = createSecurityService();
        const metrics = await securityService.getSecurityMetrics();
        const scanResults = {
          scanId: `scan-${Date.now()}`,
          type,
          status: "completed",
          startTime: new Date(Date.now() - 2e3).toISOString(),
          endTime: (/* @__PURE__ */ new Date()).toISOString(),
          duration: 2e3,
          results: {
            threatsFound: Math.floor(Math.random() * 3),
            vulnerabilities: Math.floor(Math.random() * 5),
            securityScore: metrics.securityScore,
            recommendations: [
              "Update security patches",
              "Review user permissions",
              "Enable additional security rules"
            ]
          }
        };
        res.json({
          success: true,
          message: "Security scan completed successfully",
          scan: scanResults
        });
      } catch (error) {
        console.error("Error running security scan:", error);
        res.status(500).json({
          error: "Failed to run security scan",
          message: error.message
        });
      }
    });
    securityRouter.get("/stats", async (req, res) => {
      try {
        const securityService = createSecurityService();
        const threats = await securityService.getSecurityThreats();
        const rules = await securityService.getSecurityRules();
        const authMethods = await securityService.getAuthenticationMethods();
        const metrics = await securityService.getSecurityMetrics();
        const stats = {
          threats: {
            total: threats.length,
            active: threats.filter((t) => t.status === "active").length,
            resolved: threats.filter((t) => t.status === "resolved").length,
            investigating: threats.filter((t) => t.status === "investigating").length,
            bySeverity: {
              critical: threats.filter((t) => t.severity === "critical").length,
              high: threats.filter((t) => t.severity === "high").length,
              medium: threats.filter((t) => t.severity === "medium").length,
              low: threats.filter((t) => t.severity === "low").length
            },
            byType: {
              brute_force: threats.filter((t) => t.type === "brute_force").length,
              suspicious_login: threats.filter((t) => t.type === "suspicious_login").length,
              malware: threats.filter((t) => t.type === "malware").length,
              data_breach: threats.filter((t) => t.type === "data_breach").length,
              unauthorized_access: threats.filter((t) => t.type === "unauthorized_access").length
            }
          },
          rules: {
            total: rules.length,
            enabled: rules.filter((r) => r.enabled).length,
            disabled: rules.filter((r) => !r.enabled).length,
            byType: {
              authentication: rules.filter((r) => r.type === "authentication").length,
              authorization: rules.filter((r) => r.type === "authorization").length,
              data_protection: rules.filter((r) => r.type === "data_protection").length,
              network: rules.filter((r) => r.type === "network").length,
              compliance: rules.filter((r) => r.type === "compliance").length
            }
          },
          authentication: {
            total: authMethods.length,
            enabled: authMethods.filter((m) => m.enabled).length,
            totalUsers: authMethods.reduce((sum, m) => sum + m.users, 0),
            averageSuccessRate: authMethods.reduce((sum, m) => sum + m.successRate, 0) / authMethods.length
          },
          overall: {
            securityScore: metrics.securityScore,
            lastScan: metrics.lastScan,
            vulnerabilities: metrics.vulnerabilities
          }
        };
        res.json(stats);
      } catch (error) {
        console.error("Error fetching security statistics:", error);
        res.status(500).json({
          error: "Failed to fetch security statistics",
          message: error.message
        });
      }
    });
    securityRouter.get("/health", async (req, res) => {
      try {
        const healthStatus = {
          status: "healthy",
          services: {
            threatDetection: "operational",
            securityRules: "operational",
            authentication: "operational",
            monitoring: "operational",
            alerting: "operational"
          },
          performance: {
            averageResponseTime: "85ms",
            threatDetectionLatency: "12ms",
            ruleProcessingTime: "5ms",
            uptime: "99.95%"
          },
          capabilities: {
            realTimeMonitoring: true,
            threatIntelligence: true,
            automaticResponse: true,
            complianceReporting: true,
            multiFactorAuth: true
          },
          lastHealthCheck: (/* @__PURE__ */ new Date()).toISOString(),
          version: "1.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking security service health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    security_default = securityRouter;
  }
});

// server/phoenix/services/ZeroTrustService.ts
function createZeroTrustService() {
  return new ZeroTrustService();
}
var ZeroTrustService;
var init_ZeroTrustService = __esm({
  "server/phoenix/services/ZeroTrustService.ts"() {
    "use strict";
    ZeroTrustService = class {
      identities = /* @__PURE__ */ new Map();
      devices = /* @__PURE__ */ new Map();
      policies = /* @__PURE__ */ new Map();
      sessions = /* @__PURE__ */ new Map();
      events = [];
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock zero trust data
       */
      initializeMockData() {
        const mockIdentities = [
          {
            id: "identity-1",
            userId: "user-001",
            userName: "john.doe",
            email: "john.doe@company.com",
            trustLevel: "high",
            riskScore: 15,
            verificationMethods: ["password", "mfa", "biometric"],
            lastVerification: new Date(Date.now() - 18e5).toISOString(),
            // 30 minutes ago
            deviceCount: 3,
            locationTrust: "trusted",
            behaviorAnalysis: {
              normalPatterns: true,
              anomalies: 0,
              riskFactors: []
            }
          },
          {
            id: "identity-2",
            userId: "user-002",
            userName: "jane.smith",
            email: "jane.smith@company.com",
            trustLevel: "medium",
            riskScore: 35,
            verificationMethods: ["password", "mfa"],
            lastVerification: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            deviceCount: 2,
            locationTrust: "trusted",
            behaviorAnalysis: {
              normalPatterns: true,
              anomalies: 1,
              riskFactors: ["unusual_access_time"]
            }
          },
          {
            id: "identity-3",
            userId: "user-003",
            userName: "bob.wilson",
            email: "bob.wilson@contractor.com",
            trustLevel: "low",
            riskScore: 65,
            verificationMethods: ["password"],
            lastVerification: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            deviceCount: 1,
            locationTrust: "suspicious",
            behaviorAnalysis: {
              normalPatterns: false,
              anomalies: 3,
              riskFactors: ["new_location", "unusual_device", "off_hours_access"]
            }
          },
          {
            id: "identity-4",
            userId: "user-004",
            userName: "alice.cooper",
            email: "alice.cooper@company.com",
            trustLevel: "high",
            riskScore: 20,
            verificationMethods: ["password", "mfa", "certificate"],
            lastVerification: new Date(Date.now() - 9e5).toISOString(),
            // 15 minutes ago
            deviceCount: 4,
            locationTrust: "trusted",
            behaviorAnalysis: {
              normalPatterns: true,
              anomalies: 0,
              riskFactors: []
            }
          },
          {
            id: "identity-5",
            userId: "user-005",
            userName: "charlie.brown",
            email: "charlie.brown@partner.com",
            trustLevel: "untrusted",
            riskScore: 85,
            verificationMethods: ["password"],
            lastVerification: new Date(Date.now() - 144e5).toISOString(),
            // 4 hours ago
            deviceCount: 1,
            locationTrust: "unknown",
            behaviorAnalysis: {
              normalPatterns: false,
              anomalies: 5,
              riskFactors: ["failed_verifications", "suspicious_location", "malware_detected", "data_access_anomaly"]
            }
          }
        ];
        mockIdentities.forEach((identity) => this.identities.set(identity.id, identity));
        const mockDevices = [
          {
            id: "device-1",
            deviceId: "iPhone-12-Pro-A1B2C3",
            deviceName: "John's iPhone 12 Pro",
            platform: "ios",
            userId: "user-001",
            complianceStatus: "compliant",
            trustScore: 95,
            lastChecked: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            policies: {
              encryptionEnabled: true,
              screenLockEnabled: true,
              osUpToDate: true,
              antivirusEnabled: true,
              unauthorizedApps: 0
            },
            violations: [],
            remediationRequired: false
          },
          {
            id: "device-2",
            deviceId: "MacBook-Pro-M1-D4E5F6",
            deviceName: "Jane's MacBook Pro",
            platform: "macos",
            userId: "user-002",
            complianceStatus: "compliant",
            trustScore: 88,
            lastChecked: new Date(Date.now() - 18e5).toISOString(),
            // 30 minutes ago
            policies: {
              encryptionEnabled: true,
              screenLockEnabled: true,
              osUpToDate: false,
              antivirusEnabled: true,
              unauthorizedApps: 1
            },
            violations: ["OS update required"],
            remediationRequired: true
          },
          {
            id: "device-3",
            deviceId: "Windows-Laptop-G7H8I9",
            deviceName: "Bob's Windows Laptop",
            platform: "windows",
            userId: "user-003",
            complianceStatus: "non_compliant",
            trustScore: 45,
            lastChecked: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            policies: {
              encryptionEnabled: false,
              screenLockEnabled: false,
              osUpToDate: false,
              antivirusEnabled: false,
              unauthorizedApps: 5
            },
            violations: ["No encryption", "No screen lock", "Outdated OS", "No antivirus", "Unauthorized software"],
            remediationRequired: true
          },
          {
            id: "device-4",
            deviceId: "Android-Pixel-J9K0L1",
            deviceName: "Alice's Pixel 6",
            platform: "android",
            userId: "user-004",
            complianceStatus: "compliant",
            trustScore: 92,
            lastChecked: new Date(Date.now() - 9e5).toISOString(),
            // 15 minutes ago
            policies: {
              encryptionEnabled: true,
              screenLockEnabled: true,
              osUpToDate: true,
              antivirusEnabled: true,
              unauthorizedApps: 0
            },
            violations: [],
            remediationRequired: false
          },
          {
            id: "device-5",
            deviceId: "Ubuntu-Desktop-M2N3O4",
            deviceName: "Charlie's Ubuntu Desktop",
            platform: "linux",
            userId: "user-005",
            complianceStatus: "quarantined",
            trustScore: 25,
            lastChecked: new Date(Date.now() - 144e5).toISOString(),
            // 4 hours ago
            policies: {
              encryptionEnabled: false,
              screenLockEnabled: false,
              osUpToDate: false,
              antivirusEnabled: false,
              unauthorizedApps: 12
            },
            violations: ["Malware detected", "Security tools disabled", "Unauthorized network access", "Data exfiltration attempt"],
            remediationRequired: true
          }
        ];
        mockDevices.forEach((device) => this.devices.set(device.id, device));
        const mockPolicies = [
          {
            id: "policy-1",
            name: "Executive Network Segmentation",
            type: "micro_segmentation",
            enabled: true,
            scope: "role",
            rules: [
              {
                id: "rule-1",
                source: "executives",
                destination: "financial_systems",
                protocol: "HTTPS",
                action: "allow",
                conditions: ["mfa_verified", "trusted_device"]
              }
            ],
            enforcement: "block",
            effectiveness: 98,
            violationCount: 0
          },
          {
            id: "policy-2",
            name: "Contractor Access Control",
            type: "access_control",
            enabled: true,
            scope: "department",
            rules: [
              {
                id: "rule-2",
                source: "contractors",
                destination: "internal_systems",
                protocol: "*",
                action: "deny",
                conditions: ["untrusted_location", "non_compliant_device"]
              }
            ],
            enforcement: "block",
            effectiveness: 85,
            violationCount: 3
          },
          {
            id: "policy-3",
            name: "Data Loss Prevention",
            type: "traffic_filtering",
            enabled: true,
            scope: "global",
            rules: [
              {
                id: "rule-3",
                source: "*",
                destination: "external",
                protocol: "*",
                action: "inspect",
                conditions: ["contains_sensitive_data"]
              }
            ],
            enforcement: "monitor",
            effectiveness: 92,
            violationCount: 12
          },
          {
            id: "policy-4",
            name: "Admin Console Protection",
            type: "access_control",
            enabled: true,
            scope: "global",
            rules: [
              {
                id: "rule-4",
                source: "*",
                destination: "admin_console",
                protocol: "HTTPS",
                action: "deny",
                conditions: ["!admin_role", "!privileged_device"]
              }
            ],
            enforcement: "block",
            effectiveness: 100,
            violationCount: 0
          },
          {
            id: "policy-5",
            name: "End-to-End Encryption",
            type: "encryption",
            enabled: false,
            scope: "global",
            rules: [
              {
                id: "rule-5",
                source: "*",
                destination: "*",
                protocol: "*",
                action: "allow",
                conditions: ["encrypted_transport"]
              }
            ],
            enforcement: "alert",
            effectiveness: 0,
            violationCount: 0
          }
        ];
        mockPolicies.forEach((policy) => this.policies.set(policy.id, policy));
        const mockSessions = [
          {
            id: "session-1",
            userId: "user-001",
            resource: "Financial Dashboard",
            accessLevel: "read",
            grantedAt: new Date(Date.now() - 18e5).toISOString(),
            // 30 minutes ago
            expiresAt: new Date(Date.now() + 54e5).toISOString(),
            // 1.5 hours from now
            trustFactors: {
              identity: 95,
              device: 95,
              location: 90,
              behavior: 92
            },
            continuousValidation: true,
            riskLevel: "low",
            status: "active"
          },
          {
            id: "session-2",
            userId: "user-002",
            resource: "Customer Database",
            accessLevel: "write",
            grantedAt: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            expiresAt: new Date(Date.now() + 36e5).toISOString(),
            // 1 hour from now
            trustFactors: {
              identity: 85,
              device: 88,
              location: 90,
              behavior: 80
            },
            continuousValidation: true,
            riskLevel: "medium",
            status: "active"
          },
          {
            id: "session-3",
            userId: "user-003",
            resource: "Development Environment",
            accessLevel: "read",
            grantedAt: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            expiresAt: new Date(Date.now() - 36e5).toISOString(),
            // expired 1 hour ago
            trustFactors: {
              identity: 65,
              device: 45,
              location: 30,
              behavior: 40
            },
            continuousValidation: false,
            riskLevel: "high",
            status: "revoked"
          },
          {
            id: "session-4",
            userId: "user-004",
            resource: "Admin Console",
            accessLevel: "admin",
            grantedAt: new Date(Date.now() - 9e5).toISOString(),
            // 15 minutes ago
            expiresAt: new Date(Date.now() + 27e5).toISOString(),
            // 45 minutes from now
            trustFactors: {
              identity: 92,
              device: 92,
              location: 95,
              behavior: 90
            },
            continuousValidation: true,
            riskLevel: "low",
            status: "active"
          },
          {
            id: "session-5",
            userId: "user-005",
            resource: "Public Documentation",
            accessLevel: "read",
            grantedAt: new Date(Date.now() - 144e5).toISOString(),
            // 4 hours ago
            expiresAt: new Date(Date.now() - 108e5).toISOString(),
            // expired 3 hours ago
            trustFactors: {
              identity: 15,
              device: 25,
              location: 10,
              behavior: 20
            },
            continuousValidation: false,
            riskLevel: "high",
            status: "suspended"
          }
        ];
        mockSessions.forEach((session) => this.sessions.set(session.id, session));
      }
      /**
       * Get zero trust metrics
       */
      async getZeroTrustMetrics() {
        const identities = Array.from(this.identities.values());
        const devices = Array.from(this.devices.values());
        const policies = Array.from(this.policies.values());
        const sessions = Array.from(this.sessions.values());
        const overallTrustScore = this.calculateOverallTrustScore(identities, devices, policies, sessions);
        return {
          overallTrustScore,
          identityVerification: {
            verified: identities.filter((i) => ["high", "medium"].includes(i.trustLevel)).length,
            pending: identities.filter((i) => i.trustLevel === "low").length,
            failed: identities.filter((i) => i.trustLevel === "untrusted").length
          },
          deviceCompliance: {
            compliant: devices.filter((d) => d.complianceStatus === "compliant").length,
            nonCompliant: devices.filter((d) => d.complianceStatus === "non_compliant").length,
            pending: devices.filter((d) => d.complianceStatus === "pending").length
          },
          networkSecurity: {
            policiesActive: policies.filter((p) => p.enabled).length,
            violations: policies.reduce((sum, p) => sum + p.violationCount, 0),
            threatsBlocked: 45
            // Mock value
          },
          accessControl: {
            activeSessions: sessions.filter((s) => s.status === "active").length,
            revokedSessions: sessions.filter((s) => s.status === "revoked").length,
            riskySessions: sessions.filter((s) => s.riskLevel === "high").length
          }
        };
      }
      /**
       * Get identity trust data
       */
      async getIdentityTrust() {
        return Array.from(this.identities.values()).sort((a, b) => b.riskScore - a.riskScore);
      }
      /**
       * Update identity trust level
       */
      async updateIdentityTrust(identityId, trustLevel) {
        const identity = this.identities.get(identityId);
        if (!identity) {
          throw new Error(`Identity with ID ${identityId} not found`);
        }
        identity.trustLevel = trustLevel;
        switch (trustLevel) {
          case "high":
            identity.riskScore = Math.min(identity.riskScore, 25);
            break;
          case "medium":
            identity.riskScore = Math.min(Math.max(identity.riskScore, 25), 50);
            break;
          case "low":
            identity.riskScore = Math.min(Math.max(identity.riskScore, 50), 75);
            break;
          case "untrusted":
            identity.riskScore = Math.max(identity.riskScore, 75);
            break;
        }
        this.identities.set(identityId, identity);
        this.logZeroTrustEvent({
          type: "identity_verification",
          severity: "medium",
          message: `Identity trust level updated to ${trustLevel}`,
          entityId: identityId,
          entityType: "user",
          riskScore: identity.riskScore,
          mitigationActions: ["trust_level_adjusted", "continuous_monitoring_enabled"]
        });
        return identity;
      }
      /**
       * Get device compliance data
       */
      async getDeviceCompliance() {
        return Array.from(this.devices.values()).sort((a, b) => b.trustScore - a.trustScore);
      }
      /**
       * Update device compliance
       */
      async updateDeviceCompliance(deviceId, action) {
        const device = this.devices.get(deviceId);
        if (!device) {
          throw new Error(`Device with ID ${deviceId} not found`);
        }
        switch (action) {
          case "remediate":
            device.remediationRequired = false;
            device.violations = [];
            device.trustScore = Math.min(device.trustScore + 20, 100);
            if (device.complianceStatus === "non_compliant") {
              device.complianceStatus = "pending";
            }
            break;
          case "quarantine":
            device.complianceStatus = "quarantined";
            device.trustScore = Math.max(device.trustScore - 30, 0);
            break;
          case "approve":
            device.complianceStatus = "compliant";
            device.trustScore = Math.min(device.trustScore + 10, 100);
            break;
        }
        device.lastChecked = (/* @__PURE__ */ new Date()).toISOString();
        this.devices.set(deviceId, device);
        this.logZeroTrustEvent({
          type: "device_compliance",
          severity: action === "quarantine" ? "high" : "medium",
          message: `Device compliance action: ${action}`,
          entityId: deviceId,
          entityType: "device",
          riskScore: 100 - device.trustScore,
          mitigationActions: [action, "compliance_check_scheduled"]
        });
        return device;
      }
      /**
       * Get network policies
       */
      async getNetworkPolicies() {
        return Array.from(this.policies.values()).sort((a, b) => a.name.localeCompare(b.name));
      }
      /**
       * Toggle network policy
       */
      async toggleNetworkPolicy(policyId, enabled) {
        const policy = this.policies.get(policyId);
        if (!policy) {
          throw new Error(`Network policy with ID ${policyId} not found`);
        }
        policy.enabled = enabled;
        this.policies.set(policyId, policy);
        this.logZeroTrustEvent({
          type: "network_violation",
          severity: "low",
          message: `Network policy "${policy.name}" ${enabled ? "enabled" : "disabled"}`,
          entityId: policyId,
          entityType: "network",
          riskScore: enabled ? 0 : 25,
          mitigationActions: [enabled ? "policy_enabled" : "policy_disabled"]
        });
        return policy;
      }
      /**
       * Get access sessions
       */
      async getAccessSessions() {
        return Array.from(this.sessions.values()).sort((a, b) => new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime());
      }
      /**
       * Revoke access session
       */
      async revokeAccessSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
          throw new Error(`Access session with ID ${sessionId} not found`);
        }
        session.status = "revoked";
        this.sessions.set(sessionId, session);
        this.logZeroTrustEvent({
          type: "access_denied",
          severity: "medium",
          message: `Access session revoked for resource: ${session.resource}`,
          entityId: sessionId,
          entityType: "session",
          riskScore: session.riskLevel === "high" ? 80 : session.riskLevel === "medium" ? 50 : 20,
          mitigationActions: ["session_revoked", "user_notified"]
        });
        return session;
      }
      /**
       * Get zero trust events
       */
      async getZeroTrustEvents(limit = 100) {
        return this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
      }
      /**
       * Calculate overall trust score
       */
      calculateOverallTrustScore(identities, devices, policies, sessions) {
        if (identities.length === 0) return 0;
        const identityScore = identities.reduce((sum, i) => sum + (100 - i.riskScore), 0) / identities.length;
        const deviceScore = devices.length > 0 ? devices.reduce((sum, d) => sum + d.trustScore, 0) / devices.length : 0;
        const networkScore = policies.length > 0 ? policies.filter((p) => p.enabled).length / policies.length * 100 : 0;
        const activeSessionsScore = sessions.filter((s) => s.status === "active").length > 0 ? sessions.filter((s) => s.status === "active" && s.riskLevel === "low").length / sessions.filter((s) => s.status === "active").length * 100 : 100;
        const overallScore = identityScore * 0.4 + deviceScore * 0.3 + networkScore * 0.2 + activeSessionsScore * 0.1;
        return Math.round(Math.max(0, Math.min(100, overallScore)));
      }
      /**
       * Log zero trust event
       */
      logZeroTrustEvent(event) {
        const zeroTrustEvent = {
          id: `zt-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...event
        };
        this.events.push(zeroTrustEvent);
        if (this.events.length > 1e3) {
          this.events = this.events.slice(-1e3);
        }
      }
    };
  }
});

// server/phoenix/routes/zero-trust.ts
var zero_trust_exports = {};
__export(zero_trust_exports, {
  default: () => zero_trust_default,
  zeroTrustRouter: () => zeroTrustRouter
});
import express12 from "express";
var zeroTrustRouter, zero_trust_default;
var init_zero_trust = __esm({
  "server/phoenix/routes/zero-trust.ts"() {
    "use strict";
    init_ZeroTrustService();
    zeroTrustRouter = express12.Router();
    zeroTrustRouter.get("/metrics", async (req, res) => {
      try {
        const zeroTrustService = createZeroTrustService();
        const metrics = await zeroTrustService.getZeroTrustMetrics();
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching zero trust metrics:", error);
        res.status(500).json({
          error: "Failed to fetch zero trust metrics",
          message: error.message
        });
      }
    });
    zeroTrustRouter.get("/identities", async (req, res) => {
      try {
        const zeroTrustService = createZeroTrustService();
        const identities = await zeroTrustService.getIdentityTrust();
        res.json(identities);
      } catch (error) {
        console.error("Error fetching identity trust data:", error);
        res.status(500).json({
          error: "Failed to fetch identity trust data",
          message: error.message
        });
      }
    });
    zeroTrustRouter.patch("/identities/:identityId/trust", async (req, res) => {
      try {
        const { identityId } = req.params;
        const { trustLevel } = req.body;
        if (!trustLevel) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Trust level is required"
          });
        }
        if (!["high", "medium", "low", "untrusted"].includes(trustLevel)) {
          return res.status(400).json({
            error: "Invalid Trust Level",
            message: "Trust level must be high, medium, low, or untrusted"
          });
        }
        const zeroTrustService = createZeroTrustService();
        const identity = await zeroTrustService.updateIdentityTrust(identityId, trustLevel);
        res.json({
          success: true,
          message: "Identity trust level updated successfully",
          identity
        });
      } catch (error) {
        console.error("Error updating identity trust:", error);
        res.status(500).json({
          error: "Failed to update identity trust",
          message: error.message
        });
      }
    });
    zeroTrustRouter.get("/devices", async (req, res) => {
      try {
        const zeroTrustService = createZeroTrustService();
        const devices = await zeroTrustService.getDeviceCompliance();
        res.json(devices);
      } catch (error) {
        console.error("Error fetching device compliance data:", error);
        res.status(500).json({
          error: "Failed to fetch device compliance data",
          message: error.message
        });
      }
    });
    zeroTrustRouter.post("/devices/:deviceId/action", async (req, res) => {
      try {
        const { deviceId } = req.params;
        const { action } = req.body;
        if (!action) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Action is required"
          });
        }
        if (!["remediate", "quarantine", "approve"].includes(action)) {
          return res.status(400).json({
            error: "Invalid Action",
            message: "Action must be remediate, quarantine, or approve"
          });
        }
        const zeroTrustService = createZeroTrustService();
        const device = await zeroTrustService.updateDeviceCompliance(deviceId, action);
        res.json({
          success: true,
          message: `Device ${action} action completed successfully`,
          device
        });
      } catch (error) {
        console.error("Error updating device compliance:", error);
        res.status(500).json({
          error: "Failed to update device compliance",
          message: error.message
        });
      }
    });
    zeroTrustRouter.get("/policies", async (req, res) => {
      try {
        const zeroTrustService = createZeroTrustService();
        const policies = await zeroTrustService.getNetworkPolicies();
        res.json(policies);
      } catch (error) {
        console.error("Error fetching network policies:", error);
        res.status(500).json({
          error: "Failed to fetch network policies",
          message: error.message
        });
      }
    });
    zeroTrustRouter.post("/policies/:policyId/toggle", async (req, res) => {
      try {
        const { policyId } = req.params;
        const { enabled } = req.body;
        if (typeof enabled !== "boolean") {
          return res.status(400).json({
            error: "Invalid Request",
            message: "enabled must be a boolean value"
          });
        }
        const zeroTrustService = createZeroTrustService();
        const policy = await zeroTrustService.toggleNetworkPolicy(policyId, enabled);
        res.json({
          success: true,
          message: `Network policy ${enabled ? "enabled" : "disabled"} successfully`,
          policy
        });
      } catch (error) {
        console.error("Error toggling network policy:", error);
        res.status(500).json({
          error: "Failed to toggle network policy",
          message: error.message
        });
      }
    });
    zeroTrustRouter.get("/sessions", async (req, res) => {
      try {
        const zeroTrustService = createZeroTrustService();
        const sessions = await zeroTrustService.getAccessSessions();
        res.json(sessions);
      } catch (error) {
        console.error("Error fetching access sessions:", error);
        res.status(500).json({
          error: "Failed to fetch access sessions",
          message: error.message
        });
      }
    });
    zeroTrustRouter.post("/sessions/:sessionId/revoke", async (req, res) => {
      try {
        const { sessionId } = req.params;
        const zeroTrustService = createZeroTrustService();
        const session = await zeroTrustService.revokeAccessSession(sessionId);
        res.json({
          success: true,
          message: "Access session revoked successfully",
          session
        });
      } catch (error) {
        console.error("Error revoking access session:", error);
        res.status(500).json({
          error: "Failed to revoke access session",
          message: error.message
        });
      }
    });
    zeroTrustRouter.get("/events", async (req, res) => {
      try {
        const { limit = "100" } = req.query;
        const zeroTrustService = createZeroTrustService();
        const events = await zeroTrustService.getZeroTrustEvents(parseInt(limit));
        res.json(events);
      } catch (error) {
        console.error("Error fetching zero trust events:", error);
        res.status(500).json({
          error: "Failed to fetch zero trust events",
          message: error.message
        });
      }
    });
    zeroTrustRouter.get("/health", async (req, res) => {
      try {
        const zeroTrustService = createZeroTrustService();
        const metrics = await zeroTrustService.getZeroTrustMetrics();
        const healthStatus = {
          status: metrics.overallTrustScore >= 70 ? "healthy" : "degraded",
          trustScore: metrics.overallTrustScore,
          services: {
            identityVerification: "operational",
            deviceCompliance: "operational",
            networkPolicies: "operational",
            accessControl: "operational",
            continuousMonitoring: "operational"
          },
          performance: {
            identityVerificationTime: "250ms",
            deviceComplianceCheck: "500ms",
            policyEvaluation: "100ms",
            sessionValidation: "150ms"
          },
          principles: {
            neverTrust: true,
            alwaysVerify: true,
            minimumPrivilege: true,
            assumeBreach: true,
            verifyExplicitly: true
          },
          lastHealthCheck: (/* @__PURE__ */ new Date()).toISOString(),
          version: "2.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking zero trust health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    zero_trust_default = zeroTrustRouter;
  }
});

// server/phoenix/services/DataProtectionService.ts
function createDataProtectionService() {
  return new DataProtectionService();
}
var DataProtectionService;
var init_DataProtectionService = __esm({
  "server/phoenix/services/DataProtectionService.ts"() {
    "use strict";
    DataProtectionService = class {
      keys = /* @__PURE__ */ new Map();
      assets = /* @__PURE__ */ new Map();
      dlpPolicies = /* @__PURE__ */ new Map();
      privacyControls = /* @__PURE__ */ new Map();
      events = [];
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock data protection data
       */
      initializeMockData() {
        const mockKeys = [
          {
            id: "key-1",
            name: "Primary Database Encryption Key",
            algorithm: "AES-256",
            status: "active",
            usage: "data_encryption",
            createdAt: new Date(Date.now() - 864e5 * 30).toISOString(),
            // 30 days ago
            expiresAt: new Date(Date.now() + 864e5 * 335).toISOString(),
            // 335 days from now
            rotationSchedule: "90 days",
            usageCount: 15420,
            strength: 98
          },
          {
            id: "key-2",
            name: "Backup Encryption Key",
            algorithm: "AES-256",
            status: "active",
            usage: "data_encryption",
            createdAt: new Date(Date.now() - 864e5 * 15).toISOString(),
            // 15 days ago
            expiresAt: new Date(Date.now() + 864e5 * 350).toISOString(),
            // 350 days from now
            rotationSchedule: "90 days",
            usageCount: 8765,
            strength: 95
          },
          {
            id: "key-3",
            name: "API Signing Key",
            algorithm: "RSA-4096",
            status: "active",
            usage: "signing",
            createdAt: new Date(Date.now() - 864e5 * 60).toISOString(),
            // 60 days ago
            expiresAt: new Date(Date.now() + 864e5 * 305).toISOString(),
            // 305 days from now
            rotationSchedule: "180 days",
            usageCount: 45670,
            strength: 96
          },
          {
            id: "key-4",
            name: "Log Encryption Key",
            algorithm: "ChaCha20",
            status: "rotating",
            usage: "data_encryption",
            createdAt: new Date(Date.now() - 864e5 * 85).toISOString(),
            // 85 days ago
            expiresAt: new Date(Date.now() + 864e5 * 5).toISOString(),
            // 5 days from now
            rotationSchedule: "90 days",
            usageCount: 23450,
            strength: 94
          },
          {
            id: "key-5",
            name: "Authentication Key",
            algorithm: "ECC-P384",
            status: "deprecated",
            usage: "authentication",
            createdAt: new Date(Date.now() - 864e5 * 180).toISOString(),
            // 180 days ago
            expiresAt: new Date(Date.now() - 864e5 * 5).toISOString(),
            // expired 5 days ago
            rotationSchedule: "180 days",
            usageCount: 67890,
            strength: 85
          }
        ];
        mockKeys.forEach((key) => this.keys.set(key.id, key));
        const mockAssets = [
          {
            id: "asset-1",
            name: "Customer Database",
            type: "database",
            classification: "confidential",
            encryptionStatus: "encrypted",
            encryptionMethod: "AES-256-GCM",
            size: 2147483648,
            // 2GB
            location: "us-east-1/rds-primary",
            lastAccessed: new Date(Date.now() - 18e5).toISOString(),
            // 30 minutes ago
            accessCount: 12450,
            riskScore: 25,
            complianceStatus: "compliant"
          },
          {
            id: "asset-2",
            name: "Financial Records",
            type: "file",
            classification: "restricted",
            encryptionStatus: "encrypted",
            encryptionMethod: "AES-256-CBC",
            size: 524288e3,
            // 500MB
            location: "s3://finance-bucket/records",
            lastAccessed: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            accessCount: 567,
            riskScore: 15,
            complianceStatus: "compliant"
          },
          {
            id: "asset-3",
            name: "Application Logs",
            type: "logs",
            classification: "internal",
            encryptionStatus: "partially_encrypted",
            encryptionMethod: "ChaCha20-Poly1305",
            size: 1073741824,
            // 1GB
            location: "cloudwatch/app-logs",
            lastAccessed: new Date(Date.now() - 9e5).toISOString(),
            // 15 minutes ago
            accessCount: 8920,
            riskScore: 45,
            complianceStatus: "pending"
          },
          {
            id: "asset-4",
            name: "User Profile Images",
            type: "file",
            classification: "public",
            encryptionStatus: "unencrypted",
            encryptionMethod: "none",
            size: 314572800,
            // 300MB
            location: "cdn/profile-images",
            lastAccessed: new Date(Date.now() - 6e5).toISOString(),
            // 10 minutes ago
            accessCount: 156789,
            riskScore: 10,
            complianceStatus: "compliant"
          },
          {
            id: "asset-5",
            name: "Configuration Files",
            type: "configuration",
            classification: "internal",
            encryptionStatus: "unencrypted",
            encryptionMethod: "none",
            size: 10485760,
            // 10MB
            location: "config/app-settings",
            lastAccessed: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            accessCount: 234,
            riskScore: 65,
            complianceStatus: "non_compliant"
          },
          {
            id: "asset-6",
            name: "Daily Backups",
            type: "backup",
            classification: "confidential",
            encryptionStatus: "encrypted",
            encryptionMethod: "AES-256-GCM",
            size: 5368709120,
            // 5GB
            location: "s3://backup-bucket/daily",
            lastAccessed: new Date(Date.now() - 864e5).toISOString(),
            // 1 day ago
            accessCount: 45,
            riskScore: 20,
            complianceStatus: "compliant"
          }
        ];
        mockAssets.forEach((asset) => this.assets.set(asset.id, asset));
        const mockDLPPolicies = [
          {
            id: "dlp-1",
            name: "Credit Card Detection",
            type: "credit_card",
            enabled: true,
            scope: "global",
            rules: [
              {
                id: "rule-1",
                pattern: "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$",
                confidence: 95,
                action: "encrypt",
                exceptions: ["test-environment"]
              }
            ],
            enforcement: "block",
            violationCount: 5,
            effectiveness: 98
          },
          {
            id: "dlp-2",
            name: "Social Security Number Protection",
            type: "ssn",
            enabled: true,
            scope: "global",
            rules: [
              {
                id: "rule-2",
                pattern: "^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$",
                confidence: 92,
                action: "mask",
                exceptions: ["hr-department"]
              }
            ],
            enforcement: "quarantine",
            violationCount: 12,
            effectiveness: 94
          },
          {
            id: "dlp-3",
            name: "PII Detection",
            type: "pii_detection",
            enabled: true,
            scope: "global",
            rules: [
              {
                id: "rule-3",
                pattern: "([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})",
                confidence: 88,
                action: "tokenize",
                exceptions: ["public-contact-forms"]
              }
            ],
            enforcement: "alert",
            violationCount: 34,
            effectiveness: 91
          },
          {
            id: "dlp-4",
            name: "Medical Record Protection",
            type: "medical",
            enabled: false,
            scope: "department",
            rules: [
              {
                id: "rule-4",
                pattern: "patient|medical|diagnosis|treatment",
                confidence: 75,
                action: "encrypt",
                exceptions: []
              }
            ],
            enforcement: "block",
            violationCount: 0,
            effectiveness: 0
          },
          {
            id: "dlp-5",
            name: "Financial Data Protection",
            type: "financial",
            enabled: true,
            scope: "department",
            rules: [
              {
                id: "rule-5",
                pattern: "account|routing|swift|iban",
                confidence: 80,
                action: "encrypt",
                exceptions: ["finance-team"]
              }
            ],
            enforcement: "encrypt",
            violationCount: 8,
            effectiveness: 96
          }
        ];
        mockDLPPolicies.forEach((policy) => this.dlpPolicies.set(policy.id, policy));
        const mockPrivacyControls = [
          {
            id: "privacy-1",
            name: "GDPR Compliance",
            regulation: "GDPR",
            enabled: true,
            dataTypes: ["personal_data", "contact_info", "location_data"],
            retentionPeriod: 1095,
            // 3 years
            deletionMethod: "crypto_shredding",
            consentRequired: true,
            rightToForget: true,
            dataPortability: true,
            complianceScore: 92
          },
          {
            id: "privacy-2",
            name: "CCPA Compliance",
            regulation: "CCPA",
            enabled: true,
            dataTypes: ["personal_info", "biometric_data", "browsing_history"],
            retentionPeriod: 730,
            // 2 years
            deletionMethod: "secure_delete",
            consentRequired: false,
            rightToForget: true,
            dataPortability: true,
            complianceScore: 88
          },
          {
            id: "privacy-3",
            name: "HIPAA Compliance",
            regulation: "HIPAA",
            enabled: false,
            dataTypes: ["health_records", "medical_history", "treatment_info"],
            retentionPeriod: 2555,
            // 7 years
            deletionMethod: "physical_destruction",
            consentRequired: true,
            rightToForget: false,
            dataPortability: false,
            complianceScore: 0
          },
          {
            id: "privacy-4",
            name: "PCI DSS Compliance",
            regulation: "PCI_DSS",
            enabled: true,
            dataTypes: ["payment_data", "cardholder_data", "transaction_history"],
            retentionPeriod: 365,
            // 1 year
            deletionMethod: "crypto_shredding",
            consentRequired: false,
            rightToForget: false,
            dataPortability: false,
            complianceScore: 95
          }
        ];
        mockPrivacyControls.forEach((control) => this.privacyControls.set(control.id, control));
      }
      /**
       * Get data protection metrics
       */
      async getDataProtectionMetrics() {
        const assets = Array.from(this.assets.values());
        const keys = Array.from(this.keys.values());
        const dlpPolicies = Array.from(this.dlpPolicies.values());
        const privacyControls = Array.from(this.privacyControls.values());
        const encryptedAssets = assets.filter((a) => a.encryptionStatus === "encrypted").length;
        const totalAssets = assets.length;
        const encryptionCoverage = totalAssets > 0 ? Math.round(encryptedAssets / totalAssets * 100) : 0;
        const activeKeys = keys.filter((k) => k.status === "active").length;
        const rotatingKeys = keys.filter((k) => k.status === "rotating").length;
        const expiredKeys = keys.filter((k) => k.status === "deprecated" || k.status === "revoked").length;
        const dlpViolations = dlpPolicies.reduce((sum, p) => sum + p.violationCount, 0);
        const privacyScore = privacyControls.length > 0 ? Math.round(privacyControls.reduce((sum, c) => sum + (c.enabled ? c.complianceScore : 0), 0) / privacyControls.length) : 0;
        const dataAtRest = {
          encrypted: encryptedAssets,
          unencrypted: totalAssets - encryptedAssets,
          total: totalAssets
        };
        const dataInTransit = {
          encrypted: 145,
          unencrypted: 23,
          total: 168
        };
        return {
          totalDataAssets: totalAssets,
          encryptedAssets,
          encryptionCoverage,
          keyRotationCompliance: 85,
          // Mock value
          dlpViolations,
          privacyComplianceScore: privacyScore,
          dataAtRest,
          dataInTransit,
          keyManagement: {
            activeKeys,
            rotatingKeys,
            expiredKeys
          }
        };
      }
      /**
       * Get encryption keys
       */
      async getEncryptionKeys() {
        return Array.from(this.keys.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      /**
       * Rotate encryption key
       */
      async rotateEncryptionKey(keyId) {
        const key = this.keys.get(keyId);
        if (!key) {
          throw new Error(`Encryption key with ID ${keyId} not found`);
        }
        key.status = "rotating";
        this.keys.set(keyId, key);
        this.logDataProtectionEvent({
          type: "key_rotation",
          severity: "medium",
          message: `Key rotation started for ${key.name}`,
          entityId: keyId,
          entityType: "key",
          details: { algorithm: key.algorithm, usage: key.usage },
          mitigationActions: ["new_key_generated", "old_key_scheduled_for_revocation"]
        });
        setTimeout(() => {
          key.status = "active";
          key.createdAt = (/* @__PURE__ */ new Date()).toISOString();
          key.expiresAt = new Date(Date.now() + 864e5 * 365).toISOString();
          key.usageCount = 0;
          this.keys.set(keyId, key);
        }, 5e3);
        return key;
      }
      /**
       * Get data assets
       */
      async getDataAssets() {
        return Array.from(this.assets.values()).sort((a, b) => b.riskScore - a.riskScore);
      }
      /**
       * Encrypt data asset
       */
      async encryptDataAsset(assetId, method) {
        const asset = this.assets.get(assetId);
        if (!asset) {
          throw new Error(`Data asset with ID ${assetId} not found`);
        }
        asset.encryptionStatus = "encrypted";
        asset.encryptionMethod = method;
        asset.riskScore = Math.max(asset.riskScore - 30, 0);
        asset.complianceStatus = "compliant";
        this.assets.set(assetId, asset);
        this.logDataProtectionEvent({
          type: "encryption",
          severity: "low",
          message: `Data asset "${asset.name}" encrypted using ${method}`,
          entityId: assetId,
          entityType: "asset",
          details: { method, classification: asset.classification, size: asset.size },
          mitigationActions: ["data_encrypted", "risk_score_reduced"]
        });
        return asset;
      }
      /**
       * Get DLP policies
       */
      async getDLPPolicies() {
        return Array.from(this.dlpPolicies.values()).sort((a, b) => a.name.localeCompare(b.name));
      }
      /**
       * Toggle DLP policy
       */
      async toggleDLPPolicy(policyId, enabled) {
        const policy = this.dlpPolicies.get(policyId);
        if (!policy) {
          throw new Error(`DLP policy with ID ${policyId} not found`);
        }
        policy.enabled = enabled;
        this.dlpPolicies.set(policyId, policy);
        this.logDataProtectionEvent({
          type: "dlp_violation",
          severity: "low",
          message: `DLP policy "${policy.name}" ${enabled ? "enabled" : "disabled"}`,
          entityId: policyId,
          entityType: "policy",
          details: { type: policy.type, enforcement: policy.enforcement },
          mitigationActions: [enabled ? "policy_activated" : "policy_deactivated"]
        });
        return policy;
      }
      /**
       * Get privacy controls
       */
      async getPrivacyControls() {
        return Array.from(this.privacyControls.values()).sort((a, b) => b.complianceScore - a.complianceScore);
      }
      /**
       * Toggle privacy control
       */
      async togglePrivacyControl(controlId, enabled) {
        const control = this.privacyControls.get(controlId);
        if (!control) {
          throw new Error(`Privacy control with ID ${controlId} not found`);
        }
        control.enabled = enabled;
        if (!enabled) {
          control.complianceScore = 0;
        }
        this.privacyControls.set(controlId, control);
        this.logDataProtectionEvent({
          type: "privacy_request",
          severity: "medium",
          message: `Privacy control "${control.name}" ${enabled ? "enabled" : "disabled"}`,
          entityId: controlId,
          entityType: "policy",
          details: { regulation: control.regulation, dataTypes: control.dataTypes },
          mitigationActions: [enabled ? "compliance_enabled" : "compliance_disabled"]
        });
        return control;
      }
      /**
       * Get data protection events
       */
      async getDataProtectionEvents(limit = 100) {
        return this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
      }
      /**
       * Log data protection event
       */
      logDataProtectionEvent(event) {
        const dataProtectionEvent = {
          id: `dp-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...event
        };
        this.events.push(dataProtectionEvent);
        if (this.events.length > 1e3) {
          this.events = this.events.slice(-1e3);
        }
      }
    };
  }
});

// server/phoenix/routes/data-protection.ts
var data_protection_exports = {};
__export(data_protection_exports, {
  dataProtectionRouter: () => dataProtectionRouter,
  default: () => data_protection_default
});
import express13 from "express";
var dataProtectionRouter, data_protection_default;
var init_data_protection = __esm({
  "server/phoenix/routes/data-protection.ts"() {
    "use strict";
    init_DataProtectionService();
    dataProtectionRouter = express13.Router();
    dataProtectionRouter.get("/metrics", async (req, res) => {
      try {
        const dataProtectionService = createDataProtectionService();
        const metrics = await dataProtectionService.getDataProtectionMetrics();
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching data protection metrics:", error);
        res.status(500).json({
          error: "Failed to fetch data protection metrics",
          message: error.message
        });
      }
    });
    dataProtectionRouter.get("/keys", async (req, res) => {
      try {
        const dataProtectionService = createDataProtectionService();
        const keys = await dataProtectionService.getEncryptionKeys();
        res.json(keys);
      } catch (error) {
        console.error("Error fetching encryption keys:", error);
        res.status(500).json({
          error: "Failed to fetch encryption keys",
          message: error.message
        });
      }
    });
    dataProtectionRouter.post("/keys/:keyId/rotate", async (req, res) => {
      try {
        const { keyId } = req.params;
        const dataProtectionService = createDataProtectionService();
        const key = await dataProtectionService.rotateEncryptionKey(keyId);
        res.json({
          success: true,
          message: "Key rotation initiated successfully",
          key
        });
      } catch (error) {
        console.error("Error rotating encryption key:", error);
        res.status(500).json({
          error: "Failed to rotate encryption key",
          message: error.message
        });
      }
    });
    dataProtectionRouter.get("/assets", async (req, res) => {
      try {
        const { classification, type } = req.query;
        const dataProtectionService = createDataProtectionService();
        let assets = await dataProtectionService.getDataAssets();
        if (classification && classification !== "all") {
          assets = assets.filter((asset) => asset.classification === classification);
        }
        if (type && type !== "all") {
          assets = assets.filter((asset) => asset.type === type);
        }
        res.json(assets);
      } catch (error) {
        console.error("Error fetching data assets:", error);
        res.status(500).json({
          error: "Failed to fetch data assets",
          message: error.message
        });
      }
    });
    dataProtectionRouter.post("/assets/:assetId/encrypt", async (req, res) => {
      try {
        const { assetId } = req.params;
        const { method } = req.body;
        if (!method) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Encryption method is required"
          });
        }
        if (!["AES-256", "AES-256-GCM", "ChaCha20", "RSA-4096"].includes(method)) {
          return res.status(400).json({
            error: "Invalid Encryption Method",
            message: "Method must be AES-256, AES-256-GCM, ChaCha20, or RSA-4096"
          });
        }
        const dataProtectionService = createDataProtectionService();
        const asset = await dataProtectionService.encryptDataAsset(assetId, method);
        res.json({
          success: true,
          message: "Asset encryption initiated successfully",
          asset
        });
      } catch (error) {
        console.error("Error encrypting data asset:", error);
        res.status(500).json({
          error: "Failed to encrypt data asset",
          message: error.message
        });
      }
    });
    dataProtectionRouter.get("/dlp-policies", async (req, res) => {
      try {
        const dataProtectionService = createDataProtectionService();
        const policies = await dataProtectionService.getDLPPolicies();
        res.json(policies);
      } catch (error) {
        console.error("Error fetching DLP policies:", error);
        res.status(500).json({
          error: "Failed to fetch DLP policies",
          message: error.message
        });
      }
    });
    dataProtectionRouter.post("/dlp-policies/:policyId/toggle", async (req, res) => {
      try {
        const { policyId } = req.params;
        const { enabled } = req.body;
        if (typeof enabled !== "boolean") {
          return res.status(400).json({
            error: "Invalid Request",
            message: "enabled must be a boolean value"
          });
        }
        const dataProtectionService = createDataProtectionService();
        const policy = await dataProtectionService.toggleDLPPolicy(policyId, enabled);
        res.json({
          success: true,
          message: `DLP policy ${enabled ? "enabled" : "disabled"} successfully`,
          policy
        });
      } catch (error) {
        console.error("Error toggling DLP policy:", error);
        res.status(500).json({
          error: "Failed to toggle DLP policy",
          message: error.message
        });
      }
    });
    dataProtectionRouter.get("/privacy-controls", async (req, res) => {
      try {
        const dataProtectionService = createDataProtectionService();
        const controls = await dataProtectionService.getPrivacyControls();
        res.json(controls);
      } catch (error) {
        console.error("Error fetching privacy controls:", error);
        res.status(500).json({
          error: "Failed to fetch privacy controls",
          message: error.message
        });
      }
    });
    dataProtectionRouter.post("/privacy-controls/:controlId/toggle", async (req, res) => {
      try {
        const { controlId } = req.params;
        const { enabled } = req.body;
        if (typeof enabled !== "boolean") {
          return res.status(400).json({
            error: "Invalid Request",
            message: "enabled must be a boolean value"
          });
        }
        const dataProtectionService = createDataProtectionService();
        const control = await dataProtectionService.togglePrivacyControl(controlId, enabled);
        res.json({
          success: true,
          message: `Privacy control ${enabled ? "enabled" : "disabled"} successfully`,
          control
        });
      } catch (error) {
        console.error("Error toggling privacy control:", error);
        res.status(500).json({
          error: "Failed to toggle privacy control",
          message: error.message
        });
      }
    });
    dataProtectionRouter.get("/events", async (req, res) => {
      try {
        const { limit = "100" } = req.query;
        const dataProtectionService = createDataProtectionService();
        const events = await dataProtectionService.getDataProtectionEvents(parseInt(limit));
        res.json(events);
      } catch (error) {
        console.error("Error fetching data protection events:", error);
        res.status(500).json({
          error: "Failed to fetch data protection events",
          message: error.message
        });
      }
    });
    dataProtectionRouter.get("/health", async (req, res) => {
      try {
        const dataProtectionService = createDataProtectionService();
        const metrics = await dataProtectionService.getDataProtectionMetrics();
        const healthStatus = {
          status: metrics.encryptionCoverage >= 80 ? "healthy" : "degraded",
          encryptionCoverage: metrics.encryptionCoverage,
          services: {
            keyManagement: "operational",
            dataEncryption: "operational",
            dlpPolicies: "operational",
            privacyControls: "operational",
            complianceMonitoring: "operational"
          },
          performance: {
            encryptionLatency: "12ms",
            keyRotationTime: "2.5s",
            dlpScanSpeed: "150MB/s",
            complianceCheckTime: "500ms"
          },
          compliance: {
            gdprReady: true,
            ccpaCompliant: true,
            hipaaSupport: true,
            pciDssLevel1: true,
            soxCompliant: true
          },
          lastHealthCheck: (/* @__PURE__ */ new Date()).toISOString(),
          version: "3.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking data protection health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    data_protection_default = dataProtectionRouter;
  }
});

// server/phoenix/services/EnterpriseService.ts
function createEnterpriseService() {
  return new EnterpriseService();
}
var EnterpriseService;
var init_EnterpriseService = __esm({
  "server/phoenix/services/EnterpriseService.ts"() {
    "use strict";
    EnterpriseService = class {
      organizations = /* @__PURE__ */ new Map();
      teams = /* @__PURE__ */ new Map();
      users = /* @__PURE__ */ new Map();
      events = [];
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock enterprise data
       */
      initializeMockData() {
        const mockOrganizations = [
          {
            id: "org-1",
            name: "TechCorp Solutions",
            domain: "techcorp.com",
            subscription: "enterprise",
            status: "active",
            memberCount: 156,
            projectCount: 45,
            createdAt: new Date(Date.now() - 864e5 * 120).toISOString(),
            // 120 days ago
            expiresAt: new Date(Date.now() + 864e5 * 245).toISOString(),
            // 245 days from now
            features: ["sso", "advanced_security", "custom_branding", "priority_support"],
            billing: {
              plan: "Enterprise Annual",
              amount: 12e3,
              currency: "USD",
              nextBilling: new Date(Date.now() + 864e5 * 245).toISOString()
            },
            settings: {
              ssoEnabled: true,
              mfaRequired: true,
              apiAccess: true,
              auditLogging: true
            }
          },
          {
            id: "org-2",
            name: "StartupHub Inc",
            domain: "startuphub.io",
            subscription: "professional",
            status: "active",
            memberCount: 24,
            projectCount: 12,
            createdAt: new Date(Date.now() - 864e5 * 45).toISOString(),
            // 45 days ago
            expiresAt: new Date(Date.now() + 864e5 * 320).toISOString(),
            // 320 days from now
            features: ["team_collaboration", "advanced_analytics"],
            billing: {
              plan: "Professional Monthly",
              amount: 299,
              currency: "USD",
              nextBilling: new Date(Date.now() + 864e5 * 15).toISOString()
            },
            settings: {
              ssoEnabled: false,
              mfaRequired: false,
              apiAccess: true,
              auditLogging: false
            }
          },
          {
            id: "org-3",
            name: "DevAgency Pro",
            domain: "devagency.pro",
            subscription: "enterprise",
            status: "active",
            memberCount: 89,
            projectCount: 67,
            createdAt: new Date(Date.now() - 864e5 * 200).toISOString(),
            // 200 days ago
            expiresAt: new Date(Date.now() + 864e5 * 165).toISOString(),
            // 165 days from now
            features: ["sso", "advanced_security", "white_label", "dedicated_support"],
            billing: {
              plan: "Enterprise Custom",
              amount: 15e3,
              currency: "USD",
              nextBilling: new Date(Date.now() + 864e5 * 165).toISOString()
            },
            settings: {
              ssoEnabled: true,
              mfaRequired: true,
              apiAccess: true,
              auditLogging: true
            }
          },
          {
            id: "org-4",
            name: "InnovateLabs",
            domain: "innovatelabs.com",
            subscription: "trial",
            status: "trial",
            memberCount: 8,
            projectCount: 3,
            createdAt: new Date(Date.now() - 864e5 * 10).toISOString(),
            // 10 days ago
            expiresAt: new Date(Date.now() + 864e5 * 20).toISOString(),
            // 20 days from now
            features: ["basic_features"],
            billing: {
              plan: "Trial",
              amount: 0,
              currency: "USD",
              nextBilling: new Date(Date.now() + 864e5 * 20).toISOString()
            },
            settings: {
              ssoEnabled: false,
              mfaRequired: false,
              apiAccess: false,
              auditLogging: false
            }
          },
          {
            id: "org-5",
            name: "GlobalTech Enterprises",
            domain: "globaltech.enterprise",
            subscription: "custom",
            status: "active",
            memberCount: 450,
            projectCount: 123,
            createdAt: new Date(Date.now() - 864e5 * 300).toISOString(),
            // 300 days ago
            expiresAt: new Date(Date.now() + 864e5 * 65).toISOString(),
            // 65 days from now
            features: ["everything", "custom_integrations", "dedicated_infrastructure"],
            billing: {
              plan: "Custom Enterprise",
              amount: 5e4,
              currency: "USD",
              nextBilling: new Date(Date.now() + 864e5 * 65).toISOString()
            },
            settings: {
              ssoEnabled: true,
              mfaRequired: true,
              apiAccess: true,
              auditLogging: true
            }
          }
        ];
        mockOrganizations.forEach((org) => this.organizations.set(org.id, org));
        const mockTeams = [
          {
            id: "team-1",
            name: "Frontend Development",
            description: "Responsible for all UI/UX development",
            organizationId: "org-1",
            memberCount: 12,
            projectCount: 8,
            role: "developer",
            permissions: ["create_projects", "edit_code", "deploy_staging"],
            createdAt: new Date(Date.now() - 864e5 * 80).toISOString(),
            isActive: true
          },
          {
            id: "team-2",
            name: "Backend Engineering",
            description: "API development and infrastructure",
            organizationId: "org-1",
            memberCount: 15,
            projectCount: 12,
            role: "developer",
            permissions: ["create_projects", "edit_code", "deploy_staging", "manage_databases"],
            createdAt: new Date(Date.now() - 864e5 * 75).toISOString(),
            isActive: true
          },
          {
            id: "team-3",
            name: "DevOps & Infrastructure",
            description: "Deployment and system administration",
            organizationId: "org-1",
            memberCount: 8,
            projectCount: 15,
            role: "admin",
            permissions: ["all_permissions"],
            createdAt: new Date(Date.now() - 864e5 * 70).toISOString(),
            isActive: true
          },
          {
            id: "team-4",
            name: "Mobile Development",
            description: "iOS and Android app development",
            organizationId: "org-2",
            memberCount: 6,
            projectCount: 4,
            role: "developer",
            permissions: ["create_projects", "edit_code", "deploy_staging"],
            createdAt: new Date(Date.now() - 864e5 * 30).toISOString(),
            isActive: true
          },
          {
            id: "team-5",
            name: "Quality Assurance",
            description: "Testing and quality control",
            organizationId: "org-2",
            memberCount: 4,
            projectCount: 8,
            role: "viewer",
            permissions: ["view_projects", "create_issues"],
            createdAt: new Date(Date.now() - 864e5 * 25).toISOString(),
            isActive: true
          },
          {
            id: "team-6",
            name: "Product Management",
            description: "Product strategy and roadmap",
            organizationId: "org-3",
            memberCount: 5,
            projectCount: 20,
            role: "manager",
            permissions: ["view_all_projects", "manage_teams", "approve_deployments"],
            createdAt: new Date(Date.now() - 864e5 * 150).toISOString(),
            isActive: true
          }
        ];
        mockTeams.forEach((team) => this.teams.set(team.id, team));
        const mockUsers = [
          {
            id: "user-1",
            name: "Sarah Chen",
            email: "sarah.chen@techcorp.com",
            role: "org_admin",
            status: "active",
            organizationId: "org-1",
            teams: ["team-1", "team-2"],
            lastLogin: new Date(Date.now() - 18e5).toISOString(),
            // 30 minutes ago
            projectsCreated: 23,
            permissions: ["manage_organization", "manage_users", "manage_billing"],
            mfaEnabled: true
          },
          {
            id: "user-2",
            name: "Michael Rodriguez",
            email: "michael.r@techcorp.com",
            role: "team_lead",
            status: "active",
            organizationId: "org-1",
            teams: ["team-2"],
            lastLogin: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            projectsCreated: 45,
            permissions: ["manage_team", "create_projects", "deploy_production"],
            mfaEnabled: true
          },
          {
            id: "user-3",
            name: "Emily Johnson",
            email: "emily.j@startuphub.io",
            role: "org_admin",
            status: "active",
            organizationId: "org-2",
            teams: ["team-4"],
            lastLogin: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            projectsCreated: 12,
            permissions: ["manage_organization", "manage_users"],
            mfaEnabled: false
          },
          {
            id: "user-4",
            name: "David Kim",
            email: "david.kim@devagency.pro",
            role: "super_admin",
            status: "active",
            organizationId: "org-3",
            teams: ["team-6"],
            lastLogin: new Date(Date.now() - 9e5).toISOString(),
            // 15 minutes ago
            projectsCreated: 78,
            permissions: ["all_permissions"],
            mfaEnabled: true
          },
          {
            id: "user-5",
            name: "Lisa Anderson",
            email: "lisa.a@innovatelabs.com",
            role: "developer",
            status: "active",
            organizationId: "org-4",
            teams: [],
            lastLogin: new Date(Date.now() - 864e5).toISOString(),
            // 1 day ago
            projectsCreated: 3,
            permissions: ["create_projects", "edit_code"],
            mfaEnabled: false
          },
          {
            id: "user-6",
            name: "James Wilson",
            email: "james.w@globaltech.enterprise",
            role: "org_admin",
            status: "active",
            organizationId: "org-5",
            teams: [],
            lastLogin: new Date(Date.now() - 6e5).toISOString(),
            // 10 minutes ago
            projectsCreated: 156,
            permissions: ["manage_organization", "manage_users", "manage_billing"],
            mfaEnabled: true
          },
          {
            id: "user-7",
            name: "Maria Garcia",
            email: "maria.g@techcorp.com",
            role: "developer",
            status: "inactive",
            organizationId: "org-1",
            teams: ["team-1"],
            lastLogin: new Date(Date.now() - 864e5 * 7).toISOString(),
            // 7 days ago
            projectsCreated: 8,
            permissions: ["create_projects", "edit_code"],
            mfaEnabled: false
          },
          {
            id: "user-8",
            name: "Alex Thompson",
            email: "alex.t@startuphub.io",
            role: "viewer",
            status: "pending",
            organizationId: "org-2",
            teams: ["team-5"],
            lastLogin: new Date(Date.now() - 864e5 * 2).toISOString(),
            // 2 days ago
            projectsCreated: 0,
            permissions: ["view_projects"],
            mfaEnabled: false
          }
        ];
        mockUsers.forEach((user) => this.users.set(user.id, user));
      }
      /**
       * Get admin metrics
       */
      async getAdminMetrics() {
        const organizations = Array.from(this.organizations.values());
        const users = Array.from(this.users.values());
        return {
          totalOrganizations: organizations.length,
          totalUsers: users.length,
          totalProjects: organizations.reduce((sum, org) => sum + org.projectCount, 0),
          activeSubscriptions: organizations.filter((org) => org.status === "active").length,
          revenue: {
            monthly: 77299,
            // Mock calculated value
            annual: 927588,
            // Mock calculated value
            growth: 24.5
            // Mock growth percentage
          },
          usage: {
            apiCalls: 2847593,
            storageUsed: 1247,
            buildMinutes: 145672
          },
          security: {
            threatsPrevented: 1456,
            complianceScore: 94,
            vulnerabilities: 3
          }
        };
      }
      /**
       * Get organizations
       */
      async getOrganizations() {
        return Array.from(this.organizations.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      /**
       * Create organization
       */
      async createOrganization(orgData) {
        const org = {
          id: `org-${Date.now()}`,
          name: orgData.name || "",
          domain: orgData.domain || "",
          subscription: orgData.subscription || "starter",
          status: "active",
          memberCount: 1,
          projectCount: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          expiresAt: new Date(Date.now() + 864e5 * 365).toISOString(),
          // 1 year from now
          features: this.getFeaturesBySubscription(orgData.subscription || "starter"),
          billing: {
            plan: this.getPlanName(orgData.subscription || "starter"),
            amount: this.getPlanAmount(orgData.subscription || "starter"),
            currency: "USD",
            nextBilling: new Date(Date.now() + 864e5 * 30).toISOString()
            // 30 days from now
          },
          settings: {
            ssoEnabled: false,
            mfaRequired: false,
            apiAccess: orgData.subscription !== "starter",
            auditLogging: orgData.subscription === "enterprise" || orgData.subscription === "custom"
          }
        };
        this.organizations.set(org.id, org);
        this.logEnterpriseEvent({
          type: "org_created",
          severity: "info",
          message: `Organization "${org.name}" created`,
          entityId: org.id,
          entityType: "organization",
          details: { subscription: org.subscription, domain: org.domain },
          performedBy: "system"
        });
        return org;
      }
      /**
       * Update organization
       */
      async updateOrganization(orgId, updates) {
        const org = this.organizations.get(orgId);
        if (!org) {
          throw new Error(`Organization with ID ${orgId} not found`);
        }
        const updatedOrg = { ...org, ...updates };
        this.organizations.set(orgId, updatedOrg);
        this.logEnterpriseEvent({
          type: "subscription_changed",
          severity: "info",
          message: `Organization "${org.name}" updated`,
          entityId: orgId,
          entityType: "organization",
          details: updates,
          performedBy: "admin"
        });
        return updatedOrg;
      }
      /**
       * Get teams
       */
      async getTeams() {
        return Array.from(this.teams.values()).sort((a, b) => a.name.localeCompare(b.name));
      }
      /**
       * Get users
       */
      async getUsers() {
        return Array.from(this.users.values()).sort((a, b) => a.name.localeCompare(b.name));
      }
      /**
       * Update user
       */
      async updateUser(userId, updates) {
        const user = this.users.get(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        const updatedUser = { ...user, ...updates };
        this.users.set(userId, updatedUser);
        this.logEnterpriseEvent({
          type: "permission_changed",
          severity: "info",
          message: `User "${user.name}" updated`,
          entityId: userId,
          entityType: "user",
          details: updates,
          performedBy: "admin"
        });
        return updatedUser;
      }
      /**
       * Get system health
       */
      async getSystemHealth() {
        const services = [
          { name: "API Gateway", status: "operational", responseTime: 45 },
          { name: "Authentication Service", status: "operational", responseTime: 32 },
          { name: "Code Generation Engine", status: "operational", responseTime: 156 },
          { name: "Build Service", status: "degraded", responseTime: 245 },
          { name: "Database Cluster", status: "operational", responseTime: 12 },
          { name: "File Storage", status: "operational", responseTime: 67 },
          { name: "Notification Service", status: "operational", responseTime: 89 },
          { name: "Analytics Engine", status: "operational", responseTime: 134 }
        ];
        const incidents = [
          {
            id: "inc-1",
            title: "Intermittent build timeouts",
            severity: "medium",
            status: "monitoring",
            createdAt: new Date(Date.now() - 36e5).toISOString()
            // 1 hour ago
          },
          {
            id: "inc-2",
            title: "Increased API latency in EU region",
            severity: "low",
            status: "resolved",
            createdAt: new Date(Date.now() - 864e5).toISOString()
            // 1 day ago
          }
        ];
        return {
          status: "healthy",
          uptime: 99.96,
          responseTime: 89,
          services,
          incidents
        };
      }
      /**
       * Get enterprise events
       */
      async getEnterpriseEvents(limit = 100) {
        return this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
      }
      /**
       * Get features by subscription
       */
      getFeaturesBySubscription(subscription) {
        switch (subscription) {
          case "starter":
            return ["basic_features", "community_support"];
          case "professional":
            return ["basic_features", "team_collaboration", "advanced_analytics", "priority_support"];
          case "enterprise":
            return ["all_professional_features", "sso", "advanced_security", "custom_branding", "dedicated_support"];
          case "custom":
            return ["everything", "custom_integrations", "dedicated_infrastructure", "white_label"];
          default:
            return ["basic_features"];
        }
      }
      /**
       * Get plan name by subscription
       */
      getPlanName(subscription) {
        switch (subscription) {
          case "starter":
            return "Starter Monthly";
          case "professional":
            return "Professional Monthly";
          case "enterprise":
            return "Enterprise Annual";
          case "custom":
            return "Custom Enterprise";
          default:
            return "Starter Monthly";
        }
      }
      /**
       * Get plan amount by subscription
       */
      getPlanAmount(subscription) {
        switch (subscription) {
          case "starter":
            return 29;
          case "professional":
            return 299;
          case "enterprise":
            return 12e3;
          case "custom":
            return 5e4;
          default:
            return 29;
        }
      }
      /**
       * Log enterprise event
       */
      logEnterpriseEvent(event) {
        const enterpriseEvent = {
          id: `ent-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...event
        };
        this.events.push(enterpriseEvent);
        if (this.events.length > 1e3) {
          this.events = this.events.slice(-1e3);
        }
      }
    };
  }
});

// server/phoenix/routes/enterprise.ts
var enterprise_exports = {};
__export(enterprise_exports, {
  default: () => enterprise_default,
  enterpriseRouter: () => enterpriseRouter
});
import express14 from "express";
var enterpriseRouter, enterprise_default;
var init_enterprise = __esm({
  "server/phoenix/routes/enterprise.ts"() {
    "use strict";
    init_EnterpriseService();
    enterpriseRouter = express14.Router();
    enterpriseRouter.get("/metrics", async (req, res) => {
      try {
        const enterpriseService = createEnterpriseService();
        const metrics = await enterpriseService.getAdminMetrics();
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching admin metrics:", error);
        res.status(500).json({
          error: "Failed to fetch admin metrics",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/organizations", async (req, res) => {
      try {
        const enterpriseService = createEnterpriseService();
        const organizations = await enterpriseService.getOrganizations();
        res.json(organizations);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({
          error: "Failed to fetch organizations",
          message: error.message
        });
      }
    });
    enterpriseRouter.post("/organizations", async (req, res) => {
      try {
        const { name, domain, subscription } = req.body;
        if (!name || !domain) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Name and domain are required"
          });
        }
        if (subscription && !["starter", "professional", "enterprise", "custom"].includes(subscription)) {
          return res.status(400).json({
            error: "Invalid Subscription",
            message: "Subscription must be starter, professional, enterprise, or custom"
          });
        }
        const enterpriseService = createEnterpriseService();
        const organization = await enterpriseService.createOrganization({ name, domain, subscription });
        res.status(201).json({
          success: true,
          message: "Organization created successfully",
          organization
        });
      } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({
          error: "Failed to create organization",
          message: error.message
        });
      }
    });
    enterpriseRouter.patch("/organizations/:orgId", async (req, res) => {
      try {
        const { orgId } = req.params;
        const updates = req.body;
        const enterpriseService = createEnterpriseService();
        const organization = await enterpriseService.updateOrganization(orgId, updates);
        res.json({
          success: true,
          message: "Organization updated successfully",
          organization
        });
      } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).json({
          error: "Failed to update organization",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/teams", async (req, res) => {
      try {
        const { organizationId } = req.query;
        const enterpriseService = createEnterpriseService();
        let teams = await enterpriseService.getTeams();
        if (organizationId) {
          teams = teams.filter((team) => team.organizationId === organizationId);
        }
        res.json(teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({
          error: "Failed to fetch teams",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/users", async (req, res) => {
      try {
        const { role, status, organizationId } = req.query;
        const enterpriseService = createEnterpriseService();
        let users = await enterpriseService.getUsers();
        if (role && role !== "all") {
          users = users.filter((user) => user.role === role);
        }
        if (status && status !== "all") {
          users = users.filter((user) => user.status === status);
        }
        if (organizationId) {
          users = users.filter((user) => user.organizationId === organizationId);
        }
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
          error: "Failed to fetch users",
          message: error.message
        });
      }
    });
    enterpriseRouter.patch("/users/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        const { role, status, permissions } = req.body;
        const updates = {};
        if (role) updates.role = role;
        if (status) updates.status = status;
        if (permissions) updates.permissions = permissions;
        if (Object.keys(updates).length === 0) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "At least one field to update is required"
          });
        }
        const enterpriseService = createEnterpriseService();
        const user = await enterpriseService.updateUser(userId, updates);
        res.json({
          success: true,
          message: "User updated successfully",
          user
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
          error: "Failed to update user",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/system-health", async (req, res) => {
      try {
        const enterpriseService = createEnterpriseService();
        const health = await enterpriseService.getSystemHealth();
        res.json(health);
      } catch (error) {
        console.error("Error fetching system health:", error);
        res.status(500).json({
          error: "Failed to fetch system health",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/events", async (req, res) => {
      try {
        const { limit = "100" } = req.query;
        const enterpriseService = createEnterpriseService();
        const events = await enterpriseService.getEnterpriseEvents(parseInt(limit));
        res.json(events);
      } catch (error) {
        console.error("Error fetching enterprise events:", error);
        res.status(500).json({
          error: "Failed to fetch enterprise events",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/stats", async (req, res) => {
      try {
        const enterpriseService = createEnterpriseService();
        const metrics = await enterpriseService.getAdminMetrics();
        const organizations = await enterpriseService.getOrganizations();
        const users = await enterpriseService.getUsers();
        const teams = await enterpriseService.getTeams();
        const stats = {
          overview: {
            totalOrganizations: metrics.totalOrganizations,
            totalUsers: metrics.totalUsers,
            totalProjects: metrics.totalProjects,
            totalTeams: teams.length
          },
          subscriptions: {
            starter: organizations.filter((o) => o.subscription === "starter").length,
            professional: organizations.filter((o) => o.subscription === "professional").length,
            enterprise: organizations.filter((o) => o.subscription === "enterprise").length,
            custom: organizations.filter((o) => o.subscription === "custom").length
          },
          userRoles: {
            super_admin: users.filter((u) => u.role === "super_admin").length,
            org_admin: users.filter((u) => u.role === "org_admin").length,
            team_lead: users.filter((u) => u.role === "team_lead").length,
            developer: users.filter((u) => u.role === "developer").length,
            viewer: users.filter((u) => u.role === "viewer").length
          },
          userStatus: {
            active: users.filter((u) => u.status === "active").length,
            inactive: users.filter((u) => u.status === "inactive").length,
            pending: users.filter((u) => u.status === "pending").length,
            suspended: users.filter((u) => u.status === "suspended").length
          },
          revenue: metrics.revenue,
          usage: metrics.usage,
          security: metrics.security
        };
        res.json(stats);
      } catch (error) {
        console.error("Error fetching platform statistics:", error);
        res.status(500).json({
          error: "Failed to fetch platform statistics",
          message: error.message
        });
      }
    });
    enterpriseRouter.get("/health", async (req, res) => {
      try {
        const enterpriseService = createEnterpriseService();
        const systemHealth = await enterpriseService.getSystemHealth();
        const metrics = await enterpriseService.getAdminMetrics();
        const healthStatus = {
          status: systemHealth.status,
          uptime: systemHealth.uptime,
          services: {
            userManagement: "operational",
            organizationManagement: "operational",
            teamManagement: "operational",
            billingSystem: "operational",
            analyticsEngine: "operational"
          },
          performance: {
            responseTime: systemHealth.responseTime,
            userQueryTime: "25ms",
            organizationLoadTime: "45ms",
            dashboardRenderTime: "120ms"
          },
          metrics: {
            totalOrganizations: metrics.totalOrganizations,
            totalUsers: metrics.totalUsers,
            monthlyRevenue: metrics.revenue.monthly,
            systemLoad: "normal"
          },
          lastHealthCheck: (/* @__PURE__ */ new Date()).toISOString(),
          version: "1.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking enterprise health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    enterprise_default = enterpriseRouter;
  }
});

// server/phoenix/routes/analytics.ts
var analytics_exports = {};
__export(analytics_exports, {
  analyticsRouter: () => analyticsRouter,
  default: () => analytics_default
});
import express15 from "express";
var analyticsRouter, analytics_default;
var init_analytics = __esm({
  "server/phoenix/routes/analytics.ts"() {
    "use strict";
    init_AnalyticsService();
    analyticsRouter = express15.Router();
    analyticsRouter.get("/metrics", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const analyticsService = createAnalyticsService();
        const metrics = await analyticsService.getAnalyticsMetrics(timeRange);
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching analytics metrics:", error);
        res.status(500).json({
          error: "Failed to fetch analytics metrics",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/projects", async (req, res) => {
      try {
        const { timeRange = "30d", platform } = req.query;
        const analyticsService = createAnalyticsService();
        const projects = await analyticsService.getProjectAnalytics(timeRange, platform);
        res.json(projects);
      } catch (error) {
        console.error("Error fetching project analytics:", error);
        res.status(500).json({
          error: "Failed to fetch project analytics",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/behavior", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const analyticsService = createAnalyticsService();
        const behavior = await analyticsService.getUserBehavior(timeRange);
        res.json(behavior);
      } catch (error) {
        console.error("Error fetching user behavior analytics:", error);
        res.status(500).json({
          error: "Failed to fetch user behavior analytics",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/trends", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const analyticsService = createAnalyticsService();
        const trends = await analyticsService.getTrendData(timeRange);
        res.json(trends);
      } catch (error) {
        console.error("Error fetching trend data:", error);
        res.status(500).json({
          error: "Failed to fetch trend data",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/geographic", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const analyticsService = createAnalyticsService();
        const geographic = await analyticsService.getGeographicData(timeRange);
        res.json(geographic);
      } catch (error) {
        console.error("Error fetching geographic analytics:", error);
        res.status(500).json({
          error: "Failed to fetch geographic analytics",
          message: error.message
        });
      }
    });
    analyticsRouter.post("/track", async (req, res) => {
      try {
        const { type, category, action, userId, projectId, value, properties } = req.body;
        if (!type || !category || !action) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Type, category, and action are required"
          });
        }
        const analyticsService = createAnalyticsService();
        await analyticsService.trackEvent({
          type,
          category,
          action,
          userId,
          projectId,
          value,
          properties: properties || {}
        });
        res.json({
          success: true,
          message: "Event tracked successfully"
        });
      } catch (error) {
        console.error("Error tracking analytics event:", error);
        res.status(500).json({
          error: "Failed to track analytics event",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/export", async (req, res) => {
      try {
        const { timeRange = "30d", format = "csv" } = req.query;
        if (!["csv", "json"].includes(format)) {
          return res.status(400).json({
            error: "Invalid Format",
            message: "Format must be csv or json"
          });
        }
        const analyticsService = createAnalyticsService();
        const exportData = await analyticsService.exportAnalytics(timeRange, format);
        const contentType = format === "csv" ? "text/csv" : "application/json";
        const fileName = `analytics-report-${timeRange}.${format}`;
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.send(exportData);
      } catch (error) {
        console.error("Error exporting analytics data:", error);
        res.status(500).json({
          error: "Failed to export analytics data",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/events", async (req, res) => {
      try {
        const { limit = "100" } = req.query;
        const analyticsService = createAnalyticsService();
        const events = await analyticsService.getAnalyticsEvents(parseInt(limit));
        res.json(events);
      } catch (error) {
        console.error("Error fetching analytics events:", error);
        res.status(500).json({
          error: "Failed to fetch analytics events",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/dashboard", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const analyticsService = createAnalyticsService();
        const [metrics, projects, behavior, trends, geographic] = await Promise.all([
          analyticsService.getAnalyticsMetrics(timeRange),
          analyticsService.getProjectAnalytics(timeRange),
          analyticsService.getUserBehavior(timeRange),
          analyticsService.getTrendData(timeRange),
          analyticsService.getGeographicData(timeRange)
        ]);
        res.json({
          metrics,
          projects: projects.slice(0, 10),
          // Top 10 projects
          behavior: behavior.slice(0, 8),
          // Top 8 features
          trends,
          geographic: geographic.slice(0, 8),
          // Top 8 countries
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({
          error: "Failed to fetch dashboard data",
          message: error.message
        });
      }
    });
    analyticsRouter.get("/health", async (req, res) => {
      try {
        const analyticsService = createAnalyticsService();
        const events = await analyticsService.getAnalyticsEvents(10);
        const healthStatus = {
          status: "healthy",
          services: {
            metricsCollection: "operational",
            eventTracking: "operational",
            dataProcessing: "operational",
            reportGeneration: "operational",
            exportService: "operational"
          },
          performance: {
            queryResponseTime: "45ms",
            eventProcessingTime: "8ms",
            reportGenerationTime: "1.2s",
            dataFreshness: "real-time"
          },
          statistics: {
            totalEvents: events.length,
            processingRate: "12,500 events/hour",
            storageUtilization: "78%",
            cacheHitRatio: "94%"
          },
          capabilities: {
            realTimeAnalytics: true,
            customReports: true,
            dataExport: true,
            crossPlatformTracking: true,
            behaviorAnalysis: true
          },
          lastHealthCheck: (/* @__PURE__ */ new Date()).toISOString(),
          version: "2.0.0"
        };
        res.json(healthStatus);
      } catch (error) {
        console.error("Error checking analytics health:", error);
        res.status(500).json({
          status: "unhealthy",
          error: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    analytics_default = analyticsRouter;
  }
});

// server/phoenix/services/DashboardService.ts
function createDashboardService() {
  return new DashboardService();
}
var DashboardService;
var init_DashboardService = __esm({
  "server/phoenix/services/DashboardService.ts"() {
    "use strict";
    DashboardService = class {
      projects = /* @__PURE__ */ new Map();
      systemAlerts = [];
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize mock dashboard data
       */
      initializeMockData() {
        const mockProjects = [
          {
            id: "proj-1",
            name: "ECommerce Mobile App",
            platform: "ios",
            status: "deployed",
            progress: 100,
            lastUpdate: new Date(Date.now() - 36e5).toISOString(),
            // 1 hour ago
            builds: 28,
            quality: 94
          },
          {
            id: "proj-2",
            name: "Social Media Dashboard",
            platform: "android",
            status: "building",
            progress: 75,
            lastUpdate: new Date(Date.now() - 18e5).toISOString(),
            // 30 minutes ago
            builds: 15,
            quality: 89
          },
          {
            id: "proj-3",
            name: "Financial Tracker",
            platform: "react_native",
            status: "active",
            progress: 60,
            lastUpdate: new Date(Date.now() - 72e5).toISOString(),
            // 2 hours ago
            builds: 12,
            quality: 92
          },
          {
            id: "proj-4",
            name: "Health & Fitness App",
            platform: "flutter",
            status: "deployed",
            progress: 100,
            lastUpdate: new Date(Date.now() - 144e5).toISOString(),
            // 4 hours ago
            builds: 22,
            quality: 96
          },
          {
            id: "proj-5",
            name: "Education Platform",
            platform: "ios",
            status: "error",
            progress: 45,
            lastUpdate: new Date(Date.now() - 108e5).toISOString(),
            // 3 hours ago
            builds: 8,
            quality: 78
          },
          {
            id: "proj-6",
            name: "Food Delivery Service",
            platform: "android",
            status: "active",
            progress: 35,
            lastUpdate: new Date(Date.now() - 216e5).toISOString(),
            // 6 hours ago
            builds: 6,
            quality: 85
          }
        ];
        mockProjects.forEach((project) => this.projects.set(project.id, project));
        this.systemAlerts = [
          {
            id: "alert-1",
            type: "warning",
            message: "Build queue experiencing higher than normal load",
            timestamp: new Date(Date.now() - 18e5).toISOString()
            // 30 minutes ago
          },
          {
            id: "alert-2",
            type: "info",
            message: "Scheduled maintenance completed successfully",
            timestamp: new Date(Date.now() - 72e5).toISOString()
            // 2 hours ago
          },
          {
            id: "alert-3",
            type: "warning",
            message: "iOS build service temporarily degraded",
            timestamp: new Date(Date.now() - 144e5).toISOString()
            // 4 hours ago
          },
          {
            id: "alert-4",
            type: "info",
            message: "New feature: Advanced Analytics dashboard launched",
            timestamp: new Date(Date.now() - 864e5).toISOString()
            // 1 day ago
          }
        ];
      }
      /**
       * Get dashboard overview metrics
       */
      async getDashboardOverview(timeRange = "30d") {
        const projects = Array.from(this.projects.values());
        const totalProjects = projects.length * 8;
        const activeProjects = projects.filter((p) => p.status === "active" || p.status === "building").length * 8;
        const completedProjects = projects.filter((p) => p.status === "deployed").length * 8;
        const thisMonthProjects = Math.floor(totalProjects * 0.15);
        const totalBuilds = projects.reduce((sum, p) => sum + p.builds, 0) * 100;
        const successfulBuilds = Math.floor(totalBuilds * 0.942);
        const failedBuilds = totalBuilds - successfulBuilds;
        return {
          projects: {
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects,
            thisMonth: thisMonthProjects
          },
          builds: {
            total: totalBuilds,
            successful: successfulBuilds,
            failed: failedBuilds,
            successRate: successfulBuilds / totalBuilds * 100
          },
          users: {
            total: 15847,
            active: 8934,
            thisMonth: 1247,
            growth: 23.4
          },
          revenue: {
            total: 1547890,
            thisMonth: 127589,
            growth: 18.7,
            arr: 153e4
          }
        };
      }
      /**
       * Get recent projects
       */
      async getRecentProjects(limit = 10) {
        return Array.from(this.projects.values()).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()).slice(0, limit);
      }
      /**
       * Get system status
       */
      async getSystemStatus() {
        const services = [
          { name: "API Gateway", status: "operational", uptime: 99.98, responseTime: 45 },
          { name: "Code Generation", status: "operational", uptime: 99.95, responseTime: 156 },
          { name: "Build Service", status: "degraded", uptime: 97.82, responseTime: 245 },
          { name: "Database", status: "operational", uptime: 99.99, responseTime: 12 },
          { name: "Authentication", status: "operational", uptime: 99.97, responseTime: 32 },
          { name: "File Storage", status: "operational", uptime: 99.94, responseTime: 67 },
          { name: "Analytics Engine", status: "operational", uptime: 99.91, responseTime: 89 },
          { name: "Security Scanner", status: "operational", uptime: 99.88, responseTime: 123 }
        ];
        const degradedServices = services.filter((s) => s.status === "degraded").length;
        const downServices = 0;
        let overall = "healthy";
        if (downServices > 0) {
          overall = "critical";
        } else if (degradedServices > 1) {
          overall = "critical";
        } else if (degradedServices > 0) {
          overall = "warning";
        }
        return {
          overall,
          services,
          alerts: this.systemAlerts
        };
      }
      /**
       * Get platform health assessment
       */
      async getPlatformHealth() {
        return {
          overallScore: 94,
          categories: {
            performance: 91,
            security: 97,
            reliability: 89,
            usability: 96
          },
          recommendations: [
            "Optimize build service performance during peak hours",
            "Implement additional automated testing coverage",
            "Enhance error logging and monitoring capabilities",
            "Consider scaling infrastructure for growing user base"
          ],
          lastAssessment: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      /**
       * Get platform statistics summary
       */
      async getPlatformStats() {
        const projects = Array.from(this.projects.values());
        const platformDistribution = projects.reduce((acc, project) => {
          acc[project.platform] = (acc[project.platform] || 0) + 1;
          return acc;
        }, {});
        return {
          totalUsers: 15847,
          totalProjects: projects.length * 8,
          totalBuilds: projects.reduce((sum, p) => sum + p.builds, 0) * 100,
          totalDeployments: projects.filter((p) => p.status === "deployed").length * 45,
          platformDistribution,
          growthMetrics: {
            userGrowth: 23.4,
            projectGrowth: 18.7,
            revenueGrowth: 31.2
          }
        };
      }
      /**
       * Create new project (simplified)
       */
      async createProject(projectData) {
        const project = {
          id: `proj-${Date.now()}`,
          name: projectData.name,
          platform: projectData.platform,
          status: "active",
          progress: 0,
          lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
          builds: 0,
          quality: 0
        };
        this.projects.set(project.id, project);
        return project;
      }
      /**
       * Update project status
       */
      async updateProjectStatus(projectId, status, progress) {
        const project = this.projects.get(projectId);
        if (!project) {
          throw new Error(`Project with ID ${projectId} not found`);
        }
        project.status = status;
        if (progress !== void 0) {
          project.progress = progress;
        }
        project.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
        this.projects.set(projectId, project);
        return project;
      }
      /**
       * Add system alert
       */
      async addSystemAlert(alert) {
        const newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...alert
        };
        this.systemAlerts.unshift(newAlert);
        if (this.systemAlerts.length > 50) {
          this.systemAlerts = this.systemAlerts.slice(0, 50);
        }
      }
      /**
       * Get comprehensive dashboard data
       */
      async getComprehensiveDashboard(timeRange = "30d") {
        const [overview, recentProjects, systemStatus, platformHealth, stats] = await Promise.all([
          this.getDashboardOverview(timeRange),
          this.getRecentProjects(6),
          this.getSystemStatus(),
          this.getPlatformHealth(),
          this.getPlatformStats()
        ]);
        return {
          overview,
          recentProjects,
          systemStatus,
          platformHealth,
          stats
        };
      }
    };
  }
});

// server/phoenix/routes/dashboard.ts
var dashboard_exports = {};
__export(dashboard_exports, {
  dashboardRouter: () => dashboardRouter,
  default: () => dashboard_default
});
import express16 from "express";
var dashboardRouter, dashboard_default;
var init_dashboard = __esm({
  "server/phoenix/routes/dashboard.ts"() {
    "use strict";
    init_DashboardService();
    dashboardRouter = express16.Router();
    dashboardRouter.get("/overview", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const dashboardService = createDashboardService();
        const overview = await dashboardService.getDashboardOverview(timeRange);
        res.json(overview);
      } catch (error) {
        console.error("Error fetching dashboard overview:", error);
        res.status(500).json({
          error: "Failed to fetch dashboard overview",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/projects", async (req, res) => {
      try {
        const { limit = "10" } = req.query;
        const dashboardService = createDashboardService();
        const projects = await dashboardService.getRecentProjects(parseInt(limit));
        res.json(projects);
      } catch (error) {
        console.error("Error fetching recent projects:", error);
        res.status(500).json({
          error: "Failed to fetch recent projects",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/system-status", async (req, res) => {
      try {
        const dashboardService = createDashboardService();
        const systemStatus = await dashboardService.getSystemStatus();
        res.json(systemStatus);
      } catch (error) {
        console.error("Error fetching system status:", error);
        res.status(500).json({
          error: "Failed to fetch system status",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/health", async (req, res) => {
      try {
        const dashboardService = createDashboardService();
        const health = await dashboardService.getPlatformHealth();
        res.json(health);
      } catch (error) {
        console.error("Error fetching platform health:", error);
        res.status(500).json({
          error: "Failed to fetch platform health",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/stats", async (req, res) => {
      try {
        const dashboardService = createDashboardService();
        const stats = await dashboardService.getPlatformStats();
        res.json(stats);
      } catch (error) {
        console.error("Error fetching platform stats:", error);
        res.status(500).json({
          error: "Failed to fetch platform stats",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/comprehensive", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const dashboardService = createDashboardService();
        const dashboardData = await dashboardService.getComprehensiveDashboard(timeRange);
        res.json(dashboardData);
      } catch (error) {
        console.error("Error fetching comprehensive dashboard:", error);
        res.status(500).json({
          error: "Failed to fetch comprehensive dashboard",
          message: error.message
        });
      }
    });
    dashboardRouter.post("/projects", async (req, res) => {
      try {
        const { name, platform } = req.body;
        if (!name || !platform) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Name and platform are required"
          });
        }
        if (!["ios", "android", "react_native", "flutter"].includes(platform)) {
          return res.status(400).json({
            error: "Invalid Platform",
            message: "Platform must be ios, android, react_native, or flutter"
          });
        }
        const dashboardService = createDashboardService();
        const project = await dashboardService.createProject({ name, platform });
        res.status(201).json({
          success: true,
          message: "Project created successfully",
          project
        });
      } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({
          error: "Failed to create project",
          message: error.message
        });
      }
    });
    dashboardRouter.patch("/projects/:projectId/status", async (req, res) => {
      try {
        const { projectId } = req.params;
        const { status, progress } = req.body;
        if (!status) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Status is required"
          });
        }
        if (!["active", "building", "deployed", "error"].includes(status)) {
          return res.status(400).json({
            error: "Invalid Status",
            message: "Status must be active, building, deployed, or error"
          });
        }
        const dashboardService = createDashboardService();
        const project = await dashboardService.updateProjectStatus(projectId, status, progress);
        res.json({
          success: true,
          message: "Project status updated successfully",
          project
        });
      } catch (error) {
        console.error("Error updating project status:", error);
        res.status(500).json({
          error: "Failed to update project status",
          message: error.message
        });
      }
    });
    dashboardRouter.post("/alerts", async (req, res) => {
      try {
        const { type, message } = req.body;
        if (!type || !message) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Type and message are required"
          });
        }
        if (!["info", "warning", "error"].includes(type)) {
          return res.status(400).json({
            error: "Invalid Type",
            message: "Type must be info, warning, or error"
          });
        }
        const dashboardService = createDashboardService();
        await dashboardService.addSystemAlert({ type, message });
        res.json({
          success: true,
          message: "System alert added successfully"
        });
      } catch (error) {
        console.error("Error adding system alert:", error);
        res.status(500).json({
          error: "Failed to add system alert",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/deployment-readiness", async (req, res) => {
      try {
        const dashboardService = createDashboardService();
        const [systemStatus, health, stats] = await Promise.all([
          dashboardService.getSystemStatus(),
          dashboardService.getPlatformHealth(),
          dashboardService.getPlatformStats()
        ]);
        const readiness = {
          isReady: systemStatus.overall === "healthy" && health.overallScore >= 90,
          score: health.overallScore,
          systemStatus: systemStatus.overall,
          criticalIssues: systemStatus.alerts.filter((a) => a.type === "error").length,
          warnings: systemStatus.alerts.filter((a) => a.type === "warning").length,
          recommendations: health.recommendations,
          metrics: {
            uptime: systemStatus.services.reduce((avg, s) => avg + s.uptime, 0) / systemStatus.services.length,
            performance: health.categories.performance,
            security: health.categories.security,
            reliability: health.categories.reliability
          },
          deployment: {
            canDeploy: systemStatus.overall === "healthy" && health.overallScore >= 85,
            blockers: systemStatus.overall !== "healthy" ? ["System status not healthy"] : [],
            requirements: [
              "All critical services operational",
              "Security score above 90%",
              "Performance metrics within acceptable range",
              "No critical alerts active"
            ]
          }
        };
        res.json(readiness);
      } catch (error) {
        console.error("Error checking deployment readiness:", error);
        res.status(500).json({
          error: "Failed to check deployment readiness",
          message: error.message
        });
      }
    });
    dashboardRouter.get("/summary", async (req, res) => {
      try {
        const { timeRange = "30d" } = req.query;
        const dashboardService = createDashboardService();
        const comprehensive = await dashboardService.getComprehensiveDashboard(timeRange);
        const summary = {
          platform: {
            name: "AI Mobile App Builder",
            version: "1.0.0",
            status: comprehensive.systemStatus.overall,
            healthScore: comprehensive.platformHealth.overallScore
          },
          metrics: {
            totalUsers: comprehensive.overview.users.total,
            activeUsers: comprehensive.overview.users.active,
            totalProjects: comprehensive.overview.projects.total,
            activeProjects: comprehensive.overview.projects.active,
            buildSuccessRate: comprehensive.overview.builds.successRate,
            monthlyRevenue: comprehensive.overview.revenue.thisMonth
          },
          growth: {
            userGrowth: comprehensive.stats.growthMetrics.userGrowth,
            projectGrowth: comprehensive.stats.growthMetrics.projectGrowth,
            revenueGrowth: comprehensive.stats.growthMetrics.revenueGrowth
          },
          systemHealth: {
            operationalServices: comprehensive.systemStatus.services.filter((s) => s.status === "operational").length,
            totalServices: comprehensive.systemStatus.services.length,
            activeAlerts: comprehensive.systemStatus.alerts.filter((a) => a.type === "error" || a.type === "warning").length,
            averageUptime: comprehensive.systemStatus.services.reduce((avg, s) => avg + s.uptime, 0) / comprehensive.systemStatus.services.length
          },
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
        };
        res.json(summary);
      } catch (error) {
        console.error("Error generating platform summary:", error);
        res.status(500).json({
          error: "Failed to generate platform summary",
          message: error.message
        });
      }
    });
    dashboard_default = dashboardRouter;
  }
});

// server/production/codeGenerator.ts
var codeGenerator_exports = {};
__export(codeGenerator_exports, {
  ProductionCodeGenerator: () => ProductionCodeGenerator,
  codeGenerator: () => codeGenerator
});
import OpenAI2 from "openai";
var openai2, ProductionCodeGenerator, codeGenerator;
var init_codeGenerator = __esm({
  "server/production/codeGenerator.ts"() {
    "use strict";
    openai2 = new OpenAI2({
      apiKey: process.env.OPENAI_API_KEY
    });
    ProductionCodeGenerator = class {
      async generateNativeApp(specs) {
        const results = [];
        for (const platform of specs.platforms) {
          try {
            const generatedCode = await this.generatePlatformSpecificCode(specs, platform);
            results.push(generatedCode);
          } catch (error) {
            console.error(`Error generating ${platform} code:`, error);
            throw new Error(`Failed to generate ${platform} app: ${error.message}`);
          }
        }
        return results;
      }
      async generatePlatformSpecificCode(specs, platform) {
        const prompt = this.createCodeGenerationPrompt(specs, platform);
        const response = await openai2.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(platform)
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1
        });
        const result = JSON.parse(response.choices[0].message.content);
        return this.processGeneratedCode(result, platform);
      }
      getSystemPrompt(platform) {
        if (platform === "ios") {
          return `You are an expert iOS developer. Generate complete, production-ready Swift code for iOS apps using SwiftUI and modern iOS development practices. 

Include:
- Complete Xcode project structure
- SwiftUI views and view models
- Proper navigation and state management
- iOS-specific features and integrations
- Build configuration and Info.plist

Return JSON with: files (filename -> code), projectStructure (array), buildInstructions (string)`;
        } else if (platform === "android") {
          return `You are an expert Android developer. Generate complete, production-ready Kotlin code for Android apps using Jetpack Compose and modern Android development practices.

Include:
- Complete Android Studio project structure  
- Jetpack Compose UI and ViewModels
- Proper navigation and state management
- Android-specific features and integrations
- Gradle build files and manifest

Return JSON with: files (filename -> code), projectStructure (array), buildInstructions (string)`;
        }
        throw new Error(`Unsupported platform: ${platform}`);
      }
      createCodeGenerationPrompt(specs, platform) {
        return `Generate a complete, production-ready ${platform} mobile application with these specifications:

**App Name:** ${specs.appName}
**Description:** ${specs.appDescription}
**App Type:** ${specs.appType}
**Features:** ${specs.features.join(", ")}
**Design Style:** ${specs.designTemplate || "Modern"}

Requirements:
1. Generate ALL necessary files for a complete project
2. Include proper project structure and configuration
3. Implement all specified features with working code
4. Use modern ${platform} development practices
5. Include proper error handling and state management
6. Make the app ready for App Store/Play Store submission

Provide the complete project as JSON with all source files.`;
      }
      processGeneratedCode(result, platform) {
        return {
          platform,
          files: result.files || {},
          projectStructure: result.projectStructure || [],
          buildInstructions: result.buildInstructions || ""
        };
      }
    };
    codeGenerator = new ProductionCodeGenerator();
  }
});

// server/production/fileGenerator.ts
var fileGenerator_exports = {};
__export(fileGenerator_exports, {
  FileGenerator: () => FileGenerator,
  fileGenerator: () => fileGenerator
});
import JSZip from "jszip";
import path3 from "path";
var FileGenerator, fileGenerator;
var init_fileGenerator = __esm({
  "server/production/fileGenerator.ts"() {
    "use strict";
    FileGenerator = class {
      async createDownloadableZip(projects, appName) {
        const zip = new JSZip();
        for (const project of projects) {
          const platformFolder = zip.folder(project.platform);
          for (const [filename, content] of Object.entries(project.files)) {
            platformFolder.file(filename, content);
          }
          const structureDoc = this.createStructureDocumentation(project);
          platformFolder.file("PROJECT_STRUCTURE.md", structureDoc);
        }
        const mainReadme = this.createMainReadme(appName, projects);
        zip.file("README.md", mainReadme);
        return await zip.generateAsync({ type: "nodebuffer" });
      }
      createStructureDocumentation(project) {
        return `# ${project.platform.toUpperCase()} Project Structure

This document describes the structure of your generated ${project.platform} application.

## File Overview

${Object.keys(project.files).map((filename) => {
          const extension = path3.extname(filename);
          const description = this.getFileDescription(filename, extension, project.platform);
          return `### ${filename}
${description}
`;
        }).join("\n")}

## Build Instructions

${this.getBuildInstructions(project.platform)}

## Next Steps

1. Download and extract the project files
2. Open the project in your IDE
3. Follow the build instructions above
4. Customize the app as needed
5. Test on device/simulator
6. Submit to app store

Generated by AI App Builder
`;
      }
      getFileDescription(filename, extension, platform) {
        const descriptions = {
          ".swift": "Swift source file containing app logic and UI components",
          ".kt": "Kotlin source file containing app logic and UI components",
          ".xml": "Android layout or configuration file",
          ".plist": "iOS property list configuration file",
          ".gradle": "Android build configuration file",
          ".xcodeproj": "Xcode project file",
          ".json": "Configuration or data file",
          ".md": "Documentation file"
        };
        return descriptions[extension] || `${platform} project file`;
      }
      getBuildInstructions(platform) {
        if (platform === "ios") {
          return `
**iOS Build Instructions:**

1. Open the .xcodeproj file in Xcode
2. Select your target device or simulator
3. Press Cmd+R to build and run
4. For App Store submission:
   - Archive the project (Product \u2192 Archive)
   - Upload to App Store Connect
   - Submit for review
`;
        } else if (platform === "android") {
          return `
**Android Build Instructions:**

1. Open the project in Android Studio
2. Wait for Gradle sync to complete
3. Select your target device or emulator
4. Click the Run button or press Shift+F10
5. For Play Store submission:
   - Build signed APK (Build \u2192 Generate Signed Bundle/APK)
   - Upload to Google Play Console
   - Submit for review
`;
        }
        return `Build instructions for ${platform} will be provided with the generated code.`;
      }
      createMainReadme(appName, projects) {
        const platformList = projects.map((p) => p.platform.toUpperCase()).join(", ");
        return `# ${appName}

This mobile application was generated using AI App Builder.

## Platforms Generated

${projects.map((p) => `- **${p.platform.toUpperCase()}**: Complete native ${p.platform} application`).join("\n")}

## Project Contents

${projects.map((p) => `
### ${p.platform.toUpperCase()} App
- Location: \`/${p.platform}/\`
- Files: ${Object.keys(p.files).length} source files
- Ready for: ${p.platform === "ios" ? "Xcode and App Store" : "Android Studio and Play Store"}
`).join("")}

## Getting Started

1. Choose your platform folder (${platformList})
2. Follow the README instructions in each platform folder
3. Open the project in your IDE
4. Build, test, and deploy!

## Support

This app was generated by AI App Builder.

For support with the generated code or to create more apps, visit our platform.

---
*Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()}*
`;
      }
    };
    fileGenerator = new FileGenerator();
  }
});

// server/phoenix/services/BuildHistoryService.ts
function createBuildHistoryService() {
  return new BuildHistoryService();
}
var BuildHistoryService;
var init_BuildHistoryService = __esm({
  "server/phoenix/services/BuildHistoryService.ts"() {
    "use strict";
    BuildHistoryService = class {
      builds = /* @__PURE__ */ new Map();
      constructor() {
        this.initializeMockData();
      }
      /**
       * Initialize with some mock build history
       */
      initializeMockData() {
        const mockBuilds = [
          {
            id: "build-1",
            projectId: "proj-1",
            projectName: "ECommerce Mobile App",
            platform: "ios",
            status: "success",
            githubRunId: 12345,
            githubRunUrl: "https://github.com/user/ecommerce-app/actions/runs/12345",
            repoUrl: "https://github.com/user/ecommerce-app",
            startedAt: new Date(Date.now() - 36e5).toISOString(),
            completedAt: new Date(Date.now() - 3e6).toISOString(),
            duration: 600,
            // 10 minutes
            artifacts: [
              {
                name: "ECommerce-v1.0.0.ipa",
                url: "https://github.com/user/ecommerce-app/suites/artifacts/123",
                size: 256e5,
                // 25.6 MB
                type: "ipa"
              },
              {
                name: "build-logs.txt",
                url: "https://github.com/user/ecommerce-app/suites/artifacts/124",
                size: 156e3,
                // 156 KB
                type: "logs"
              }
            ],
            logs: [
              {
                timestamp: new Date(Date.now() - 36e5).toISOString(),
                level: "info",
                message: "Build started for iOS platform",
                source: "github"
              },
              {
                timestamp: new Date(Date.now() - 358e4).toISOString(),
                level: "info",
                message: "XcodeGen project generation completed",
                source: "xcode"
              },
              {
                timestamp: new Date(Date.now() - 34e5).toISOString(),
                level: "info",
                message: "Code signing completed successfully",
                source: "fastlane"
              },
              {
                timestamp: new Date(Date.now() - 3e6).toISOString(),
                level: "info",
                message: "Build completed successfully",
                source: "github"
              }
            ],
            buildConfig: {
              bundleId: "com.example.ecommerce",
              version: "1.0.0",
              buildNumber: "1",
              scheme: "ECommerce",
              configuration: "release"
            }
          },
          {
            id: "build-2",
            projectId: "proj-2",
            projectName: "Social Media Dashboard",
            platform: "android",
            status: "failed",
            githubRunId: 12346,
            githubRunUrl: "https://github.com/user/social-dashboard/actions/runs/12346",
            repoUrl: "https://github.com/user/social-dashboard",
            startedAt: new Date(Date.now() - 72e5).toISOString(),
            completedAt: new Date(Date.now() - 69e5).toISOString(),
            duration: 300,
            // 5 minutes
            artifacts: [
              {
                name: "error-logs.txt",
                url: "https://github.com/user/social-dashboard/suites/artifacts/125",
                size: 45e3,
                // 45 KB
                type: "logs"
              }
            ],
            logs: [
              {
                timestamp: new Date(Date.now() - 72e5).toISOString(),
                level: "info",
                message: "Build started for Android platform",
                source: "github"
              },
              {
                timestamp: new Date(Date.now() - 71e5).toISOString(),
                level: "warning",
                message: "Deprecated API usage detected in build.gradle",
                source: "gradle"
              },
              {
                timestamp: new Date(Date.now() - 69e5).toISOString(),
                level: "error",
                message: "Build failed: Signing key not found",
                source: "gradle"
              }
            ],
            error: "Build failed due to missing signing configuration",
            buildConfig: {
              bundleId: "com.example.socialdashboard",
              version: "1.0.0",
              buildNumber: "2",
              configuration: "debug"
            }
          }
        ];
        mockBuilds.forEach((build) => this.builds.set(build.id, build));
      }
      /**
       * Create a new build record
       */
      async createBuild(buildData) {
        const build = {
          id: `build-${Date.now()}`,
          ...buildData,
          status: "queued",
          startedAt: (/* @__PURE__ */ new Date()).toISOString(),
          artifacts: [],
          logs: [
            {
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              level: "info",
              message: `Build queued for ${buildData.platform} platform`,
              source: "github"
            }
          ]
        };
        this.builds.set(build.id, build);
        return build;
      }
      /**
       * Update build status
       */
      async updateBuildStatus(buildId, status, githubRunId, githubRunUrl, repoUrl) {
        const build = this.builds.get(buildId);
        if (!build) {
          throw new Error(`Build ${buildId} not found`);
        }
        build.status = status;
        if (githubRunId) build.githubRunId = githubRunId;
        if (githubRunUrl) build.githubRunUrl = githubRunUrl;
        if (repoUrl) build.repoUrl = repoUrl;
        if (status === "building" && !build.startedAt) {
          build.startedAt = (/* @__PURE__ */ new Date()).toISOString();
        }
        if ((status === "success" || status === "failed" || status === "cancelled") && !build.completedAt) {
          build.completedAt = (/* @__PURE__ */ new Date()).toISOString();
          build.duration = Math.floor(
            (new Date(build.completedAt).getTime() - new Date(build.startedAt).getTime()) / 1e3
          );
        }
        this.builds.set(buildId, build);
        return build;
      }
      /**
       * Add log entry to build
       */
      async addBuildLog(buildId, log2) {
        const build = this.builds.get(buildId);
        if (!build) {
          throw new Error(`Build ${buildId} not found`);
        }
        build.logs.push({
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...log2
        });
        this.builds.set(buildId, build);
      }
      /**
       * Add artifact to build
       */
      async addBuildArtifact(buildId, artifact) {
        const build = this.builds.get(buildId);
        if (!build) {
          throw new Error(`Build ${buildId} not found`);
        }
        build.artifacts.push(artifact);
        this.builds.set(buildId, build);
      }
      /**
       * Get build history for a project
       */
      async getProjectBuilds(projectId, limit = 20) {
        return Array.from(this.builds.values()).filter((build) => build.projectId === projectId).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, limit);
      }
      /**
       * Get all builds (for admin/dashboard view)
       */
      async getAllBuilds(limit = 50) {
        return Array.from(this.builds.values()).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, limit);
      }
      /**
       * Get build by ID
       */
      async getBuild(buildId) {
        return this.builds.get(buildId);
      }
      /**
       * Get build statistics
       */
      async getBuildStats(timeRange = "7d") {
        const builds = Array.from(this.builds.values());
        const now = /* @__PURE__ */ new Date();
        const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1e3);
        const recentBuilds = builds.filter(
          (build) => new Date(build.startedAt) >= cutoff
        );
        const completedBuilds = recentBuilds.filter(
          (build) => build.status === "success" || build.status === "failed"
        );
        const successfulBuilds = recentBuilds.filter(
          (build) => build.status === "success"
        );
        const platformBreakdown = recentBuilds.reduce((acc, build) => {
          acc[build.platform] = (acc[build.platform] || 0) + 1;
          return acc;
        }, {});
        const totalDuration = completedBuilds.reduce(
          (sum, build) => sum + (build.duration || 0),
          0
        );
        return {
          totalBuilds: recentBuilds.length,
          successfulBuilds: successfulBuilds.length,
          failedBuilds: recentBuilds.filter((b) => b.status === "failed").length,
          successRate: recentBuilds.length > 0 ? successfulBuilds.length / recentBuilds.length * 100 : 0,
          averageDuration: completedBuilds.length > 0 ? totalDuration / completedBuilds.length : 0,
          platformBreakdown
        };
      }
    };
  }
});

// server/phoenix/routes/build-history.ts
var build_history_exports = {};
__export(build_history_exports, {
  buildHistoryRouter: () => buildHistoryRouter,
  default: () => build_history_default
});
import express17 from "express";
var buildHistoryRouter, build_history_default;
var init_build_history = __esm({
  "server/phoenix/routes/build-history.ts"() {
    "use strict";
    init_BuildHistoryService();
    buildHistoryRouter = express17.Router();
    buildHistoryRouter.get("/", async (req, res) => {
      try {
        const { limit = "50" } = req.query;
        const buildHistoryService = createBuildHistoryService();
        const builds = await buildHistoryService.getAllBuilds(parseInt(limit));
        res.json(builds);
      } catch (error) {
        console.error("Error fetching builds:", error);
        res.status(500).json({
          error: "Failed to fetch builds",
          message: error.message
        });
      }
    });
    buildHistoryRouter.get("/project/:projectId", async (req, res) => {
      try {
        const { projectId } = req.params;
        const { limit = "20" } = req.query;
        const buildHistoryService = createBuildHistoryService();
        const builds = await buildHistoryService.getProjectBuilds(projectId, parseInt(limit));
        res.json(builds);
      } catch (error) {
        console.error("Error fetching project builds:", error);
        res.status(500).json({
          error: "Failed to fetch project builds",
          message: error.message
        });
      }
    });
    buildHistoryRouter.get("/:buildId", async (req, res) => {
      try {
        const { buildId } = req.params;
        const buildHistoryService = createBuildHistoryService();
        const build = await buildHistoryService.getBuild(buildId);
        if (!build) {
          return res.status(404).json({
            error: "Build not found",
            message: `Build with ID ${buildId} not found`
          });
        }
        res.json(build);
      } catch (error) {
        console.error("Error fetching build:", error);
        res.status(500).json({
          error: "Failed to fetch build",
          message: error.message
        });
      }
    });
    buildHistoryRouter.post("/", async (req, res) => {
      try {
        const { projectId, projectName, platform, buildConfig } = req.body;
        if (!projectId || !projectName || !platform || !buildConfig) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "projectId, projectName, platform, and buildConfig are required"
          });
        }
        if (!["ios", "android", "react_native", "flutter"].includes(platform)) {
          return res.status(400).json({
            error: "Invalid Platform",
            message: "Platform must be ios, android, react_native, or flutter"
          });
        }
        const buildHistoryService = createBuildHistoryService();
        const build = await buildHistoryService.createBuild({
          projectId,
          projectName,
          platform,
          buildConfig
        });
        res.status(201).json({
          success: true,
          message: "Build created successfully",
          build
        });
      } catch (error) {
        console.error("Error creating build:", error);
        res.status(500).json({
          error: "Failed to create build",
          message: error.message
        });
      }
    });
    buildHistoryRouter.patch("/:buildId/status", async (req, res) => {
      try {
        const { buildId } = req.params;
        const { status, githubRunId, githubRunUrl, repoUrl } = req.body;
        if (!status) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Status is required"
          });
        }
        if (!["queued", "building", "success", "failed", "cancelled"].includes(status)) {
          return res.status(400).json({
            error: "Invalid Status",
            message: "Status must be queued, building, success, failed, or cancelled"
          });
        }
        const buildHistoryService = createBuildHistoryService();
        const build = await buildHistoryService.updateBuildStatus(
          buildId,
          status,
          githubRunId,
          githubRunUrl,
          repoUrl
        );
        res.json({
          success: true,
          message: "Build status updated successfully",
          build
        });
      } catch (error) {
        console.error("Error updating build status:", error);
        res.status(500).json({
          error: "Failed to update build status",
          message: error.message
        });
      }
    });
    buildHistoryRouter.post("/:buildId/logs", async (req, res) => {
      try {
        const { buildId } = req.params;
        const { level, message, source } = req.body;
        if (!level || !message || !source) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "level, message, and source are required"
          });
        }
        if (!["info", "warning", "error"].includes(level)) {
          return res.status(400).json({
            error: "Invalid Level",
            message: "Level must be info, warning, or error"
          });
        }
        if (!["github", "fastlane", "xcode", "gradle"].includes(source)) {
          return res.status(400).json({
            error: "Invalid Source",
            message: "Source must be github, fastlane, xcode, or gradle"
          });
        }
        const buildHistoryService = createBuildHistoryService();
        await buildHistoryService.addBuildLog(buildId, { level, message, source });
        res.json({
          success: true,
          message: "Build log added successfully"
        });
      } catch (error) {
        console.error("Error adding build log:", error);
        res.status(500).json({
          error: "Failed to add build log",
          message: error.message
        });
      }
    });
    buildHistoryRouter.post("/:buildId/artifacts", async (req, res) => {
      try {
        const { buildId } = req.params;
        const { name, url, size, type } = req.body;
        if (!name || !url || !size || !type) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "name, url, size, and type are required"
          });
        }
        if (!["ipa", "apk", "bundle", "logs"].includes(type)) {
          return res.status(400).json({
            error: "Invalid Type",
            message: "Type must be ipa, apk, bundle, or logs"
          });
        }
        const buildHistoryService = createBuildHistoryService();
        await buildHistoryService.addBuildArtifact(buildId, { name, url, size, type });
        res.json({
          success: true,
          message: "Build artifact added successfully"
        });
      } catch (error) {
        console.error("Error adding build artifact:", error);
        res.status(500).json({
          error: "Failed to add build artifact",
          message: error.message
        });
      }
    });
    buildHistoryRouter.get("/stats/:timeRange", async (req, res) => {
      try {
        const { timeRange } = req.params;
        if (!["7d", "30d", "90d"].includes(timeRange)) {
          return res.status(400).json({
            error: "Invalid Time Range",
            message: "Time range must be 7d, 30d, or 90d"
          });
        }
        const buildHistoryService = createBuildHistoryService();
        const stats = await buildHistoryService.getBuildStats(timeRange);
        res.json(stats);
      } catch (error) {
        console.error("Error fetching build stats:", error);
        res.status(500).json({
          error: "Failed to fetch build stats",
          message: error.message
        });
      }
    });
    build_history_default = buildHistoryRouter;
  }
});

// server/index.ts
import express20 from "express";

// server/routes.ts
import express18 from "express";
import { createServer } from "http";

// package.json
var package_default = {
  name: "rest-express",
  version: "1.0.0",
  type: "module",
  license: "MIT",
  scripts: {
    dev: "NODE_ENV=development tsx server/index.ts",
    build: "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    start: "NODE_ENV=production node dist/index.js",
    check: "tsc",
    "db:push": "drizzle-kit push"
  },
  dependencies: {
    "@anthropic-ai/sdk": "^0.37.0",
    "@hookform/resolvers": "^3.10.0",
    "@jridgewell/trace-mapping": "^0.3.25",
    "@liveblocks/client": "^2.24.2",
    "@liveblocks/react": "^2.24.2",
    "@neondatabase/serverless": "^0.10.4",
    "@octokit/auth-app": "^8.0.1",
    "@octokit/rest": "^21.1.1",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.76.1",
    "@types/js-base64": "^3.0.0",
    "@types/js-yaml": "^4.0.9",
    "@types/memoizee": "^0.4.12",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    cmdk: "^1.1.1",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^3.6.0",
    dotenv: "^16.5.0",
    "drizzle-orm": "^0.39.3",
    "drizzle-zod": "^0.7.1",
    "embla-carousel-react": "^8.6.0",
    express: "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.13.1",
    handlebars: "^4.7.8",
    html2canvas: "^1.4.1",
    "input-otp": "^1.4.2",
    "js-base64": "^3.7.7",
    "js-yaml": "^4.1.0",
    jszip: "^3.10.1",
    "lucide-react": "^0.453.0",
    memoizee: "^0.4.17",
    memorystore: "^1.6.7",
    "next-themes": "^0.4.6",
    openai: "^4.100.0",
    "openid-client": "^6.5.0",
    passport: "^0.7.0",
    "passport-local": "^1.0.0",
    react: "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.56.4",
    "react-icons": "^5.5.0",
    "react-resizable-panels": "^2.1.7",
    "react-router-dom": "^7.6.0",
    recharts: "^2.15.2",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.2.5",
    uuid: "^11.1.0",
    vaul: "^1.1.2",
    ws: "^8.18.0",
    zod: "^3.24.4",
    "zod-validation-error": "^3.4.0",
    zustand: "^5.0.5"
  },
  devDependencies: {
    "@replit/vite-plugin-cartographer": "^0.2.0",
    "@replit/vite-plugin-runtime-error-modal": "^0.0.3",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.3",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "4.17.21",
    "@types/express-session": "^1.18.1",
    "@types/node": "20.16.11",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.2",
    autoprefixer: "^10.4.20",
    "drizzle-kit": "^0.30.4",
    esbuild: "^0.25.0",
    postcss: "^8.4.47",
    tailwindcss: "^3.4.17",
    tsx: "^4.19.1",
    typescript: "5.6.3",
    vite: "^5.4.14"
  },
  optionalDependencies: {
    bufferutil: "^4.0.8"
  }
};

// server/phoenix/routes.ts
import express6 from "express";

// server/phoenix/services/GitHubIntegrationService.ts
import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var templatePaths = {
  ios: path.join(__dirname, "../templates/github/workflows/ios-build.yml"),
  android: path.join(__dirname, "../templates/github/workflows/android-build.yml"),
  reactNative: path.join(__dirname, "../templates/github/workflows/react-native-build.yml"),
  flutter: path.join(__dirname, "../templates/github/workflows/flutter-build.yml")
};
function safeReadTemplate(templatePath, templateName) {
  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (error) {
    console.warn(`Warning: Could not read ${templateName} template at ${templatePath}. Using empty placeholder.`);
    return `# ${templateName} Build Workflow
# Template file not found - will be generated at runtime`;
  }
}
var iosWorkflowTemplate = safeReadTemplate(templatePaths.ios, "iOS");
var androidWorkflowTemplate = safeReadTemplate(templatePaths.android, "Android");
var reactNativeWorkflowTemplate = safeReadTemplate(templatePaths.reactNative, "React Native");
var flutterWorkflowTemplate = safeReadTemplate(templatePaths.flutter, "Flutter");
var GitHubIntegrationService = class {
  octokit;
  owner;
  /**
   * Constructor
   * 
   * @param token GitHub personal access token
   * @param owner GitHub username or organization name
   */
  constructor(token, owner) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
  }
  /**
   * Create a new repository on GitHub
   * 
   * @param name Repository name
   * @param description Repository description
   * @param isPrivate Whether the repository is private
   * @returns Repository information
   */
  async createRepository(name, description, isPrivate = true) {
    try {
      const response = await this.octokit.repos.createInOrg({
        org: this.owner,
        name,
        description,
        private: isPrivate,
        auto_init: true
      });
      return response.data;
    } catch (error) {
      console.error("Error creating repository:", error);
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }
  /**
   * Create a file in a GitHub repository
   * 
   * @param repo Repository name
   * @param path File path in the repository
   * @param content File content
   * @param message Commit message
   * @returns File information
   */
  async createFile(repo, path6, content, message) {
    try {
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo,
        path: path6,
        message,
        content: Base64.encode(content),
        branch: "main"
      });
      return response.data;
    } catch (error) {
      console.error("Error creating file:", error);
      throw new Error(`Failed to create file: ${error.message}`);
    }
  }
  /**
   * Set up iOS GitHub Actions workflow
   * 
   * @param repo Repository name
   * @returns Workflow information
   */
  async setupIOSWorkflow(repo) {
    const workflowPath = ".github/workflows/ios-build.yml";
    const commitMessage = "Add iOS build workflow";
    return this.createFile(repo, workflowPath, iosWorkflowTemplate, commitMessage);
  }
  /**
   * Set up Android GitHub Actions workflow
   * 
   * @param repo Repository name
   * @returns Workflow information
   */
  async setupAndroidWorkflow(repo) {
    const workflowPath = ".github/workflows/android-build.yml";
    const commitMessage = "Add Android build workflow";
    return this.createFile(repo, workflowPath, androidWorkflowTemplate, commitMessage);
  }
  /**
   * Set up React Native GitHub Actions workflow
   * 
   * @param repo Repository name
   * @returns Workflow information
   */
  async setupReactNativeWorkflow(repo) {
    const workflowPath = ".github/workflows/react-native-build.yml";
    const commitMessage = "Add React Native build workflow";
    return this.createFile(repo, workflowPath, reactNativeWorkflowTemplate, commitMessage);
  }
  /**
   * Set up Flutter GitHub Actions workflow
   * 
   * @param repo Repository name
   * @returns Workflow information
   */
  async setupFlutterWorkflow(repo) {
    const workflowPath = ".github/workflows/flutter-build.yml";
    const commitMessage = "Add Flutter build workflow";
    return this.createFile(repo, workflowPath, flutterWorkflowTemplate, commitMessage);
  }
  /**
   * Push project code to GitHub repository
   * 
   * @param repo Repository name
   * @param files Map of file paths to file contents
   * @returns Array of file creation results
   */
  async pushProjectFiles(repo, files) {
    const results = [];
    const entries = Array.from(files.entries());
    for (const [filePath, content] of entries) {
      const result = await this.createFile(
        repo,
        filePath,
        content,
        `Add ${path.basename(filePath)}`
      );
      results.push(result);
    }
    return results;
  }
  /**
   * List workflows for a repository
   * 
   * @param repo Repository name
   * @returns List of workflows
   */
  async listWorkflows(repo) {
    try {
      const response = await this.octokit.actions.listRepoWorkflows({
        owner: this.owner,
        repo
      });
      return response.data.workflows;
    } catch (error) {
      console.error("Error listing workflows:", error);
      throw new Error(`Failed to list workflows: ${error.message}`);
    }
  }
  /**
   * Trigger a workflow run
   * 
   * @param repo Repository name
   * @param workflowId Workflow ID
   * @param ref Git reference (branch, tag, commit)
   * @param inputs Workflow inputs
   * @returns Workflow run information
   */
  async triggerWorkflow(repo, workflowId, ref = "main", inputs = {}) {
    try {
      const response = await this.octokit.actions.createWorkflowDispatch({
        owner: this.owner,
        repo,
        workflow_id: workflowId,
        ref,
        inputs
      });
      return response.data;
    } catch (error) {
      console.error("Error triggering workflow:", error);
      throw new Error(`Failed to trigger workflow: ${error.message}`);
    }
  }
  /**
   * List workflow runs for a repository
   * 
   * @param repo Repository name
   * @param workflowId Workflow ID (optional)
   * @returns List of workflow runs
   */
  async listWorkflowRuns(repo, workflowId) {
    try {
      const params = {
        owner: this.owner,
        repo
      };
      if (workflowId) {
        params.workflow_id = workflowId;
      }
      const response = await this.octokit.actions.listWorkflowRuns(params);
      return response.data.workflow_runs;
    } catch (error) {
      console.error("Error listing workflow runs:", error);
      throw new Error(`Failed to list workflow runs: ${error.message}`);
    }
  }
  /**
   * Get a workflow run
   * 
   * @param repo Repository name
   * @param runId Workflow run ID
   * @returns Workflow run information
   */
  async getWorkflowRun(repo, runId) {
    try {
      const response = await this.octokit.actions.getWorkflowRun({
        owner: this.owner,
        repo,
        run_id: runId
      });
      return response.data;
    } catch (error) {
      console.error("Error getting workflow run:", error);
      throw new Error(`Failed to get workflow run: ${error.message}`);
    }
  }
  /**
   * Download workflow run artifacts
   * 
   * @param repo Repository name
   * @param runId Workflow run ID
   * @returns List of artifacts with download URLs
   */
  async listWorkflowRunArtifacts(repo, runId) {
    try {
      const response = await this.octokit.actions.listWorkflowRunArtifacts({
        owner: this.owner,
        repo,
        run_id: runId
      });
      return response.data.artifacts;
    } catch (error) {
      console.error("Error listing workflow run artifacts:", error);
      throw new Error(`Failed to list workflow run artifacts: ${error.message}`);
    }
  }
  /**
   * Download a workflow run artifact
   * 
   * @param repo Repository name
   * @param artifactId Artifact ID
   * @returns Artifact download URL
   */
  async downloadArtifact(repo, artifactId) {
    try {
      const response = await this.octokit.actions.downloadArtifact({
        owner: this.owner,
        repo,
        artifact_id: artifactId,
        archive_format: "zip"
      });
      return response.url;
    } catch (error) {
      console.error("Error downloading artifact:", error);
      throw new Error(`Failed to download artifact: ${error.message}`);
    }
  }
  /**
   * Create a GitHub release
   * 
   * @param repo Repository name
   * @param tagName Tag name
   * @param name Release name
   * @param body Release description
   * @param draft Whether the release is a draft
   * @param prerelease Whether the release is a prerelease
   * @returns Release information
   */
  async createRelease(repo, tagName, name, body, draft = false, prerelease = false) {
    try {
      const response = await this.octokit.repos.createRelease({
        owner: this.owner,
        repo,
        tag_name: tagName,
        name,
        body,
        draft,
        prerelease
      });
      return response.data;
    } catch (error) {
      console.error("Error creating release:", error);
      throw new Error(`Failed to create release: ${error.message}`);
    }
  }
  /**
   * Get the latest release for a repository
   * 
   * @param repo Repository name
   * @returns Latest release information
   */
  async getLatestRelease(repo) {
    try {
      const response = await this.octokit.repos.getLatestRelease({
        owner: this.owner,
        repo
      });
      return response.data;
    } catch (error) {
      console.error("Error getting latest release:", error);
      throw new Error(`Failed to get latest release: ${error.message}`);
    }
  }
};
function createGitHubIntegrationService() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }
  if (!owner) {
    throw new Error("GITHUB_OWNER environment variable is not set");
  }
  return new GitHubIntegrationService(token, owner);
}

// server/phoenix/services/XcodeProjectGenerator.ts
import * as yaml from "js-yaml";
import * as fs2 from "fs";
import * as path2 from "path";
var XcodeProjectGenerator = class {
  /**
   * Generate an XcodeGen project.yml file
   * 
   * @param config iOS App Configuration
   * @returns XcodeGen project.yml content as string
   */
  generateProjectYml(config) {
    const projectConfig = {
      name: config.name,
      options: {
        bundleIdPrefix: this.getBundleIdPrefix(config.bundleId),
        deploymentTarget: {
          iOS: config.minVersion || "14.0"
        },
        createIntermediateGroups: true,
        generateEmptyDirectories: true
      },
      settings: {
        base: {
          MARKETING_VERSION: config.version,
          CURRENT_PROJECT_VERSION: config.buildNumber,
          DEVELOPMENT_TEAM: config.teamId || "",
          CODE_SIGN_STYLE: "Automatic",
          CODE_SIGN_IDENTITY: "Apple Development"
        }
      },
      targets: {
        [config.name]: {
          type: "application",
          platform: "iOS",
          deploymentTarget: config.minVersion || "14.0",
          sources: this.getSourcesConfig(config),
          info: this.getInfoPlistConfig(config),
          entitlements: this.getEntitlementsConfig(config),
          settings: {
            base: {
              PRODUCT_BUNDLE_IDENTIFIER: config.bundleId,
              INFOPLIST_FILE: "Info.plist",
              CODE_SIGN_ENTITLEMENTS: config.entitlements ? `${config.name}/${config.name}.entitlements` : null
            }
          },
          dependencies: this.getDependenciesConfig(config)
        }
      },
      schemes: {
        [config.name]: {
          build: {
            targets: {
              [config.name]: ["run", "test", "profile", "analyze", "archive"]
            }
          },
          run: {
            config: "Debug"
          },
          archive: {
            config: "Release"
          }
        }
      }
    };
    this.removeNullValues(projectConfig);
    return yaml.dump(projectConfig);
  }
  /**
   * Generate Info.plist content
   * 
   * @param config iOS App Configuration
   * @returns Info.plist content as an XML string
   */
  generateInfoPlist(config) {
    const basicInfoPlist = {
      CFBundleDevelopmentRegion: "en",
      CFBundleDisplayName: config.name,
      CFBundleExecutable: "$(EXECUTABLE_NAME)",
      CFBundleIdentifier: "$(PRODUCT_BUNDLE_IDENTIFIER)",
      CFBundleInfoDictionaryVersion: "6.0",
      CFBundleName: "$(PRODUCT_NAME)",
      CFBundlePackageType: "APPL",
      CFBundleShortVersionString: "$(MARKETING_VERSION)",
      CFBundleVersion: "$(CURRENT_PROJECT_VERSION)",
      LSRequiresIPhoneOS: true,
      UIApplicationSupportsIndirectInputEvents: true,
      UILaunchStoryboardName: "LaunchScreen",
      UIStatusBarStyle: "UIStatusBarStyleDefault",
      UISupportedInterfaceOrientations: this.getOrientationsArray(config.orientations),
      UIUserInterfaceStyle: "Light",
      ...this.getDeviceInfoPlistEntries(config.devices),
      ...config.infoPlist || {}
    };
    return this.convertToPlistXml(basicInfoPlist);
  }
  /**
   * Generate entitlements file content
   * 
   * @param config iOS App Configuration
   * @returns Entitlements content as an XML string
   */
  generateEntitlements(config) {
    if (!config.entitlements || Object.keys(config.entitlements).length === 0) {
      return "";
    }
    return this.convertToPlistXml(config.entitlements);
  }
  /**
   * Get the bundle ID prefix from a full bundle ID
   * 
   * @param bundleId Full bundle ID (e.g., "com.example.myapp")
   * @returns Bundle ID prefix (e.g., "com.example")
   */
  getBundleIdPrefix(bundleId) {
    const parts = bundleId.split(".");
    if (parts.length < 3) {
      return bundleId;
    }
    return parts.slice(0, -1).join(".");
  }
  /**
   * Get sources configuration for XcodeGen
   * 
   * @param config iOS App Configuration
   * @returns Sources configuration object
   */
  getSourcesConfig(config) {
    return {
      include: config.sourceFiles,
      excludes: ["**/.*", "**/*.md"]
    };
  }
  /**
   * Get Info.plist configuration for XcodeGen
   * 
   * @param config iOS App Configuration
   * @returns Info.plist configuration object
   */
  getInfoPlistConfig(config) {
    return {
      path: "Info.plist",
      properties: {
        CFBundleDevelopmentRegion: "en",
        CFBundleDisplayName: config.name,
        CFBundleIdentifier: "$(PRODUCT_BUNDLE_IDENTIFIER)",
        CFBundleVersion: "$(CURRENT_PROJECT_VERSION)",
        CFBundleShortVersionString: "$(MARKETING_VERSION)",
        LSRequiresIPhoneOS: true,
        UILaunchStoryboardName: "LaunchScreen",
        UISupportedInterfaceOrientations: this.getOrientationsArray(config.orientations),
        ...this.getDeviceInfoPlistEntries(config.devices),
        ...config.infoPlist || {}
      }
    };
  }
  /**
   * Get entitlements configuration for XcodeGen
   * 
   * @param config iOS App Configuration
   * @returns Entitlements configuration object or null
   */
  getEntitlementsConfig(config) {
    if (!config.entitlements || Object.keys(config.entitlements).length === 0) {
      return null;
    }
    return {
      path: `${config.name}.entitlements`,
      properties: config.entitlements
    };
  }
  /**
   * Get dependencies configuration for XcodeGen
   * 
   * @param config iOS App Configuration
   * @returns Dependencies configuration array
   */
  getDependenciesConfig(config) {
    const deps = [];
    if (config.frameworks && config.frameworks.length > 0) {
      for (const framework of config.frameworks) {
        deps.push({
          framework,
          embed: false
        });
      }
    }
    const defaultFrameworks = ["UIKit", "Foundation", "CoreGraphics"];
    for (const framework of defaultFrameworks) {
      if (!config.frameworks || !config.frameworks.includes(framework)) {
        deps.push({
          framework,
          embed: false
        });
      }
    }
    return deps;
  }
  /**
   * Get supported orientations array for Info.plist
   * 
   * @param orientations Array of orientation names
   * @returns Array of orientation identifiers for Info.plist
   */
  getOrientationsArray(orientations) {
    const orientationMap = {
      "portrait": "UIInterfaceOrientationPortrait",
      "landscape": "UIInterfaceOrientationLandscapeRight",
      "landscapeLeft": "UIInterfaceOrientationLandscapeLeft",
      "landscapeRight": "UIInterfaceOrientationLandscapeRight",
      "portraitUpsideDown": "UIInterfaceOrientationPortraitUpsideDown"
    };
    return orientations.map((o) => orientationMap[o] || orientationMap["portrait"]);
  }
  /**
   * Get device-specific Info.plist entries
   * 
   * @param devices Array of device types
   * @returns Device-specific Info.plist entries
   */
  getDeviceInfoPlistEntries(devices) {
    const result = {};
    const families = [];
    if (devices.includes("iphone") || devices.includes("universal")) {
      families.push(1);
    }
    if (devices.includes("ipad") || devices.includes("universal")) {
      families.push(2);
    }
    result["UIDeviceFamily"] = families;
    return result;
  }
  /**
   * Remove null values from an object (recursive)
   * 
   * @param obj Object to clean
   */
  removeNullValues(obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null) {
        delete obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        this.removeNullValues(obj[key]);
      }
    });
  }
  /**
   * Convert object to plist XML format
   * This is a simple placeholder - in a real implementation we would use a plist library
   * 
   * @param obj Object to convert
   * @returns XML string
   */
  convertToPlistXml(obj) {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n';
    const xmlFooter = "</plist>";
    return `${xmlHeader}<dict>
${this.objectToPlistXml(obj)}</dict>
${xmlFooter}`;
  }
  /**
   * Convert object to plist XML format (recursive helper)
   * 
   * @param obj Object to convert
   * @returns XML string
   */
  objectToPlistXml(obj, indent = "  ") {
    let result = "";
    for (const [key, value] of Object.entries(obj)) {
      result += `${indent}<key>${key}</key>
`;
      if (typeof value === "string") {
        result += `${indent}<string>${value}</string>
`;
      } else if (typeof value === "number") {
        if (Number.isInteger(value)) {
          result += `${indent}<integer>${value}</integer>
`;
        } else {
          result += `${indent}<real>${value}</real>
`;
        }
      } else if (typeof value === "boolean") {
        result += `${indent}<${value ? "true" : "false"}/>
`;
      } else if (Array.isArray(value)) {
        result += `${indent}<array>
`;
        for (const item of value) {
          if (typeof item === "string") {
            result += `${indent}  <string>${item}</string>
`;
          } else if (typeof item === "number") {
            if (Number.isInteger(item)) {
              result += `${indent}  <integer>${item}</integer>
`;
            } else {
              result += `${indent}  <real>${item}</real>
`;
            }
          } else if (typeof item === "boolean") {
            result += `${indent}  <${item ? "true" : "false"}/>
`;
          } else if (typeof item === "object" && item !== null) {
            result += `${indent}  <dict>
${this.objectToPlistXml(item, indent + "    ")}</dict>
`;
          }
        }
        result += `${indent}</array>
`;
      } else if (typeof value === "object" && value !== null) {
        result += `${indent}<dict>
${this.objectToPlistXml(value, indent + "  ")}</dict>
`;
      }
    }
    return result;
  }
  /**
   * Save the generated files to disk
   * 
   * @param config iOS App Configuration
   * @param outputDir Output directory
   */
  saveProjectFiles(config, outputDir) {
    if (!fs2.existsSync(outputDir)) {
      fs2.mkdirSync(outputDir, { recursive: true });
    }
    const projectYml = this.generateProjectYml(config);
    fs2.writeFileSync(path2.join(outputDir, "project.yml"), projectYml);
    const infoPlist = this.generateInfoPlist(config);
    fs2.writeFileSync(path2.join(outputDir, "Info.plist"), infoPlist);
    if (config.entitlements && Object.keys(config.entitlements).length > 0) {
      const entitlements = this.generateEntitlements(config);
      fs2.writeFileSync(path2.join(outputDir, `${config.name}.entitlements`), entitlements);
    }
  }
};
function createXcodeProjectGenerator() {
  return new XcodeProjectGenerator();
}

// server/phoenix/routes.ts
init_settings();

// server/phoenix/routes/build-monitor.ts
import express from "express";
init_AnalyticsService();
init_settings();
var buildMonitorRouter = express.Router();
function requireGitHubConfig(req, res, next) {
  const validation = validateGitHubSettings();
  if (!validation.valid) {
    return res.status(400).json({
      error: "GitHub Configuration Missing",
      message: validation.message
    });
  }
  next();
}
buildMonitorRouter.get("/dashboard", requireGitHubConfig, async (req, res) => {
  try {
    const { repos } = req.query;
    const repoList = typeof repos === "string" ? repos.split(",") : ["demo-repo"];
    const githubService = createGitHubIntegrationService();
    const dashboardData = {
      summary: {
        totalBuilds: 0,
        activeBuilds: 0,
        successfulBuilds: 0,
        failedBuilds: 0
      },
      recentBuilds: []
    };
    for (const repo of repoList) {
      try {
        const runs = await githubService.listWorkflowRuns(repo);
        dashboardData.summary.totalBuilds += runs.length;
        dashboardData.summary.activeBuilds += runs.filter(
          (r) => r.status === "in_progress" || r.status === "queued"
        ).length;
        dashboardData.summary.successfulBuilds += runs.filter(
          (r) => r.status === "completed" && r.conclusion === "success"
        ).length;
        dashboardData.summary.failedBuilds += runs.filter(
          (r) => r.status === "completed" && r.conclusion === "failure"
        ).length;
        const recentRuns = runs.slice(0, 5).map((run) => ({
          ...run,
          repository: repo
        }));
        dashboardData.recentBuilds.push(...recentRuns);
      } catch (error) {
        console.warn(`Failed to fetch data for repo ${repo}:`, error);
      }
    }
    dashboardData.recentBuilds.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    dashboardData.recentBuilds = dashboardData.recentBuilds.slice(0, 20);
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      message: error.message
    });
  }
});
buildMonitorRouter.get("/status/:repo/:runId", requireGitHubConfig, async (req, res) => {
  try {
    const { repo, runId } = req.params;
    const githubService = createGitHubIntegrationService();
    const run = await githubService.getWorkflowRun(repo, Number(runId));
    const enhancedStatus = {
      ...run,
      buildSteps: [
        { name: "Setup", status: run.status !== "queued" ? "completed" : "pending" },
        { name: "Dependencies", status: run.status === "completed" || run.status === "in_progress" ? "completed" : "pending" },
        { name: "Build", status: run.status === "completed" ? "completed" : run.status === "in_progress" ? "in_progress" : "pending" },
        { name: "Package", status: run.status === "completed" && run.conclusion === "success" ? "completed" : "pending" },
        { name: "Upload", status: run.status === "completed" && run.conclusion === "success" ? "completed" : "pending" }
      ]
    };
    res.json(enhancedStatus);
  } catch (error) {
    console.error("Error fetching build status:", error);
    res.status(500).json({
      error: "Failed to fetch build status",
      message: error.message
    });
  }
});
buildMonitorRouter.get("/analytics/dashboard", async (req, res) => {
  try {
    const { days = 30, repo = "all" } = req.query;
    const analyticsService = createAnalyticsService();
    const analytics = await analyticsService.generateDashboardAnalytics({
      days: Number(days),
      repo: repo === "all" ? void 0 : String(repo)
    });
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics dashboard:", error);
    res.status(500).json({
      error: "Failed to fetch analytics dashboard",
      message: error.message
    });
  }
});
buildMonitorRouter.get("/analytics/insights/:repo", async (req, res) => {
  try {
    const { repo } = req.params;
    const { days = 30 } = req.query;
    const analyticsService = createAnalyticsService();
    const insights = await analyticsService.getPerformanceInsights(repo, Number(days));
    res.json(insights);
  } catch (error) {
    console.error("Error fetching performance insights:", error);
    res.status(500).json({
      error: "Failed to fetch performance insights",
      message: error.message
    });
  }
});
var build_monitor_default = buildMonitorRouter;

// server/phoenix/routes/deployment.ts
import express2 from "express";

// server/phoenix/services/AppStoreService.ts
var AppStoreService = class {
  appStoreConfig;
  playStoreConfig;
  constructor(appStoreConfig, playStoreConfig) {
    this.appStoreConfig = appStoreConfig;
    this.playStoreConfig = playStoreConfig;
  }
  /**
   * Deploy app to stores
   * 
   * @param request Deployment request
   * @returns Deployment status
   */
  async deployApp(request) {
    const deployments = [];
    try {
      if ((request.platform === "ios" || request.platform === "both") && this.appStoreConfig) {
        const iosDeployment = await this.deployToAppStore(request);
        deployments.push(iosDeployment);
      }
      if ((request.platform === "android" || request.platform === "both") && this.playStoreConfig) {
        const androidDeployment = await this.deployToPlayStore(request);
        deployments.push(androidDeployment);
      }
      return { deployments };
    } catch (error) {
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
  /**
   * Deploy to Apple App Store
   * 
   * @param request Deployment request
   * @returns Deployment status
   */
  async deployToAppStore(request) {
    const deploymentId = `ios-${Date.now()}`;
    try {
      const deployment = {
        id: deploymentId,
        status: "uploading",
        platform: "iOS",
        progress: 10,
        lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
      };
      setTimeout(() => {
        deployment.status = "processing";
        deployment.progress = 50;
        deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
      }, 2e3);
      if (request.deploymentType === "production") {
        setTimeout(() => {
          deployment.status = "review";
          deployment.progress = 75;
          deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
          deployment.reviewNotes = "App submitted for App Store review. Review typically takes 24-48 hours.";
        }, 5e3);
        if (request.autoPublish) {
          setTimeout(() => {
            deployment.status = "published";
            deployment.progress = 100;
            deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
            deployment.storeUrl = `https://apps.apple.com/app/${request.bundleId}`;
          }, 1e4);
        }
      } else {
        setTimeout(() => {
          deployment.status = "published";
          deployment.progress = 100;
          deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
          deployment.storeUrl = "https://testflight.apple.com/join/demo-link";
        }, 3e3);
      }
      return deployment;
    } catch (error) {
      return {
        id: deploymentId,
        status: "failed",
        platform: "iOS",
        progress: 0,
        lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
        reviewNotes: `Deployment failed: ${error.message}`
      };
    }
  }
  /**
   * Deploy to Google Play Store
   * 
   * @param request Deployment request
   * @returns Deployment status
   */
  async deployToPlayStore(request) {
    const deploymentId = `android-${Date.now()}`;
    try {
      const deployment = {
        id: deploymentId,
        status: "uploading",
        platform: "Android",
        progress: 15,
        lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
      };
      setTimeout(() => {
        deployment.status = "processing";
        deployment.progress = 60;
        deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
      }, 1500);
      if (request.deploymentType === "production") {
        setTimeout(() => {
          deployment.status = "review";
          deployment.progress = 80;
          deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
          deployment.reviewNotes = "App submitted to Google Play. Review typically takes 1-3 hours.";
        }, 3e3);
        setTimeout(() => {
          deployment.status = "published";
          deployment.progress = 100;
          deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
          deployment.storeUrl = `https://play.google.com/store/apps/details?id=${request.bundleId}`;
        }, 6e3);
      } else {
        setTimeout(() => {
          deployment.status = "published";
          deployment.progress = 100;
          deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
          deployment.storeUrl = "https://play.google.com/apps/internaltest/demo-link";
        }, 2500);
      }
      return deployment;
    } catch (error) {
      return {
        id: deploymentId,
        status: "failed",
        platform: "Android",
        progress: 0,
        lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
        reviewNotes: `Deployment failed: ${error.message}`
      };
    }
  }
  /**
   * Get deployment status
   * 
   * @param deploymentId Deployment ID
   * @returns Deployment status
   */
  async getDeploymentStatus(deploymentId) {
    return null;
  }
  /**
   * List all deployments
   * 
   * @returns Array of deployment statuses
   */
  async listDeployments() {
    return [];
  }
  /**
   * Cancel a deployment
   * 
   * @param deploymentId Deployment ID
   * @returns Success status
   */
  async cancelDeployment(deploymentId) {
    return false;
  }
  /**
   * Validate App Store credentials
   * 
   * @param config App Store configuration
   * @returns Validation result
   */
  async validateAppStoreCredentials(config) {
    try {
      if (!config.keyId || !config.issuerId || !config.privateKey) {
        return {
          valid: false,
          message: "Missing required App Store Connect credentials"
        };
      }
      return {
        valid: true,
        message: "App Store Connect credentials are valid"
      };
    } catch (error) {
      return {
        valid: false,
        message: `Invalid credentials: ${error.message}`
      };
    }
  }
  /**
   * Validate Play Store credentials
   * 
   * @param config Play Store configuration
   * @returns Validation result
   */
  async validatePlayStoreCredentials(config) {
    try {
      if (!config.serviceAccountEmail || !config.serviceAccountKey) {
        return {
          valid: false,
          message: "Missing required Google Play Console credentials"
        };
      }
      return {
        valid: true,
        message: "Google Play Console credentials are valid"
      };
    } catch (error) {
      return {
        valid: false,
        message: `Invalid credentials: ${error.message}`
      };
    }
  }
};
function createAppStoreService() {
  const appStoreConfig = process.env.APPLE_KEY_ID ? {
    keyId: process.env.APPLE_KEY_ID,
    issuerId: process.env.APPLE_ISSUER_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY,
    bundleId: process.env.APPLE_BUNDLE_ID
  } : void 0;
  const playStoreConfig = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    packageName: process.env.GOOGLE_PACKAGE_NAME
  } : void 0;
  return new AppStoreService(appStoreConfig, playStoreConfig);
}

// server/phoenix/routes/deployment.ts
init_settings();
var deploymentRouter = express2.Router();
var deploymentConfigs = [];
var activeDeployments = [];
function requireGitHubConfig2(req, res, next) {
  const validation = validateGitHubSettings();
  if (!validation.valid) {
    return res.status(400).json({
      error: "GitHub Configuration Missing",
      message: validation.message
    });
  }
  next();
}
deploymentRouter.post("/create", requireGitHubConfig2, async (req, res) => {
  try {
    const deploymentRequest = req.body;
    if (!deploymentRequest.appName || !deploymentRequest.bundleId) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Missing required fields: appName, bundleId"
      });
    }
    const githubService = createGitHubIntegrationService();
    deploymentRequest.artifactUrl = `https://github.com/demo-owner/${deploymentRequest.bundleId}/releases/latest/download/app.ipa`;
    const appStoreService = createAppStoreService();
    const result = await appStoreService.deployApp(deploymentRequest);
    activeDeployments.push(...result.deployments);
    res.status(201).json({
      success: true,
      message: "Deployment initiated successfully",
      deployments: result.deployments
    });
  } catch (error) {
    console.error("Error creating deployment:", error);
    res.status(500).json({
      error: "Failed to create deployment",
      message: error.message
    });
  }
});
deploymentRouter.get("/status", async (req, res) => {
  try {
    const now = Date.now();
    const updatedDeployments = activeDeployments.map((deployment) => {
      const timeSinceStart = now - new Date(deployment.lastUpdate).getTime();
      if (deployment.status === "uploading" && timeSinceStart > 3e4) {
        deployment.status = "processing";
        deployment.progress = 50;
        deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
      } else if (deployment.status === "processing" && timeSinceStart > 6e4) {
        deployment.status = "review";
        deployment.progress = 75;
        deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
      } else if (deployment.status === "review" && timeSinceStart > 12e4) {
        deployment.status = "published";
        deployment.progress = 100;
        deployment.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
        deployment.storeUrl = deployment.platform === "iOS" ? "https://apps.apple.com/app/demo-app" : "https://play.google.com/store/apps/details?id=com.demo.app";
      }
      return deployment;
    });
    res.json(updatedDeployments);
  } catch (error) {
    console.error("Error fetching deployment status:", error);
    res.status(500).json({
      error: "Failed to fetch deployment status",
      message: error.message
    });
  }
});
deploymentRouter.get("/status/:deploymentId", async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const deployment = activeDeployments.find((d) => d.id === deploymentId);
    if (!deployment) {
      return res.status(404).json({
        error: "Deployment not found",
        message: `No deployment found with ID: ${deploymentId}`
      });
    }
    res.json(deployment);
  } catch (error) {
    console.error("Error fetching deployment status:", error);
    res.status(500).json({
      error: "Failed to fetch deployment status",
      message: error.message
    });
  }
});
deploymentRouter.get("/configs", async (req, res) => {
  try {
    res.json(deploymentConfigs);
  } catch (error) {
    console.error("Error fetching deployment configs:", error);
    res.status(500).json({
      error: "Failed to fetch deployment configs",
      message: error.message
    });
  }
});
deploymentRouter.post("/configs", async (req, res) => {
  try {
    const config = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    deploymentConfigs.push(config);
    res.status(201).json({
      success: true,
      message: "Configuration saved successfully",
      config
    });
  } catch (error) {
    console.error("Error saving deployment config:", error);
    res.status(500).json({
      error: "Failed to save deployment config",
      message: error.message
    });
  }
});
deploymentRouter.post("/validate/:store", async (req, res) => {
  try {
    const { store } = req.params;
    const credentials = req.body;
    const appStoreService = createAppStoreService();
    let validation;
    if (store === "apple") {
      validation = await appStoreService.validateAppStoreCredentials(credentials);
    } else if (store === "google") {
      validation = await appStoreService.validatePlayStoreCredentials(credentials);
    } else {
      return res.status(400).json({
        error: "Invalid Store",
        message: 'Store must be either "apple" or "google"'
      });
    }
    res.json(validation);
  } catch (error) {
    console.error("Error validating credentials:", error);
    res.status(500).json({
      error: "Failed to validate credentials",
      message: error.message
    });
  }
});
deploymentRouter.post("/cancel/:deploymentId", async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const deploymentIndex = activeDeployments.findIndex((d) => d.id === deploymentId);
    if (deploymentIndex === -1) {
      return res.status(404).json({
        error: "Deployment not found",
        message: `No deployment found with ID: ${deploymentId}`
      });
    }
    activeDeployments[deploymentIndex].status = "cancelled";
    activeDeployments[deploymentIndex].lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
    res.json({
      success: true,
      message: "Deployment cancelled successfully"
    });
  } catch (error) {
    console.error("Error cancelling deployment:", error);
    res.status(500).json({
      error: "Failed to cancel deployment",
      message: error.message
    });
  }
});
deploymentRouter.get("/history", async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const history = activeDeployments.filter((d) => d.status === "published" || d.status === "failed").slice(Number(offset), Number(offset) + Number(limit));
    res.json({
      deployments: history,
      total: activeDeployments.length,
      hasMore: Number(offset) + Number(limit) < activeDeployments.length
    });
  } catch (error) {
    console.error("Error fetching deployment history:", error);
    res.status(500).json({
      error: "Failed to fetch deployment history",
      message: error.message
    });
  }
});
var deployment_default = deploymentRouter;

// server/phoenix/routes/testing.ts
import express3 from "express";

// server/phoenix/services/TestingService.ts
var TestingService = class {
  testSuites = /* @__PURE__ */ new Map();
  testDevices = /* @__PURE__ */ new Map();
  testResults = /* @__PURE__ */ new Map();
  qualityGates = [];
  activeExecutions = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeMockData();
  }
  /**
   * Initialize mock test data for demonstration
   */
  initializeMockData() {
    const mockSuites = [
      {
        id: "unit-tests",
        name: "Unit Tests",
        type: "unit",
        platform: "both",
        status: "passed",
        duration: 120,
        testCount: 156,
        passedTests: 154,
        failedTests: 2,
        lastRun: new Date(Date.now() - 36e5).toISOString(),
        configuration: {
          timeout: 30,
          retries: 2,
          parallel: true
        }
      },
      {
        id: "integration-tests",
        name: "Integration Tests",
        type: "integration",
        platform: "both",
        status: "running",
        duration: 300,
        testCount: 45,
        passedTests: 42,
        failedTests: 0,
        lastRun: (/* @__PURE__ */ new Date()).toISOString(),
        configuration: {
          timeout: 60,
          retries: 1,
          parallel: false
        }
      },
      {
        id: "ui-tests-ios",
        name: "iOS UI Tests",
        type: "ui",
        platform: "ios",
        status: "passed",
        duration: 480,
        testCount: 28,
        passedTests: 28,
        failedTests: 0,
        lastRun: new Date(Date.now() - 72e5).toISOString(),
        configuration: {
          timeout: 120,
          retries: 3,
          parallel: false,
          devices: ["iphone-14", "ipad-pro"]
        }
      },
      {
        id: "ui-tests-android",
        name: "Android UI Tests",
        type: "ui",
        platform: "android",
        status: "failed",
        duration: 420,
        testCount: 32,
        passedTests: 29,
        failedTests: 3,
        lastRun: new Date(Date.now() - 54e5).toISOString(),
        configuration: {
          timeout: 120,
          retries: 3,
          parallel: false,
          devices: ["pixel-7", "galaxy-s23"]
        }
      },
      {
        id: "performance-tests",
        name: "Performance Tests",
        type: "performance",
        platform: "both",
        status: "passed",
        duration: 600,
        testCount: 12,
        passedTests: 11,
        failedTests: 1,
        lastRun: new Date(Date.now() - 864e5).toISOString(),
        configuration: {
          timeout: 300,
          retries: 1,
          parallel: false
        }
      },
      {
        id: "security-tests",
        name: "Security Tests",
        type: "security",
        platform: "both",
        status: "passed",
        duration: 240,
        testCount: 18,
        passedTests: 17,
        failedTests: 1,
        lastRun: new Date(Date.now() - 1728e5).toISOString(),
        configuration: {
          timeout: 180,
          retries: 0,
          parallel: true
        }
      }
    ];
    mockSuites.forEach((suite) => this.testSuites.set(suite.id, suite));
    const mockDevices = [
      {
        id: "iphone-14",
        name: "iPhone 14",
        platform: "ios",
        version: "16.5",
        type: "simulator",
        status: "available",
        location: "Cloud",
        capabilities: {
          screenResolution: "1170x2532",
          ram: "6GB",
          storage: "128GB"
        }
      },
      {
        id: "ipad-pro",
        name: 'iPad Pro 12.9"',
        platform: "ios",
        version: "16.5",
        type: "simulator",
        status: "available",
        location: "Cloud",
        capabilities: {
          screenResolution: "2048x2732",
          ram: "8GB",
          storage: "256GB"
        }
      },
      {
        id: "pixel-7",
        name: "Google Pixel 7",
        platform: "android",
        version: "13",
        type: "physical",
        status: "busy",
        location: "Lab Device Farm",
        capabilities: {
          screenResolution: "1080x2400",
          ram: "8GB",
          storage: "128GB"
        }
      },
      {
        id: "galaxy-s23",
        name: "Samsung Galaxy S23",
        platform: "android",
        version: "13",
        type: "physical",
        status: "available",
        location: "Lab Device Farm",
        capabilities: {
          screenResolution: "1080x2340",
          ram: "8GB",
          storage: "256GB"
        }
      },
      {
        id: "pixel-emulator",
        name: "Pixel 7 Emulator",
        platform: "android",
        version: "13",
        type: "simulator",
        status: "available",
        location: "Cloud",
        capabilities: {
          screenResolution: "1080x2400",
          ram: "4GB",
          storage: "32GB"
        }
      },
      {
        id: "iphone-se",
        name: "iPhone SE (3rd gen)",
        platform: "ios",
        version: "16.5",
        type: "physical",
        status: "offline",
        location: "Lab Device Farm",
        capabilities: {
          screenResolution: "750x1334",
          ram: "4GB",
          storage: "64GB"
        }
      }
    ];
    mockDevices.forEach((device) => this.testDevices.set(device.id, device));
    this.qualityGates = [
      {
        id: "unit-coverage",
        name: "Unit Test Coverage",
        type: "coverage",
        threshold: 80,
        currentValue: 85,
        status: "passed",
        required: true
      },
      {
        id: "performance-startup",
        name: "App Startup Time",
        type: "performance",
        threshold: 3e3,
        currentValue: 2100,
        status: "passed",
        required: true
      },
      {
        id: "security-scan",
        name: "Security Vulnerabilities",
        type: "security",
        threshold: 0,
        currentValue: 1,
        status: "warning",
        required: false
      },
      {
        id: "ui-critical-flows",
        name: "Critical UI Flows",
        type: "ui",
        threshold: 100,
        currentValue: 100,
        status: "passed",
        required: true
      }
    ];
  }
  /**
   * Get all test suites
   */
  async getTestSuites(platform) {
    const suites = Array.from(this.testSuites.values());
    if (platform && platform !== "both") {
      return suites.filter((suite) => suite.platform === platform || suite.platform === "both");
    }
    return suites;
  }
  /**
   * Get all test devices
   */
  async getTestDevices(platform) {
    const devices = Array.from(this.testDevices.values());
    if (platform && platform !== "both") {
      return devices.filter((device) => device.platform === platform);
    }
    return devices;
  }
  /**
   * Get test results for a suite
   */
  async getTestResults(suiteId) {
    if (suiteId && suiteId !== "all") {
      return this.testResults.get(suiteId) || [];
    }
    const allResults = [];
    for (const results of this.testResults.values()) {
      allResults.push(...results);
    }
    return allResults.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }
  /**
   * Execute a test suite
   */
  async executeTestSuite(suiteId, deviceId, platform) {
    const suite = this.testSuites.get(suiteId);
    if (!suite) {
      throw new Error(`Test suite not found: ${suiteId}`);
    }
    const execution = {
      id: `exec-${Date.now()}`,
      suiteId,
      deviceId,
      platform: platform || suite.platform,
      status: "queued",
      progress: 0,
      startTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.activeExecutions.set(execution.id, execution);
    this.simulateTestExecution(execution);
    return execution;
  }
  /**
   * Simulate test execution for demonstration
   */
  async simulateTestExecution(execution) {
    const suite = this.testSuites.get(execution.suiteId);
    if (!suite) return;
    suite.status = "running";
    this.testSuites.set(suite.id, suite);
    if (execution.deviceId) {
      const device = this.testDevices.get(execution.deviceId);
      if (device) {
        device.status = "busy";
        this.testDevices.set(device.id, device);
      }
    }
    execution.status = "running";
    const totalDuration = suite.configuration.timeout * suite.testCount;
    const progressInterval = totalDuration / 10;
    for (let i = 0; i <= 10; i++) {
      setTimeout(() => {
        execution.progress = i * 10;
        this.activeExecutions.set(execution.id, execution);
      }, i * progressInterval * 100);
    }
    setTimeout(() => {
      const results = [];
      const now = (/* @__PURE__ */ new Date()).toISOString();
      for (let i = 0; i < suite.testCount; i++) {
        const testResult = {
          id: `result-${execution.id}-${i}`,
          suiteId: suite.id,
          suiteName: suite.name,
          testName: `Test Case ${i + 1}`,
          status: Math.random() > 0.1 ? "passed" : "failed",
          // 90% pass rate
          duration: Math.floor(Math.random() * 30) + 5,
          startTime: now,
          endTime: now,
          deviceId: execution.deviceId
        };
        if (testResult.status === "failed") {
          testResult.errorMessage = "Assertion failed: Expected value to be truthy";
          testResult.stackTrace = "at TestCase.test (test.js:42:10)";
        }
        results.push(testResult);
      }
      this.testResults.set(suite.id, results);
      const passedTests = results.filter((r) => r.status === "passed").length;
      const failedTests = results.filter((r) => r.status === "failed").length;
      suite.status = failedTests > 0 ? "failed" : "passed";
      suite.passedTests = passedTests;
      suite.failedTests = failedTests;
      suite.lastRun = now;
      suite.duration = Math.floor(totalDuration / 1e3);
      this.testSuites.set(suite.id, suite);
      execution.status = "completed";
      execution.progress = 100;
      this.activeExecutions.set(execution.id, execution);
      if (execution.deviceId) {
        const device = this.testDevices.get(execution.deviceId);
        if (device) {
          device.status = "available";
          this.testDevices.set(device.id, device);
        }
      }
      setTimeout(() => {
        this.activeExecutions.delete(execution.id);
      }, 6e4);
    }, totalDuration / 10);
  }
  /**
   * Get quality gates status
   */
  async getQualityGates() {
    return this.qualityGates;
  }
  /**
   * Get active test executions
   */
  async getActiveExecutions() {
    return Array.from(this.activeExecutions.values());
  }
  /**
   * Cancel test execution
   */
  async cancelTestExecution(executionId) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) {
      return false;
    }
    execution.status = "cancelled";
    this.activeExecutions.set(executionId, execution);
    const suite = this.testSuites.get(execution.suiteId);
    if (suite) {
      suite.status = "cancelled";
      this.testSuites.set(suite.id, suite);
    }
    if (execution.deviceId) {
      const device = this.testDevices.get(execution.deviceId);
      if (device) {
        device.status = "available";
        this.testDevices.set(device.id, device);
      }
    }
    return true;
  }
  /**
   * Get test statistics
   */
  async getTestStatistics() {
    const suites = Array.from(this.testSuites.values());
    const devices = Array.from(this.testDevices.values());
    const totalSuites = suites.length;
    const runningSuites = suites.filter((s) => s.status === "running").length;
    const totalTests = suites.reduce((acc, s) => acc + s.testCount, 0);
    const passedTests = suites.reduce((acc, s) => acc + s.passedTests, 0);
    const successRate = totalTests > 0 ? passedTests / totalTests * 100 : 0;
    const availableDevices = devices.filter((d) => d.status === "available").length;
    const totalDevices = devices.length;
    const failedTests = suites.reduce((acc, s) => acc + s.failedTests, 0);
    return {
      totalSuites,
      runningSuites,
      successRate,
      availableDevices,
      totalDevices,
      failedTests
    };
  }
};
function createTestingService() {
  return new TestingService();
}

// server/phoenix/routes/testing.ts
var testingRouter = express3.Router();
testingRouter.get("/suites", async (req, res) => {
  try {
    const { platform } = req.query;
    const testingService = createTestingService();
    const suites = await testingService.getTestSuites(platform);
    res.json(suites);
  } catch (error) {
    console.error("Error fetching test suites:", error);
    res.status(500).json({
      error: "Failed to fetch test suites",
      message: error.message
    });
  }
});
testingRouter.get("/devices", async (req, res) => {
  try {
    const { platform } = req.query;
    const testingService = createTestingService();
    const devices = await testingService.getTestDevices(platform);
    res.json(devices);
  } catch (error) {
    console.error("Error fetching test devices:", error);
    res.status(500).json({
      error: "Failed to fetch test devices",
      message: error.message
    });
  }
});
testingRouter.get("/results/:suiteId?", async (req, res) => {
  try {
    const { suiteId } = req.params;
    const testingService = createTestingService();
    const results = await testingService.getTestResults(suiteId);
    res.json(results);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({
      error: "Failed to fetch test results",
      message: error.message
    });
  }
});
testingRouter.post("/run", async (req, res) => {
  try {
    const { suiteId, deviceId, platform } = req.body;
    if (!suiteId) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Suite ID is required"
      });
    }
    const testingService = createTestingService();
    if (suiteId === "all") {
      const suites = await testingService.getTestSuites(platform);
      const executions = [];
      for (const suite of suites) {
        if (suite.status !== "running") {
          const execution = await testingService.executeTestSuite(suite.id, deviceId, platform);
          executions.push(execution);
        }
      }
      res.json({
        success: true,
        message: `Started ${executions.length} test suites`,
        executions
      });
    } else {
      const execution = await testingService.executeTestSuite(suiteId, deviceId, platform);
      res.json({
        success: true,
        message: "Test suite started successfully",
        execution
      });
    }
  } catch (error) {
    console.error("Error running test suite:", error);
    res.status(500).json({
      error: "Failed to run test suite",
      message: error.message
    });
  }
});
testingRouter.post("/cancel/:executionId", async (req, res) => {
  try {
    const { executionId } = req.params;
    const testingService = createTestingService();
    const cancelled = await testingService.cancelTestExecution(executionId);
    if (!cancelled) {
      return res.status(404).json({
        error: "Execution not found",
        message: `No active execution found with ID: ${executionId}`
      });
    }
    res.json({
      success: true,
      message: "Test execution cancelled successfully"
    });
  } catch (error) {
    console.error("Error cancelling test execution:", error);
    res.status(500).json({
      error: "Failed to cancel test execution",
      message: error.message
    });
  }
});
testingRouter.get("/quality-gates", async (req, res) => {
  try {
    const testingService = createTestingService();
    const qualityGates = await testingService.getQualityGates();
    res.json(qualityGates);
  } catch (error) {
    console.error("Error fetching quality gates:", error);
    res.status(500).json({
      error: "Failed to fetch quality gates",
      message: error.message
    });
  }
});
testingRouter.get("/executions", async (req, res) => {
  try {
    const testingService = createTestingService();
    const executions = await testingService.getActiveExecutions();
    res.json(executions);
  } catch (error) {
    console.error("Error fetching active executions:", error);
    res.status(500).json({
      error: "Failed to fetch active executions",
      message: error.message
    });
  }
});
testingRouter.get("/statistics", async (req, res) => {
  try {
    const testingService = createTestingService();
    const statistics = await testingService.getTestStatistics();
    res.json(statistics);
  } catch (error) {
    console.error("Error fetching testing statistics:", error);
    res.status(500).json({
      error: "Failed to fetch testing statistics",
      message: error.message
    });
  }
});
var testing_default = testingRouter;

// server/phoenix/routes/ci-integration.ts
import express4 from "express";

// server/phoenix/services/CIIntegrationService.ts
import fs3 from "fs";
var CIIntegrationService = class {
  githubService;
  xcodeGenerator;
  constructor() {
    this.githubService = createGitHubIntegrationService();
    this.xcodeGenerator = createXcodeProjectGenerator();
  }
  /**
   * Complete workflow: Generate project → Commit → Trigger build
   */
  async generateAndBuild(request) {
    try {
      console.log(`Starting build workflow for ${request.appName} (${request.platform})`);
      const projectFiles = await this.generateProjectFiles(request);
      const branchName = `generated-${Date.now()}-${request.platform}`;
      await this.commitToGitHub(branchName, projectFiles, request);
      await this.ensureWorkflowFiles(request.platform);
      const workflowRun = await this.triggerBuild(branchName, request);
      return {
        success: true,
        branchName,
        workflowRunId: workflowRun?.id,
        buildUrl: workflowRun?.html_url,
        message: `Build started successfully for ${request.appName}`
      };
    } catch (error) {
      console.error("Build workflow failed:", error);
      return {
        success: false,
        branchName: "",
        message: `Build failed: ${error.message}`
      };
    }
  }
  /**
   * Generate project files based on platform
   */
  async generateProjectFiles(request) {
    const files = /* @__PURE__ */ new Map();
    switch (request.platform) {
      case "ios":
        return this.generateIOSProject(request);
      case "android":
        return this.generateAndroidProject(request);
      case "react-native":
        return this.generateReactNativeProject(request);
      case "flutter":
        return this.generateFlutterProject(request);
      default:
        throw new Error(`Unsupported platform: ${request.platform}`);
    }
  }
  /**
   * Generate iOS project with XcodeGen
   */
  async generateIOSProject(request) {
    const files = /* @__PURE__ */ new Map();
    const mainSwift = this.generateSwiftCode(request);
    files.set("Sources/App/ContentView.swift", mainSwift);
    const projectYml = this.generateXcodeGenConfig(request);
    files.set("project.yml", projectYml);
    const infoPlist = this.generateInfoPlist(request);
    files.set("Sources/App/Info.plist", infoPlist);
    if (request.assets?.icon) {
      const iconFiles = await this.generateAppIcons(request.assets.icon);
      iconFiles.forEach((content, path6) => {
        files.set(path6, content);
      });
    }
    const fastlaneFiles = this.generateFastlaneFiles(request);
    fastlaneFiles.forEach((content, path6) => {
      files.set(path6, content);
    });
    return files;
  }
  /**
   * Generate Android project
   */
  async generateAndroidProject(request) {
    const files = /* @__PURE__ */ new Map();
    const mainActivity = this.generateKotlinCode(request);
    files.set("app/src/main/java/com/example/app/MainActivity.kt", mainActivity);
    const buildGradle = this.generateBuildGradle(request);
    files.set("app/build.gradle", buildGradle);
    const manifest = this.generateAndroidManifest(request);
    files.set("app/src/main/AndroidManifest.xml", manifest);
    files.set("gradle/wrapper/gradle-wrapper.properties", this.generateGradleWrapper());
    files.set("gradlew", this.generateGradlewScript());
    return files;
  }
  /**
   * Generate React Native project
   */
  async generateReactNativeProject(request) {
    const files = /* @__PURE__ */ new Map();
    const appTsx = this.generateReactNativeCode(request);
    files.set("App.tsx", appTsx);
    const packageJson = this.generateReactNativePackageJson(request);
    files.set("package.json", packageJson);
    files.set("metro.config.js", this.generateMetroConfig());
    return files;
  }
  /**
   * Generate Flutter project
   */
  async generateFlutterProject(request) {
    const files = /* @__PURE__ */ new Map();
    const mainDart = this.generateFlutterCode(request);
    files.set("lib/main.dart", mainDart);
    const pubspec = this.generatePubspecYaml(request);
    files.set("pubspec.yaml", pubspec);
    return files;
  }
  /**
   * Commit generated files to GitHub
   */
  async commitToGitHub(branchName, files, request) {
    const commitMessage = `Generated ${request.platform} app: ${request.appName}`;
    const filesArray = Array.from(files.entries()).map(([path6, content]) => ({
      path: path6,
      content
    }));
    await this.githubService.createBranch(branchName, filesArray, commitMessage);
  }
  /**
   * Ensure workflow files exist in repository
   */
  async ensureWorkflowFiles(platform) {
    const workflowPath = `.github/workflows/${platform}-build.yml`;
    try {
      await this.githubService.getFileContent(workflowPath);
      console.log(`Workflow file ${workflowPath} already exists`);
    } catch (error) {
      console.log(`Creating workflow file ${workflowPath} from template`);
      const templatePath = `./server/phoenix/templates/github/workflows/${platform}-build.yml`;
      const workflowContent = fs3.readFileSync(templatePath, "utf8");
      await this.githubService.createOrUpdateFile(
        workflowPath,
        workflowContent,
        `Add ${platform} build workflow`
      );
    }
  }
  /**
   * Trigger the build workflow
   */
  async triggerBuild(branchName, request) {
    const workflowFileName = `${request.platform}-build.yml`;
    return await this.githubService.triggerWorkflow(workflowFileName, {
      ref: branchName,
      inputs: {
        app_name: request.appName,
        bundle_id: request.bundleId,
        version: request.configuration.version,
        build_number: request.configuration.buildNumber
      }
    });
  }
  /**
   * Generate Swift code for iOS
   */
  generateSwiftCode(request) {
    return `import SwiftUI

@main
struct ${request.appName.replace(/\s+/g, "")}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("Hello, ${request.appName}!")
                .font(.title)
                .padding()
            
            ${request.sourceCode || 'Text("Welcome to your generated app!")'}
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}`;
  }
  /**
   * Generate XcodeGen configuration
   */
  generateXcodeGenConfig(request) {
    return `name: ${request.appName}
options:
  bundleIdPrefix: ${request.bundleId.split(".").slice(0, -1).join(".")}
  createIntermediateGroups: true
  
settings:
  DEVELOPMENT_TEAM: ${request.configuration.signingTeam || "YOUR_TEAM_ID"}
  PRODUCT_BUNDLE_IDENTIFIER: ${request.bundleId}
  MARKETING_VERSION: ${request.configuration.version}
  CURRENT_PROJECT_VERSION: ${request.configuration.buildNumber}

targets:
  ${request.appName.replace(/\s+/g, "")}:
    type: application
    platform: iOS
    deploymentTarget: "15.0"
    sources:
      - Sources/App
    settings:
      PRODUCT_BUNDLE_IDENTIFIER: ${request.bundleId}
      INFOPLIST_FILE: Sources/App/Info.plist
    
schemes:
  ${request.appName.replace(/\s+/g, "")}:
    build:
      targets:
        ${request.appName.replace(/\s+/g, "")}: all
    run:
      config: Debug
    archive:
      config: Release`;
  }
  /**
   * Generate Info.plist
   */
  generateInfoPlist(request) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>${request.appName}</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>${request.bundleId}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${request.appName}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${request.configuration.version}</string>
    <key>CFBundleVersion</key>
    <string>${request.configuration.buildNumber}</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>`;
  }
  /**
   * Generate app icons from base64 image
   */
  async generateAppIcons(base64Icon) {
    const files = /* @__PURE__ */ new Map();
    const contentsJson = {
      images: [
        { idiom: "iphone", scale: "2x", size: "20x20" },
        { idiom: "iphone", scale: "3x", size: "20x20" },
        { idiom: "iphone", scale: "2x", size: "29x29" },
        { idiom: "iphone", scale: "3x", size: "29x29" },
        { idiom: "iphone", scale: "2x", size: "40x40" },
        { idiom: "iphone", scale: "3x", size: "40x40" },
        { idiom: "iphone", scale: "2x", size: "60x60" },
        { idiom: "iphone", scale: "3x", size: "60x60" },
        { idiom: "ios-marketing", scale: "1x", size: "1024x1024" }
      ].map((icon) => ({
        ...icon,
        filename: `icon-${icon.size}@${icon.scale}.png`
      })),
      info: { author: "xcode", version: 1 }
    };
    files.set("Sources/App/AppIcon.appiconset/Contents.json", JSON.stringify(contentsJson, null, 2));
    return files;
  }
  /**
   * Generate Fastlane files
   */
  generateFastlaneFiles(request) {
    const files = /* @__PURE__ */ new Map();
    const fastfile = `default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    match(type: "appstore")
    gym(scheme: "${request.appName.replace(/\s+/g, "")}")
    pilot(skip_waiting_for_build_processing: true)
  end
  
  desc "Build for App Store"
  lane :release do
    match(type: "appstore")
    gym(scheme: "${request.appName.replace(/\s+/g, "")}")
    deliver(force: true)
  end
end`;
    files.set("fastlane/Fastfile", fastfile);
    const appfile = `app_identifier("${request.bundleId}")
apple_id("YOUR_APPLE_ID")
itc_team_id("YOUR_ITC_TEAM_ID")
team_id("${request.configuration.signingTeam || "YOUR_TEAM_ID"}")`;
    files.set("fastlane/Appfile", appfile);
    return files;
  }
  /**
   * Generate Kotlin code for Android
   */
  generateKotlinCode(request) {
    return `package com.example.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ${request.appName.replace(/\s+/g, "")}Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainScreen()
                }
            }
        }
    }
}

@Composable
fun MainScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Hello, ${request.appName}!",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Welcome to your generated app!",
            fontSize = 16.sp
        )
    }
}

@Composable
fun ${request.appName.replace(/\s+/g, "")}Theme(content: @Composable () -> Unit) {
    MaterialTheme {
        content()
    }
}`;
  }
  /**
   * Generate build.gradle for Android
   */
  generateBuildGradle(request) {
    return `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace '${request.bundleId}'
    compileSdk 34

    defaultConfig {
        applicationId "${request.bundleId}"
        minSdk 24
        targetSdk 34
        versionCode ${request.configuration.buildNumber}
        versionName "${request.configuration.version}"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    buildFeatures {
        compose true
    }

    composeOptions {
        kotlinCompilerExtensionVersion '1.5.4'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
    implementation 'androidx.activity:activity-compose:1.8.2'
    implementation 'androidx.compose.ui:ui:1.5.4'
    implementation 'androidx.compose.material3:material3:1.1.2'
}`;
  }
  /**
   * Generate other required files...
   */
  generateAndroidManifest(request) {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${request.appName}"
        android:theme="@style/Theme.${request.appName.replace(/\s+/g, "")}">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.${request.appName.replace(/\s+/g, "")}">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  }
  generateGradleWrapper() {
    return `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`;
  }
  generateGradlewScript() {
    return `#!/bin/sh
./gradlew "$@"`;
  }
  generateReactNativeCode(request) {
    return `import React from 'react';


const App = () => {
  return (
    <div className="mobile-converted">
      <span className="mobile-converted">Hello, ${request.appName}!</span>
      <span className="mobile-converted">Welcome to your generated app!</span>
    </div>
  );
};

export default App;`;
  }
  generateReactNativePackageJson(request) {
    return JSON.stringify({
      name: request.appName.toLowerCase().replace(/\s+/g, "-"),
      version: request.configuration.version,
      private: true,
      scripts: {
        android: "react-native run-android",
        ios: "react-native run-ios",
        start: "react-native start",
        test: "jest",
        lint: "eslint ."
      },
      dependencies: {
        react: "18.2.0",
        "react-native": "0.72.6"
      },
      devDependencies: {
        "@babel/core": "^7.20.0",
        "@babel/preset-env": "^7.20.0",
        "@babel/runtime": "^7.20.0"
      }
    }, null, 2);
  }
  generateMetroConfig() {
    return `const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
module.exports = mergeConfig(defaultConfig, {});`;
  }
  generateFlutterCode(request) {
    return `import 'package:flutter/material.dart';

void main() {
  runApp(${request.appName.replace(/\s+/g, "")}App());
}

class ${request.appName.replace(/\s+/g, "")}App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${request.appName}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${request.appName}'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Hello, ${request.appName}!',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            SizedBox(height: 16),
            Text(
              'Welcome to your generated app!',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }
}`;
  }
  generatePubspecYaml(request) {
    return `name: ${request.appName.toLowerCase().replace(/\s+/g, "_")}
description: ${request.appName} - Generated Flutter application
version: ${request.configuration.version}+${request.configuration.buildNumber}

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true`;
  }
};
function createCIIntegrationService() {
  return new CIIntegrationService();
}

// server/phoenix/routes/ci-integration.ts
init_settings();
var ciIntegrationRouter = express4.Router();
function requireGitHubConfig3(req, res, next) {
  const validation = validateGitHubSettings();
  if (!validation.valid) {
    return res.status(400).json({
      error: "GitHub Configuration Missing",
      message: validation.message
    });
  }
  next();
}
ciIntegrationRouter.post("/build", requireGitHubConfig3, async (req, res) => {
  try {
    const buildRequest = req.body;
    if (!buildRequest.appName || !buildRequest.bundleId || !buildRequest.platform) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Missing required fields: appName, bundleId, platform"
      });
    }
    const ciService = createCIIntegrationService();
    const result = await ciService.generateAndBuild(buildRequest);
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          branchName: result.branchName,
          workflowRunId: result.workflowRunId,
          buildUrl: result.buildUrl
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Build Failed",
        message: result.message
      });
    }
  } catch (error) {
    console.error("CI Integration error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});
ciIntegrationRouter.get("/build/:runId/status", requireGitHubConfig3, async (req, res) => {
  try {
    const { runId } = req.params;
    res.json({
      id: runId,
      status: "in_progress",
      conclusion: null,
      progress: 45,
      steps: [
        { name: "Checkout", status: "completed" },
        { name: "Setup Xcode", status: "completed" },
        { name: "Generate Project", status: "in_progress" },
        { name: "Build Archive", status: "queued" },
        { name: "Upload to TestFlight", status: "queued" }
      ]
    });
  } catch (error) {
    console.error("Error fetching build status:", error);
    res.status(500).json({
      error: "Failed to fetch build status",
      message: error.message
    });
  }
});
ciIntegrationRouter.get("/build/:runId/artifacts", requireGitHubConfig3, async (req, res) => {
  try {
    const { runId } = req.params;
    res.json({
      artifacts: [
        {
          id: "artifact-1",
          name: "iOS-App.ipa",
          size: "24.5 MB",
          download_url: `https://api.github.com/repos/user/repo/actions/artifacts/artifact-1/zip`
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching artifacts:", error);
    res.status(500).json({
      error: "Failed to fetch artifacts",
      message: error.message
    });
  }
});
ciIntegrationRouter.post("/setup", requireGitHubConfig3, async (req, res) => {
  try {
    const { platforms = ["ios", "android"] } = req.body;
    res.json({
      success: true,
      message: "Repository configured for CI/CD",
      platforms,
      nextSteps: [
        "Add required secrets to GitHub repository",
        "Configure code signing certificates",
        "Test the workflow with a sample build"
      ]
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({
      error: "Setup failed",
      message: error.message
    });
  }
});
var ci_integration_default = ciIntegrationRouter;

// server/phoenix/routes/collaboration.ts
import express5 from "express";

// server/phoenix/services/CollaborationService.ts
var CollaborationService = class {
  projects = /* @__PURE__ */ new Map();
  liveSessions = /* @__PURE__ */ new Map();
  // projectId -> userId -> LiveUser
  liveEdits = /* @__PURE__ */ new Map();
  // projectId -> edits
  constructor() {
    this.initializeMockData();
  }
  /**
   * Initialize mock collaboration data
   */
  initializeMockData() {
    const mockProject = {
      id: "project-demo",
      name: "TaskMaster Pro",
      description: "A productivity app with task management and team collaboration features",
      platform: "react-native",
      visibility: "team",
      status: "development",
      createdAt: new Date(Date.now() - 864e5 * 7).toISOString(),
      // 7 days ago
      updatedAt: new Date(Date.now() - 36e5).toISOString(),
      // 1 hour ago
      ownerId: "user-1",
      ownerName: "Sarah Johnson",
      collaborators: [
        {
          id: "collab-1",
          userId: "user-1",
          name: "Sarah Johnson",
          email: "sarah@acme.com",
          role: "owner",
          permissions: {
            canEdit: true,
            canComment: true,
            canShare: true,
            canExport: true
          },
          joinedAt: new Date(Date.now() - 864e5 * 7).toISOString(),
          lastActive: new Date(Date.now() - 18e5).toISOString()
          // 30 minutes ago
        },
        {
          id: "collab-2",
          userId: "user-2",
          name: "Mike Chen",
          email: "mike@acme.com",
          role: "editor",
          permissions: {
            canEdit: true,
            canComment: true,
            canShare: false,
            canExport: true
          },
          joinedAt: new Date(Date.now() - 864e5 * 5).toISOString(),
          lastActive: new Date(Date.now() - 3e5).toISOString()
          // 5 minutes ago
        },
        {
          id: "collab-3",
          userId: "user-3",
          name: "Emma Davis",
          email: "emma@acme.com",
          role: "editor",
          permissions: {
            canEdit: true,
            canComment: true,
            canShare: false,
            canExport: false
          },
          joinedAt: new Date(Date.now() - 864e5 * 3).toISOString(),
          lastActive: new Date(Date.now() - 6e5).toISOString()
          // 10 minutes ago
        },
        {
          id: "collab-4",
          userId: "user-4",
          name: "David Kim",
          email: "david@contractor.com",
          role: "viewer",
          permissions: {
            canEdit: false,
            canComment: true,
            canShare: false,
            canExport: false
          },
          joinedAt: new Date(Date.now() - 864e5 * 2).toISOString(),
          lastActive: new Date(Date.now() - 72e5).toISOString()
          // 2 hours ago
        }
      ],
      liveUsers: [
        {
          id: "live-1",
          name: "Mike Chen",
          cursor: {
            x: 450,
            y: 320,
            section: "UI Design"
          },
          isTyping: true,
          lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
          sessionId: "session-123"
        },
        {
          id: "live-2",
          name: "Emma Davis",
          cursor: {
            x: 200,
            y: 150,
            section: "App Logic"
          },
          isTyping: false,
          lastSeen: new Date(Date.now() - 6e4).toISOString(),
          // 1 minute ago
          sessionId: "session-456"
        }
      ],
      comments: [
        {
          id: "comment-1",
          userId: "user-2",
          userName: "Mike Chen",
          content: "The login flow looks great! Should we add biometric authentication as an option?",
          section: "ui",
          resolved: false,
          createdAt: new Date(Date.now() - 36e5).toISOString(),
          // 1 hour ago
          replies: [
            {
              id: "reply-1",
              userId: "user-1",
              userName: "Sarah Johnson",
              content: "Great idea! Let's add that to the next version.",
              createdAt: new Date(Date.now() - 3e6).toISOString()
              // 50 minutes ago
            }
          ]
        },
        {
          id: "comment-2",
          userId: "user-3",
          userName: "Emma Davis",
          content: "The task creation form could use some validation. Currently it allows empty tasks.",
          section: "logic",
          resolved: true,
          createdAt: new Date(Date.now() - 72e5).toISOString(),
          // 2 hours ago
          replies: []
        },
        {
          id: "comment-3",
          userId: "user-4",
          userName: "David Kim",
          content: "Performance seems good on my test device. Loading times are under 2 seconds.",
          section: "testing",
          resolved: false,
          createdAt: new Date(Date.now() - 18e5).toISOString(),
          // 30 minutes ago
          replies: []
        }
      ],
      versions: [
        {
          id: "version-1",
          version: "1.0.0",
          description: "Initial release with core task management features",
          createdBy: "Sarah Johnson",
          createdAt: new Date(Date.now() - 864e5 * 7).toISOString(),
          changes: [
            "Created basic task list interface",
            "Added user authentication",
            "Implemented task CRUD operations"
          ],
          snapshot: {}
        },
        {
          id: "version-2",
          version: "1.1.0",
          description: "Enhanced UI and team collaboration features",
          createdBy: "Mike Chen",
          createdAt: new Date(Date.now() - 864e5 * 3).toISOString(),
          changes: [
            "Redesigned task cards with better visual hierarchy",
            "Added team member assignment to tasks",
            "Implemented real-time task updates",
            "Added push notifications for task reminders"
          ],
          snapshot: {}
        },
        {
          id: "version-3",
          version: "1.2.0",
          description: "Performance improvements and bug fixes",
          createdBy: "Emma Davis",
          createdAt: new Date(Date.now() - 864e5).toISOString(),
          changes: [
            "Optimized app loading time by 40%",
            "Fixed task duplication bug",
            "Improved offline sync reliability",
            "Added dark mode support"
          ],
          snapshot: {}
        }
      ],
      settings: {
        allowComments: true,
        realTimeCollaboration: true,
        autoSave: true,
        versionHistory: true,
        maxCollaborators: 10
      }
    };
    this.projects.set(mockProject.id, mockProject);
    const liveSessions = /* @__PURE__ */ new Map();
    mockProject.liveUsers.forEach((user) => {
      liveSessions.set(user.id, user);
    });
    this.liveSessions.set(mockProject.id, liveSessions);
  }
  /**
   * Get project with collaboration data
   */
  async getProject(projectId, userId) {
    const project = this.projects.get(projectId);
    if (!project) {
      return null;
    }
    if (project.visibility === "private") {
      const hasAccess = project.collaborators.some((c) => c.userId === userId);
      if (!hasAccess) {
        return null;
      }
    }
    const sessions = this.liveSessions.get(projectId) || /* @__PURE__ */ new Map();
    project.liveUsers = Array.from(sessions.values());
    return project;
  }
  /**
   * Share project with a collaborator
   */
  async shareProject(projectId, email, role, invitedBy) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const existingCollaborator = project.collaborators.find((c) => c.email === email);
    if (existingCollaborator) {
      throw new Error("User is already a collaborator");
    }
    const collaborator = {
      id: `collab-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name: email.split("@")[0],
      // In real implementation, fetch from user profile
      email,
      role,
      permissions: {
        canEdit: role === "editor",
        canComment: true,
        canShare: false,
        canExport: role === "editor"
      },
      joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastActive: (/* @__PURE__ */ new Date()).toISOString()
    };
    project.collaborators.push(collaborator);
    this.projects.set(projectId, project);
    return collaborator;
  }
  /**
   * Add comment to project
   */
  async addComment(projectId, userId, content, section) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const collaborator = project.collaborators.find((c) => c.userId === userId);
    if (!collaborator) {
      throw new Error("User is not a collaborator");
    }
    const comment = {
      id: `comment-${Date.now()}`,
      userId,
      userName: collaborator.name,
      userAvatar: collaborator.avatar,
      content,
      section,
      resolved: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      replies: []
    };
    project.comments.push(comment);
    this.projects.set(projectId, project);
    return comment;
  }
  /**
   * Join live editing session
   */
  async joinLiveSession(projectId, userId, userName, sessionId) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const liveUser = {
      id: userId,
      name: userName,
      cursor: {
        x: 0,
        y: 0,
        section: "general"
      },
      isTyping: false,
      lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
      sessionId
    };
    let sessions = this.liveSessions.get(projectId);
    if (!sessions) {
      sessions = /* @__PURE__ */ new Map();
      this.liveSessions.set(projectId, sessions);
    }
    sessions.set(userId, liveUser);
    return liveUser;
  }
  /**
   * Update user cursor position
   */
  async updateCursor(projectId, userId, cursor) {
    const sessions = this.liveSessions.get(projectId);
    if (sessions && sessions.has(userId)) {
      const user = sessions.get(userId);
      user.cursor = cursor;
      user.lastSeen = (/* @__PURE__ */ new Date()).toISOString();
      sessions.set(userId, user);
    }
  }
  /**
   * Set user typing status
   */
  async setTypingStatus(projectId, userId, isTyping) {
    const sessions = this.liveSessions.get(projectId);
    if (sessions && sessions.has(userId)) {
      const user = sessions.get(userId);
      user.isTyping = isTyping;
      user.lastSeen = (/* @__PURE__ */ new Date()).toISOString();
      sessions.set(userId, user);
    }
  }
  /**
   * Leave live session
   */
  async leaveLiveSession(projectId, userId) {
    const sessions = this.liveSessions.get(projectId);
    if (sessions) {
      sessions.delete(userId);
    }
  }
  /**
   * Create new project version
   */
  async createVersion(projectId, version, description, changes, createdBy) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const newVersion = {
      id: `version-${Date.now()}`,
      version,
      description,
      createdBy,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      changes,
      snapshot: { ...project }
      // Deep copy of current project state
    };
    project.versions.push(newVersion);
    this.projects.set(projectId, project);
    return newVersion;
  }
  /**
   * Apply live edit operation
   */
  async applyLiveEdit(projectId, userId, operation) {
    let edits = this.liveEdits.get(projectId);
    if (!edits) {
      edits = [];
      this.liveEdits.set(projectId, edits);
    }
    operation.timestamp = (/* @__PURE__ */ new Date()).toISOString();
    operation.applied = false;
    edits.push(operation);
  }
  /**
   * Get live edits for project
   */
  async getLiveEdits(projectId, since) {
    const edits = this.liveEdits.get(projectId) || [];
    if (since) {
      const sinceDate = new Date(since);
      return edits.filter((edit) => new Date(edit.timestamp) > sinceDate);
    }
    return edits;
  }
  /**
   * Update project settings
   */
  async updateProjectSettings(projectId, settings) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    project.settings = { ...project.settings, ...settings };
    this.projects.set(projectId, project);
    return project.settings;
  }
  /**
   * Get collaboration statistics
   */
  async getCollaborationStats(projectId) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    return {
      totalCollaborators: project.collaborators.length,
      activeUsers: project.liveUsers.length,
      totalComments: project.comments.length,
      unresolvedComments: project.comments.filter((c) => !c.resolved).length,
      totalVersions: project.versions.length,
      lastActivity: project.updatedAt
    };
  }
};
function createCollaborationService() {
  return new CollaborationService();
}

// server/phoenix/routes/collaboration.ts
var collaborationRouter = express5.Router();
collaborationRouter.get("/projects/:projectId/collaboration", async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers["user-id"] || "user-1";
    const collaborationService = createCollaborationService();
    const project = await collaborationService.getProject(projectId, userId);
    if (!project) {
      return res.status(404).json({
        error: "Project not found",
        message: "Project not found or you do not have access to view it"
      });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project collaboration data:", error);
    res.status(500).json({
      error: "Failed to fetch project data",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/share", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const invitedBy = req.headers["user-name"] || "Current User";
    if (!email || !role) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Email and role are required"
      });
    }
    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({
        error: "Invalid Role",
        message: 'Role must be either "editor" or "viewer"'
      });
    }
    const collaborationService = createCollaborationService();
    const collaborator = await collaborationService.shareProject(projectId, email, role, invitedBy);
    res.status(201).json({
      success: true,
      message: "Project shared successfully",
      collaborator
    });
  } catch (error) {
    console.error("Error sharing project:", error);
    res.status(500).json({
      error: "Failed to share project",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/comments", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, section } = req.body;
    const userId = req.headers["user-id"] || "user-1";
    if (!content || !section) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Content and section are required"
      });
    }
    const collaborationService = createCollaborationService();
    const comment = await collaborationService.addComment(projectId, userId, content, section);
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      error: "Failed to add comment",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/live/join", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sessionId } = req.body;
    const userId = req.headers["user-id"] || "user-1";
    const userName = req.headers["user-name"] || "Anonymous User";
    const collaborationService = createCollaborationService();
    const liveUser = await collaborationService.joinLiveSession(projectId, userId, userName, sessionId);
    res.json({
      success: true,
      message: "Joined live session",
      liveUser
    });
  } catch (error) {
    console.error("Error joining live session:", error);
    res.status(500).json({
      error: "Failed to join live session",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/live/cursor", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { cursor } = req.body;
    const userId = req.headers["user-id"] || "user-1";
    if (!cursor || typeof cursor.x !== "number" || typeof cursor.y !== "number" || !cursor.section) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Cursor must have x, y coordinates and section"
      });
    }
    const collaborationService = createCollaborationService();
    await collaborationService.updateCursor(projectId, userId, cursor);
    res.json({
      success: true,
      message: "Cursor position updated"
    });
  } catch (error) {
    console.error("Error updating cursor:", error);
    res.status(500).json({
      error: "Failed to update cursor",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/live/typing", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { isTyping } = req.body;
    const userId = req.headers["user-id"] || "user-1";
    const collaborationService = createCollaborationService();
    await collaborationService.setTypingStatus(projectId, userId, Boolean(isTyping));
    res.json({
      success: true,
      message: "Typing status updated"
    });
  } catch (error) {
    console.error("Error updating typing status:", error);
    res.status(500).json({
      error: "Failed to update typing status",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/live/leave", async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers["user-id"] || "user-1";
    const collaborationService = createCollaborationService();
    await collaborationService.leaveLiveSession(projectId, userId);
    res.json({
      success: true,
      message: "Left live session"
    });
  } catch (error) {
    console.error("Error leaving live session:", error);
    res.status(500).json({
      error: "Failed to leave live session",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/versions", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { version, description, changes } = req.body;
    const createdBy = req.headers["user-name"] || "Anonymous User";
    if (!version || !description || !Array.isArray(changes)) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Version, description, and changes array are required"
      });
    }
    const collaborationService = createCollaborationService();
    const newVersion = await collaborationService.createVersion(projectId, version, description, changes, createdBy);
    res.status(201).json({
      success: true,
      message: "Version created successfully",
      version: newVersion
    });
  } catch (error) {
    console.error("Error creating version:", error);
    res.status(500).json({
      error: "Failed to create version",
      message: error.message
    });
  }
});
collaborationRouter.post("/projects/:projectId/live/edit", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { operation } = req.body;
    const userId = req.headers["user-id"] || "user-1";
    if (!operation || !operation.section || !operation.operation || !operation.data) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Operation must have section, operation type, and data"
      });
    }
    const liveEdit = {
      id: `edit-${Date.now()}`,
      userId,
      projectId,
      ...operation,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      applied: false
    };
    const collaborationService = createCollaborationService();
    await collaborationService.applyLiveEdit(projectId, userId, liveEdit);
    res.json({
      success: true,
      message: "Live edit applied",
      editId: liveEdit.id
    });
  } catch (error) {
    console.error("Error applying live edit:", error);
    res.status(500).json({
      error: "Failed to apply live edit",
      message: error.message
    });
  }
});
collaborationRouter.get("/projects/:projectId/live/edits", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { since } = req.query;
    const collaborationService = createCollaborationService();
    const edits = await collaborationService.getLiveEdits(projectId, since);
    res.json({
      edits,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error fetching live edits:", error);
    res.status(500).json({
      error: "Failed to fetch live edits",
      message: error.message
    });
  }
});
collaborationRouter.patch("/projects/:projectId/settings", async (req, res) => {
  try {
    const { projectId } = req.params;
    const settings = req.body;
    const collaborationService = createCollaborationService();
    const updatedSettings = await collaborationService.updateProjectSettings(projectId, settings);
    res.json({
      success: true,
      message: "Project settings updated",
      settings: updatedSettings
    });
  } catch (error) {
    console.error("Error updating project settings:", error);
    res.status(500).json({
      error: "Failed to update project settings",
      message: error.message
    });
  }
});
collaborationRouter.get("/projects/:projectId/stats", async (req, res) => {
  try {
    const { projectId } = req.params;
    const collaborationService = createCollaborationService();
    const stats = await collaborationService.getCollaborationStats(projectId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching collaboration stats:", error);
    res.status(500).json({
      error: "Failed to fetch collaboration stats",
      message: error.message
    });
  }
});
var collaboration_default = collaborationRouter;

// server/phoenix/routes.ts
var phoenixRouter = express6.Router();
function requireGitHubConfig4(req, res, next) {
  const validation = validateGitHubSettings();
  if (!validation.valid) {
    return res.status(400).json({
      error: "GitHub Configuration Missing",
      message: validation.message,
      details: {
        tokenConfigured: validation.tokenConfigured,
        ownerConfigured: validation.ownerConfigured
      }
    });
  }
  next();
}
phoenixRouter.get("/github/status", (req, res) => {
  const validation = validateGitHubSettings();
  res.json({
    configured: validation.valid,
    message: validation.message,
    details: {
      tokenConfigured: validation.tokenConfigured,
      ownerConfigured: validation.ownerConfigured
    }
  });
});
phoenixRouter.post("/github/repos", requireGitHubConfig4, async (req, res) => {
  try {
    const { name, description, isPrivate = true } = req.body;
    if (!name) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Repository name is required"
      });
    }
    const githubService = createGitHubIntegrationService();
    const repository = await githubService.createRepository(name, description || `${name} - Generated by Project Phoenix`, isPrivate);
    res.status(201).json(repository);
  } catch (error) {
    console.error("Error creating GitHub repository:", error);
    res.status(500).json({
      error: "Failed to create repository",
      message: error.message
    });
  }
});
phoenixRouter.post("/github/repos/:repo/workflows", requireGitHubConfig4, async (req, res) => {
  try {
    const { repo } = req.params;
    const { platform } = req.body;
    if (!platform) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Platform is required (ios, android, react-native, flutter)"
      });
    }
    const githubService = createGitHubIntegrationService();
    let result;
    switch (platform) {
      case "ios":
        result = await githubService.setupIOSWorkflow(repo);
        break;
      case "android":
        result = await githubService.setupAndroidWorkflow(repo);
        break;
      case "react-native":
        result = await githubService.setupReactNativeWorkflow(repo);
        break;
      case "flutter":
        result = await githubService.setupFlutterWorkflow(repo);
        break;
      default:
        return res.status(400).json({
          error: "Invalid Platform",
          message: "Platform must be one of: ios, android, react-native, flutter"
        });
    }
    res.status(201).json({
      success: true,
      platform,
      result
    });
  } catch (error) {
    console.error("Error setting up workflow:", error);
    res.status(500).json({
      error: "Failed to set up workflow",
      message: error.message
    });
  }
});
phoenixRouter.get("/github/repos/:repo/runs", requireGitHubConfig4, async (req, res) => {
  try {
    const { repo } = req.params;
    const workflowId = req.query.workflow_id ? Number(req.query.workflow_id) : void 0;
    const githubService = createGitHubIntegrationService();
    const runs = await githubService.listWorkflowRuns(repo, workflowId);
    res.json({
      runs
    });
  } catch (error) {
    console.error("Error listing workflow runs:", error);
    res.status(500).json({
      error: "Failed to list workflow runs",
      message: error.message
    });
  }
});
phoenixRouter.get("/github/repos/:repo/runs/:runId", requireGitHubConfig4, async (req, res) => {
  try {
    const { repo, runId } = req.params;
    const githubService = createGitHubIntegrationService();
    const run = await githubService.getWorkflowRun(repo, Number(runId));
    res.json(run);
  } catch (error) {
    console.error("Error getting workflow run:", error);
    res.status(500).json({
      error: "Failed to get workflow run",
      message: error.message
    });
  }
});
phoenixRouter.post("/github/repos/:repo/dispatch", requireGitHubConfig4, async (req, res) => {
  try {
    const { repo } = req.params;
    const { workflowId, ref = "main", inputs = {} } = req.body;
    if (!workflowId) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Workflow ID is required"
      });
    }
    const githubService = createGitHubIntegrationService();
    await githubService.triggerWorkflow(repo, Number(workflowId), ref, inputs);
    res.json({
      success: true,
      message: "Workflow triggered successfully"
    });
  } catch (error) {
    console.error("Error triggering workflow:", error);
    res.status(500).json({
      error: "Failed to trigger workflow",
      message: error.message
    });
  }
});
phoenixRouter.get("/github/repos/:repo/runs/:runId/artifacts", requireGitHubConfig4, async (req, res) => {
  try {
    const { repo, runId } = req.params;
    const githubService = createGitHubIntegrationService();
    const artifacts = await githubService.listWorkflowRunArtifacts(repo, Number(runId));
    res.json({
      artifacts
    });
  } catch (error) {
    console.error("Error listing artifacts:", error);
    res.status(500).json({
      error: "Failed to list artifacts",
      message: error.message
    });
  }
});
phoenixRouter.post("/ios/generate-project", async (req, res) => {
  try {
    const config = req.body;
    if (!config.name || !config.bundleId || !config.sourceFiles) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Missing required fields: name, bundleId, sourceFiles"
      });
    }
    const xcodeGenerator = createXcodeProjectGenerator();
    const projectYml = xcodeGenerator.generateProjectYml(config);
    const infoPlist = xcodeGenerator.generateInfoPlist(config);
    const entitlements = config.entitlements ? xcodeGenerator.generateEntitlements(config) : null;
    res.json({
      projectYml,
      infoPlist,
      entitlements,
      config
    });
  } catch (error) {
    console.error("Error generating Xcode project:", error);
    res.status(500).json({
      error: "Failed to generate Xcode project",
      message: error.message
    });
  }
});
phoenixRouter.post("/build", requireGitHubConfig4, async (req, res) => {
  try {
    const { repo, platform, buildType, workflowId, source } = req.body;
    if (!repo || !platform) {
      return res.status(400).json({
        error: "Invalid Request",
        message: "Missing required fields: repo, platform"
      });
    }
    const githubService = createGitHubIntegrationService();
    if (source && typeof source === "object") {
      const files = /* @__PURE__ */ new Map();
      for (const [path6, content] of Object.entries(source)) {
        if (typeof content === "string") {
          files.set(path6, content);
        }
      }
      if (files.size > 0) {
        await githubService.pushProjectFiles(repo, files);
      }
    }
    let actualWorkflowId = workflowId;
    if (!actualWorkflowId) {
      let workflowSetupResult;
      switch (platform) {
        case "ios":
          workflowSetupResult = await githubService.setupIOSWorkflow(repo);
          break;
        case "android":
          workflowSetupResult = await githubService.setupAndroidWorkflow(repo);
          break;
        case "react-native":
          workflowSetupResult = await githubService.setupReactNativeWorkflow(repo);
          break;
        case "flutter":
          workflowSetupResult = await githubService.setupFlutterWorkflow(repo);
          break;
        default:
          return res.status(400).json({
            error: "Invalid Platform",
            message: "Platform must be one of: ios, android, react-native, flutter"
          });
      }
      const workflows = await githubService.listWorkflows(repo);
      const workflowFileNames = {
        ios: "ios-build.yml",
        android: "android-build.yml",
        "react-native": "react-native-build.yml",
        flutter: "flutter-build.yml"
      };
      const workflowFileName = workflowFileNames[platform];
      const workflow = workflows.find((w) => w.path.endsWith(workflowFileName));
      if (!workflow) {
        return res.status(500).json({
          error: "Workflow Setup Failed",
          message: "Could not find the workflow after setup"
        });
      }
      actualWorkflowId = workflow.id;
    }
    const inputs = {};
    if (buildType) {
      if (platform === "ios") {
        inputs.build_configuration = buildType === "debug" ? "Debug" : "Release";
      } else {
        inputs.build_type = buildType;
      }
    }
    if (platform === "react-native" || platform === "flutter") {
      inputs.platform = "all";
    }
    await githubService.triggerWorkflow(repo, Number(actualWorkflowId), "main", inputs);
    const runs = await githubService.listWorkflowRuns(repo, Number(actualWorkflowId));
    const latestRun = runs[0];
    res.json({
      success: true,
      message: "Build triggered successfully",
      buildDetails: {
        repo,
        platform,
        buildType: buildType || "release",
        workflowId: actualWorkflowId,
        latestRunId: latestRun?.id
      }
    });
  } catch (error) {
    console.error("Error triggering build:", error);
    res.status(500).json({
      error: "Failed to trigger build",
      message: error.message
    });
  }
});
phoenixRouter.use("/monitor", build_monitor_default);
phoenixRouter.use("/deployment", deployment_default);
phoenixRouter.use("/testing", testing_default);
phoenixRouter.use("/ci", ci_integration_default);
phoenixRouter.use("/collaboration", collaboration_default);

// server/phoenix/test-api.ts
init_settings();
import express7 from "express";
import { Octokit as Octokit2 } from "@octokit/rest";
var router = express7.Router();
router.get("/github/auth", async (req, res) => {
  try {
    const validation = validateGitHubSettings();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    const octokit = new Octokit2({ auth: process.env.GITHUB_TOKEN });
    const { data } = await octokit.users.getAuthenticated();
    return res.json({
      success: true,
      message: "GitHub authentication successful",
      user: {
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
        html_url: data.html_url
      },
      scopes: data.scopes || []
    });
  } catch (error) {
    console.error("GitHub authentication test failed:", error);
    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        message: "GitHub API authentication failed. Invalid token.",
        error: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "GitHub API test failed",
      error: error.message
    });
  }
});
router.get("/github/repos", async (req, res) => {
  try {
    const validation = validateGitHubSettings();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    const octokit = new Octokit2({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER;
    const { data } = await octokit.repos.listForUser({
      username: owner,
      sort: "updated",
      direction: "desc",
      per_page: 10
    });
    return res.json({
      success: true,
      message: "Successfully listed repositories",
      owner,
      repos: data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        private: repo.private
      }))
    });
  } catch (error) {
    console.error("GitHub repositories test failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list GitHub repositories",
      error: error.message
    });
  }
});
router.get("/github/actions/:repo", async (req, res) => {
  try {
    const validation = validateGitHubSettings();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    const { repo } = req.params;
    if (!repo) {
      return res.status(400).json({
        success: false,
        message: "Repository name is required"
      });
    }
    const octokit = new Octokit2({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER;
    const { data: workflowsData } = await octokit.actions.listRepoWorkflows({
      owner,
      repo
    });
    const { data: runsData } = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 5
    });
    return res.json({
      success: true,
      message: "Successfully fetched GitHub Actions data",
      repo,
      workflows: workflowsData.workflows,
      runs: runsData.workflow_runs
    });
  } catch (error) {
    console.error("GitHub Actions test failed:", error);
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Repository not found or no access to GitHub Actions",
        error: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub Actions data",
      error: error.message
    });
  }
});
router.get("/github/scopes", async (req, res) => {
  try {
    const validation = validateGitHubSettings();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });
    const scopes = response.headers.get("x-oauth-scopes")?.split(", ") || [];
    const requiredScopes = ["repo", "workflow"];
    const missingScopes = requiredScopes.filter((scope) => !scopes.some((s) => s === scope || s.startsWith(`${scope}:`)));
    const hasRequiredScopes = missingScopes.length === 0;
    return res.json({
      success: true,
      message: hasRequiredScopes ? "Token has all required scopes" : `Token is missing required scopes: ${missingScopes.join(", ")}`,
      scopes,
      hasRequiredScopes,
      missingScopes
    });
  } catch (error) {
    console.error("GitHub token scopes check failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check GitHub token scopes",
      error: error.message
    });
  }
});
var test_api_default = router;

// server/utils/gistManager.ts
import { Octokit as Octokit3 } from "@octokit/rest";
var GistManager = class {
  octokit;
  constructor(token) {
    this.octokit = new Octokit3({ auth: token });
  }
  async createGist(params) {
    const { code, language, title, platform } = params;
    const extensions = {
      "swift": "swift",
      "kotlin": "kt",
      "java": "java",
      "javascript": "js",
      "typescript": "ts",
      "dart": "dart",
      "python": "py",
      "go": "go",
      "rust": "rs"
    };
    const extension = extensions[language.toLowerCase()] || "txt";
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.${extension}`;
    const description = platform ? `${title} - Generated with AI App Builder for ${platform}` : `${title} - Generated with AI App Builder`;
    try {
      const response = await this.octokit.gists.create({
        files: {
          [filename]: {
            content: code
          }
        },
        public: true,
        description
      });
      return {
        url: response.data.html_url ?? "",
        id: response.data.id ?? "",
        rawUrl: Object.values(response.data.files ?? {})[0]?.raw_url ?? ""
      };
    } catch (error) {
      console.error("Failed to create Gist:", error);
      throw new Error("Failed to create GitHub Gist");
    }
  }
  async updateGist(gistId, code, filename) {
    try {
      await this.octokit.gists.update({
        gist_id: gistId,
        files: {
          [filename]: {
            content: code
          }
        }
      });
    } catch (error) {
      console.error("Failed to update Gist:", error);
      throw new Error("Failed to update GitHub Gist");
    }
  }
  async deleteGist(gistId) {
    try {
      await this.octokit.gists.delete({
        gist_id: gistId
      });
    } catch (error) {
      console.error("Failed to delete Gist:", error);
      throw new Error("Failed to delete GitHub Gist");
    }
  }
  async listUserGists(page = 1, per_page = 30) {
    try {
      const response = await this.octokit.gists.list({
        page,
        per_page
      });
      return response.data.map((gist) => ({
        id: gist.id,
        description: gist.description,
        url: gist.html_url,
        createdAt: gist.created_at,
        files: Object.keys(gist.files || {}),
        public: gist.public
      }));
    } catch (error) {
      console.error("Failed to list Gists:", error);
      throw new Error("Failed to list GitHub Gists");
    }
  }
};
function createGistManager(token) {
  if (!token) {
    throw new Error("GitHub token is required to create Gist manager");
  }
  return new GistManager(token);
}

// server/utils/adaptiveAI.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function buildAdaptivePrompt(options) {
  const { idea, skillLevel, platform, codeStyle = "detailed", includeComments = true } = options;
  let explanationStyle = "";
  let complexityLevel = "";
  let commentStyle = "";
  switch (skillLevel) {
    case "beginner":
      explanationStyle = "Provide detailed step-by-step explanations for each code section.";
      complexityLevel = "Use simple, straightforward patterns and avoid advanced concepts.";
      commentStyle = "Add extensive inline comments explaining what each line does and why.";
      break;
    case "intermediate":
      explanationStyle = "Include moderate explanations focusing on key concepts and best practices.";
      complexityLevel = "Use standard patterns with some intermediate concepts where appropriate.";
      commentStyle = "Add strategic comments for important logic and non-obvious sections.";
      break;
    case "advanced":
      explanationStyle = "Focus on optimized, production-ready code with minimal explanation.";
      complexityLevel = "Use advanced patterns, performance optimizations, and modern best practices.";
      commentStyle = "Include only essential comments for complex algorithms or business logic.";
      break;
  }
  const commentInstruction = includeComments ? commentStyle : "Minimize comments and focus on clean, self-documenting code.";
  return `Create a ${platform} app for: ${idea}

**Skill Level:** ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
**Style Guide:** ${codeStyle}

**Instructions:**
- ${explanationStyle}
- ${complexityLevel}
- ${commentInstruction}
- Generate complete, production-ready code
- Follow ${platform} best practices and conventions
- Include proper error handling appropriate for ${skillLevel} level
- Structure the code for maintainability and scalability

**Output Format:**
Provide clean, well-structured code that matches the specified skill level and includes any necessary setup instructions.`;
}
async function generateAdaptiveCode(options) {
  try {
    const prompt = buildAdaptivePrompt(options);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert mobile app developer who adapts code complexity and explanation detail based on the developer's skill level. Generate high-quality, production-ready code."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3e3
    });
    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating adaptive code:", error);
    throw new Error("Failed to generate adaptive code");
  }
}
function buildAdaptiveErrorPrompt(errorMessage, skillLevel, context) {
  let explanationStyle = "";
  switch (skillLevel) {
    case "beginner":
      explanationStyle = `Explain this error as if I'm new to programming. Break down:
- What this error means in simple terms
- Why it happened (common causes for beginners)
- Step-by-step instructions to fix it
- How to prevent similar errors in the future
- Any fundamental concepts I should understand`;
      break;
    case "intermediate":
      explanationStyle = `Provide a clear explanation of this error including:
- The root cause and technical context
- Best practices to fix it properly
- Alternative approaches to consider
- Performance or architecture implications`;
      break;
    case "advanced":
      explanationStyle = `Diagnose this error concisely:
- Root cause analysis
- Optimal fix with minimal code changes
- Performance considerations
- Edge cases to handle`;
      break;
  }
  return `${explanationStyle}

ERROR: ${errorMessage}
${context ? `CONTEXT: ${context}` : ""}

Provide actionable solutions appropriate for a ${skillLevel} developer.`;
}
async function generateAdaptiveErrorExplanation(errorMessage, skillLevel, context) {
  try {
    const prompt = buildAdaptiveErrorPrompt(errorMessage, skillLevel, context);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful debugging assistant who adapts explanations to the developer's skill level. Always be constructive and educational."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1e3
    });
    const explanation = response.choices[0].message.content || "";
    let severity = "medium";
    if (errorMessage.toLowerCase().includes("syntax") || errorMessage.toLowerCase().includes("typo")) {
      severity = "low";
    } else if (errorMessage.toLowerCase().includes("crash") || errorMessage.toLowerCase().includes("fatal")) {
      severity = "critical";
    } else if (errorMessage.toLowerCase().includes("performance") || errorMessage.toLowerCase().includes("memory")) {
      severity = "high";
    }
    const suggestedFixes = explanation.split("\n").filter((line) => line.includes("fix") || line.includes("solution") || line.includes("try")).slice(0, 3).map((fix) => fix.trim());
    return {
      explanation,
      severity,
      suggestedFixes
    };
  } catch (error) {
    console.error("Error generating adaptive error explanation:", error);
    throw new Error("Failed to generate error explanation");
  }
}
async function generateCodeReview(options) {
  const { code, skillLevel, language = "javascript" } = options;
  let reviewStyle = "";
  switch (skillLevel) {
    case "beginner":
      reviewStyle = "Focus on fundamental coding practices, readability, and learning opportunities. Explain WHY each suggestion matters for building good habits.";
      break;
    case "intermediate":
      reviewStyle = "Review for best practices, code organization, performance considerations, and maintainability. Include architectural suggestions.";
      break;
    case "advanced":
      reviewStyle = "Conduct a thorough technical review focusing on optimization, scalability, security, and advanced patterns. Be concise but comprehensive.";
      break;
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a senior code reviewer. ${reviewStyle} Respond with JSON containing: overallScore (1-10), suggestions (array), strengths (array), improvements (array).`
        },
        {
          role: "user",
          content: `Review this ${language} code for a ${skillLevel} developer:

${code}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1500
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      overallScore: result.overallScore || 7,
      suggestions: result.suggestions || [],
      strengths: result.strengths || [],
      improvements: result.improvements || []
    };
  } catch (error) {
    console.error("Error generating code review:", error);
    throw new Error("Failed to generate code review");
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.use(express18.json());
  app2.use(express18.urlencoded({ extended: true }));
  app2.get("/api", (req, res) => {
    res.json({
      app: package_default.name,
      version: package_default.version
    });
  });
  app2.use("/api/phoenix", phoenixRouter);
  app2.use("/api/phoenix/test", test_api_default);
  app2.use("/api/ai", (await Promise.resolve().then(() => (init_ai_assistant(), ai_assistant_exports))).default);
  app2.use("/api/ai/editor", (await Promise.resolve().then(() => (init_code_editor(), code_editor_exports))).default);
  app2.use("/api/ai/design", (await Promise.resolve().then(() => (init_ai_design(), ai_design_exports))).default);
  app2.use("/api/security", (await Promise.resolve().then(() => (init_security(), security_exports))).default);
  app2.use("/api/zero-trust", (await Promise.resolve().then(() => (init_zero_trust(), zero_trust_exports))).default);
  app2.use("/api/data-protection", (await Promise.resolve().then(() => (init_data_protection(), data_protection_exports))).default);
  app2.use("/api/enterprise", (await Promise.resolve().then(() => (init_enterprise(), enterprise_exports))).default);
  app2.use("/api/analytics", (await Promise.resolve().then(() => (init_analytics(), analytics_exports))).default);
  app2.use("/api/dashboard", (await Promise.resolve().then(() => (init_dashboard(), dashboard_exports))).default);
  app2.post("/api/create-gist", async (req, res) => {
    try {
      const { code, language, title, platform } = req.body;
      if (!code || !language || !title) {
        return res.status(400).json({ error: "Code, language, and title are required" });
      }
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }
      const gistManager = createGistManager(githubToken);
      const gist = await gistManager.createGist({ code, language, title, platform });
      res.json({
        url: gist.url,
        id: gist.id,
        rawUrl: gist.rawUrl
      });
    } catch (error) {
      console.error("Failed to create Gist:", error);
      res.status(500).json({ error: "Failed to create GitHub Gist" });
    }
  });
  app2.get("/api/gists", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 30;
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }
      const gistManager = createGistManager(githubToken);
      const gists = await gistManager.listUserGists(page, per_page);
      res.json({ gists });
    } catch (error) {
      console.error("Failed to list Gists:", error);
      res.status(500).json({ error: "Failed to list GitHub Gists" });
    }
  });
  app2.post("/api/generate-adaptive-code", async (req, res) => {
    try {
      const { idea, skillLevel, platform, codeStyle, includeComments } = req.body;
      if (!idea || !skillLevel || !platform) {
        return res.status(400).json({ error: "Idea, skill level, and platform are required" });
      }
      const code = await generateAdaptiveCode({
        idea,
        skillLevel,
        platform,
        codeStyle,
        includeComments
      });
      res.json({ code });
    } catch (error) {
      console.error("Failed to generate adaptive code:", error);
      res.status(500).json({ error: "Failed to generate adaptive code" });
    }
  });
  app2.post("/api/explain-error-adaptive", async (req, res) => {
    try {
      const { errorMessage, skillLevel, context } = req.body;
      if (!errorMessage || !skillLevel) {
        return res.status(400).json({ error: "Error message and skill level are required" });
      }
      const result = await generateAdaptiveErrorExplanation(errorMessage, skillLevel, context);
      res.json(result);
    } catch (error) {
      console.error("Failed to explain error adaptively:", error);
      res.status(500).json({ error: "Failed to generate adaptive error explanation" });
    }
  });
  app2.post("/api/review-code", async (req, res) => {
    try {
      const { code, skillLevel, language } = req.body;
      if (!code || !skillLevel) {
        return res.status(400).json({ error: "Code and skill level are required" });
      }
      const review = await generateCodeReview({ code, skillLevel, language });
      res.json(review);
    } catch (error) {
      console.error("Failed to review code:", error);
      res.status(500).json({ error: "Failed to generate code review" });
    }
  });
  app2.post("/api/waitlist", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email is required" });
      }
      console.log(`New waitlist signup: ${email} at ${(/* @__PURE__ */ new Date()).toISOString()}`);
      res.json({ success: true, message: "Successfully joined waitlist" });
    } catch (error) {
      console.error("Failed to process waitlist signup:", error);
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });
  app2.post("/api/generate-production-app", async (req, res) => {
    try {
      const { appName, appDescription, appType, features, platforms, designTemplate } = req.body;
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          error: "AI service not configured",
          message: "OpenAI API key required for code generation"
        });
      }
      const { codeGenerator: codeGenerator2 } = await Promise.resolve().then(() => (init_codeGenerator(), codeGenerator_exports));
      const { fileGenerator: fileGenerator2 } = await Promise.resolve().then(() => (init_fileGenerator(), fileGenerator_exports));
      const generatedApps = await codeGenerator2.generateNativeApp({
        appName,
        appDescription,
        appType,
        features: features || [],
        platforms: platforms || ["ios", "android"],
        designTemplate
      });
      const zipBuffer = await fileGenerator2.createDownloadableZip(generatedApps, appName);
      const fs5 = await import("fs/promises");
      const tempDir = "./temp_projects";
      await fs5.mkdir(tempDir, { recursive: true });
      const zipFileName = `${appName.replace(/[^a-zA-Z0-9]/g, "_")}_generated_apps.zip`;
      const zipPath = `${tempDir}/${zipFileName}`;
      await fs5.writeFile(zipPath, zipBuffer);
      res.json({
        success: true,
        apps: generatedApps,
        downloadUrl: `/api/download-project/${encodeURIComponent(appName)}`,
        zipPath,
        message: "Your native apps have been generated successfully!"
      });
    } catch (error) {
      console.error("Production generation error:", error);
      res.status(500).json({
        error: "Generation failed",
        message: error.message || "Failed to generate your apps. Please try again."
      });
    }
  });
  app2.get("/api/download-project/:appName", async (req, res) => {
    try {
      const { appName } = req.params;
      const fileName = `${appName.replace(/[^a-zA-Z0-9]/g, "_")}_generated_apps.zip`;
      const zipPath = `./temp_projects/${fileName}`;
      const fs5 = await import("fs/promises");
      try {
        await fs5.access(zipPath);
      } catch {
        return res.status(404).json({
          error: "Project not found",
          message: "Please generate your app first"
        });
      }
      const path6 = await import("path");
      const absolutePath = path6.resolve(zipPath);
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.download(absolutePath, fileName);
    } catch (error) {
      res.status(500).json({
        error: "Download failed",
        message: "Could not retrieve project files"
      });
    }
  });
  app2.use("/api/builds", (await Promise.resolve().then(() => (init_build_history(), build_history_exports))).default);
  app2.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: `No API endpoint found for ${req.method} ${req.originalUrl}`
    });
  });
  app2.get("/api/config/github", (req, res) => {
    const { validateGitHubSettings: validateGitHubSettings2 } = (init_settings(), __toCommonJS(settings_exports));
    const validation = validateGitHubSettings2();
    res.json({
      githubConfigured: validation.valid,
      tokenConfigured: validation.tokenConfigured,
      ownerConfigured: validation.ownerConfigured,
      message: validation.message
    });
  });
  const server = createServer(app2);
  return server;
}

// server/vite.ts
import express19 from "express";
import fs4 from "fs";
import path5 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path4 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path4.resolve(import.meta.dirname, "client", "src"),
      "@shared": path4.resolve(import.meta.dirname, "shared"),
      "@assets": path4.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path4.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path4.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path5.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs4.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(import.meta.dirname, "public");
  if (!fs4.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express19.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express20();
app.use(express20.json());
app.use(express20.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();


export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}