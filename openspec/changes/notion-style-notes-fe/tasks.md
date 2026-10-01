# Tasks: Notion-Style Hierarchical Notes System (FE Core)

## 1. Types & API Service Layer

- [x] 1.1 Create `src/types/notes.types.ts` with interfaces for `Page`, `PageTreeItem`, `NotionBlock`, `NotionBlockType`, `CreatePagePayload`, `UpdatePageContentPayload`.
- [x] 1.2 Create `src/constants/notes.constants.ts` with mock initial pages, slash command menu registry, and default block templates.
- [x] 1.3 Create `src/services/notesService.ts` providing methods for `getTree`, `getPage`, `createPage`, `updateContent`, `movePage`, `archivePage`, `restorePage`, and `extractTasks`.

## 2. Sidebar & Nested Page Tree Components

- [x] 2.1 Implement `PageTreeNode` in `src/components/features/notes/page-tree-node.tsx` supporting recursive sub-pages, expand/collapse, active state, and quick sub-page addition.
- [x] 2.2 Implement `NotesSidebar` in `src/components/features/notes/notes-sidebar.tsx` with search input, Favorites section, nested page tree, Trash drawer, and New Page button.

## 3. Block Editor & Specialized Block Components

- [x] 3.1 Implement `TableBlock` in `src/components/features/notes/table-block.tsx` with editable cells, add/delete rows & columns, and column header toggle.
- [x] 3.2 Implement `BlockItem` in `src/components/features/notes/block-item.tsx` rendering Headers 1/2/3, To-do checkbox, Bullet/Numbered list, Toggle, Code block with copy, Quote, Callout, Divider, and Table.
- [x] 3.3 Implement `NotionBlockEditor` in `src/components/features/notes/notion-block-editor.tsx` featuring breadcrumbs, cover image, icon picker, editable page title, autosave status badge, and block container.

## 4. Slash Command Menu & Keyboard Shortcuts

- [x] 4.1 Implement `SlashCommandMenu` in `src/components/features/notes/slash-command-menu.tsx` with keyboard navigation (up/down/enter/escape) and block category items.
- [x] 4.2 Connect slash trigger in `BlockItem` to display floating command menu and transform blocks seamlessly.

## 5. Action Funnel Integration (Extract Tasks Modal)

- [x] 5.1 Implement `ExtractTasksModal` in `src/components/features/notes/extract-tasks-modal.tsx` to preview to-do blocks in the note, select items, and convert them to Gọn Action Tasks.

## 6. Page Route Assembly, Navigation & Verification

- [x] 6.1 Create `/notes` page in `src/app/notes/page.tsx` assembling `Header`, `NotesSidebar`, `NotionBlockEditor`, and `ExtractTasksModal`.
- [x] 6.2 Update `SITE_CONFIG.navItems` in `src/config/site.config.ts` to add navigation item pointing to `/notes`.
- [x] 6.3 Run TypeScript verification (`tsc --noEmit`) and verify zero errors.
