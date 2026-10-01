---
version: 2.1.0
name: Gọn Web Design System
description: "Hệ thống thiết kế tối giản, ấm áp (Warm Minimalist / Kinfolk / Modern Editorial) cho Gọn Web - Personal Growth & Smart Knowledge OS. Tông màu nền kem ấm (#F8F4F0), khối components kem nhạt (#FFFBF8), font Newsreader Bold cho tiêu đề, icon dạng line thanh mảnh (Lucide Icons), hạn chế tối đa gradient và kiến trúc Sidebar-only thu gọn linh hoạt."
colors:
  # Lớp nền dưới cùng của cả trang (Canvas Layer / Bottom-most Layer)
  background: "#F8F4F0"         # Màu nền kem ấm dịu (Soft Warm Linen Cream)
  
  # Lớp bề mặt (Surfaces) - Warm Minimal Neutrals
  surface: "#FFFBF8"            # Màu kem nhạt hơn nền, ấm áp và không dùng màu trắng thuần (#ffffff)
  surface-secondary: "#f7f1e6"  # Lớp phụ thứ 2 (Sidebar/Sub-cards/Hover)
  surface-tertiary: "#efe7d9"   # Lớp phụ thứ 3 (Input/Active state)
  surface-dark: "#1e1a17"       # Nền Dark Mode (Warm Espresso / Dark Roast)
  surface-secondary-dark: "#26211d"
  surface-tertiary-dark: "#302a25"
  
  # Màu sắc chủ đạo (Brand & Core Accents)
  primary: "#8c6747"            # Nâu Caramel ấm (Warm Earth - Điềm đạm, tập trung, hữu cơ)
  primary-hover: "#755235"      # Nâu đậm khi hover
  primary-soft: "#f5ede1"       # Nền be caramel nhạt làm badge / highlight
  on-primary: "#ffffff"         # Chữ trắng trên nền Nâu Caramel
  
  # Điểm nhấn Kỷ luật & Gamification (Gold Zone, Streak, XP)
  accent-gold: "#c8832a"        # Hổ phách ấm (Amber Gold)
  accent-gold-soft: "#faebd7"   # Nền hổ phách nhạt
  
  # Chữ & Độ tương phản (Typography Contrast)
  text-primary: "#2d2420"       # Chữ chính (Nâu than đậm ấm áp, dịu mắt hơn đen thuần)
  text-secondary: "#63574c"     # Chữ phụ / Subheadings / Metadata
  text-tertiary: "#8f8274"      # Chữ chú thích / Placeholder
  text-primary-dark: "#f4eee7"
  text-secondary-dark: "#b5aca0"
  text-tertiary-dark: "#847a6f"
  
  # Đường viền & Bóng đổ (Borders & Warm Ambient Shadows)
  border: "rgba(60, 45, 30, 0.07)"         # Viền siêu mờ nhẹ kết hợp bóng đổ ấm
  border-subtle: "rgba(60, 45, 30, 0.04)"  # Viền phân vùng siêu mảnh
  border-dark: "rgba(230, 222, 210, 0.08)"
  border-subtle-dark: "rgba(230, 222, 210, 0.04)"
  
  # Trạng thái hệ thống (System Status)
  error: "#b84e46"              # Đỏ đất nhã nhặn
  error-soft: "#fae8e6"
  warning: "#c8832a"            # Hổ phách
  warning-soft: "#faebd7"
  success: "#527a5d"            # Xanh lá botanical tự nhiên
  success-soft: "#eaf2ec"

typography:
  font-family-sans: "Geist, Inter, system-ui, sans-serif"
  font-family-serif: "Newsreader, Georgia, serif"
  font-family-mono: "Geist Mono, JetBrains Mono, monospace"
  headings:
    font-family: "Newsreader, Georgia, serif"
    font-weight: "700"          # Kiểu Bold đĩnh đạc, sắc nét theo phong cách báo chí cao cấp
    letter-spacing: "-0.02em"   # Tracking chặt chẽ, sang trọng
  body:
    font-family: "Geist, Inter, system-ui, sans-serif"
    font-weight: "400"
    line-height: "1.6"

