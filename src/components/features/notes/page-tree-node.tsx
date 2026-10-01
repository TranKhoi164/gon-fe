'use client';

import React, { useState } from 'react';
import { PageTreeItem } from '@/types/notes.types';
import { cn } from '@/lib/utils';
import { ChevronRight, Plus, Trash2, FileText } from 'lucide-react';

interface PageTreeNodeProps {
  item: PageTreeItem;
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddSubPage: (parentId: string) => void;
  onArchivePage: (id: string) => void;
  depth?: number;
}

export const PageTreeNode: React.FC<PageTreeNodeProps> = ({
  item,
  activePageId,
  onSelectPage,
  onAddSubPage,
  onArchivePage,
  depth = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isActive = item.id === activePageId;
  const hasChildren = (item.children && item.children.length > 0) || item.hasChildren;

  return (
    <div className="select-none text-xs">
      <div
        className={cn(
          'group flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-150',
          isActive
            ? 'bg-primary-soft text-primary font-semibold shadow-warm-xs'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
        )}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        onClick={() => onSelectPage(item.id)}
      >
        {/* Toggle Collapse/Expand Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            'w-4 h-4 flex items-center justify-center rounded hover:bg-surface-tertiary text-text-tertiary transition-transform cursor-pointer',
            !hasChildren && 'opacity-0 pointer-events-none',
            isExpanded && hasChildren && 'rotate-90'
          )}
          title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
        >
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Page Icon (Line icon fallback) */}
        {item.icon && item.icon !== '📄' ? (
          <span className="text-xs shrink-0">{item.icon}</span>
        ) : (
          <FileText className="w-3.5 h-3.5 text-text-tertiary shrink-0 stroke-[1.8]" />
        )}

        {/* Page Title */}
        <span className="truncate flex-1 text-xs">
          {item.title || 'Không có tiêu đề'}
        </span>

        {/* Action buttons on hover */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubPage(item.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-primary/20 text-text-secondary hover:text-primary transition-colors cursor-pointer"
            title="Thêm trang con lồng nhau"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onArchivePage(item.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-error-soft text-text-tertiary hover:text-error transition-colors cursor-pointer"
            title="Chuyển vào thùng rác"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Recursive Sub-Pages */}
      {isExpanded && item.children && item.children.length > 0 && (
        <div className="space-y-0.5 mt-0.5">
          {item.children.map((child) => (
            <PageTreeNode
              key={child.id}
              item={child}
              activePageId={activePageId}
              onSelectPage={onSelectPage}
              onAddSubPage={onAddSubPage}
              onArchivePage={onArchivePage}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
