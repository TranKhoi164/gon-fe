"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { NotionBlock, PageDetail } from "@/types/notes.types";
import { EMOJI_SUGGESTIONS } from "@/constants/notes.constants";
import {
  notionBlocksToBlockNote,
  blockNoteToPersistedBlocks,
} from "@/lib/blocknote-converter";
import { cn } from "@/lib/utils";

// BlockNote Imports
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@/styling/blocknote.css";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Theme } from "@blocknote/mantine";

import {
  Star,
  Zap,
  Copy,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  FileDown,
  Check,
} from "lucide-react";

interface NotionBlockEditorProps {
  page: PageDetail;
  onUpdateMetadata: (payload: {
    title?: string;
    icon?: string | null;
    coverImageUrl?: string | null;
    isFavorite?: boolean;
  }) => void;
  onSaveContent: (content: NotionBlock[], version: number) => Promise<void>;
  onExtractTasksClick: () => void;
  onDuplicateClick: () => void;
  onDeleteClick: () => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
}

const gonLightBlockNoteTheme: Theme = {
  colors: {
    editor: {
      text: "#2d2420",
      background: "transparent",
    },
    menu: {
      text: "#2d2420",
      background: "#FFFBF8",
    },
    tooltip: {
      text: "#FFFBF8",
      background: "#2d2420",
    },
    hovered: {
      text: "#2d2420",
      background: "#f7f1e6",
    },
    selected: {
      text: "#2d2420",
      background: "#efe7d9",
    },
    disabled: {
      text: "#8f8274",
      background: "#f7f1e6",
    },
    shadow: "rgba(50, 38, 28, 0.08)",
    border: "rgba(60, 45, 30, 0.08)",
    sideMenu: "#8f8274",
  },
  borderRadius: 10,
  fontFamily: "inherit",
};

const gonDarkBlockNoteTheme: Theme = {
  colors: {
    editor: {
      text: "#f4eee7",
      background: "transparent",
    },
    menu: {
      text: "#f4eee7",
      background: "#1c1714",
    },
    tooltip: {
      text: "#13100e",
      background: "#f4eee7",
    },
    hovered: {
      text: "#f4eee7",
      background: "#29211c",
    },
    selected: {
      text: "#f4eee7",
      background: "#382e27",
    },
    disabled: {
      text: "#7a6e63",
      background: "#1c1714",
    },
    shadow: "rgba(0, 0, 0, 0.4)",
    border: "rgba(255, 255, 255, 0.08)",
    sideMenu: "#7a6e63",
  },
  borderRadius: 10,
  fontFamily: "inherit",
};

const emptySubscribe = () => () => {};

