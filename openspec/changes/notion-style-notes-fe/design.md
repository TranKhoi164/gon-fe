# Design: Notion-Style Hierarchical Notes System (FE Core)

## Context

Giao diện `fe-core` xây dựng trên Next.js 16 (App Router), React 19, Tailwind CSS v4 và tuân thủ các quy chuẩn thiết kế tại [`DESIGN.md`](file:///f:/workspace/gon/fe-core/DESIGN.md) và quy tắc tại [`AGENTS.md`](file:///f:/workspace/gon/fe-core/AGENTS.md). 

Tài liệu này chi tiết hóa cấu trúc component, luồng quản lý trạng thái, mô hình tương tác phím tắt slash `/`, cơ chế autosave debounced và cách kết nối mượt mà với `api-core`.

## Goals / Non-Goals

**Goals:**
- Xây dựng giao diện ghi chú phân cấp `/notes` với Sidebar cây trang lồng nhau đệ quy chuẩn Notion.
- Xây dựng trình soạn thảo khối `NotionBlockEditor` hỗ trợ đầy đủ: Header 1/2/3, Bảng tính (Table), To-do checkbox, Bullet/Numbered list, Toggle, Code block, Quote, Callout, Divider.
- Triển khai Menu gõ phím tắt Slash Command (`/`) giúp chuyển đổi hoặc chèn khối nhanh chóng bằng bàn phím.
- Tự động lưu ngầm (Debounced Autosave 1.5s) kèm badge trạng thái ("Đang lưu..." / "Đã lưu").
- Tích hợp 1-click modal trích xuất các to-do trong ghi chú thành Task trong Action Dashboard của Gọn.
- Tông màu chuẩn Design System: Xanh Rêu (Moss Green), Kem Bơ (Butter Cream) và Vàng Kỷ Luật (Accent Gold).

**Non-Goals:**
- Chưa triển khai kéo thả khối Reorder Drag & Drop phức tạp giữa các dòng trong pha này (sử dụng phím mũi tên / phím Enter / Backspace trực quan).
- Chưa tích hợp thư viện nặng bên ngoài (giữ code nhẹ nhàng, tối ưu bundle size và chuẩn React 19).

## Decisions

### 1. Cấu Trúc Component Phân Cấp (Feature Architecture)

```
src/
├── app/
│   └── notes/
│       └── page.tsx                         # Client Component quản lý layout chính và state trang đang chọn
│
├── components/features/notes/
│   ├── notes-sidebar.tsx                    # Sidebar cây trang phân cấp, tìm kiếm, Favorites, Trash
│   ├── page-tree-node.tsx                   # Node đệ quy render trang cha và danh sách trang con
│   ├── notion-block-editor.tsx              # Khung soạn thảo chính: Header, Cover, Title, Block list
│   ├── block-item.tsx                       # Component render từng khối tùy biến theo block.type
│   ├── table-block.tsx                      # Component bảng tương tác (thêm/xóa dòng, cột, header)
│   ├── slash-command-menu.tsx               # Floating Dropdown menu khi gõ ký tự "/"
│   └── extract-tasks-modal.tsx              # Modal trích xuất to-do checkbox sang Task Dashboard
│
├── services/
│   └── notesService.ts                      # Tầng giao tiếp HTTP với /api/v1/pages của api-core
│
├── types/
│   └── notes.types.ts                       # Định nghĩa Type / Interface dữ liệu trang và khối Notion
│
└── constants/
    └── notes.constants.ts                   # Dữ liệu khởi tạo mẫu, cấu hình menu Slash, icon gợi ý
```

### 2. Mô Hình Dữ Liệu Khối (Notion Block Interface)

```typescript
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
```

### 3. Tương Tác Bàn Phím & Menu Slash Command

- Khi con trỏ văn bản tại một khối đang trống và người dùng gõ `/`:
  - Hiển thị menu nổi `SlashCommandMenu` ngay bên dưới khối hiện tại.
  - Cho phép người dùng tìm kiếm theo tên khối (vd: `/table`, `/h1`, `/todo`, `/code`).
  - Hỗ trợ phím `ArrowDown`, `ArrowUp`, `Enter` để chọn nhanh hoặc phím `Escape` để hủy.
- Khi người dùng nhấn `Enter` ở cuối một khối:
  - Tự động tạo một khối mới loại `paragraph` bên dưới.
- Khi người dùng nhấn `Backspace` ở đầu khối trống:
  - Tự động chuyển đổi khối về dạng `paragraph` thường hoặc xóa khối nếu đã là `paragraph`.

### 4. Chiến Lược Autosave & Tích Hợp API Core

- Sử dụng hook debounce (1500ms): Khi người dùng dừng gõ, hàm `updateContent(pageId, blocks, version)` sẽ được gọi tự động.
- Hiển thị badge trạng thái nhỏ tại góc phải trên cùng của Editor:
  - `Đang lưu...` (biểu tượng loading xoay nhẹ nhàng)
  - `Đã lưu` (biểu tượng check xanh rêu dịu mắt)
  - `Lỗi lưu` (cho phép bấm Thử lại)
- Nếu kết nối `api-core` chưa sẵn sàng, service tự động lưu đệm vào LocalStorage để dữ liệu người dùng không bao giờ bị mất mát.

---

## Risks / Trade-offs

- **[Risk]** Render bảng Table tương tác nhiều ô có thể gây giật lag nếu re-render toàn bộ trang.
  - **Mitigation**: Cô lập state của `TableBlock` ở cấp component con, chỉ đẩy cập nhật lên parent khi thay đổi ô hoặc thêm hàng/cột.
- **[Risk]** Xung đột focus bàn phím khi chuyển đổi giữa các khối.
  - **Mitigation**: Quản lý focus có chủ đích bằng `useRef` và `data-block-id`.

---

## Migration Plan

1. Tạo type definitions tại `src/types/notes.types.ts`.
2. Tạo service data fetching tại `src/services/notesService.ts`.
3. Tạo các components trong `src/components/features/notes/`.
4. Tạo trang `/notes` tại `src/app/notes/page.tsx`.
5. Cập nhật navigation trong `src/config/site.config.ts`.
