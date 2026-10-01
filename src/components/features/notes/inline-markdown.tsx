import React from 'react';

interface InlineMarkdownProps {
  content: string;
  className?: string;
  placeholder?: string;
}

/**
 * Lightweight, safe inline Markdown renderer for note blocks.
 * Parses **bold**, *italic*, `code`, ~~strike~~, and [text](url).
 */
export const InlineMarkdown: React.FC<InlineMarkdownProps> = ({
  content,
  className = '',
  placeholder = '',
}) => {
  if (!content) {
    return placeholder ? (
      <span className="text-text-tertiary/40 italic select-none">{placeholder}</span>
    ) : null;
  }

  // Regular expression matching bold, italic, code, strike, links
  const pattern =
    /(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`|~~.*?~~|\[.*?\]\(.*?\))/g;

  const parts = content.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // **bold** or __bold__
        if (
          (part.startsWith('**') && part.endsWith('**')) ||
          (part.startsWith('__') && part.endsWith('__'))
        ) {
          return (
            <strong key={index} className="font-bold text-text-primary">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // *italic* or _italic_
        if (
          (part.startsWith('*') && part.endsWith('*')) ||
          (part.startsWith('_') && part.endsWith('_'))
        ) {
          return (
            <em key={index} className="italic text-text-primary">
              {part.slice(1, -1)}
            </em>
          );
        }

        // `code`
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="bg-surface-secondary text-primary font-mono text-xs px-1.5 py-0.5 rounded shadow-warm-xs border border-border-subtle"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // ~~strikethrough~~
        if (part.startsWith('~~') && part.endsWith('~~')) {
          return (
            <del key={index} className="line-through text-text-tertiary">
              {part.slice(2, -2)}
            </del>
          );
        }

        // [title](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a
              key={index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
