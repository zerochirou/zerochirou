import { Grid2X2Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MinimalFooter() {
  const year = new Date().getFullYear();

  const navigation = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "#about",
    },
    {
      title: "Stack",
      href: "#stack",
    },
    {
      title: "Projects",
      href: "#projects",
    },
  ];

  const social = [
    {
      title: "GitHub",
      href: "https://github.com/zerochirou",
    },
    {
      title: "Blog",
      href: "https://zeroposts.netlify.app/",
    },
    {
      title: "Reddit",
      href: "https://www.reddit.com/user/zerochirou/",
    },
    {
      title: "Threads",
      href: "https://www.threads.net/zerochirou",
    },
  ];

  return (
    <footer className="relative h-100 flex items-end">
      <div className="bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)] mx-auto max-w-4xl md:border-x w-full">
        <div className="bg-border absolute inset-x-0 h-px w-full" />
        <div className="grid max-w-4xl grid-cols-6 gap-6 p-4">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
            <a href="https://zerochirou.com" className="w-max opacity-25">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={28}
                height={28}
                className="rounded"
              />
            </a>
            <p className="text-muted-foreground max-w-sm font-mono text-sm text-balance">
              A developer who works differently.
            </p>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground mb-1 text-xs font-semibold">
              Navigation
            </span>
            <div className="flex flex-col gap-1">
              {navigation.map(({ href, title }, i) => (
                <a
                  key={i}
                  className={`w-max py-1 text-sm duration-200 hover:underline`}
                  href={href}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground mb-1 text-xs font-semibold">
              Social
            </span>
            <div className="flex flex-col gap-1">
              {social.map(({ href, title }, i) => (
                <a
                  key={i}
                  className={`w-max py-1 text-sm duration-200 hover:underline`}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-border absolute inset-x-0 h-px w-full" />
        <div className="flex max-w-4xl flex-col justify-between gap-2 pt-2 pb-5">
          <p className="text-muted-foreground text-center font-thin">
            ©{" "}
            <a
              href="https://github.com/zerochirou"
              target="_blank"
              rel="noopener noreferrer"
            >
              zerochirou
            </a>
            . All rights reserved {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
