"use client";

import * as React from "react";
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code_block";
import { useHighlightedCode } from "@/hooks/use_highlighted_code";
import { cn } from "@workspace/ui/lib/utils";

export interface MdxCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  lineNumbers?: boolean;
}

export function MdxCodeBlock({
  code,
  language = "bash",
  title,
  className,
  lineNumbers,
}: MdxCodeBlockProps) {
  const cleanCode = typeof code === "string" ? code.replace(/\n$/, "") : String(code || "");
  const lang = (language || "bash").toLowerCase().replace(/^language-/, "");
  const highlightedLines = useHighlightedCode(cleanCode, lang);
  const displayTitle = title || lang;
  const isMultiLine = cleanCode.includes("\n");
  const showLineNumbers = lineNumbers ?? isMultiLine;

  return (
    <CodeBlock className={cn("my-6 rounded-xl border border-border/40 bg-muted/30 shadow-sm overflow-hidden", className)}>
      <CodeBlockHeader className="flex items-center justify-between border-b border-border/20 bg-muted/20 px-4 py-2">
        <CodeBlockTitle className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {displayTitle}
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={cleanCode} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent
        lineNumbers={showLineNumbers}
        className="p-4 text-xs sm:text-sm font-mono leading-relaxed text-foreground"
      >
        {highlightedLines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
}

export interface MdxPreProps extends React.ComponentProps<"pre"> {
  title?: string;
  lineNumbers?: boolean;
}

export function MdxPre({ children, className, title, lineNumbers, ...props }: MdxPreProps) {
  // Check if children is a <code> element from MDX
  if (React.isValidElement(children)) {
    const childProps = children.props as {
      className?: string;
      children?: React.ReactNode;
      title?: string;
    };

    const codeClass = childProps.className || className || "";
    const match = /language-([a-zA-Z0-9_-]+)/.exec(codeClass);
    const language = match ? match[1] : "bash";
    const rawContent = childProps.children;
    const codeString =
      typeof rawContent === "string"
        ? rawContent
        : Array.isArray(rawContent)
          ? rawContent.join("")
          : "";

    if (codeString) {
      return (
        <MdxCodeBlock
          code={codeString}
          language={language}
          title={title || childProps.title}
          lineNumbers={lineNumbers}
          className={className}
        />
      );
    }
  }

  // If children is already a string
  if (typeof children === "string" && children.trim().length > 0) {
    return (
      <MdxCodeBlock
        code={children}
        title={title}
        lineNumbers={lineNumbers}
        className={className}
      />
    );
  }

  // Fallback to standard styled pre
  return (
    <pre
      className={cn(
        "relative my-6 max-h-162.5 overflow-x-auto rounded-xl border border-border/40 bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  );
}

export interface MdxCodeProps extends React.ComponentProps<"code"> {
  title?: string;
}

export function MdxCode({ className, children, title, ...props }: MdxCodeProps) {
  // If it is a block code element not wrapped in pre but has language class and newlines
  const codeClass = className || "";
  const match = /language-([a-zA-Z0-9_-]+)/.exec(codeClass);
  const isBlock = typeof children === "string" && (Boolean(match) || children.includes("\n"));

  if (isBlock && typeof children === "string") {
    return (
      <MdxCodeBlock
        code={children}
        language={match ? match[1] : "bash"}
        title={title}
        className={className}
      />
    );
  }

  // Inline code styling
  return (
    <code
      className={cn(
        "relative rounded-md border border-border/50 bg-muted px-[0.35rem] py-[0.15rem] font-mono text-[0.875em] font-normal text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
