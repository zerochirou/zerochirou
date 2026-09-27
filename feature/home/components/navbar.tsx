"use client";

import { Separator } from "@/components/ui/separator";
import { MenuDrawer, type MenuItem } from "./menu_drawer";
import Image from "next/image";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  menuItems?: MenuItem[];
}

export function Navbar({
  subtitle = "Portofolio",
  menuItems,
}: NavbarProps) {
  return (
    <nav className="mx-auto flex w-full max-w-4xl items-center justify-between pointer-events-auto">
      <div className="font-semibold flex items-center gap-2 justify-center">
        {/*<span className="text-xl">{title}</span>*/}
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={30}
          height={30}
        />
        <Separator
          className="rotate-12 bg-foreground"
          orientation="vertical"
        />
        <span className="text-xl">{subtitle}</span>
      </div>
      <MenuDrawer items={menuItems} />
    </nav>
  );
}
