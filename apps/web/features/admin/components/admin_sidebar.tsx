"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Database,
  Home,
  MessageSquareQuote,
  Send,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { TeamSwitcher } from "./team_switcher";
import { NavMain } from "./nav_main";
import { NavProjects } from "./nav_projects";
import { NavUser } from "./nav_user";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  const pathname = usePathname();

  const teamsData = React.useMemo(
    () => [
      {
        name: "Zerochirou Admin",
        logo: <ShieldCheck className="size-4" />,
        plan: "Super Admin",
      },
      {
        name: "Cloudflare D1 Core",
        logo: <Database className="size-4" />,
        plan: "Production DB",
      },
    ],
    [],
  );

  const navMainData = React.useMemo(
    () => [
      {
        title: "Q&A Inbox",
        url: "/admin",
        icon: <MessageSquareQuote className="size-4" />,
        isActive: pathname === "/admin",
        items: [
          {
            title: "Management Console",
            url: "/admin",
          },
        ],
      },
      {
        title: "System & Auth",
        url: "/admin",
        icon: <Terminal className="size-4" />,
        items: [
          {
            title: "Single Super Admin",
            url: "/admin",
          },
          {
            title: "Better-Auth Guard",
            url: "/admin",
          },
        ],
      },
    ],
    [pathname],
  );

  const projectsData = React.useMemo(
    () => [
      {
        name: "Public Q&A",
        url: "/send",
        icon: <Send className="size-4" />,
      },
      {
        name: "Portfolio Home",
        url: "/",
        icon: <Home className="size-4" />,
      },
    ],
    [],
  );

  const userData = React.useMemo(
    () => ({
      name: user?.name || "Zerochirou",
      email: user?.email || "admin@zerochirou.com",
    }),
    [user],
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainData} />
        <NavProjects projects={projectsData} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
