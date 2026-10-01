# Proposal: Notion-Style Hierarchical Notes System (FE Core)

## Why

Người dùng của **Gọn Web** cần một không gian ghi chú tri thức (Knowledge & Notes Workspace) theo phong cách Notion:
- Cấu trúc cây thư mục phân cấp đa tầng (Nested Pages) trực quan trên Sidebar.
- Trình soạn thảo văn bản dạng khối (Block-Based Editor) hỗ trợ đầy đủ các khối nội dung: Headers (`#`, `##`, `###`), Bảng dữ liệu (Table), Danh sách to-do (`[]`), Bullet/Numbered list, Toggle list, Code block, Quote, Callout, Divider.
- Menu lệnh nhanh Slash Command (`/`) giúp tạo khối siêu tốc mà không cần rời tay khỏi bàn phím.
- Đồng bộ với phễu hành động của Gọn: Trích xuất 1-click các to-do từ ghi chú sang Action Dashboard.
- Tự động lưu ngầm (Autosave) mượt mà, phản hồi tức thời.

## What Changes

1. **Giao diện Không Gian Ghi Chú (`/notes` & `/notes/[id]`)**:
   - Tạo trang `/notes` tích hợp Sidebar cây trang Notion và khu vực Editor chính.
   - Sidebar đa tầng hỗ trợ mở rộng/thu gọn (collapsible tree), thêm trang con nhanh (`+`), tìm kiếm trang, mục Yêu thích (Favorites) và Thùng rác (Trash).

2. **Trình Soạn Thảo Khối Chuẩn Notion (`NotionBlockEditor`)**:
   - Hỗ trợ đổi icon emoji và thêm/sửa ảnh bìa (Cover Image).
   - Thanh điều hướng Breadcrumbs liên kết từ Root Page đến trang hiện tại.
   - Hỗ trợ đầy đủ các loại khối:
     - Header 1, 2, 3 (`# `, `## `, `### `)
     - Table (bảng tương tác thêm cột, thêm dòng, bật tắt header)
     - To-do list (`- [ ]`, checkbox hoàn thành)
     - Bullet list, Numbered list, Toggle list
     - Code block (syntax language, copy code)
     - Callout box (icon & màu nền)
     - Quote, Divider
     - Child page mention
   - Menu phím tắt Slash Command (`/`): Gợi ý chọn loại block dạng dropdown nổi bật.

3. **Tích hợp Tự Động Lưu (Debounced Autosave) & Trích Xuất Task**:
   - Tự động đồng bộ với backend `api-core` qua `PATCH /api/v1/pages/:id/content` với trạng thái lưu thời gian thực.
   - Nút hành động "⚡ Trích xuất sang Task": Mở modal trích xuất các to-do trong ghi chú thành Task trong Dashboard.

4. **Tuân thủ Design System (`DESIGN.md`)**:
   - Sử dụng bảng màu Xanh Rêu (`Moss Green`), Vàng Bơ (`Butter Cream`), Vàng Kim (`Gold Zone`) và typography Inter tinh tế.

## Capabilities

### New Capabilities
- `notes-workspace`: Trải nghiệm ghi chú phân cấp đa tầng, trình soạn thảo khối Notion, menu gõ phím tắt slash `/`, tự động lưu và trích xuất to-do sang Dashboard.

### Modified Capabilities
*(Không có spec cũ bị thay đổi requirement)*

## Impact

- **Routes**: Tạo mới `src/app/notes/page.tsx` và `src/app/notes/[id]/page.tsx` (hoặc view động trên `/notes`).
- **Components**: Thêm cụm component `src/components/features/notes/`: `notes-sidebar.tsx`, `notion-block-editor.tsx`, `slash-command-menu.tsx`, `block-item.tsx`, `table-block.tsx`, `extract-tasks-modal.tsx`.
- **Services & Types**: Thêm `src/services/notesService.ts`, `src/types/notes.types.ts`, `src/constants/notes.constants.ts`.
- **Navigation**: Cập nhật `SITE_CONFIG.navItems` trong `src/config/site.config.ts` để hiển thị mục "Ghi chú Notion" dẫn sang `/notes`.
