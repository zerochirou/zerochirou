"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MenuDrawer, type MenuItem } from "./menu_drawer";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  menuItems?: MenuItem[];
}

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ subtitle = "Portofolio", menuItems }: NavbarProps) {
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
      )}
    >
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between p-4 pointer-events-auto">
        <div className="font-semibold flex items-center gap-2 justify-center">
          {/*<span className="text-xl">{title}</span>*/}
          <Image src="/favicon.ico" alt="Logo" width={30} height={30} />
          <Separator
            className="rotate-12 bg-foreground"
            orientation="vertical"
          />
          <span className="text-xl">{subtitle}</span>
        </div>
        <div className="hidden md:flex">
          <ul className="flex items-center gap-6">
            {links.map((item, index) => (
              <Link key={index} className="" href={item.href}>
                {item.label}
              </Link>
            ))}
          </ul>
        </div>
        <div className="md:hidden">
          <MenuDrawer items={menuItems} />
        </div>
      </nav>
    </header>
  );
}
