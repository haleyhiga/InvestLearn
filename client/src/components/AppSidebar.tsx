import { Home, BookOpen, Trophy, BarChart3, Settings, MessageSquare, Sparkles, Info, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Learning Modules",
    url: "/modules",
    icon: BookOpen,
  },
  {
    title: "Achievements",
    url: "/achievements", 
    icon: Trophy,
    badge: "3",
  },
  {
    title: "Progress",
    url: "/progress",
    icon: BarChart3,
  },
  {
    title: "AI Quiz Generator",
    url: "/ai-quiz",
    icon: Sparkles,
    badge: "New",
  },
];

const bottomItems = [
  {
    title: "AI Assistant",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect to login page or home page after logout
    window.location.href = '/';
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg" data-testid="text-app-title">InvestLearn</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout}
                    data-testid="button-logout"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}