rounded:
  sm: "4px"     # Tag nhỏ, checkbox
  md: "6px"     # Button nhỏ, input field
  lg: "8px"     # Button chuẩn, control pills, dropdown items
  xl: "12px"    # Chuẩn bo góc cho Thẻ card chính, Panel, Dialog, Modal
  2xl: "14px"   # Cụm widget lớn
  full: "9999px" # Avatar, pill badges tròn

shadows:
  shadow-warm-xs: "0 1px 3px rgba(50, 40, 30, 0.04)"
  shadow-warm-sm: "0 3px 12px -2px rgba(50, 40, 30, 0.05), 0 1px 3px -1px rgba(50, 40, 30, 0.03)"
  shadow-warm: "0 8px 24px -4px rgba(50, 40, 30, 0.06), 0 2px 6px -1px rgba(50, 40, 30, 0.03)"
  shadow-warm-lg: "0 16px 40px -8px rgba(50, 40, 30, 0.08), 0 4px 12px -2px rgba(50, 40, 30, 0.04)"

icons:
  style: "Line / Outline"       # Chỉ sử dụng icon nét đơn (stroke-width: 1.5px - 2px)
  library: "lucide-react"       # Đồng bộ thư viện Lucide Icons
  rule: "Tuyệt đối không dùng emoji hoạt hình hoặc icon tô màu mảng (fill/bold/3D) gây rối mắt"
---

# 🌿 Gọn Web Design System (Hệ Thống Thiết Kế Tối Giản Mới)

## 📌 1. Triết Lý Thiết Kế Mới (Warm Minimalist & Editorial Print)

**Gọn Web** áp dụng hướng thiết kế **Tối giản Ấm áp (Warm Minimalist)** kết hợp với phong cách ấn phẩm cao cấp (**Modern Editorial**):

1. **Thanh lọc thị giác (Visual Serenity)**:
   - Loại bỏ thanh Header ngang để giải phóng toàn bộ không gian chiều dọc. 
   - Đưa tất cả chức năng điều hướng, tài khoản, tìm kiếm nhanh và gamification về **Thanh Sidebar duy nhất (Sidebar-only)** có thể **thu gọn (Collapsible)** linh hoạt.
   - Hạn chế tối đa các hiệu ứng Gradient chuyển màu lòe loẹt. Ưu tiên các mảng màu đơn sắc (solid), độ trong suốt có kiểm soát và bóng đổ ấm đa tầng.

2. **Hệ màu kem ấm hữu cơ (Warm Organic Cream Palette)**:
   - Nền canvas dưới cùng: `#F8F4F0` (Màu kem ấm dịu mắt).
   - Khối thẻ components: `#FFFBF8` (Sáng và nhạt hơn nền, tuyệt đối không dùng màu trắng thuần `#ffffff` gây lóa).
   - Màu chủ đạo Nâu Caramel `#8c6747` kết hợp điểm nhấn Hổ Phách `#c8832a`.

3. **Kiểu chữ Editorial Đĩnh Đạc (Newsreader Bold)**:
   - Sử dụng font có chân cổ điển **Newsreader (Bold)** cho tiêu đề chính, tạo điểm nhấn văn học, điềm đạm và trưởng thành.
   - Thân bài và số liệu dùng **Geist Sans / Geist Mono** sắc sảo, hiện đại và chuẩn xác.

4. **Biểu tượng dạng đường nét (Line-only Icons)**:
   - 100% icon sử dụng dạng **Line thanh mảnh** (stroke 1.5px/2px từ `lucide-react`).
   - Loại bỏ hoàn toàn emoji hoạt hình, icon dạng fill đặc hoặc 3D gradient gây phân tán sự chú ý.

