"use client";

import { useRef, useState, type ReactNode } from "react";

function ToolbarButton({
  label,
  onClick,
  title,
}: {
  label: ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep selection focused in the editor
      onClick={onClick}
      title={title}
      className="px-2.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200"
    >
      {label}
    </button>
  );
}

function BulletListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function NumberedListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <text x="1.5" y="8" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text>
      <text x="1.5" y="14.3" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text>
      <text x="1.5" y="20.6" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text>
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function RichTextEditor({
  initialHtml,
  onChange,
  onSave,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
  /** Called (in addition to onChange) when a change should persist immediately,
   *  instead of waiting for the surrounding page's explicit Save button. */
  onSave?: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [html, setHtml] = useState(initialHtml); // always the real HTML (full base64 images)
  const [htmlDraft, setHtmlDraft] = useState(""); // what the HTML textarea displays (images collapsed)
  const [renderKey, setRenderKey] = useState(0);
  const [imgModal, setImgModal] = useState<{ el: HTMLImageElement; alt: string } | null>(null);
  const imageMapRef = useRef<Record<string, string>>({});

  // Long base64 image data makes the HTML textarea unreadable, so swap it for a short
  // token while editing and expand it back before saving/rendering.
  const collapseImages = (h: string) => {
    let i = 0;
    const map: Record<string, string> = {};
    const collapsed = h.replace(
      /src="(data:image\/[^;]+;base64,[^"]*)"/gi,
      (_match, dataUri: string) => {
        i += 1;
        const key = String(i);
        map[key] = dataUri;
        const kb = Math.round((dataUri.length * 0.75) / 1024);
        return `src="__IMG_DATA_${key}__ (~${kb}KB, do not edit this token)"`;
      }
    );
    imageMapRef.current = map;
    return collapsed;
  };

  const expandImages = (h: string) =>
    h.replace(/src="__IMG_DATA_(\d+)__[^"]*"/gi, (match, key: string) => {
      const dataUri = imageMapRef.current[key];
      return dataUri ? `src="${dataUri}"` : match;
    });

  // The selection highlight is applied directly to the live DOM node so the user can see
  // which image they're editing, but it must never leak into what gets saved — so every
  // read of the editor's HTML goes through this, which strips it from a clone.
  const getCleanHtml = () => {
    if (!ref.current) return html;
    const clone = ref.current.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("img.rte-img-selected").forEach((img) => img.classList.remove("rte-img-selected"));
    return clone.innerHTML;
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    ref.current?.focus();
    onChange(getCleanHtml());
  };

  const toggleHtmlView = () => {
    if (showHtml) {
      // Switching HTML -> visual: re-mount the editable div with the edited (expanded) HTML
      setRenderKey((k) => k + 1);
    } else {
      // Switching visual -> HTML: capture current visual content and collapse images for display
      const current = getCleanHtml();
      setHtml(current);
      setHtmlDraft(collapseImages(current));
    }
    setShowHtml((s) => !s);
  };

  const insertLink = () => {
    const url = prompt("Link URL:", "https://");
    if (url) exec("createLink", url);
  };

  const selectImageForEditing = (img: HTMLImageElement) => {
    ref.current?.querySelectorAll("img.rte-img-selected").forEach((el) => el.classList.remove("rte-img-selected"));
    img.classList.add("rte-img-selected");
    setImgModal({ el: img, alt: img.getAttribute("alt") || "" });
  };

  const insertImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      // The filename itself is invisible to Google, but a keyword-rich name (e.g.
      // "power-bi-dashboard.jpg" instead of "IMG_1234.jpg") makes writing a good
      // alt text easy — so we suggest it as a starting point in the alt text dialog.
      const suggestedAlt = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();

      document.execCommand("insertImage", false, dataUrl);
      ref.current?.focus();
      if (ref.current) {
        const inserted = Array.from(ref.current.querySelectorAll("img")).find(
          (img) => img.getAttribute("src") === dataUrl
        );
        if (inserted) selectImageForEditing(inserted);
        onChange(getCleanHtml());
      }
    };
    reader.readAsDataURL(file);
  };

  const closeImgModal = () => {
    ref.current?.querySelectorAll("img.rte-img-selected").forEach((el) => el.classList.remove("rte-img-selected"));
    setImgModal(null);
  };

  const saveImgModal = () => {
    if (!imgModal) return;
    imgModal.el.setAttribute("alt", imgModal.alt);
    imgModal.el.classList.remove("rte-img-selected");
    const clean = getCleanHtml();
    onChange(clean);
    onSave?.(clean); // persist right away — don't make alt text depend on remembering the outer Save button
    setImgModal(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-slate-100 border-b border-slate-200">
        <ToolbarButton label="B" onClick={() => exec("bold")} />
        <ToolbarButton label="I" onClick={() => exec("italic")} />
        <ToolbarButton label="U" onClick={() => exec("underline")} />
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) exec("formatBlock", e.target.value);
            e.target.value = "";
          }}
          className="px-2 py-1.5 rounded-lg text-sm font-semibold text-slate-700 bg-transparent hover:bg-slate-200 focus:outline-none"
        >
          <option value="" disabled>
            Heading
          </option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Paragraph</option>
        </select>
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <ToolbarButton
          label={<BulletListIcon />}
          title="Bulleted list"
          onClick={() => exec("insertUnorderedList")}
        />
        <ToolbarButton
          label={<NumberedListIcon />}
          title="Numbered list"
          onClick={() => exec("insertOrderedList")}
        />
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
        <ToolbarButton label="↶" title="Undo" onClick={() => exec("undo")} />
        <ToolbarButton label="↷" title="Redo" onClick={() => exec("redo")} />
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleHtmlView}
          className={`px-2.5 py-1.5 rounded-lg text-sm font-mono font-bold ${
            showHtml ? "bg-slate-700 text-white" : "text-slate-700 hover:bg-slate-200"
          }`}
          title={showHtml ? "Switch to visual view" : "Switch to HTML view"}
        >
          &lt;/&gt;
        </button>
      </div>
      {showHtml ? (
        <textarea
          value={htmlDraft}
          onChange={(e) => {
            setHtmlDraft(e.target.value);
            const expanded = expandImages(e.target.value);
            setHtml(expanded);
            onChange(expanded);
          }}
          spellCheck={false}
          className="w-full h-160 resize-y p-6 md:p-8 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all focus:outline-none"
        />
      ) : (
        <div
          key={renderKey}
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(getCleanHtml())}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "IMG") {
              e.preventDefault();
              selectImageForEditing(target as HTMLImageElement);
            }
          }}
          className="article-body p-6 md:p-8 min-h-160 focus:outline-none overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      {imgModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 grid place-items-center p-4"
          onClick={saveImgModal}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Edit image</h3>
              <button
                onClick={closeImgModal}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <img
              src={imgModal.el.getAttribute("src") || ""}
              alt=""
              className="rounded-xl max-h-40 w-full object-cover border border-slate-200"
            />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Alt text — describe the image with real keywords (this is what Google reads)
              </label>
              <input
                autoFocus
                value={imgModal.alt}
                onChange={(e) => setImgModal({ ...imgModal, alt: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveImgModal();
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeImgModal}
                className="text-sm font-semibold text-slate-500 px-3 py-2 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={saveImgModal}
                className="text-sm font-semibold text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
