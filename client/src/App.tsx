import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import UserMenu from "@/components/UserMenu";
import AppSidebar from "@/components/AppSidebar";
import ChatbotInterface from "@/components/ChatbotInterface";
import ThemeToggle from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import Modules from "@/pages/ModulesEnhanced";
import AIQuizGenerator from "@/pages/AIQuizGenerator";
import Chat from "@/pages/Chat";
import Achievements from "@/pages/Achievements";
import ProgressPage from "@/pages/Progress";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" data-testid="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return <>{children}</>;
}

function AuthenticatedApp() {
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
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
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
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/modules" component={Modules} />
      <Route path="/ai-quiz" component={AIQuizGenerator} />
      <Route path="/about" component={About} />
      <Route path="/chat" component={Chat} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/progress" component={ProgressPage} />
      {/* Placeholder routes for sidebar items */}
      <Route path="/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}