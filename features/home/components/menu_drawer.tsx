"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Ellipsis } from "lucide-react";
import Image from "next/image";

export interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "HOME", ariaLabel: "Go to home page", link: "/" },
  { label: "ABOUT", ariaLabel: "Learn about me", link: "#about" },
  { label: "STACK", ariaLabel: "View tech stack", link: "#stack" },
  { label: "PROJECTS", ariaLabel: "View projects", link: "#projects" },
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
      <DrawerContent className="bg-background">
        <ul className="mt-20 px-8 grid-cols-1 grid gap-4">
          {items.map((item, index) => (
            <Link
              href={item.link}
              className="flex items-start gap-2"
              key={item.label}
              aria-label={item.ariaLabel}
            >
              <span className="text-3xl capitalize">{item.label}</span>
              <span className="font-mono">0{index + 1}</span>
            </Link>
          ))}
        </ul>
        <DrawerFooter>
          <div className="flex gap-4">
            <Link href="https://github.com/zerochirou" className="text-xl flex items-ceter gap-2">
              <Image
                src="/assets/icons/github.svg"
                alt="Github"
                width={20}
                height={20}
              />
              Github
            </Link>
            <Link href="https://www.reddit.com/user/zerochirou/" className="text-xl flex items-ceter gap-2">
              <Image
                src="/assets/icons/reddit.svg"
                alt="Reddit"
                width={20}
                height={20}
              />
              Reddit
            </Link>
            <Link href="https://www.threads.net/zerochirou" className="text-xl flex items-ceter gap-2">
              <Image
                src="/assets/icons/threads.svg"
                alt="Threads"
                width={20}
                height={20}
              />
              Threads
            </Link>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
