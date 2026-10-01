# 🌿 Đặc Tả Landing Page — Gọn Web (Bản Tinh Gọn & Sắc Sảo)

## 🎨 0. Nguyên Tắc Thiết Kế & Nội Dung

1. **Ngắn gọn, dứt khoát, không thuật ngữ học thuật**:
   - Không dùng các tên framework khó hiểu (*MAZE, Eisenhower, Feynman, PARA...*) hay ép buộc con số cứng nhắc (*3-3-3*).
   - Tập trung thẳng vào giá trị thực tế: **Quản lý mục tiêu (Năm → Tuần → Ngày), ưu tiên việc quan trọng, khóa khung giờ tập trung, ghi chép chuyển thành hành động và nhận thưởng kỷ luật.**
2. **Giao diện "Khử mùi AI" & Bảng màu Clean White Canvas × Sage Green**:
   - **Màu nền trang (Background)**: Trắng sạch sẽ, tinh tế (`#ffffff`) kết hợp lớp lưới chấm mờ `bg-dot-grid` (`16x16px`, `4-5%` opacity) giúp không gian sáng sủa và thoáng đãng.
   - **Màu nhận diện & Nút bấm**: **Xanh Rêu / Sage Green (`#34623f`)** điềm tĩnh, tượng trưng cho kỷ luật và sự tập trung sâu.
   - **Điểm nhấn Vàng Bơ Nhạt (`#fbf5d6` / `#fefcf2`)**: Thỉnh thoảng xuất hiện điểm xuyết ở ô Việc Trọng Tâm (+50% EXP), badge trạng thái của Bé Gọn và các nhãn quan trọng.
   - **Góc bo vừa vừa (`14px – 22px`)**: `rounded-xl` (`14px–18px`) và `rounded-2xl` (`20px–22px`), cân đối, hiện đại, không bị sắc cạnh cũng không quá tròn bầu bĩnh.
   - **Mascot Bé Gọn 3D (Smiski Claymation Style)**: Hình minh họa 3D chất lượng cao của Bé Gọn ngồi tập trung làm việc bên chiếc laptop xanh Sage, tương tác trực tiếp (tick hoàn thành nhận +50 EXP, thanh tiến trình Level và chuỗi 14 ngày kỷ luật).
3. **Phân luồng truy cập (Auth Gate)**:
   - Chỉ hiển thị Landing Page (`/`) cho người dùng **chưa đăng nhập / đăng ký**.
   - Nếu đã đăng nhập, tự động điều hướng thẳng vào `/dashboard`.

---

## 🧭 1. Cấu Trúc 5 Phần Tinh Gọn

### 1. Hero Section
- **Badge**: `⚡ Tối ưu thời gian & Làm việc sâu mỗi ngày`
- **Headline**: **Gọn tâm trí. Xong việc lớn.** *Không còn ngợp vì việc vụn vặt.*
- **Subheadline**: Bám sát mục tiêu dài hạn, ưu tiên những việc quan trọng nhất trong ngày, khóa khung giờ tập trung và biến mọi kiến thức học được thành kết quả thực tế.
- **4 Tag lợi ích**:
  - `🎯 Quản lý mục tiêu Năm → Tuần → Ngày`
  - `⏳ Khóa giờ tập trung sâu`
  - `🧠 Ghi chép có hành động`
  - `🔥 +50% EXP & Quà tự thưởng`
- **CTA**: `[ Dùng thử miễn phí → ]` (`/register`) & `[ Xem bản Live ↗ ]` (`/dashboard`)
- **Visual bên phải**: Illustration card minh họa 3D Bé Gọn ngồi tập trung làm việc bên chiếc laptop xanh Sage, kèm thanh tương tác tick việc nhận +50 EXP, Level bar và chuỗi 14 ngày kỷ luật.

### 2. Giá Trị Cốt Lõi (Bento Grid 3 Ô)
1. **01 • Mục tiêu & Thời gian**: *Bám sát mục tiêu, ưu tiên việc quan trọng và khóa giờ làm* — Kết nối mạch lạc từ Mục tiêu Năm, Mục tiêu Tuần đến danh sách việc hôm nay; khóa lịch giờ vàng và gom việc vặt xử lý gọn trong 15 phút.
2. **02 • Ghi chép**: *Hiểu bản chất, nhớ lâu và biến thành việc làm ngay* — Đúc kết ngắn gọn bằng lời của mình, tự nhắc ôn lại và 1 cú nhấp chuyển thành việc cần làm.
3. **03 • Động lực**: *Kỷ luật nhẹ nhàng với điểm thưởng và quà đời thực* — Làm việc khó nhận +50% EXP, giữ chuỗi ngày liên tiếp và tự đổi quà thật (Matcha, sách mới).

### 3. Bảng So Sánh Nhanh (4 Tiêu Chí)
So sánh trực diện giữa **Notion / Obsidian**, **Todoist / TickTick** và **🌿 Gọn Web** trên 4 điểm:
- *Kết nối Mục tiêu & Khóa giờ trong ngày*
- *Ghi chép & Chuyển thành việc làm*
- *Động lực & Tự đổi quà thật*
- *Thời gian thiết lập (0 phút — Mở lên dùng ngay)*

### 4. Khu Vực Dùng Thử Trực Tiếp (Interactive Sandbox)
- **Cột trái (Bước 01 • Hiểu bản chất)**: Chọn/nhập chủ đề $\rightarrow$ Bấm **`✨ Tóm gọn ý chính`** $\rightarrow$ Bấm **`➕ Đưa vào Việc Hôm Nay`**.
- **Cột phải (Bước 02 • Hoàn thành việc trọng tâm)**: Tick hoàn thành trong **Danh Sách Việc Quan Trọng Hôm Nay** để nhận `+EXP`, tăng Level và bấm lưu tiến độ.

### 5. Hỏi Đáp Nhanh (3 Câu) & Banner Kết Trang
- Giải đáp ngắn gọn 3 câu hỏi về sự khác biệt của Gọn, thời gian làm quen và cơ chế đổi điểm thưởng.
- **CTA cuối trang**: *"Làm mọi thứ Gọn gàng và bắt đầu tập trung vào điều thực sự quan trọng."*