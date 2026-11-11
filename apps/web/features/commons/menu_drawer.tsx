"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { PanelLeft, X } from "lucide-react"
import Image from "next/image"

export interface MenuItem {
  label: string
  ariaLabel: string
  link: string
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "HOME", ariaLabel: "Go to home page", link: "/" },
  // {
  //   label: "BLOG",
  //   ariaLabel: "Read my blog",
  //   link: "https://blog.zerochirou.com",
  // },
  {
    label: "CURHAT",
    ariaLabel:
      "Sharing personal problems, deep emotions, secrets, or life struggles with a close friend, family member, or partner",
    link: "/send",
  },
  // {
  //   label: "LEARN JOURNEY",
  //   ariaLabel: "Read my course journey",
  //   link: "/course",
  // },
  {
    label: "RADIO",
    ariaLabel: "Code Radio - 24/7 Music Designed for Coding",
    link: "/radio",
  },
  {
    label: "ZEROMIND",
    ariaLabel: "Zeromind - Interactive Architecture Whiteboard",
    link: "/zeromind",
  },
  {
    label: "THREADS",
    ariaLabel: "Threads - The ultimate cloning",
    link: "https://threads.zerochirou.com",
  },
  {
    label: "TAROT",
    ariaLabel: "Tarot - Interactive Reflection & Prediction Engine",
    link: "/tarot",
  },
  { label: "HUMAN", ariaLabel: "90% Human Hands, 10% AI.", link: "/human" },
]

interface MenuDrawerProps {
  items?: MenuItem[]
}

export function MenuDrawer({ items = DEFAULT_MENU_ITEMS }: MenuDrawerProps) {
  const [open, setOpen] = useState(false)

  const handleLinkClick = (link: string) => {
    setOpen(false)
    if (link.startsWith("#")) {
      setTimeout(() => {
        const targetId = link.slice(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 150)
    } else if (link === "/") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 150)
    }
  }

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
      <DrawerContent className="flex w-[85vw] max-w-xs flex-col justify-between bg-background sm:max-w-sm">
        <div>
          <div className="flex items-center justify-between border-b border-border/15 p-4">
            <DrawerTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
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
          <ul className="mt-6 grid grid-cols-1 gap-2 px-4">
            {items.map((item, index) => (
              <Link
                href={item.link}
                className="group flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/40"
                key={item.label}
                aria-label={item.ariaLabel}
                onClick={() => handleLinkClick(item.link)}
              >
                <span className="text-xl font-medium tracking-tight capitalize transition-colors group-hover:text-primary sm:text-2xl">
                  {item.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </ul>
        </div>
        <DrawerFooter className="border-t border-border/15 p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="https://github.com/zerochirou"
              className="flex min-h-8 items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
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
              className="flex min-h-8 items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
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
              className="flex min-h-8 items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
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
  )
}
