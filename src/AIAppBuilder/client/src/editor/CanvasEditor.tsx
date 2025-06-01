import React from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { Button } from "./components/Button";
import { Text } from "./components/Text";
import { Container } from "./components/Container";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

export function CanvasEditor() {
  return (
    <div className="h-screen bg-gray-100">
      <Editor resolver={{ Button, Text, Container }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <Toolbar />
            
            {/* Canvas */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <Frame>
                  <Element 
                    is={Container} 
                    canvas 
                    backgroundColor="white"
                    padding="8"
                    className="min-h-[600px] w-full"
                  >
                    <span content="Welcome to Visual Designer" fontSize="2xl" fontWeight="bold" />
                    <span content="Drag components from the sidebar to build your app interface" color="gray-600" />
                    <Button text="Get Started" color="blue" size="large" />
                  </Element>
                </Frame>
              </div>
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
}