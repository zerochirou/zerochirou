"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, Music, Disc } from "lucide-react";
import { useRadioStore } from "../store/radio_store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function RadioHistoryDialog() {
  const historyOpen = useRadioStore((s) => s.historyOpen);
  const setHistoryOpen = useRadioStore((s) => s.setHistoryOpen);
  const songHistory = useRadioStore((s) => s.songHistory);
  const currentSong = useRadioStore((s) => s.currentSong);

  return (
    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto border border-card/10 bg-background/95 p-4 backdrop-blur-xl sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            <DialogTitle>Song History</DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            Recently played songs on the Code Radio live stream.
          </DialogDescription>
        </DialogHeader>

        {currentSong ? (
          <Card className="mt-2 overflow-hidden border-border/40 bg-card/60">
            <CardHeader className="p-0">
              <div className="relative flex justify-center">
                <Image
                  src={currentSong.art || "/assets/images/radio_bg.jpg"}
                  width={460}
                  height={260}
                  alt={currentSong.title || "Code Radio Track"}
                  unoptimized
                  className="h-32 w-full rounded-xl object-cover grayscale-100 sm:h-44"
                />
              </div>
            </CardHeader>
            <CardContent className="p-3.5 pt-2.5 sm:p-4 sm:pt-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                    Now Playing
                  </span>
                  <CardTitle className="truncate text-base font-semibold sm:text-lg">
                    {currentSong.title}
                  </CardTitle>
                  <CardDescription className="truncate text-xs text-muted-foreground mt-0.5">
                    {currentSong.artist}
                    {currentSong.album ? ` • ${currentSong.album}` : ""}
                  </CardDescription>
                </div>
                <Button size={"icon-sm"}>
                  <Disc className="size-4 animate-spin duration-3000" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Previous Tracks
          </h4>
          {songHistory.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No recent songs recorded yet. Keep the radio streaming!
            </div>
          ) : (
            <div className="space-y-2">
              {songHistory.map((song, idx) => (
                <Card
                  key={`${song.title}-${song.playedAt || idx}`}
                  size="sm"
                  className=""
                >
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Music className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">
                          {song.title}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    {song.playedAt ? (
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {new Date(song.playedAt * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
