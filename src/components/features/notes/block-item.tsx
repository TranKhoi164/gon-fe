'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotionBlock, NotionBlockType } from '@/types/notes.types';
import { TableBlock } from './table-block';
import { CodeBlock } from './code-block';
import { SlashCommandMenu } from './slash-command-menu';
import { InlineMarkdown } from './inline-markdown';
import { detectMarkdownTrigger } from '@/lib/markdown-block-converter';
import { cn } from '@/lib/utils';
import {
  Trash2,
  GripVertical,
  ChevronRight,
} from 'lucide-react';

interface BlockItemProps {
  block: NotionBlock;
  index: number;
  isFocused?: boolean;
  onFocused?: () => void;
  onChange: (updated: NotionBlock) => void;
  onDelete: (id: string) => void;
  onAddBelow: (id: string, initialType?: NotionBlockType) => void;
  onFocusNext?: () => void;
  onFocusPrev?: () => void;
}

const hasInlineMarkdown = (str: string) =>
  /(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`|~~.*?~~|\[.*?\]\(.*?\))/.test(str);

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  index,
  isFocused,
  onFocused,
  onChange,
  onDelete,
  onAddBelow,
}) => {
  const [isSlashOpen, setIsSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [isToggleOpen, setIsToggleOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const title = block.properties?.title || '';

  // Auto-focus when newly created or selected
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      setIsEditing(true);
      if ('setSelectionRange' in inputRef.current) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
      onFocused?.();
    }
  }, [isFocused, onFocused]);

  // Auto-resize textarea height
  useEffect(() => {
    if (inputRef.current && inputRef.current instanceof HTMLTextAreaElement) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [title, isEditing]);

  const handleTextChange = (val: string) => {
    if (val.startsWith('/')) {
      setIsSlashOpen(true);
      setSlashQuery(val);
    } else {
      if (isSlashOpen) setIsSlashOpen(false);
    }

    // Real-time Markdown syntax trigger detection (#, ##, ###, - [ ], -, 1., >, ```, ---, :::)
    const trigger = detectMarkdownTrigger(val);
    if (
      trigger &&
      (block.type === 'paragraph' ||
        block.type === 'heading_1' ||
        block.type === 'heading_2' ||
        block.type === 'heading_3')
    ) {
      onChange({
        ...block,
        type: trigger.type,
        properties: {
          ...block.properties,
          title: trigger.cleanText,
          checked: trigger.checked !== undefined ? trigger.checked : block.properties?.checked,
          language: trigger.language || block.properties?.language,
          icon: trigger.type === 'callout' ? '💡' : block.properties?.icon,
        },
      });
      return;
    }

    onChange({
      ...block,
      properties: {
        ...block.properties,
        title: val,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSlashOpen) return;

    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault();

      // 1. Khi đang ở block to_do (checkbox):
      if (block.type === 'to_do') {
        if (title.trim() === '') {
          // Bấm Enter trên dòng checkbox rỗng -> chuyển thành đoạn văn bản thường
          onChange({ ...block, type: 'paragraph' });
        } else {
          // Đang có nội dung -> tạo tiếp 1 dòng checkbox mới ngay bên dưới
          onAddBelow(block.id, 'to_do');
        }
        return;
      }

      // 2. Khi đang ở block bulleted_list_item (gạch đầu dòng):
      if (block.type === 'bulleted_list_item') {
        if (title.trim() === '') {
          // Bấm Enter trên dòng gạch đầu dòng rỗng -> chuyển thành đoạn văn bản thường
          onChange({ ...block, type: 'paragraph' });
        } else {
          // Đang có nội dung -> tạo tiếp 1 dòng gạch đầu dòng mới ngay bên dưới
          onAddBelow(block.id, 'bulleted_list_item');
        }
        return;
      }

      // 3. Khi đang ở block numbered_list_item (danh sách có số):
      if (block.type === 'numbered_list_item') {
        if (title.trim() === '') {
          // Bấm Enter trên dòng số rỗng -> chuyển thành đoạn văn bản thường
          onChange({ ...block, type: 'paragraph' });
        } else {
          // Đang có nội dung -> tạo tiếp 1 dòng đánh số mới ngay bên dưới
          onAddBelow(block.id, 'numbered_list_item');
        }
        return;
      }

      // 4. Các block thông thường khác (heading, quote, paragraph, callout...) -> tạo block paragraph mới
      onAddBelow(block.id, 'paragraph');
    } else if (e.key === 'Backspace' && title === '') {
      if (block.type !== 'paragraph') {
        e.preventDefault();
        onChange({ ...block, type: 'paragraph' });
      } else {
        e.preventDefault();
        onDelete(block.id);
      }
    }
  };

  const handleSelectSlashType = (newType: NotionBlockType) => {
    setIsSlashOpen(false);
    setSlashQuery('');
    onChange({
      ...block,
      type: newType,
      properties: {
        ...block.properties,
        title: '',
        checked: false,
        language: newType === 'code' ? 'typescript' : undefined,
        icon: newType === 'callout' ? '💡' : undefined,
      },
    });
  };

  return (
    <div className="group relative flex items-start gap-1.5 py-0.5 my-0.5">
      {/* Left Block Controls (Hover handle & delete) */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 absolute -left-9 top-1 transition-opacity select-none z-10">
        <button
          type="button"
          onClick={() => onDelete(block.id)}
          className="w-4 h-4 flex items-center justify-center text-text-tertiary hover:text-error rounded transition-colors cursor-pointer"
          title="Xóa khối này"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsSlashOpen(!isSlashOpen)}
          className="w-4 h-4 flex items-center justify-center text-text-tertiary hover:text-primary rounded transition-colors cursor-pointer"
          title="Đổi loại khối (/)"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block Body Rendering */}
      <div className="flex-1 min-w-0">
        {/* HEADING 1 (Slim Editorial Serif) */}
        {block.type === 'heading_1' && (
          <div className="relative">
            {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
              <div
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
                className="w-full cursor-text font-serif-display font-bold text-2xl md:text-3xl text-text-primary leading-snug py-1 tracking-tight min-h-[38px]"
              >
                <InlineMarkdown content={title} placeholder="Tiêu đề 1 (# Tiêu đề lớn)" />
              </div>
            ) : (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={1}
                value={title}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                placeholder="Tiêu đề 1 (# Tiêu đề lớn)"
                className="w-full resize-none bg-transparent font-serif-display font-bold text-2xl md:text-3xl text-text-primary placeholder:text-text-tertiary/40 focus:outline-none leading-snug py-1 tracking-tight"
              />
            )}
          </div>
        )}

        {/* HEADING 2 (Newsreader Bold) */}
        {block.type === 'heading_2' && (
          <div className="relative">
            {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
              <div
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
                className="w-full cursor-text font-serif-display font-bold text-xl md:text-2xl text-text-primary leading-snug py-1 tracking-tight min-h-[32px]"
              >
                <InlineMarkdown content={title} placeholder="Tiêu đề 2 (## Tiêu đề vừa)" />
              </div>
            ) : (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={1}
                value={title}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                placeholder="Tiêu đề 2 (## Tiêu đề vừa)"
                className="w-full resize-none bg-transparent font-serif-display font-bold text-xl md:text-2xl text-text-primary placeholder:text-text-tertiary/40 focus:outline-none leading-snug py-1 tracking-tight"
              />
            )}
          </div>
        )}

        {/* HEADING 3 */}
        {block.type === 'heading_3' && (
          <div className="relative">
            {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
              <div
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
                className="w-full cursor-text font-sans font-medium text-base md:text-lg text-text-primary leading-snug py-0.5 tracking-tight min-h-[28px]"
              >
                <InlineMarkdown content={title} placeholder="Tiêu đề 3 (### Tiêu đề nhỏ)" />
              </div>
            ) : (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={1}
                value={title}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                placeholder="Tiêu đề 3 (### Tiêu đề nhỏ)"
                className="w-full resize-none bg-transparent font-sans font-medium text-base md:text-lg text-text-primary placeholder:text-text-tertiary/40 focus:outline-none leading-snug py-0.5 tracking-tight"
              />
            )}
          </div>
        )}

        {/* PARAGRAPH */}
        {block.type === 'paragraph' && (
          <div className="relative">
            {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
              <div
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
                className="w-full cursor-text text-sm text-text-primary leading-relaxed py-0.5 min-h-[24px]"
              >
                <InlineMarkdown content={title} placeholder="Gõ '/' để chèn khối hoặc bắt đầu viết..." />
              </div>
            ) : (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={1}
                value={title}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                placeholder="Gõ '/' để chèn khối hoặc gõ cú pháp Markdown (#, -, >)..."
                className="w-full resize-none bg-transparent text-sm text-text-primary placeholder:text-text-tertiary/30 focus:outline-none leading-relaxed py-0.5"
              />
            )}
          </div>
        )}

        {/* TO-DO CHECKBOX */}
        {block.type === 'to_do' && (
          <div className="flex items-start gap-2 py-0.5">
            <input
              type="checkbox"
              checked={block.properties?.checked || false}
              onChange={(e) =>
                onChange({
                  ...block,
                  properties: { ...block.properties, checked: e.target.checked },
                })
              }
              className="mt-1 w-4 h-4 rounded text-primary accent-primary cursor-pointer transition-transform hover:scale-110"
            />
            <div className="flex-1 relative">
              {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
                <div
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  className={cn(
                    'w-full cursor-text text-sm py-0.5 leading-relaxed min-h-[24px]',
                    block.properties?.checked
                      ? 'line-through text-text-tertiary'
                      : 'text-text-primary'
                  )}
                >
                  <InlineMarkdown content={title} placeholder="Việc cần làm..." />
                </div>
              ) : (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={1}
                  value={title}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  placeholder="Việc cần làm..."
                  className={cn(
                    'w-full resize-none bg-transparent text-sm focus:outline-none py-0.5 leading-relaxed',
                    block.properties?.checked
                      ? 'line-through text-text-tertiary'
                      : 'text-text-primary'
                  )}
                />
              )}
            </div>
          </div>
        )}

        {/* BULLETED LIST ITEM */}
        {block.type === 'bulleted_list_item' && (
          <div className="flex items-start gap-2 py-0.5">
            <span className="text-base text-text-secondary leading-none select-none mt-0.5">•</span>
            <div className="flex-1 relative">
              {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
                <div
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  className="w-full cursor-text text-sm text-text-primary py-0.5 leading-relaxed min-h-[24px]"
                >
                  <InlineMarkdown content={title} placeholder="Danh sách..." />
                </div>
              ) : (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={1}
                  value={title}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  placeholder="Danh sách..."
                  className="w-full resize-none bg-transparent text-sm text-text-primary focus:outline-none py-0.5 leading-relaxed"
                />
              )}
            </div>
          </div>
        )}

        {/* NUMBERED LIST ITEM */}
        {block.type === 'numbered_list_item' && (
          <div className="flex items-start gap-2 py-0.5">
            <span className="text-xs font-semibold text-text-secondary select-none mt-1 min-w-[16px]">
              {index + 1}.
            </span>
            <div className="flex-1 relative">
              {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
                <div
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  className="w-full cursor-text text-sm text-text-primary py-0.5 leading-relaxed min-h-[24px]"
                >
                  <InlineMarkdown content={title} placeholder="Danh sách có số..." />
                </div>
              ) : (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={1}
                  value={title}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  placeholder="Danh sách có số..."
                  className="w-full resize-none bg-transparent text-sm text-text-primary focus:outline-none py-0.5 leading-relaxed"
                />
              )}
            </div>
          </div>
        )}

        {/* TOGGLE LIST */}
        {block.type === 'toggle' && (
          <div className="space-y-1 py-0.5">
            <div className="flex items-start gap-1.5">
              <button
                type="button"
                onClick={() => setIsToggleOpen(!isToggleOpen)}
                className="w-4 h-4 flex items-center justify-center text-text-tertiary hover:bg-surface-tertiary rounded transition-colors mt-1 cursor-pointer"
              >
                <ChevronRight
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-150',
                    isToggleOpen && 'rotate-90'
                  )}
                />
              </button>
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={title}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                placeholder="Nội dung tiêu đề toggle..."
                className="flex-1 bg-transparent text-sm font-medium text-text-primary focus:outline-none py-0.5"
              />
            </div>
            {isToggleOpen && (
              <div className="pl-6 border-l border-border-subtle py-1 text-xs text-text-secondary">
                <p className="italic text-text-tertiary">Khối con bên trong toggle</p>
              </div>
            )}
          </div>
        )}

        {/* CODE BLOCK (PrismJS Syntax Highlighting) */}
        {block.type === 'code' && (
          <CodeBlock
            block={block}
            onChange={onChange}
            isFocused={isFocused}
          />
        )}

        {/* QUOTE BLOCK (Kinfolk Warm Editorial Card) */}
        {block.type === 'quote' && (
          <div className="flex items-start gap-3.5 my-2.5 p-4 md:p-5 rounded-xl bg-surface-secondary/70 border border-border-subtle shadow-warm-xs">
            <span className="font-serif-display text-2xl text-primary select-none shrink-0 leading-none mt-0.5">
              ❝
            </span>
            <div className="flex-1 relative">
              {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
                <div
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  className="w-full cursor-text font-serif-display italic text-sm md:text-base text-text-secondary py-0.5 leading-relaxed min-h-[24px]"
                >
                  <InlineMarkdown content={title} placeholder="Đoạn văn trích dẫn ý tưởng sâu sắc..." />
                </div>
              ) : (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={1}
                  value={title}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  placeholder="Đoạn văn trích dẫn ý tưởng sâu sắc..."
                  className="w-full resize-none bg-transparent font-serif-display italic text-sm md:text-base text-text-secondary placeholder:text-text-tertiary/40 focus:outline-none py-0.5 leading-relaxed"
                />
              )}
            </div>
          </div>
        )}

        {/* CALLOUT BOX */}
        {block.type === 'callout' && (
          <div className="flex items-start gap-3 my-2.5 p-3.5 rounded-xl bg-surface-secondary/70 border border-border shadow-xs">
            <span className="text-xl select-none shrink-0">
              {block.properties?.icon || '💡'}
            </span>
            <div className="flex-1 relative">
              {!isEditing && !isFocused && hasInlineMarkdown(title) ? (
                <div
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  className="w-full cursor-text text-sm text-text-primary font-medium leading-relaxed py-0.5 min-h-[24px]"
                >
                  <InlineMarkdown content={title} placeholder="Ghi chú quan trọng..." />
                </div>
              ) : (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={1}
                  value={title}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  placeholder="Ghi chú quan trọng..."
                  className="w-full resize-none bg-transparent text-sm text-text-primary focus:outline-none py-0.5 leading-relaxed font-medium"
                />
              )}
            </div>
          </div>
        )}

        {/* DIVIDER */}
        {block.type === 'divider' && (
          <div className="my-3 py-2 cursor-pointer" onClick={() => onAddBelow(block.id)}>
            <hr className="border-t border-border-subtle" />
          </div>
        )}

        {/* TABLE BLOCK */}
        {block.type === 'table' && (
          <TableBlock block={block} onChange={onChange} />
        )}

        {/* Slash Command Floating Menu */}
        {isSlashOpen && (
          <SlashCommandMenu
            filterQuery={slashQuery}
            onSelect={handleSelectSlashType}
            onClose={() => setIsSlashOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
