# Spec Delta: Notion-Style Notes Workspace (Frontend)

## Purpose

Cung cấp giao diện ghi chú phân cấp đa tầng (Nested Page Sidebar), trình soạn thảo văn bản dạng khối chuẩn Notion (Headers, Table, To-do list, Code block, Callout), menu gõ phím tắt slash command và trích xuất to-do sang Action Dashboard.

## ADDED Requirements

### Requirement: User can navigate and manage hierarchical page tree in Sidebar
Giao diện MUST hiển thị cây thư mục các trang ghi chú lồng nhau, cho phép mở rộng/thu gọn nhánh con, thêm trang con mới, ghim yêu thích và chuyển trang vào thùng rác.

#### Scenario: View and toggle nested pages in tree
- **WHEN** người dùng mở trang ghi chú `/notes`
- **THEN** sidebar tải danh sách cây trang phân cấp, hiển thị các trang gốc kèm biểu tượng mở rộng nếu có trang con, và cho phép click để chọn trang hiển thị.

#### Scenario: Add a new sub-page from sidebar
- **WHEN** người dùng bấm nút `+` bên cạnh một trang trong sidebar
- **THEN** hệ thống tạo một trang con mới lồng bên dưới trang đó, tự động mở rộng nhánh cây và chuyển focus sang trang con vừa tạo.

### Requirement: User can edit Notion-style blocks with live markdown triggers and slash command menu
Giao diện MUST cung cấp trình soạn thảo khối hỗ trợ Header 1/2/3 (`# `, `## `, `### `), Table, To-do list (`[]`), Bullet/Numbered list, Toggle, Code, Quote, Callout, Divider, và menu phím tắt Slash `/`.

#### Scenario: Insert block using Slash command menu
- **WHEN** người dùng gõ ký tự `/` trong một khối văn bản trống
- **THEN** hệ thống hiển thị menu popup nổi chứa danh sách các loại khối (Heading, Table, To-do, Code, Callout...) cho phép điều hướng bằng phím mũi tên hoặc click để chuyển đổi khối.

#### Scenario: Interact with table block
- **WHEN** người dùng thêm một khối Table
- **THEN** giao diện hiển thị bảng tương tác cho phép nhập liệu từng ô, thêm/xóa cột, thêm/xóa hàng và bật tắt dòng tiêu đề cột.

### Requirement: User content is automatically saved with debounce and optimistic status
Giao diện MUST tự động gửi bản cập nhật nội dung khối lên backend sau khi người dùng dừng gõ phím và hiển thị chỉ báo trạng thái lưu rõ ràng.

#### Scenario: Autosave note content
- **WHEN** người dùng chỉnh sửa tiêu đề hoặc nội dung các khối trong ghi chú
- **THEN** hệ thống hiển thị trạng thái "Đang lưu..." và gửi request `PATCH /api/v1/pages/:id/content` sau khoảng chờ debounce, sau đó cập nhật thành "Đã lưu".

### Requirement: User can extract to-do items into Action Dashboard tasks
Giao diện MUST cung cấp tính năng quét các khối to-do (`[]`) trong ghi chú hiện tại và mở modal cho phép chọn trích xuất thành Task của Gọn.

#### Scenario: Extract tasks from note
- **WHEN** người dùng bấm nút "Trích xuất Task" trên thanh công cụ ghi chú
- **THEN** hệ thống mở modal liệt kê tất cả các mục to-do trong trang, cho phép chọn lọc và gửi yêu cầu tạo Task sang backend kèm thông báo thành công.