export const NotionBlockEditor: React.FC<NotionBlockEditorProps> = ({
  page,
  onUpdateMetadata,
  onSaveContent,
  onExtractTasksClick,
  onDuplicateClick,
  onDeleteClick,
  saveStatus,
}) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [title, setTitle] = useState(page.title);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestBlocksRef = useRef<NotionBlock[] | null>(null);
  const isDirtyRef = useRef(false);

  // Initialize BlockNote Editor instance with existing page content converted to BlockNote blocks
  const editor = useCreateBlockNote({
    initialContent: notionBlocksToBlockNote(page.content),
  });

  // Debounced autosave using BlockNote's useEditorChange
  useEditorChange((ed) => {
    isDirtyRef.current = true;
    const persistedBlocks = blockNoteToPersistedBlocks(ed.document);
    latestBlocksRef.current = persistedBlocks;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      isDirtyRef.current = false;
      onSaveContent(persistedBlocks, page.version);
    }, 1200);
  }, editor);

  // Flush pending autosave on unmount if dirty
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (isDirtyRef.current && latestBlocksRef.current) {
        onSaveContent(latestBlocksRef.current, page.version);
      }
    };
  }, [page.id, page.version, onSaveContent]);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.style.height = "auto";
      titleInputRef.current.style.height = `${titleInputRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    onUpdateMetadata({ title: val });
  };

  const handleCopyAsMarkdown = async () => {
    if (!editor) return;
    try {
      const bodyMd = editor.blocksToMarkdownLossy(editor.document);
      const fullMd = title ? `# ${title}\n\n${bodyMd}` : bodyMd;
      await navigator.clipboard.writeText(fullMd);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy markdown", e);
    }
  };

  const handleAddCover = () => {
    const sampleCovers = [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    ];
    const chosen = sampleCovers[Math.floor(Math.random() * sampleCovers.length)];
    onUpdateMetadata({ coverImageUrl: chosen });
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col overflow-y-auto bg-surface rounded-xl shadow-warm select-text relative transition-all">
      {/* Top Action Header Bar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-surface/90 px-6 py-3 flex items-center justify-between text-xs rounded-t-xl shadow-warm-xs gap-3">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-text-tertiary truncate max-w-xs sm:max-w-md">
          {page.breadcrumbs && page.breadcrumbs.length > 0 ? (
            page.breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                {idx > 0 && <span className="text-[10px] text-text-tertiary">/</span>}
                <span
                  className={cn(
                    "flex items-center gap-1 truncate",
                    idx === page.breadcrumbs!.length - 1 &&
                      "font-medium text-text-primary"
                  )}
                >
                  {crumb.icon && crumb.icon !== "📄" ? (
                    <span className="text-xs">{crumb.icon}</span>
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-text-tertiary shrink-0 stroke-[1.8]" />
                  )}
                  <span>{crumb.title}</span>
                </span>
              </React.Fragment>
            ))
          ) : (
            <span className="font-medium text-text-primary">{page.title}</span>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Autosave Status Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary mr-1">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-gold" />
                <span className="hidden sm:inline">Đang lưu...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-medium hidden sm:inline">Đã lưu</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-error" />
                <span className="text-error font-medium hidden sm:inline">Lỗi</span>
              </>
            )}
          </div>

          {/* Extract to Task Button */}
          <button
            type="button"
            onClick={onExtractTasksClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-gold-soft hover:bg-accent-gold/20 text-accent-gold font-medium transition-all shadow-warm-xs text-xs cursor-pointer"
            title="Trích xuất các việc to-do từ ghi chú thành Task trên Dashboard"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Trích xuất Task</span>
          </button>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => onUpdateMetadata({ isFavorite: !page.isFavorite })}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-secondary transition-colors cursor-pointer"
            title={page.isFavorite ? "Bỏ yêu thích" : "Ghim vào Yêu thích"}
          >
            <Star
              className={cn(
                "w-4 h-4 transition-colors",
                page.isFavorite
                  ? "fill-amber-400 text-amber-500"
                  : "text-text-tertiary hover:text-text-primary"
              )}
            />
          </button>

          {/* Copy as Markdown Button */}
          <button
            type="button"
            onClick={handleCopyAsMarkdown}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="Sao chép toàn bộ trang dạng Markdown"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Duplicate Button */}
          <button
            type="button"
            onClick={onDuplicateClick}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="Nhân bản trang"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={onDeleteClick}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-error-soft text-text-tertiary hover:text-error transition-colors cursor-pointer"
            title="Xóa trang (chuyển vào thùng rác)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Cover Image Section */}
      {page.coverImageUrl ? (
        <div className="relative group w-full h-44 md:h-56 overflow-hidden bg-surface-tertiary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover object-center"
          />
          <div className="opacity-0 group-hover:opacity-100 absolute bottom-3 right-6 flex items-center gap-2 transition-opacity">
            <button
              type="button"
              onClick={handleAddCover}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface/90 hover:bg-surface text-text-primary text-xs font-medium shadow-md backdrop-blur-xs cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Đổi ảnh bìa</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateMetadata({ coverImageUrl: null })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface/90 hover:bg-surface text-error text-xs font-medium shadow-md backdrop-blur-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa ảnh</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="h-6 group hover:h-8 transition-all flex items-center px-16 text-xs text-text-tertiary">
          <button
            type="button"
            onClick={handleAddCover}
            className="opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Thêm ảnh bìa</span>
          </button>
        </div>
      )}

      {/* Editor Content Canvas */}
      <main className="max-w-4xl w-full mx-auto px-6 md:px-12 py-8 flex-1">
        {/* Page Icon / Emoji Picker */}
        <div className="relative mb-3">
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="w-12 h-12 flex items-center justify-center text-3xl rounded-xl hover:bg-surface-secondary transition-transform hover:scale-105 cursor-pointer"
            title="Bấm để đổi biểu tượng trang"
          >
            {page.icon || "📄"}
          </button>

          {/* Emoji Suggestions Popover */}
          {isEmojiPickerOpen && (
            <div className="absolute z-30 mt-2 p-2.5 bg-surface border border-border rounded-xl shadow-xl flex items-center gap-1.5 flex-wrap w-64 animate-in fade-in zoom-in-95">
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onUpdateMetadata({ icon: emoji });
                    setIsEmojiPickerOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-surface-tertiary transition-colors cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Page Title Editable Textarea (Slim Editorial Serif) */}
        <textarea
          ref={titleInputRef}
          rows={1}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Không có tiêu đề"
          className="w-full resize-none bg-transparent font-serif-display font-bold text-3xl md:text-5xl text-text-primary placeholder:text-text-tertiary/30 focus:outline-none leading-[1.15] mb-6 tracking-tight transition-colors"
        />

        {/* Real BlockNote Rich-Text Editor Canvas */}
        <div className="blocknote-container min-h-[450px]">
          {isMounted && editor ? (
            <BlockNoteView
              editor={editor}
              theme={{
                light: gonLightBlockNoteTheme,
                dark: gonDarkBlockNoteTheme,
              }}
            />
          ) : (
            <div className="flex items-center justify-center py-20 text-text-tertiary text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" />
              <span>Đang tải trình soạn thảo BlockNote...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
