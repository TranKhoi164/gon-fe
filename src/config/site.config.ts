export const SITE_CONFIG = {
  name: "Gọn Web",
  description: "Smart Personal Growth & Knowledge OS - Giải phóng tâm trí khỏi sự hỗn độn",
  version: "1.0.0",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  navItems: [
    { label: "Trang chủ Action", href: "/dashboard", icon: "🎯", active: true },
    { label: "Ghi chú Notion", href: "/notes", icon: "📝", active: false },
    { label: "Tri thức PARA", href: "/knowledge", icon: "📚", active: false },
    { label: "Micro-Review", href: "/review", icon: "⚡", active: false },
    { label: "Quantified Self", href: "/analytics", icon: "📈", active: false },
    { label: "Cài đặt", href: "/settings", icon: "⚙️", active: false },
  ],
  defaultGoalLimits: {
    yearly: 3,
    weekly: 3,
    daily: 3,
  },
  batchingSessionDefaultMinutes: 15,
} as const;
