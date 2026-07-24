"use client";

import { useRef } from "react";

function ToolbarButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep selection focused in the editor
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200"
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    ref.current?.focus();
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt("Link URL:", "https://");
    if (url) exec("createLink", url);
  };

  const insertImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => exec("insertImage", String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-slate-100 border-b border-slate-200">
        <ToolbarButton label="B" onClick={() => exec("bold")} />
        <ToolbarButton label="I" onClick={() => exec("italic")} />
        <ToolbarButton label="U" onClick={() => exec("underline")} />
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <ToolbarButton label="H2" onClick={() => exec("formatBlock", "h2")} />
        <ToolbarButton label="H3" onClick={() => exec("formatBlock", "h3")} />
        <ToolbarButton label="¶" onClick={() => exec("formatBlock", "p")} />
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <ToolbarButton label="• List" onClick={() => exec("insertUnorderedList")} />
        <ToolbarButton label="1. List" onClick={() => exec("insertOrderedList")} />
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <ToolbarButton label="🔗 Link" onClick={insertLink} />
        <ToolbarButton label="🖼️ Image" onClick={() => imgRef.current?.click()} />
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) insertImageFile(f);
            e.target.value = "";
          }}
        />
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <ToolbarButton label="↶ Undo" onClick={() => exec("undo")} />
        <ToolbarButton label="↷ Redo" onClick={() => exec("redo")} />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        className="article-body p-6 md:p-8 min-h-[300px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: initialHtml }}
      />
    </div>
  );
}
