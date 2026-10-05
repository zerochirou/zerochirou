"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftIcon,
  Code2Icon,
  DownloadIcon,
  ImageIcon,
  FileCodeIcon,
  CopyIcon,
  ZoomInIcon,
  ZoomOutIcon,
  Maximize2Icon,
  Trash2Icon,
  SunIcon,
  MoonIcon,
  LayoutTemplateIcon,
  GridIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import type { CanvasTheme } from "./types";
import { MERMAID_PRESETS } from "./template_presets";

export interface ZeromindToolbarProps {
  theme: CanvasTheme;
  onToggleTheme: () => void;
  onOpenMermaidDialog: () => void;
  onSelectPreset: (presetId: string) => void;
  onExport: (format: "png" | "svg" | "json") => void;
  onCopyToClipboard: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onClearCanvas: () => void;
  isGridMode?: boolean;
  onToggleGrid?: () => void;
}

export function ZeromindToolbar({
  theme,
  onToggleTheme,
  onOpenMermaidDialog,
  onSelectPreset,
  onExport,
  onCopyToClipboard,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onClearCanvas,
  isGridMode = true,
  onToggleGrid,
}: ZeromindToolbarProps) {
  return (
    <header className="fixed top-3 left-3 right-3 z-30 pointer-events-none flex items-center justify-between gap-2">
      {/* Left section: Breadcrumb & Title */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-4xl bg-card/90 px-3 py-1.5 shadow-md border border-border/40 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href="/" />}
          nativeButton={false}
          aria-label="Back to Portfolio"
          className="rounded-full"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>

        <div className="flex items-center gap-2 pr-1">
          <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Zeromind
          </span>
          <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-mono">
            whiteboard
          </Badge>
        </div>
      </div>

      {/* Right section: Streamlined, non-colliding action tools */}
      <div className="pointer-events-auto flex items-center gap-1 rounded-4xl bg-card/90 px-2 py-1.5 shadow-md border border-border/40 backdrop-blur-md">
        {/* Mermaid generator button */}
        <Button
          variant="default"
          size="sm"
          onClick={onOpenMermaidDialog}
          className="rounded-3xl gap-1.5 text-xs font-medium"
        >
          <Code2Icon data-icon="inline-start" className="size-3.5" />
          <span className="hidden md:inline">Mermaid</span>
          <span className="md:hidden">Code</span>
        </Button>

        {/* Templates dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                aria-label="Diagram Templates"
                className="rounded-3xl gap-1 text-xs"
              />
            }
          >
            <LayoutTemplateIcon data-icon="inline-start" className="size-3.5" />
            <span className="hidden lg:inline">Presets</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-3xl p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                Insert Diagram Preset
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MERMAID_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className="flex flex-col items-start gap-0.5 rounded-2xl px-2.5 py-1.5 text-xs"
                >
                  <span className="font-medium text-foreground">{preset.title}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">
                    {preset.category} &bull; {preset.description}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                aria-label="Export Whiteboard"
                className="rounded-3xl gap-1 text-xs"
              />
            }
          >
            <DownloadIcon data-icon="inline-start" className="size-3.5" />
            <span className="hidden lg:inline">Export</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-3xl p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                Export Canvas
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onExport("png")}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <ImageIcon className="size-3.5 text-muted-foreground" />
                <span>PNG Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport("svg")}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <FileCodeIcon className="size-3.5 text-muted-foreground" />
                <span>SVG Vector</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport("json")}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <FileCodeIcon className="size-3.5 text-muted-foreground" />
                <span>Excalidraw JSON</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onCopyToClipboard}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <CopyIcon className="size-3.5 text-muted-foreground" />
                <span>Copy to Clipboard</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-px bg-border/40 mx-0.5" />

        {/* View Options Menu (compact dropdown for canvas view and grid tools) */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Canvas view options"
                className="rounded-full"
              />
            }
          >
            <SlidersHorizontalIcon className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-3xl p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                Canvas Controls
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onZoomToFit}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <Maximize2Icon className="size-3.5 text-muted-foreground" />
                <span>Fit to Content</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onZoomIn}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <ZoomInIcon className="size-3.5 text-muted-foreground" />
                <span>Zoom In</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onZoomOut}
                className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
              >
                <ZoomOutIcon className="size-3.5 text-muted-foreground" />
                <span>Zoom Out</span>
              </DropdownMenuItem>
              {onToggleGrid ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onToggleGrid}
                    className="gap-2 rounded-2xl px-2.5 py-1.5 text-xs"
                  >
                    <GridIcon className="size-3.5 text-muted-foreground" />
                    <span>{isGridMode ? "Hide Grid" : "Show Grid"}</span>
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <SunIcon className="size-3.5" />
          ) : (
            <MoonIcon className="size-3.5" />
          )}
        </Button>

        {/* Clear canvas button */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClearCanvas}
          aria-label="Clear whiteboard"
          className="rounded-full text-destructive hover:bg-destructive/10"
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>
    </header>
  );
}
