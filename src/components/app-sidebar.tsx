"use client";
import {
  Home,
  Settings,
} from "lucide-react";

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
import Link from "next/link";
import Profile from "@/app/admin/profile";
import { usePathname } from "next/navigation";
export function AppSidebar() {
  const pathName = usePathname();
  const paths = {
    "create-blog": "/admin/create-blog",
    "admin-home": "/admin",
    "tags-management": "/admin/tags-management",
    "admin-settings": "/admin/settings",
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl">
            Byte Blogger
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === paths["admin-home"] || pathName === paths["create-blog"]}
                >
                  <Link href={paths["admin-home"]}>
                    <Home />
                    <span>Admin Home</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === paths["tags-management"]}
                >
                  <Link href={paths["tags-management"]}>
                    <Home />
                    <span>Tag Management</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === paths["admin-settings"]}
                >
                  <Link href={paths["admin-settings"]}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </Sidebar>
  );
}
