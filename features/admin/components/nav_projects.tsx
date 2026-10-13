"use client";

import * as React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown_menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ExternalLink, MoreHorizontal } from "lucide-react";

export interface NavProjectItem {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export function NavProjects({
  projects,
}: {
  projects: NavProjectItem[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Shortcuts &amp; Links
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              render={<Link href={item.url} />}
              className="cursor-pointer min-h-[38px]"
            >
              {item.icon}
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted cursor-pointer"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-40"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  render={
                    <Link
                      href={item.url}
                      target={item.url.startsWith("http") ? "_blank" : undefined}
                    />
                  }
                  className="cursor-pointer gap-2"
                >
                  <ExternalLink className="size-4" />
                  <span>Open Page</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
