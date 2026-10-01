import { NotionBlock, NotionBlockType } from '@/types/notes.types';

/**
 * Converts an array of NotionBlocks into a formatted Markdown string.
 */
export function blocksToMarkdown(blocks: NotionBlock[], title?: string): string {
  const lines: string[] = [];

  if (title) {
    lines.push(`# ${title}\n`);
  }

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const text = b.properties?.title || '';

    switch (b.type) {
      case 'heading_1':
        lines.push(`# ${text}`);
        break;
      case 'heading_2':
        lines.push(`## ${text}`);
        break;
      case 'heading_3':
        lines.push(`### ${text}`);
        break;
      case 'to_do':
        lines.push(`- [${b.properties?.checked ? 'x' : ' '}] ${text}`);
        break;
      case 'bulleted_list_item':
        lines.push(`- ${text}`);
        break;
      case 'numbered_list_item':
        lines.push(`1. ${text}`);
        break;
      case 'quote':
        lines.push(`> ${text}`);
        break;
      case 'callout':
        lines.push(`> 💡 ${text}`);
        break;
      case 'divider':
        lines.push('---');
        break;
      case 'code':
        lines.push(`\`\`\`${b.properties?.language || ''}\n${text}\n\`\`\``);
        break;
      case 'toggle':
        lines.push(`> **${text}**`);
        break;
      case 'table':
        if (b.properties?.cells && b.properties.cells.length > 0) {
          const rows = b.properties.cells;
          const headers = b.properties.columns || rows[0];
          lines.push(`| ${headers.join(' | ')} |`);
          lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
          const startIdx = b.properties.columns ? 0 : 1;
          for (let r = startIdx; r < rows.length; r++) {
            lines.push(`| ${rows[r].join(' | ')} |`);
          }
        } else {
          lines.push(text);
        }
        break;
      case 'paragraph':
      default:
        lines.push(text);
        break;
    }
  }

  return lines.join('\n');
}

/**
 * Parses a Markdown string into an array of NotionBlocks.
 */
export function markdownToBlocks(markdown: string): NotionBlock[] {
  if (!markdown || !markdown.trim()) {
    return [
      {
        id: `b-${Date.now()}-1`,
        type: 'paragraph',
        properties: { title: '' },
      },
    ];
  }

  const lines = markdown.split(/\r?\n/);
  const blocks: NotionBlock[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    // Check for code fences: ``` or ```lang
    if (rawLine.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        blocks.push({
          id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
          type: 'code',
          properties: {
            title: codeBuffer.join('\n'),
            language: codeLang || 'typescript',
          },
        });
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = '';
        continue;
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLang = rawLine.trim().replace(/^```/, '').trim();
        codeBuffer = [];
        continue;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    const trimmed = rawLine.trim();

    // Divider
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'divider',
        properties: {},
      });
      continue;
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'heading_1',
        properties: { title: trimmed.replace(/^#\s+/, '') },
      });
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'heading_2',
        properties: { title: trimmed.replace(/^##\s+/, '') },
      });
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'heading_3',
        properties: { title: trimmed.replace(/^###\s+/, '') },
      });
      continue;
    }

    // To-Do Checkbox: - [ ] or - [x]
    const todoMatch = trimmed.match(/^-\s*\[([ xX])\]\s*(.*)$/);
    if (todoMatch) {
      const isChecked = todoMatch[1].toLowerCase() === 'x';
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'to_do',
        properties: {
          title: todoMatch[2],
          checked: isChecked,
        },
      });
      continue;
    }

    // Bulleted list: - item or * item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'bulleted_list_item',
        properties: { title: trimmed.replace(/^[-*]\s+/, '') },
      });
      continue;
    }

    // Numbered list: 1. item
    const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (numMatch) {
      blocks.push({
        id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
        type: 'numbered_list_item',
        properties: { title: numMatch[2] },
      });
      continue;
    }

    // Quote or Callout: > text
    if (trimmed.startsWith('> ')) {
      const quoteContent = trimmed.replace(/^>\s+/, '');
      if (quoteContent.startsWith('💡') || quoteContent.startsWith(':::')) {
        blocks.push({
          id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
          type: 'callout',
          properties: {
            title: quoteContent.replace(/^(💡|:::)\s*/, ''),
            icon: '💡',
          },
        });
      } else {
        blocks.push({
          id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
          type: 'quote',
          properties: { title: quoteContent },
        });
      }
      continue;
    }

    // Regular Paragraph
    blocks.push({
      id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'paragraph',
      properties: { title: rawLine },
    });
  }

  // Handle unclosed code block if any
  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push({
      id: `b-${Date.now()}-${blocks.length}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'code',
      properties: {
        title: codeBuffer.join('\n'),
        language: codeLang || 'typescript',
      },
    });
  }

  return blocks.length > 0
    ? blocks
    : [
        {
          id: `b-${Date.now()}-1`,
          type: 'paragraph',
          properties: { title: '' },
        },
      ];
}

/**
 * Checks if a given text starts with a Markdown trigger that should transform the current block.
 * Returns the target NotionBlockType and remaining clean text, or null if no trigger.
 */
export function detectMarkdownTrigger(text: string): {
  type: NotionBlockType;
  cleanText: string;
  checked?: boolean;
  language?: string;
} | null {
  // Heading 1: #
  if (text.startsWith('# ')) {
    return { type: 'heading_1', cleanText: text.slice(2) };
  }
  // Heading 2: ##
  if (text.startsWith('## ')) {
    return { type: 'heading_2', cleanText: text.slice(3) };
  }
  // Heading 3: ###
  if (text.startsWith('### ')) {
    return { type: 'heading_3', cleanText: text.slice(4) };
  }
  // To-Do: [] or [ ] or - [ ]
  if (text.startsWith('[] ') || text.startsWith('[ ] ') || text.startsWith('- [ ] ')) {
    const clean = text.replace(/^(-\s*)?\[\s*\]\s*/, '');
    return { type: 'to_do', cleanText: clean, checked: false };
  }
  // To-Do checked: [x] or - [x]
  if (text.startsWith('[x] ') || text.startsWith('- [x] ') || text.startsWith('[X] ') || text.startsWith('- [X] ')) {
    const clean = text.replace(/^(-\s*)?\[[xX]\]\s*/, '');
    return { type: 'to_do', cleanText: clean, checked: true };
  }
  // Bullet list: - or *
  if (text.startsWith('- ') || text.startsWith('* ')) {
    return { type: 'bulleted_list_item', cleanText: text.slice(2) };
  }
  // Numbered list: 1. or 1)
  const numMatch = text.match(/^1[\.\)]\s+(.*)$/);
  if (numMatch) {
    return { type: 'numbered_list_item', cleanText: numMatch[1] };
  }
  // Quote: >
  if (text.startsWith('> ')) {
    return { type: 'quote', cleanText: text.slice(2) };
  }
  // Code block: ``` or ```ts
  if (text.startsWith('```')) {
    const lang = text.slice(3).trim();
    return { type: 'code', cleanText: '', language: lang || 'typescript' };
  }
  // Divider: --- or ***
  if (text === '---' || text === '***') {
    return { type: 'divider', cleanText: '' };
  }
  // Callout: ::: or 💡
  if (text.startsWith('::: ') || text.startsWith('💡 ')) {
    return { type: 'callout', cleanText: text.replace(/^(:{3}|💡)\s*/, '') };
  }

  return null;
}
