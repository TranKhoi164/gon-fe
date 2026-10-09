<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules & Architecture — FE Core (`fe-core`)

Tài liệu quy chuẩn kiến trúc, công nghệ và cấu trúc thư mục dự án Frontend Gọn Web.

---

## ⚠️ CRITICAL WORKFLOW RULES

- **KHÔNG chạy `pnpm run build` hoặc `pnpm build` mỗi khi sửa code** (cả Backend `api-core` lẫn Frontend `fe-core`) trừ khi người dùng yêu cầu trực tiếp.
- Thay vào đó, hãy dùng unit test (`pnpm run test`), kiểm tra TypeScript, hoặc để dev server (`pnpm run start:dev` / `pnpm run dev`) tự reload để tiết kiệm thời gian.

---

## 🛠️ 1. Công Nghệ Sử Dụng (Tech Stack)

| Công Nghệ | Phiên Bản | Vai Trò & Mô Tả |
|---|---|---|
| **Next.js** | `16.x` | Framework chính (App Router, Server & Client Components) |
| **React** | `19.x` | Thư viện UI (React 19 Concurrent Features & Server Actions) |
| **TypeScript** | `5.x` | Ngôn ngữ lập trình chính (Enforce Strict Mode) |
| **Tailwind CSS** | `v4.x` | Utility-first Styling (Định nghĩa Token qua `@theme` trong `globals.css`) |
| **Package Manager** | `pnpm` | Quản lý gói phụ thuộc nhanh, tối ưu ổ đĩa |
| **ESLint & Prettier** | Latest | Linting & Code formatting chuẩn hóa |

---

## 📁 2. Cấu Trúc Thư Mục Chuẩn (Folder Structure)

Dự án áp dụng cấu trúc **Feature-driven & Layered Architecture** cho Next.js App Router nhằm đảm bảo khả năng mở rộng (scalability), dễ bảo trì và phân tách nhiệm vụ rõ ràng:

```
fe-core/
├── public/                 # Các tài nguyên tĩnh (images, icons, fonts, favicon...)
├── src/
│   ├── app/                # App Router Routes & Pages
│   │   ├── (auth)/         # Route Group cho Authentication (login, register, forgot-password...)
│   │   ├── (dashboard)/    # Route Group cho trang Quản trị / User Dashboard
│   │   ├── api/            # API Routes / Backend-For-Frontend (BFF) endpoints
│   │   ├── globals.css     # Global Styles & Tailwind CSS v4 Theme Token config
│   │   ├── layout.tsx      # Root Layout (Providers, Fonts, Metadata)
│   │   ├── page.tsx        # Trang chủ (Homepage)
│   │   ├── loading.tsx     # Custom Loading UI state
│   │   └── error.tsx       # Global Error Boundary component
│   │
│   ├── components/         # Thư viện UI Components
│   │   ├── ui/             # Base Design System / Atomic UI elements (Button, Input, Card, Modal...)
│   │   ├── shared/         # Common Layout Components (Header, Footer, Sidebar, Navbar...)
│   │   └── features/       # Feature-specific Components (AuthForm, UserTable, ProductCard...)
│   │
│   ├── config/             # Cấu hình dự án (site config, env vars definition, navigation link)
│   ├── constants/          # Các hằng số cố định, Enums, API Endpoints list
│   ├── hooks/              # Custom React Hooks (useAuth, useDebounce, useMediaQuery...)
│   ├── lib/                # Third-party Library wrappers & Instances (axios, fetcher, cn utility)
│   ├── services/           # Tầng gọi API / Data Fetching layer (Connect sang api-core)
│   ├── store/              # Client State Management (Zustand, React Context...)
│   ├── styling/            # Custom CSS stylesheets độc lập (override theme thư viện: schedule-x, blocknote...)
│   ├── types/              # Type Definitions & TypeScript Interfaces (API Request/Response schemas)
│   └── utils/              # Helper functions nguyên bản (date formatting, currency, string helpers)
│
├── .env.local              # Biến môi trường chạy cục bộ
├── next.config.ts          # Cấu hình Next.js (turbopack, images, rewrites...)
├── postcss.config.mjs      # Cấu hình PostCSS (PostCSS plugin cho Tailwind v4)
├── package.json            # Scripts & Dependencies
└── tsconfig.json           # Cấu hình TypeScript compile & Path Aliases (@/*)
```

