"use client";

import * as React from "react";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { MERMAID_PRESETS } from "./template_presets";
import { parseMermaidCode } from "./mermaid_parser";
import { Code2Icon, SparklesIcon, AlertCircleIcon, CopyCheckIcon } from "lucide-react";

export interface MermaidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertElements: (elements: readonly ExcalidrawElement[]) => void;
}

export function MermaidDialog({
  open,
  onOpenChange,
  onInsertElements,
}: MermaidDialogProps) {
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>(MERMAID_PRESETS[0].id);
  const [code, setCode] = React.useState<string>(MERMAID_PRESETS[0].code);
  const [isConverting, setIsConverting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = MERMAID_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setCode(found.code);
      setErrorMessage(null);
    }
  };

  const handleConvert = async () => {
    if (!code.trim()) {
      setErrorMessage("Please enter valid Mermaid diagram syntax.");
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);

    try {
      const result = await parseMermaidCode(code);
      if (result.success && result.elements.length > 0) {
        onInsertElements(result.elements);
        onOpenChange(false);
      } else {
        setErrorMessage(
          result.error ||
            "Unable to parse Mermaid syntax. Please verify diagram keywords and indentation."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl gap-5 p-6 rounded-4xl bg-popover text-popover-foreground border border-border/40">
        <DialogHeader className="gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Code2Icon className="size-4" />
            </div>
            <DialogTitle className="text-lg font-heading font-medium tracking-tight">
              Mermaid to Excalidraw Generator
            </DialogTitle>
            <Badge variant="secondary" className="ml-auto font-mono text-[10px]">
              zeromind-v1
            </Badge>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Convert Mermaid graph definitions into fully editable whiteboard shapes and connections.
          </DialogDescription>
        </DialogHeader>

        {/* Preset Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Architecture Presets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MERMAID_PRESETS.map((preset) => {
              const isActive = preset.id === selectedPresetId;
              return (
                <Button
                  key={preset.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="xs"
                  onClick={() => handleSelectPreset(preset.id)}
                  className="rounded-3xl text-xs font-normal"
                >
                  {preset.title}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Mermaid Definition</span>
            <span className="font-mono">{code.split("\n").length} lines</span>
          </div>
          <Textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. flowchart TD\n  A[Start] --> B[Execute]\n  B --> C[Done]"
            rows={10}
            className="font-mono text-xs leading-relaxed bg-background/60 border border-border/40 focus-visible:border-ring rounded-2xl resize-y min-h-48"
            spellCheck={false}
          />
        </div>

        {/* Error Alert */}
        {errorMessage ? (
          <Alert variant="destructive" className="rounded-2xl border-destructive/30 bg-destructive/10">
            <AlertCircleIcon className="size-4 text-destructive" />
            <AlertTitle className="text-xs font-semibold">Syntax Parse Error</AlertTitle>
            <AlertDescription className="text-xs text-destructive/90 font-mono break-words mt-1">
              {errorMessage}
            </AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SparklesIcon className="size-3.5 text-primary" />
            <span>Parses vertices, directed edges, subgraphs & labels</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isConverting}
            >
              Cancel
            </Button>
            {isConverting ? (
              <Button size="sm" disabled>
                <Spinner data-icon="inline-start" />
                Generating Diagram...
              </Button>
            ) : (
              <Button size="sm" onClick={handleConvert}>
                <CopyCheckIcon data-icon="inline-start" />
                Insert to Whiteboard
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

