import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const showSidebar = !["/", "/login"].includes(location.pathname);
  return (
    <SidebarProvider>
      <div className="flex w-full">
        {showSidebar && <AppSidebar />}
        <main className="flex-1">
          {showSidebar && <SidebarTrigger />}
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
