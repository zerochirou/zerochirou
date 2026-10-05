"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PanelLeft, X } from "lucide-react";
import Image from "next/image";

export interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "HOME", ariaLabel: "Go to home page", link: "/" },
  {
    label: "BLOG",
    ariaLabel: "Read my blog",
    link: "https://blog.zerochirou.com",
  },
  {
    label: "RADIO",
    ariaLabel: "Code Radio - 24/7 Music Designed for Coding",
    link: "/radio",
  },
  { label: "HUMAN", ariaLabel: "90% Human Hands, 10% AI.", link: "/human" },
  { label: "ABOUT", ariaLabel: "Learn about me", link: "#about" },
  { label: "STACK", ariaLabel: "View tech stack", link: "#stack" },
  { label: "PROJECTS", ariaLabel: "View projects", link: "#projects" },
];

interface MenuDrawerProps {
  items?: MenuItem[];
}

export function MenuDrawer({ items = DEFAULT_MENU_ITEMS }: MenuDrawerProps) {
  const [open, setOpen] = useState(false);

  const handleLinkClick = (link: string) => {
    setOpen(false);
    if (link.startsWith("#")) {
      setTimeout(() => {
        const targetId = link.slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else if (link === "/") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Open navigation menu"
          />
        }
      >
        <PanelLeft className="size-5" />
      </DrawerTrigger>
      <DrawerContent className="bg-background w-[85vw] max-w-xs sm:max-w-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between p-4 border-b border-border/15">
            <DrawerTitle className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Navigation
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Site navigation menu drawer
            </DrawerDescription>
            <DrawerClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close navigation menu"
                />
              }
            >
              <X className="size-4" />
            </DrawerClose>
          </div>
          <ul className="mt-6 px-4 grid grid-cols-1 gap-2">
            {items.map((item, index) => (
              <Link
                href={item.link}
                className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/40 transition-colors group"
                key={item.label}
                aria-label={item.ariaLabel}
                onClick={() => handleLinkClick(item.link)}
              >
                <span className="text-xl sm:text-2xl font-medium capitalize tracking-tight group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </ul>
        </div>
        <DrawerFooter className="p-4 border-t border-border/15">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="https://github.com/zerochirou"
              className="text-xs sm:text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-1 min-h-[32px]"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/assets/icons/github.svg"
                alt="Github"
                width={16}
                height={16}
              />
              Github
            </Link>
            <Link
              href="https://www.reddit.com/user/zerochirou/"
              className="text-xs sm:text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-1 min-h-[32px]"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/assets/icons/reddit.svg"
                alt="Reddit"
                width={16}
                height={16}
              />
              Reddit
            </Link>
            <Link
              href="https://www.threads.net/zerochirou"
              className="text-xs sm:text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-1 min-h-[32px]"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/assets/icons/threads.svg"
                alt="Threads"
                width={16}
                height={16}
              />
              Threads
            </Link>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