---

## 📐 3. Quy Tắc Lập Trình (Development Guidelines)

### 3.1. Phân Tách Server Components & Client Components
- **Mặc định**: Tất cả Component trong `src/app/` và `src/components/` là **Server Component** để tối ưu SEO, bundle size và tốc độ tải trang.
- **Client Component**: Chỉ sử dụng `"use client";` khi cần:
  - Quản lý state (`useState`, `useReducer`, `useContext`).
  - Lắng nghe event (`onClick`, `onChange`, `onSubmit`, `onKeyDown`...).
  - Dùng Lifecycle hook (`useEffect`, `useLayoutEffect`).
  - Gọi Browser-only APIs (`window`, `localStorage`, `document`...).

### 3.2. Styling với Tailwind CSS v4
- Cấu hình Design Tokens (Colors, Typography, Radius) trực tiếp tại `@theme` trong `src/app/globals.css`.
- Tránh ghi đè style inline hoặc tạo file CSS riêng rẽ cho từng component.
- Dùng helper `cn(...)` từ `src/lib/utils.ts` để kết hợp class linh hoạt.

### 3.3. Quy Tắc Đặt Tên (Naming Conventions)
- **Component files**: Dùng `kebab-case` hoặc `PascalCase` (Ví dụ: `button.tsx`, `user-profile-card.tsx`).
- **Custom Hooks**: Bắt đầu bằng prefix `use` theo chuẩn `camelCase` (Ví dụ: `useAuth.ts`, `useFetch.ts`).
- **Services & Utils**: `camelCase` (Ví dụ: `authService.ts`, `formatCurrency.ts`).
- **Interfaces / Types**: `PascalCase` (Ví dụ: `User`, `ApiResponse<T>`, `AuthToken`).

### 3.4. Giao Tiếp với `api-core`
- Tất cả API calls sang `api-core` đều đi qua tầng `src/services/`.
- Sử dụng URL cấu hình qua `process.env.NEXT_PUBLIC_API_URL`.

### 3.5. Quy Tắc Tránh Hardcode (No Hardcoding Policy)
- **Tuyệt đối KHÔNG hardcode**: Mọi giá trị cấu hình, hằng số cố định, URL, magic numbers, danh sách tùy chọn hay chuỗi hiển thị tĩnh đều **PHẢI** được khai báo tập trung trong các thư mục chuẩn:
  - `src/config/`: Cấu hình hệ thống, app metadata, navigation links, biến môi trường.
  - `src/constants/`: Các hằng số cố định, nhãn giao diện dùng chung, danh sách static options, API endpoints.
  - `src/types/` hoặc `src/constants/`: Các kiểu dữ liệu `enum`, TypeScript union types.

### 3.6. Quy Tắc Phân Tách File Khi Số Lượng Code Lớn (File Splitting & Modularization Policy)
- **Giới hạn độ dài và độ phức tạp của file**:
  - Tránh viết các file "monolithic" vượt quá ~250–300 dòng code gánh quá nhiều trách nhiệm.
  - Khi một Component, Hook, Service hay Stylesheet phình to, cần chủ động phân tách thành các file mô-đun nhỏ hơn theo nguyên tắc Single Responsibility.
