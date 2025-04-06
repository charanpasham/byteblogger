"use client";
import {
  Home,
  Settings,
  Pencil,
  PencilRuler,
  UserRoundCheck,
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
    "edit-blog": "/admin/edit-blog",
    "modify-roles": "/admin/modify-roles",
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
                  isActive={pathName === paths["admin-home"]}
                >
                  <Link href={paths["admin-home"]}>
                    <Home />
                    <span>Admin Home</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === paths["create-blog"]}
                >
                  <Link href={paths["create-blog"]}>
                    <Pencil />
                    <span>Create Blog</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === paths["edit-blog"]}
                >
                  <Link href={paths["edit-blog"]}>
                    <PencilRuler />
                    <span>Edit Blog</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === paths["modify-roles"]}
                >
                  <Link href={paths["modify-roles"]}>
                    <UserRoundCheck />
                    <span>Modify Roles</span>
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
