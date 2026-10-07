"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MenuDrawer, type MenuItem } from "./menu_drawer";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, PanelsTopLeft } from "lucide-react";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  menuItems?: MenuItem[];
  className?: string;
  logoSrc?: string;
}

const links = [
  { href: "/", label: "Home" },
  { href: "https://blog.zerochirou.com", label: "Blog" },
  { href: "/human", label: "Human" },
  { href: "/radio", label: "Radio" },
  { href: "/zeromind", label: "Zeromind" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#projects", label: "Projects" },
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
        "sticky top-0 z-50 w-full transition-all duration-300 -mb-[73px]",
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
          <Separator className="rotate-12 bg-white" orientation="vertical" />
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            {subtitle}
          </span>
        </Link>
        <div className="hidden md:flex">
          <ul className="flex items-center gap-6">
            {links.map((item, index) => (
              <Link
                key={index}
                className="text-sm font-medium py-1"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size={"icon-lg"} />}
              >
                <Image
                  src={"/assets/icons/github.svg"}
                  width={25}
                  height={25}
                  alt="Github Link"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-card border">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Github</DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center flex-col justify-center gap-2">
                    {/* <Home /> */}
                    {/* Github Profile */}
                    <Image
                      src="https://github.com/zerochirou.png"
                      alt="Foto profil GitHub zerochirou"
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-border"
                      priority={false}
                    />
                    <h1 className="text-md font-semibold">zerochirou</h1>
                  </DropdownMenuItem>
                  <Link href={"https://github.com/zerochirou"}>
                    <DropdownMenuItem>
                      <Home />
                      Github Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"https://github.com/zerochirou/zerochirou"}>
                    <DropdownMenuItem>
                      <PanelsTopLeft />
                      zerochirou.com
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ul>
        </div>
        <div className="md:hidden">
          <MenuDrawer items={menuItems} />
        </div>
      </nav>
    </header>
  );
}
