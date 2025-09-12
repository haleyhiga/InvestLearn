import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from '../AppSidebar';

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-4">Sidebar Navigation Demo</h2>
          <p className="text-muted-foreground">
            This shows the main navigation sidebar for the InvestLearn application.
            Navigate between different sections using the menu items.
          </p>
        </div>
      </div>
    </SidebarProvider>
  );
}