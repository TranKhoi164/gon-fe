import {
  HeroPillTag,
  ComparisonRow,
  PlaygroundDemoTask,
  FeynmanPreset,
  FaqItem,
} from "@/types/landing.types";

export const LANDING_NAV_LINKS = [
  { href: "#features", label: "Tính năng" },
  { href: "#comparison", label: "So sánh" },
  { href: "#playground", label: "🎮 Thử ngay" },
  { href: "#faq", label: "Hỏi đáp" },
] as const;

export const MASCOT_CARD_CONFIG = {
  initialXp: 420,
  maxXp: 500,
  boostStepXp: 50,
  boostDurationMs: 1400,
  streakDays: 14,
  level: 4,
  windowTitle: "gon.app — workspace/today",
  modeBadge: "LOCKING IN...",
  goldZoneBadge: "⭐ VIỆC TRỌNG TÂM · +50% EXP",
  funnelSummary: [
    { label: "Mục tiêu Năm", ratio: "Định hướng" },
    { label: "Mục tiêu Tuần", ratio: "Trọng tâm" },
    { label: "Việc Hôm nay", ratio: "Thực thi" },
  ],
  windowTasks: [
    {
      id: "win-task-1",
      title: "Thiết kế tính năng chính của dự án",
      quadrant: "GOLD_ZONE",
      xp: 75,
      time: "09:00",
      done: true,
    },
    {
      id: "win-task-2",
      title: "Tóm tắt bài học sáng nay thành các ý chính",
      quadrant: "GOLD_ZONE",
      xp: 60,
      time: "10:30",
      done: false,
    },
    {
      id: "win-task-3",
      title: "Phản hồi mail & chốt lịch với team",
      quadrant: "DO_FIRST",
      xp: 35,
      time: "13:30",
      done: false,
    },
  ],
  timeboxBlocks: [
    {
      time: "09:00",
      duration: "90p",
      title: "Tập trung sâu: Thiết kế tính năng",
      tag: "⭐ Việc trọng tâm",
      tone: "gold",
    },
    {
      time: "10:30",
      duration: "45p",
      title: "Đúc kết ghi chép & Ôn tập",
      tag: "🧠 Học sâu",
      tone: "sage",
    },
    {
      time: "11:15",
      duration: "15p",
      title: "Gom việc vặt (Mail, Slack)",
      tag: "🧺 15 phút",
      tone: "neutral",
    },
  ],
  boostToastText: "+50 EXP • Đã lưu tiến độ tập trung",
} as const;

export const PLAYGROUND_CONFIG = {
  initialXp: 120,
  levelTwoThresholdXp: 240,
  levelTwoSpanXp: 200,
  feynmanizeBonusXp: 25,
  pushActionBonusXp: 20,
  celebrationDurationMs: 2200,
  streakDays: 1,
} as const;

export const LANDING_HERO_CONFIG = {
  badge: "⚡ Tối ưu thời gian & Làm việc sâu mỗi ngày",
  headlineTop: "Gọn tâm trí.",
  headlineHighlight: "Xong việc lớn.",
  headlineBottom: "Không còn ngợp vì việc vụn vặt.",
  subheadline:
    "Bám sát mục tiêu dài hạn, ưu tiên những việc quan trọng nhất trong ngày, khóa khung giờ tập trung và biến mọi kiến thức học được thành kết quả thực tế.",
  primaryCtaText: "Dùng thử miễn phí",
  secondaryCtaText: "Xem bản Live ↗",
  mascotPosterTitle: "LOCKING IN...",
  mascotPosterSubtitle: "BÉ GỌN @DEEP WORK",
  mascotCaption:
    "Bé Gọn ngồi tập trung cùng bạn lọc bỏ xao nhãng để dứt điểm những mục tiêu quan trọng nhất mỗi ngày.",
  trustPoints: [
    "Không cần dựng mẫu",
    "Tập trung sâu",
    "Miễn phí",
  ],
} as const;

export const HERO_PILL_TAGS: HeroPillTag[] = [
  { id: "focus", icon: "🎯", label: "Quản lý mục tiêu Năm → Tuần → Ngày" },
  { id: "time", icon: "⏳", label: "Khóa giờ tập trung sâu" },
  { id: "learn", icon: "🧠", label: "Ghi chép có hành động" },
  { id: "reward", icon: "🔥", label: "+50% EXP & Quà tự thưởng" },
];

export const CORE_FEATURES_BENTO = [
  {
    id: "focus-time",
    icon: "🎯",
    badge: "01 • Mục tiêu & Thời gian",
    title: "Bám sát mục tiêu, ưu tiên việc quan trọng và khóa giờ làm",
    desc: "Kết nối mạch lạc từ Mục tiêu Năm, Mục tiêu Tuần đến danh sách việc hôm nay. Khóa lịch giờ vàng cho việc quan trọng và gom việc vặt xử lý gọn trong 15 phút.",
    tags: ["Mục tiêu rõ ràng", "Lịch khóa giờ", "Giỏ việc vặt 15p"],
  },
  {
    id: "action-notes",
    icon: "🧠",
    badge: "02 • Ghi chép",
    title: "Hiểu bản chất, nhớ lâu và biến thành việc làm ngay",
    desc: "Đúc kết kiến thức bằng lời của chính mình. 1 cú nhấp chuyển ý tưởng thành việc cần làm, hệ thống tự nhắc ôn lại đúng lúc sắp quên.",
    tags: ["Viết ngắn gọn", "Tự nhắc ôn tập", "Chuyển thành việc làm"],
  },
  {
    id: "gamified-rewards",
    icon: "🎁",
    badge: "03 • Động lực",
    title: "Kỷ luật nhẹ nhàng với điểm thưởng và quà đời thực",
    desc: "Làm việc khó được thưởng +50% EXP. Cày Level, giữ chuỗi ngày liên tiếp và tự đổi quà thật (Matcha, sách mới, nghỉ ngơi).",
    tags: ["+50% EXP việc khó", "Chuỗi ngày liên tiếp", "Quà tự chọn"],
  },
] as const;

