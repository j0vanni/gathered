import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import api from "@/globals";
import useAuth from "@/useAuth";
import axios from "axios";
import { ChevronUp, ScrollText, Search, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const items = [
  {
    title: "Lists",
    url: "/lists",
    icon: ScrollText,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
];

export function AppSidebar() {
  const handleSignOut = async () => {
    await axios.get(api + "/auth/signout", {
      withCredentials: true,
    });

    window.location.href = "/";
  };

  const { user } = useAuth();
  const [name, setName] = useState("User");

  useEffect(() => {
    if ((user as any)?.displayName) {
      setName((user as any).displayName);
    }
  }, [user]);

  return (
    <Sidebar>
      <SidebarContent className="bg-muted">
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">
            Gathered
          </SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="text-foreground"
                color="text-foreground"
              >
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> <span>{name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-muted-foreground"
              >
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