5. **Bo góc tinh giản (Refined Crisp Geometry)**:
   - Giảm độ cong bo tròn (border-radius) từ kiểu tròn trịa sang phong cách sắc nét, vuông vức thanh lịch: chuẩn `12px` (`rounded-xl`) cho Card/Panel, `8px` (`rounded-lg`) cho Buttons/Input.

---

## 🎨 2. Hệ Thống Màu Sắc Chi Tiết

| Semantic Token | Mã HEX | Ứng Dụng Thực Tế |
|---|---|---|
| `--background` | `#F8F4F0` | Nền canvas toàn bộ viewport của ứng dụng |
| `--surface` | `#FFFBF8` | Nền các thẻ Card chính, Sidebar, Editor Panel (không dùng trắng thuần) |
| `--surface-secondary` | `#f7f1e6` | Lớp phụ bên trong card, ô tìm kiếm, sub-items |
| `--surface-tertiary` | `#efe7d9` | Ô input, trạng thái hover, khu vực phụ trợ |
| `--primary` | `#8c6747` | Nút hành động chính, active navigation, logo |
| `--primary-hover` | `#755235` | Trạng thái hover cho nút chính |
| `--primary-soft` | `#f5ede1` | Nền badge nhẹ, tag phân loại |
| `--accent-gold` | `#c8832a` | Điểm nhấn Gold Zone, Streak 🔥, Level XP |
| `--text-primary` | `#2d2420` | Tiêu đề và văn bản đọc chính (Nâu than ấm) |
| `--text-secondary` | `#63574c` | Phụ đề, mô tả, nhãn trường |
| `--text-tertiary` | `#8f8274` | Placeholder, ngày tháng, thông tin mờ |
| `--border` | `rgba(60, 45, 30, 0.07)` | Đường ngăn cách nhẹ nhàng kết hợp bóng ấm |

---

## 📐 3. Quy Chuẩn Bo Tròn & Bóng Đổ

- **`rounded-sm` (4px)**: Checkbox, tag mini.
- **`rounded-md` (6px)**: Ô input nhỏ, kbd badge (Ctrl+K).
- **`rounded-lg` (8px)**: Nút bấm (Button), ô tìm kiếm, dropdown menu item.
- **`rounded-xl` (12px)**: Thẻ card chính, Panel điều hướng, Khung soạn thảo Notion, Modal dialog.
- **Bóng đổ ấm thay viền cứng**:
  - `.shadow-warm-xs`: Hiệu ứng nổi nhẹ cho nút bấm và dropdown item.
  - `.shadow-warm-sm`: Hiệu ứng cho thanh sidebar và thanh điều khiển nhỏ.
  - `.shadow-warm`: Hiệu ứng chuẩn cho Card Dashboard, Panel Editor, Thùng gom việc vặt.
  - `.shadow-warm-lg`: Hiệu ứng cho Modal popup và Codeblock nổi.

---

## 🔲 4. Kiến Trúc Điều Hướng (Sidebar-Only, Embedded Notes Tree & Collapsible)

Ứng dụng loại bỏ hoàn toàn thanh Header ngang và loại bỏ thanh Sidebar phụ trong trang Notes, chuyển sang **Kiến trúc Sidebar duy nhất**:

