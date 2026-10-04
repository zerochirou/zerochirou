"use client";

import { useRadioAudio } from "../hooks/use_radio_audio";
import { useRadioMetadata } from "../hooks/use_radio_metadata";
import { useRadioShortcuts } from "../hooks/use_radio_shortcuts";
import { RadioHeader } from "./radio_header";
import { RadioVisual } from "./radio_visual";
import { RadioControls } from "./radio_controls";
import { RadioHistoryDialog } from "./radio_history_dialog";
import { RadioShortcutsDialog } from "./radio_shortcuts_dialog";

export function RadioPlayer() {
  // 1. Audio lifecycle and fullscreen event bindings
  useRadioAudio();

  // 2. Automated metadata fetching and polling with AbortController
  useRadioMetadata();

  // 3. Global keyboard shortcuts handler
  useRadioShortcuts();

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background font-sans text-foreground">
      {/* Top Header Bar */}
      <RadioHeader />

      {/* Center Interactive Visual Stage */}
      <RadioVisual />

      {/* Bottom Audio Control Bar */}
      <RadioControls />

      {/* History Dialog Modal */}
      <RadioHistoryDialog />

      {/* Keyboard Shortcuts Dialog Modal */}
      <RadioShortcutsDialog />
    </main>
  );
}
