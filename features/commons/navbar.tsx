"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MenuDrawer, type MenuItem } from "./menu_drawer";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation_menu";
import { Home, PanelsTopLeft } from "lucide-react";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  menuItems?: MenuItem[];
  className?: string;
  logoSrc?: string;
}

const links = [
  // { href: "https://blog.zerochirou.com", label: "Blog" },
  { href: "/human", label: "Human" },
  { href: "/send", label: "Curhat" },
  { href: "/radio", label: "Radio" },
  { href: "/zeromind", label: "Zeromind" },
  { href: "/tarot", label: "Tarot" },
];

export function Navbar({
  subtitle = "Portofolio",
  menuItems,
  className,
  logoSrc = "/favicon.ico",
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 -mb-18.25",
        scrolled
          ? "backdrop-blur-md bg-background/60 border-b border-border/10 shadow-sm"
          : "bg-transparent border-b border-transparent",
        className,
      )}
    >
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3 sm:p-4 pointer-events-auto">
        <Link
          href="/"
          className="font-semibold flex items-center gap-2 justify-center group"
          aria-label="Zerochirou Homepage"
        >
          <Image
            src={logoSrc}
            alt="Zerochirou Logo"
            width={28}
            height={28}
            className="rounded object-contain"
          />
          <Separator className="rotate-12 bg-border" orientation="vertical" />
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            {subtitle}
          </span>
        </Link>
        <div className="hidden md:flex items-center">
          <NavigationMenu align="end">
            <NavigationMenuList className="gap-1">
              {links.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    render={<Link href={item.href} />}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-2.5 rounded-full hover:bg-muted/40 data-popup-open:bg-muted/50 transition-colors">
                  <Image
                    src={"/assets/icons/github.svg"}
                    width={20}
                    height={20}
                    alt="Github Link"
                  />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-2 w-64 bg-background border border-border/40 rounded-2xl shadow-xl">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted/40 p-3 border border-border/20">
                      <Image
                        src="https://github.com/zerochirou.png"
                        alt="Foto profil GitHub zerochirou"
                        width={44}
                        height={44}
                        className="rounded-full object-cover border border-border"
                        priority={false}
                      />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">zerochirou</p>
                        <p className="text-xs text-muted-foreground">Software Engineer & Founder</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <NavigationMenuLink
                        render={<Link href="https://github.com/zerochirou" target="_blank" rel="noopener noreferrer" />}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        <Home className="size-4" />
                        <span>Github Profile</span>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        render={<Link href="https://github.com/zerochirou/zerochirou" target="_blank" rel="noopener noreferrer" />}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        <PanelsTopLeft className="size-4" />
                        <span>zerochirou.com</span>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="md:hidden">
          <MenuDrawer items={menuItems} />
        </div>
      </nav>
    </header>
  );
}
