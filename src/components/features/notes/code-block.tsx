'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NotionBlock } from '@/types/notes.types';
import { Copy, Check, Code as CodeIcon, Eye, Edit3, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';

// Import Prism language definitions
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface CodeBlockProps {
  block: NotionBlock;
  onChange: (updatedBlock: NotionBlock) => void;
  isFocused?: boolean;
}

export const SUPPORTED_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML / XML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'yaml', label: 'YAML' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getHighlightedHtml(code: string, language: string): string {
  if (!code) return '';
  const langKey = language.toLowerCase();
  const grammar = Prism.languages[langKey] || Prism.languages.typescript || Prism.languages.javascript;
  if (!grammar) {
    return escapeHtml(code);
  }
  try {
    return Prism.highlight(code, grammar, langKey);
  } catch {
    return escapeHtml(code);
  }
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block, onChange, isFocused }) => {
  const code = block.properties?.title || '';
  const language = block.properties?.language || 'typescript';

  // If code is empty or newly focused, start in edit mode; otherwise show Prism highlight
  const [isEditing, setIsEditing] = useState<boolean>(!code || !!isFocused);
  const [prevFocused, setPrevFocused] = useState(isFocused);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync focus state directly during render
  if (isFocused && !prevFocused) {
    setPrevFocused(true);
    setIsEditing(true);
  } else if (!isFocused && prevFocused) {
    setPrevFocused(false);
  }

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [isEditing, code]);

  const handleLanguageChange = (newLang: string) => {
    onChange({
      ...block,
      properties: {
        ...block.properties,
        language: newLang,
      },
    });
  };

  const handleCodeChange = (newCode: string) => {
    onChange({
      ...block,
      properties: {
        ...block.properties,
        title: newCode,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Support Tab indentation in code block
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextValue = code.substring(0, start) + '  ' + code.substring(end);

      handleCodeChange(nextValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const highlightedHtml = getHighlightedHtml(code, language);
  const lines = code ? code.split('\n') : [''];

  return (
    <div className="my-3.5 rounded-xl bg-[#1c1917] shadow-warm-lg overflow-hidden text-xs select-text">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161311] text-[#a0988e] select-none">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <CodeIcon className="w-3.5 h-3.5 text-primary" />
          <div className="relative inline-flex items-center">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-transparent font-mono text-[11px] font-semibold text-[#e0e4eb] hover:text-white pr-5 py-0.5 cursor-pointer focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-[#1d1f21] text-white">
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-0 pointer-events-none text-[#717680]" />
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Edit / Highlight */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#282a2e] text-[11px] text-[#b4b9c2] hover:text-white transition-colors cursor-pointer"
            title={isEditing ? 'Xem cú pháp highlight (Esc)' : 'Chỉnh sửa mã nguồn'}
          >
            {isEditing ? (
              <>
                <Eye className="w-3 h-3 text-primary" />
                <span>Xem cú pháp</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Sửa code</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#282a2e] text-[11px] text-[#b4b9c2] hover:text-white transition-colors cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-primary" />
                <span className="text-primary font-medium">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content Canvas */}
      {isEditing ? (
        <div className="relative p-3 bg-[#1d1f21]">
          <textarea
            ref={textareaRef}
            rows={Math.max(4, lines.length)}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="// Nhập hoặc dán mã nguồn vào đây (bấm Xem cú pháp hoặc Esc để hiện Prism highlight)..."
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="w-full bg-transparent text-[#e0e4eb] font-mono text-xs p-0 focus:outline-none leading-relaxed resize-y placeholder:text-[#5c6370]"
          />
          <div className="mt-2 pt-2 border-t border-[#282a2e] flex items-center justify-between text-[10px] text-[#717680]">
            <span>Tab: thụt lề 2 khoảng trắng | Esc: hoàn tất sửa</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Hoàn tất & xem highlight
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="group relative flex font-mono text-xs bg-[#1d1f21] hover:bg-[#212326] transition-colors cursor-pointer min-h-[64px]"
          title="Bấm để chỉnh sửa mã nguồn"
        >
          {/* Line Numbers column */}
          <div className="py-3 pl-3 pr-2 text-right select-none text-[#5c6370] border-r border-[#282a2e] bg-[#1a1b1d] min-w-[36px]">
            {lines.map((_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Prism Highlighted Code */}
          <div className="flex-1 p-3 overflow-x-auto">
            {code ? (
              <pre className={cn(`language-${language}`, '!m-0 !p-0 !bg-transparent')}>
                <code
                  className={cn(`language-${language}`, '!bg-transparent font-mono text-xs leading-relaxed')}
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              </pre>
            ) : (
              <span className="italic text-[#5c6370]">
                {'// Khối code rỗng. Bấm vào đây để nhập mã nguồn...'}
              </span>
            )}
          </div>

          {/* Hover hint */}
          <div className="opacity-0 group-hover:opacity-100 absolute top-2 right-3 px-2 py-0.5 rounded bg-[#282a2e]/90 text-[10px] text-[#b4b9c2] transition-opacity select-none">
            Bấm để sửa
          </div>
        </div>
      )}
    </div>
  );
};
