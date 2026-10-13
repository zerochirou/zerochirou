import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  TeamSwitcher,
  NavMain,
  NavProjects,
  NavUser,
} from "@/features/admin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { authClient } from "@/lib/auth_client";
import { MessageSquare, ShieldCheck, Home } from "lucide-react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/admin",
}));

vi.mock("@/lib/auth_client", () => ({
  authClient: {
    signOut: vi.fn().mockResolvedValue({}),
  },
}));

describe("Sidebar-07 Pattern Components", () => {
  describe("TeamSwitcher", () => {
    it("renders active team name and plan badge", () => {
      const teams = [
        {
          name: "Zerochirou Admin",
          logo: <ShieldCheck className="size-4" />,
          plan: "Super Admin",
        },
        {
          name: "Cloudflare D1",
          logo: <ShieldCheck className="size-4" />,
          plan: "Production",
        },
      ];

      render(
        <SidebarProvider>
          <TeamSwitcher teams={teams} />
        </SidebarProvider>,
      );

      expect(screen.getByText("Zerochirou Admin")).toBeInTheDocument();
      expect(screen.getByText("Super Admin")).toBeInTheDocument();
    });

    it("opens workspace menu when clicked", async () => {
      const teams = [
        {
          name: "Zerochirou Admin",
          logo: <ShieldCheck className="size-4" />,
          plan: "Super Admin",
        },
        {
          name: "Cloudflare D1",
          logo: <ShieldCheck className="size-4" />,
          plan: "Production",
        },
      ];

      render(
        <SidebarProvider>
          <TeamSwitcher teams={teams} />
        </SidebarProvider>,
      );

      const trigger = screen.getByText("Zerochirou Admin").closest("button");
      expect(trigger).toBeInTheDocument();
      if (trigger) fireEvent.click(trigger);

      expect(await screen.findByText("Workspaces")).toBeInTheDocument();
      expect(screen.getByText("Cloudflare D1")).toBeInTheDocument();
    });
  });

  describe("NavMain", () => {
    it("renders collapsible items with sublinks", () => {
      const navItems = [
        {
          title: "Q&A Inbox",
          url: "/admin",
          icon: <MessageSquare className="size-4" />,
          isActive: true,
          items: [
            { title: "Management Console", url: "/admin" },
            { title: "Public Archive", url: "/send" },
          ],
        },
      ];

      render(
        <SidebarProvider>
          <NavMain items={navItems} />
        </SidebarProvider>,
      );

      expect(screen.getByText("Q&A Inbox")).toBeInTheDocument();
      expect(screen.getByText("Management Console")).toBeInTheDocument();
      expect(screen.getByText("Public Archive")).toBeInTheDocument();
    });
  });

  describe("NavProjects", () => {
    it("renders shortcuts and action menu triggers", () => {
      const projects = [
        {
          name: "Portfolio Home",
          url: "/",
          icon: <Home className="size-4" />,
        },
      ];

      render(
        <SidebarProvider>
          <NavProjects projects={projects} />
        </SidebarProvider>,
      );

      expect(screen.getByText("Portfolio Home")).toBeInTheDocument();
      expect(screen.getByText("Shortcuts & Links")).toBeInTheDocument();
    });
  });

  describe("NavUser", () => {
    it("renders user details and triggers signOut from dropdown", async () => {
      render(
        <SidebarProvider>
          <NavUser
            user={{
              name: "Zerochirou",
              email: "admin@zerochirou.com",
            }}
          />
        </SidebarProvider>,
      );

      expect(screen.getByText("Zerochirou")).toBeInTheDocument();
      expect(screen.getByText("admin@zerochirou.com")).toBeInTheDocument();

      const userTrigger = screen.getByText("Zerochirou").closest("button");
      if (userTrigger) fireEvent.click(userTrigger);

      const signOutItem = await screen.findByText(/Sign Out/i);
      fireEvent.click(signOutItem);

      await waitFor(() => {
        expect(authClient.signOut).toHaveBeenCalled();
      });
    });
  });

  describe("Breadcrumb Primitives", () => {
    it("renders breadcrumb list and items", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Q&amp;A Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Q&A Management")).toBeInTheDocument();
    });
  });

  describe("Avatar & Collapsible Primitives", () => {
    it("renders Avatar fallback", () => {
      render(
        <Avatar>
          <AvatarFallback>ZC</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("ZC")).toBeInTheDocument();
    });

    it("renders Collapsible with trigger and content", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Collapsible Content</CollapsibleContent>
        </Collapsible>,
      );

      expect(screen.getByText("Toggle")).toBeInTheDocument();
      expect(screen.getByText("Collapsible Content")).toBeInTheDocument();
    });
  });
});