```text
┌─────────────────────────┬────────────────────────────────────────────────────────┐
│  UNIFIED SIDEBAR        │  MAIN APPLICATION CANVAS (Tối đa hóa không gian viết) │
│                         │                                                        │
│  [G] Gọn Web       [◀]  │  ┌──────────────────────────────────────────────────┐  │
│  ─────────────────────  │  │                                                  │  │
│  🔍 Tìm kiếm       Ctrl+K│  │  Notion Block Canvas Editor / Action Dashboard   │  │
│                         │  │  (Mở rộng toàn màn hình, không bị kẹp 2 sidebar)│  │
│  ✦ Trang chủ Action     │  │                                                  │  │
│  ✦ Ghi chú Notion   [+] │  │                                                  │  │
│    │                    │  │                                                  │  │
│    ├─ 🔍 Tìm trang...   │  │                                                  │  │
│    ├─ ⭐ Yêu thích      │  │                                                  │  │
│    ├─ CÂY PHÂN TRANG:   │  │                                                  │  │
│    │  ├─ 📄 Kế hoạch Q4 │  │                                                  │  │
│    │  └─ 📄 Nhật ký     │  │                                                  │  │
│    └─ 🗑️ Thùng rác (0)   │  │                                                  │  │
│                         │  │                                                  │  │
│  ✦ Tri thức PARA        │  │                                                  │  │
│  ✦ Micro-Review         │  │                                                  │  │
│  ✦ Quantified Self      │  │                                                  │  │
│  ✦ Cài đặt              │  │                                                  │  │
│                         │  │                                                  │  │
│  🔥 5 Ngày • Lv.3       │  │                                                  │  │
│  ─────────────────────  │  │                                                  │  │
│  ☀️ Giao diện sáng       │  │                                                  │  │
│  👤 Tài khoản           │  └──────────────────────────────────────────────────┘  │
└─────────────────────────┴────────────────────────────────────────────────────────┘
```

- **Chế độ Mở Rộng (`w-64` ~ 256px)**: Hiển thị đầy đủ Logo, Tên nhãn, phím tắt Ctrl+K, Cây phân trang Notion lồng dưới mục "Ghi chú Notion", số ngày Streak, Level và User Profile.
- **Chế độ Thu Gọn (`w-16` ~ 64px)**: Tự động ẩn text và cây trang, căn giữa các line icon tinh tế với tooltip trên desktop, cho trải nghiệm viết lách không phân tâm (Distraction-free Writing).
- **Tích hợp Cây Trang (Embedded Notes Tree)**:
  - **Đóng / Mở linh hoạt (Collapsible Accordion)**: Cho phép đóng/mở cây trang bằng icon `ChevronRight` (tự động xoay 90 độ khi mở), lưu trạng thái vào `localStorage ('gon_notes_tree_open')`.
  - Nút `+` tạo trang nhanh ngay trên hàng "Ghi chú Notion" (tự động mở cây trang nếu đang đóng).
  - Ô tìm kiếm trang mini, danh sách Yêu thích, Cây phân cấp lồng nhau đa tầng và ngăn Thùng rác.
  - Loại bỏ hoàn toàn thanh sidebar phụ `NotesSidebar` giúp không gian soạn thảo Notion rộng mở, sang trọng.
- **Nút Toggle Sidebar**: Icon line `PanelLeftClose` và `PanelLeftOpen`, tự động ghi nhớ trạng thái qua `localStorage`.

---

## ✒️ 5. Nguyên Tắc Do's and Don'ts

### 🟢 NÊN (Do's):
- **Ưu tiên Icon dạng Line**: Luôn dùng icon stroke mỏng (1.5px/2px) từ `lucide-react`.
- **Dùng màu kem `#FFFBF8` cho thẻ**: Tránh dùng màu trắng tinh `#ffffff` để giữ độ ấm và không mỏi mắt.
- **Dùng Newsreader Bold cho tiêu đề**: Giữ phong cách báo chí đĩnh đạc và phân tầng rõ nét với font thân bài Geist Sans.
- **Giữ bo góc gọn gàng (`12px`)**: Không bo tròn quá đà gây cảm giác hoạt hình.

### 🔴 KHÔNG NÊN (Don'ts):
- **Không dùng Gradient màu mè**: Tránh các gradient cầu vồng, gradient đa sắc rực rỡ.
- **Không dùng Emoji thay cho Icon chức năng**: Thay thế 🎯, 📝, 📦, 🔥, 🏆 bằng các line icon `Target`, `FileText`, `Package`, `Flame`, `Award`.
- **Không chèn Header ngang**: Toàn bộ chức năng nằm trong Sidebar duy nhất.
- **Không dùng viền kẻ đậm dày**: Sử dụng bóng đổ ấm `.shadow-warm` kết hợp màu nền để phân tách khối.
