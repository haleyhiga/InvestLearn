import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

import AppSidebar from "@/components/AppSidebar";
import ChatbotInterface from "@/components/ChatbotInterface";
import ThemeToggle from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import Modules from "@/pages/Modules";
import AIQuizGenerator from "@/pages/AIQuizGenerator";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/modules" component={Modules} />
      <Route path="/ai-quiz" component={AIQuizGenerator} />
      {/* Placeholder routes for sidebar items */}
      <Route path="/achievements" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Achievements - Coming Soon</h1></div>} />
      <Route path="/progress" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Progress Analytics - Coming Soon</h1></div>} />
      <Route path="/chat" component={() => <div className="p-8"><h1 className="text-2xl font-bold">AI Chat - Use the floating button!</h1></div>} />
      <Route path="/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);

  // Sidebar width configuration
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleToggleChat = () => {
    setChatOpen(!chatOpen);
    setChatMinimized(false);
  };

  const handleMinimizeChat = () => {
    setChatMinimized(true);
  };

  const handleMaximizeChat = () => {
    setChatMinimized(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-6 max-w-7xl">
                  <Router />
                </div>
              </main>
            </div>
          </div>
          
          {/* Floating Chatbot */}
          <ChatbotInterface
            isOpen={chatOpen}
            isMinimized={chatMinimized}
            onToggle={handleToggleChat}
            onMinimize={handleMinimizeChat}
            onMaximize={handleMaximizeChat}
          />
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}