'use client';

import React, { useState, useEffect } from 'react';
import { SLASH_MENU_ITEMS } from '@/constants/notes.constants';
import { NotionBlockType } from '@/types/notes.types';
import { cn } from '@/lib/utils';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  CheckSquare,
  List,
  ListOrdered,
  ChevronRight,
  Code,
  Quote,
  Lightbulb,
  Minus,
  FileText,
} from 'lucide-react';

const renderBlockIcon = (type: NotionBlockType) => {
  switch (type) {
    case 'paragraph':
      return <Type className="w-3.5 h-3.5 text-text-secondary" />;
    case 'heading_1':
      return <Heading1 className="w-3.5 h-3.5 text-primary font-bold" />;
    case 'heading_2':
      return <Heading2 className="w-3.5 h-3.5 text-primary font-bold" />;
    case 'heading_3':
      return <Heading3 className="w-3.5 h-3.5 text-primary font-bold" />;
    case 'table':
      return <TableIcon className="w-3.5 h-3.5 text-accent-gold" />;
    case 'to_do':
      return <CheckSquare className="w-3.5 h-3.5 text-primary" />;
    case 'bulleted_list_item':
      return <List className="w-3.5 h-3.5 text-text-secondary" />;
    case 'numbered_list_item':
      return <ListOrdered className="w-3.5 h-3.5 text-text-secondary" />;
    case 'toggle':
      return <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />;
    case 'code':
      return <Code className="w-3.5 h-3.5 text-text-secondary" />;
    case 'quote':
      return <Quote className="w-3.5 h-3.5 text-primary" />;
    case 'callout':
      return <Lightbulb className="w-3.5 h-3.5 text-accent-gold" />;
    case 'divider':
      return <Minus className="w-3.5 h-3.5 text-text-tertiary" />;
    default:
      return <FileText className="w-3.5 h-3.5 text-text-secondary" />;
  }
};

interface SlashCommandMenuProps {
  filterQuery: string;
  onSelect: (type: NotionBlockType) => void;
  onClose: () => void;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  filterQuery,
  onSelect,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const cleanQuery = filterQuery.replace(/^\//, '').toLowerCase().trim();
  const [prevQuery, setPrevQuery] = useState(cleanQuery);
  if (prevQuery !== cleanQuery) {
    setPrevQuery(cleanQuery);
    setSelectedIndex(0);
  }

  const filteredItems = SLASH_MENU_ITEMS.filter((item) => {
    if (!cleanQuery) return true;
    return (
      item.label.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery) ||
      item.keywords.some((k) => k.includes(cleanQuery))
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex, onSelect, onClose]);

  if (filteredItems.length === 0) {
    return (
      <div className="absolute z-50 mt-1 w-64 p-3 bg-surface rounded-xl shadow-warm-lg text-xs text-text-tertiary">
        Không tìm thấy khối phù hợp với &quot;{cleanQuery}&quot;
      </div>
    );
  }

  return (
    <div className="absolute z-50 mt-1 w-72 max-h-72 overflow-y-auto bg-surface rounded-xl shadow-warm-lg p-2 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
        Khối cơ bản & Tiện ích
      </div>
      {filteredItems.map((item, index) => {
        const isSelected = index === selectedIndex;
        return (
          <div
            key={item.type}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => onSelect(item.type)}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-xs',
              isSelected
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-text-primary hover:bg-surface-secondary'
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-surface-secondary text-xs shrink-0 font-bold shadow-warm-xs">
              {renderBlockIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs truncate">{item.label}</div>
              <div className="text-[11px] text-text-tertiary truncate leading-tight">
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