export const COMPARISON_ROWS_DATA: ComparisonRow[] = [
  {
    feature: "Kết nối Mục tiêu & Khóa giờ trong ngày",
    notionObsidian: "Dễ bị loãng",
    todoistTickTick: "Chỉ có danh sách việc rời rạc",
    ankiHabitica: "Không hỗ trợ",
    gonApp: "✅ Rõ mục tiêu, khóa giờ dứt điểm",
  },
  {
    feature: "Ghi chép & Chuyển thành việc làm",
    notionObsidian: "Phải tự dựng phức tạp",
    todoistTickTick: "Không ghi chép sâu được",
    ankiHabitica: "Rời rạc",
    gonApp: "✅ 1 click bóc tách thành việc",
  },
  {
    feature: "Động lực & Tự đổi quà thật",
    notionObsidian: "Không có",
    todoistTickTick: "Chỉ có thống kê khô khan",
    ankiHabitica: "Nặng tính ảo",
    gonApp: "✅ +50% EXP & Đổi quà đời thực",
  },
  {
    feature: "Thời gian thiết lập",
    notionObsidian: "Mất nhiều ngày",
    todoistTickTick: "Nhanh nhưng thiếu chiều sâu",
    ankiHabitica: "Tốn công tạo thẻ",
    gonApp: "🚀 0 phút — Mở lên dùng ngay",
  },
];

export const PLAYGROUND_INITIAL_TASKS: PlaygroundDemoTask[] = [
  {
    id: "demo-task-1",
    title: "Dành 45 phút tập trung cho công việc quan trọng nhất",
    tag: "⭐ VIỆC TRỌNG TÂM (+50% EXP)",
    xpReward: 75,
    isGoldZone: true,
    completed: false,
  },
  {
    id: "demo-task-2",
    title: "Đúc kết 1 bài học hôm nay thành ghi chú ngắn gọn",
    tag: "⭐ VIỆC TRỌNG TÂM (+50% EXP)",
    xpReward: 60,
    isGoldZone: true,
    completed: false,
  },
  {
    id: "demo-task-3",
    title: "Xử lý giỏ việc vặt (Mail, tin nhắn) trong 15 phút",
    tag: "🧺 VIỆC VẶT 15P",
    xpReward: 35,
    isGoldZone: false,
    completed: false,
  },
];

export const FEYNMAN_PRESETS_DATA: FeynmanPreset[] = [
  {
    id: "timeboxing",
    concept: "Khóa giờ làm việc",
    rawJargon: "",
    simplifiedExplanation:
      "Ấn định rõ từ mấy giờ đến mấy giờ chỉ làm duy nhất 1 việc. Hết giờ là dừng, không làm dây dưa.",
    extractedAction: "Khóa khung giờ 09:00 - 10:30 sáng mai cho việc quan trọng nhất.",
    xpBonus: 40,
  },
  {
    id: "atomic-note",
    concept: "Đúc kết ý chính",
    rawJargon: "",
    simplifiedExplanation:
      "Chỉ viết gọn ý cốt lõi bằng lời của bạn. Tự diễn đạt lại được thì kiến thức mới thực sự là của bạn.",
    extractedAction: "Viết tóm tắt ngắn gọn từ nội dung vừa đọc hôm nay.",
    xpBonus: 50,
  },
  {
    id: "deep-focus",
    concept: "Ưu tiên việc lớn",
    rawJargon: "",
    simplifiedExplanation:
      "Việc quan trọng giúp bạn phát triển nhưng hay bị việc gấp lấn át. Làm việc này đầu ngày trước khi mở tin nhắn.",
    extractedAction: "Dành 60 phút đầu ngày cho việc Quan trọng trước khi check mail.",
    xpBonus: 60,
  },
];

export const LANDING_FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    question: "Gọn khác gì một to-do list thông thường?",
    answer:
      "To-do list thông thường chỉ liệt kê việc rời rạc. Gọn giúp bạn kết nối từ mục tiêu lớn xuống việc cần làm hôm nay, phân loại việc trọng tâm, khóa giờ làm sâu và chuyển ghi chép thành hành động.",
  },
  {
    id: "faq-2",
    question: "Có mất thời gian cài đặt không?",
    answer:
      "Không. Mở lên là thêm mục tiêu và dùng ngay trong 30 giây, không phải dựng template hay cài plugin.",
  },
  {
    id: "faq-3",
    question: "Điểm thưởng dùng để làm gì?",
    answer:
      "Làm việc khó được thưởng +50% EXP. Bạn dùng điểm đó để tự mở khóa phần thưởng đời thực do chính bạn đặt ra (như 1 ly Matcha, 1 cuốn sách).",
  },
];
