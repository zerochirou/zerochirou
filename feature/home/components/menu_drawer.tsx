"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Ellipsis } from "lucide-react";

export interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "HOME", ariaLabel: "Go to home page", link: "/" },
  { label: "ABOUT", ariaLabel: "Learn about us", link: "/about" },
  { label: "PROJECTS", ariaLabel: "View our services", link: "/services" },
  { label: "CONTACT", ariaLabel: "Get in touch", link: "/contact" },
];

interface MenuDrawerProps {
  items?: MenuItem[];
}

export function MenuDrawer({ items = DEFAULT_MENU_ITEMS }: MenuDrawerProps) {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button variant="default" size={'icon-lg'}/>}>
        <Ellipsis />
      </DrawerTrigger>
      <DrawerContent>
        <ul className="mt-20 px-8 grid-cols-1 grid gap-4">
          {items.map((item, index) => (
            <Link
              href={item.link}
              className="flex items-start gap-1"
              key={item.label}
              aria-label={item.ariaLabel}
            >
              <span className="text-3xl capitalize">{item.label}</span>
              <span>0{index + 1}</span>
            </Link>
          ))}
        </ul>
        <DrawerFooter>
          <div className="flex gap-4">
            <span className="text-2xl">Github</span>
            <span className="text-2xl">Instagram</span>
            <span className="text-2xl">Threads</span>
          </div>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
