export type NotionBlockType =
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'paragraph'
  | 'to_do'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'toggle'
  | 'code'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'table'
  | 'table_row'
  | 'child_page';

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  properties?: {
    title?: string;
    checked?: boolean;
    language?: string;
    icon?: string;
    color?: string;
    has_column_header?: boolean;
    columns?: string[];
    cells?: string[][];
  };
  content?: NotionBlock[];
}

export interface PageBreadcrumb {
  id: string;
  title: string;
  icon?: string | null;
  level: number;
}

export interface PageTreeItem {
  id: string;
  parentPageId?: string | null;
  title: string;
  icon?: string | null;
  orderIndex: number;
  level: number;
  isFavorite: boolean;
  hasChildren: boolean;
  children?: PageTreeItem[];
}

export interface PageSummary {
  id: string;
  parentPageId?: string | null;
  title: string;
  icon?: string | null;
  plainTextSummary?: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  orderIndex: number;
  level: number;
  updatedAt: string;
}

export interface PageDetail {
  id: string;
  parentPageId?: string | null;
  title: string;
  icon?: string | null;
  coverImageUrl?: string | null;
  content: NotionBlock[];
  plainTextSummary?: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  orderIndex: number;
  level: number;
  path: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  breadcrumbs?: PageBreadcrumb[];
}

export interface CreatePagePayload {
  title: string;
  parentPageId?: string | null;
  icon?: string | null;
  coverImageUrl?: string | null;
}

export interface UpdatePageMetadataPayload {
  title?: string;
  icon?: string | null;
  coverImageUrl?: string | null;
  isFavorite?: boolean;
}

export interface UpdatePageContentPayload {
  content: NotionBlock[];
  version: number;
}

export interface MovePagePayload {
  targetParentId?: string | null;
  targetOrderIndex: number;
}
