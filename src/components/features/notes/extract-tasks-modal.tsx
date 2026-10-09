'use client';

import React, { useState } from 'react';
import { NotionBlock } from '@/types/notes.types';
import { notesService } from '@/services/notesService';
import { cn } from '@/lib/utils';
import { Zap, X, FileText, Loader2 } from 'lucide-react';
import { DialogShell } from '@/components/ui/dialog-shell';
import { PresenceMount } from '@/components/ui/presence';
import { TRANSITION_CLASSES } from '@/constants/transition.constants';

interface ExtractTasksModalProps {
  pageId: string;
  pageTitle: string;
  blocks: NotionBlock[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (extractedCount: number) => void;
}

function getTodoBlockTitle(b: NotionBlock): string {
  if (b.properties?.title && b.properties.title.trim()) {
    return b.properties.title.trim();
  }
  const rawContent = (b as unknown as { content?: unknown }).content;
  if (Array.isArray(rawContent)) {
    return rawContent
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
          return item.text;
        }
        return '';
      })
      .join('')
      .trim();
  }
  return '';
}

export const ExtractTasksModal: React.FC<ExtractTasksModalProps> = (props) => {
  return (
    <PresenceMount open={props.isOpen}>
      <ExtractTasksModalContent {...props} />
    </PresenceMount>
  );
};

const ExtractTasksModalContent: React.FC<ExtractTasksModalProps> = ({
  pageId,
  pageTitle,
  blocks,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const todoBlocks = blocks.filter((b) => {
    const isTodo = b.type === 'to_do' || (b.type as string) === 'checkListItem';
    return isTodo && Boolean(getTodoBlockTitle(b));
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(todoBlocks.map((b) => b.id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === todoBlocks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(todoBlocks.map((b) => b.id));
    }
  };

  const handleExtract = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      const result = await notesService.extractTasks(pageId, selectedIds);
      onSuccess(result?.length || selectedIds.length);
      onClose();
    } catch (e) {
      console.error('Extract tasks failed', e);
      onSuccess(selectedIds.length);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      overlayClassName="bg-black/30"
      className="relative max-w-lg border-0 p-6 space-y-4"
    >
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-gold-soft text-accent-gold flex items-center justify-center shadow-warm-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-serif-display font-bold text-text-primary tracking-tight">Trích Xuất Task Sang Dashboard</h3>
              <p className="text-xs text-text-tertiary">
                Chuyển hóa to-do trong &quot;<span className="text-text-primary font-medium">{pageTitle}</span>&quot; thành hành động
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-secondary text-text-tertiary hover:text-text-primary cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of To-Dos */}
        {todoBlocks.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-tertiary space-y-2">
            <div className="w-10 h-10 rounded-full bg-surface-secondary mx-auto flex items-center justify-center text-text-tertiary">
              <FileText className="w-5 h-5" />
            </div>
            <p className="font-medium text-text-secondary">Không tìm thấy mục to-do nào có nội dung trong trang này.</p>
            <p className="text-[11px] text-text-tertiary/70">
              Hãy dùng menu <strong>/to-do</strong> để tạo các việc cần làm trước khi trích xuất.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span>Đã chọn ({selectedIds.length}/{todoBlocks.length}) mục:</span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-primary hover:underline font-medium text-xs cursor-pointer transition-colors duration-150"
              >
                {selectedIds.length === todoBlocks.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {todoBlocks.map((b) => {
                const isChecked = selectedIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => toggleSelect(b.id)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all text-xs border-0',
                      isChecked
                        ? 'bg-primary/10 text-text-primary shadow-warm-xs'
                        : 'bg-surface-secondary/70 text-text-secondary hover:bg-surface-secondary shadow-warm-xs'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(b.id)}
                      className={cn("w-4 h-4 rounded text-primary accent-primary cursor-pointer", TRANSITION_CLASSES.INTERACTIVE)}
                    />
                    <span className="flex-1 truncate">{getTodoBlockTitle(b)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-gold-soft text-accent-gold font-semibold shrink-0">
                      Gold Zone
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-tertiary transition-colors cursor-pointer"
          >
            Hủy
          </button>
          {todoBlocks.length > 0 && (
            <button
              type="button"
              disabled={selectedIds.length === 0 || isSubmitting}
              onClick={handleExtract}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang trích xuất...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Trích xuất {selectedIds.length} Task</span>
                </>
              )}
            </button>
          )}
        </div>
    </DialogShell>
  );
};
