"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type RichTextProps = {
  value: string;
  onChange: (value: string) => void;
};

const buttons = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "Bullet", command: "insertUnorderedList" }
];

export function RichTextEditor({ value, onChange }: RichTextProps) {
  const editorRef = React.useRef<HTMLDivElement | null>(null);

  const handleCommand = (command: string) => {
    document.execCommand(command);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.command}
            type="button"
            onClick={() => handleCommand(btn.command)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-textBody transition hover:border-purple/30 hover:bg-purple/10 hover:text-purple"
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className={cn(
          "min-h-[140px] rounded-xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none"
        )}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange((event.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
