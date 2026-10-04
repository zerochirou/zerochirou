"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { useRadioStore } from "../store/radio_store";
import { KEYBOARD_SHORTCUTS } from "../constants";

export function RadioShortcutsDialog() {
  const shortcutsOpen = useRadioStore((s) => s.shortcutsOpen);
  const setShortcutsOpen = useRadioStore((s) => s.setShortcutsOpen);

  return (
    <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <DialogContent className="max-w-md border border-card/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="size-5 text-primary" />
            <DialogTitle>Keyboard Controls</DialogTitle>
          </div>
          <DialogDescription>
            Speed up your music control while you code with quick hotkeys.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-2.5">
          {KEYBOARD_SHORTCUTS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-background/50 px-3.5 py-2.5 text-xs"
            >
              <span className="text-muted-foreground">{item.desc}</span>
              <kbd className="inline-flex h-6 items-center justify-center rounded-md border border-white/15 bg-muted/60 px-2 font-mono text-[11px] font-semibold text-foreground shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