- **Tách Style Thư Viện Bên Thứ Ba ra thư mục `src/styling/`**:
  - **TUYỆT ĐỐI KHÔNG** gom hàng trăm dòng CSS override của các thư viện bên ngoài (ví dụ: `@schedule-x/calendar`, `@blocknote/react`, `@mantine`, v.v.) vào `globals.css`.
  - Phải tách riêng thành các file `.css` chuyên biệt trong thư mục `src/styling/` (ví dụ: `src/styling/schedule-x.css`, `src/styling/blocknote.css`) và chỉ `import` tại đúng component/feature sử dụng hoặc layout liên quan.
  - `globals.css` chỉ giữ vai trò định nghĩa Design Tokens cốt lõi (`@theme inline`), cấu hình biến màu chung của toàn website (`:root`, `.dark`), font chữ và base layout reset.
- **Tách Sub-components cho các Feature UI lớn**:
  - Khi xây dựng Modal phức tạp, Dashboard Grid, Ma trận hoặc Form nhiều bước, hãy bóc tách các sub-components (như Header, Footer, Toolbar, Item Cards, Dialogs con) thành các file riêng trong cùng thư mục feature (ví dụ: `src/components/features/<feature>/...`).
- **Tách Types, Enums & Hằng số**:
  - Không định nghĩa hàng loạt TypeScript Interfaces hoặc Enum chung trong cùng file component. Hãy chuyển vào `src/types/<feature>.types.ts` và `src/constants/<feature>.constants.ts` hoặc `enums.ts`.
- **Tách Business Logic & Helpers**:
  - Các hàm xử lý ngày tháng, thuật toán lặp lại (recurrence), tính điểm gamification, parse dữ liệu... phải được tách ra `src/utils/` hoặc đóng gói thành Custom Hooks trong `src/hooks/`.

### 3.7. UI Interaction & Transition Rules (STRICT)

1. **NO ABRUPT UI CHANGES (KHÔNG THAY ĐỔI ĐỘT NGỘT)**:
   - Tuyệt đối cấm render giật cục, xuất hiện hoặc biến mất tức thì (snap/instant show/hide).
   - Bất kỳ khi nào Modal, Popover, Tooltip, Dropdown, Accordion hoặc Banner xuất hiện/đóng lại, **BẮT BUỘC** phải có Transition mượt mà cả 2 chiều: **Enter (vào)** và **Exit (ra)**.

2. **Cách xử lý Conditional Rendering / Mounting**:
   - **CẤM** render trần dạng `{isOpen && <Component />}` nếu không có cơ chế giữ component trong DOM để chạy xong exit transition.
   - **Nếu dùng React/Tailwind/CSS thuần:**
     - Giữ element trong DOM và toggle visibility qua classes kết hợp transition (opacity, scale, translate), hoặc dùng dynamic state/transition hook để chỉ unmount sau khi animation kết thúc.
     - Backdrop/Overlay: Phải fade-in / fade-out (`transition-opacity duration-200`).
     - Modal Content: Phải kết hợp fade + zoom nhẹ hoặc slide (`transition-all duration-200 ease-out`, scale từ 95% → 100% khi vào, và ngược lại khi ra).
   - **Nếu có thư viện animation (Framer Motion / Headless UI / Radix UI):**
     - **BẮT BUỘC** dùng component hỗ trợ unmount có transition (ví dụ: bọc bằng `AnimatePresence` + `motion.div` với đầy đủ `initial`, `animate`, `exit`).

3. **Chuẩn thông số Animation / Transition**:
   - Duration: `150ms – 250ms` cho popover/dropdown/tooltip; `200ms – 300ms` cho modal/dialog/drawer.
   - Easing: `ease-out` khi mở, `ease-in` khi đóng.
   - Tương tác cơ bản: Mọi button, link, item clickable đều phải có transition trạng thái (`hover`, `active`, `focus`) tối thiểu `duration-150`.

---

## 🚀 4. Lệnh Chạy Dự Án (Commands)

```bash
# Chạy dự án ở môi trường Development
pnpm run dev

# Kiểm tra Linter & Code style
pnpm run lint

# Build sản phẩm Production
pnpm run build

# Chạy bản Build Production
pnpm run start
```
