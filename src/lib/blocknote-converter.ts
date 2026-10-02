import { PartialBlock, Block } from '@blocknote/core';
import { NotionBlock } from '@/types/notes.types';

/**
 * Extracts plain text string from BlockNote inline content array or string
 */
export function extractTextFromInlineContent(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
        return item.text;
      }
      return '';
    })
    .join('');
}

/**
 * Converts legacy NotionBlock[] or existing stored content into BlockNote PartialBlock[]
 */
export function notionBlocksToBlockNote(blocks?: unknown[]): PartialBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [
      {
        type: 'paragraph',
        content: '',
      },
    ];
  }

  return blocks.map((rawBlock): PartialBlock => {
    const b = rawBlock as Partial<NotionBlock> & {
      props?: Record<string, unknown>;
      children?: unknown[];
    };

    // If block is already in BlockNote native format (has props or BlockNote types)
    if (b.props !== undefined && Array.isArray(b.content)) {
      return b as unknown as PartialBlock;
    }

    const titleText = b.properties?.title || '';
    const blockId = b.id;

    switch (b.type) {
      case 'heading_1':
        return {
          id: blockId,
          type: 'heading',
          props: { level: 1 },
          content: titleText,
        };
      case 'heading_2':
        return {
          id: blockId,
          type: 'heading',
          props: { level: 2 },
          content: titleText,
        };
      case 'heading_3':
        return {
          id: blockId,
          type: 'heading',
          props: { level: 3 },
          content: titleText,
        };
      case 'to_do':
        return {
          id: blockId,
          type: 'checkListItem',
          props: { checked: Boolean(b.properties?.checked) },
          content: titleText,
        };
      case 'bulleted_list_item':
        return {
          id: blockId,
          type: 'bulletListItem',
          content: titleText,
        };
      case 'numbered_list_item':
        return {
          id: blockId,
          type: 'numberedListItem',
          content: titleText,
        };
      case 'divider':
        return {
          id: blockId,
          type: 'divider',
        };
      case 'code':
        return {
          id: blockId,
          type: 'codeBlock',
          props: { language: b.properties?.language || 'typescript' },
          content: titleText,
        };
      default:
        return {
          id: blockId,
          type: 'paragraph',
          content: titleText,
        };
    }
  });
}

/**
 * Normalizes BlockNote blocks before saving to backend, injecting legacy `properties.title`
 * for backward compatibility with `api-core` extractTasks & plainTextSummary.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blockNoteToPersistedBlocks(blocks: Block<any, any, any>[]): NotionBlock[] {
  return blocks.map((b) => {
    const plainText = extractTextFromInlineContent(b.content);
    const checked = b.type === 'checkListItem' ? Boolean((b.props as { checked?: boolean })?.checked) : undefined;

    return {
      ...(b as unknown as NotionBlock),
      // Ensure properties are populated for backend backwards compatibility
      properties: {
        title: plainText,
        checked,
      },
    };
  });
}
