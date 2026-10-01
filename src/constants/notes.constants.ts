import { NotionBlockType, PageDetail, PageTreeItem } from '@/types/notes.types';

export interface SlashMenuItem {
  type: NotionBlockType;
  label: string;
  description: string;
  icon: string;
  keywords: string[];
}

export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  {
    type: 'paragraph',
    label: 'Văn bản (Text)',
    description: 'Đoạn văn bản thuần túy hoặc nội dung ghi chép thông thường.',
    icon: '📝',
    keywords: ['text', 'van ban', 'paragraph', 'p'],
  },
  {
    type: 'heading_1',
    label: 'Tiêu đề lớn (Heading 1)',
    description: 'Tiêu đề mục chính cấp cao nhất (# Tiêu đề).',
    icon: 'H1',
    keywords: ['heading 1', 'h1', 'tieu de 1', 'header 1'],
  },
  {
    type: 'heading_2',
    label: 'Tiêu đề vừa (Heading 2)',
    description: 'Tiêu đề phân mục vừa (## Tiêu đề).',
    icon: 'H2',
    keywords: ['heading 2', 'h2', 'tieu de 2', 'header 2'],
  },
  {
    type: 'heading_3',
    label: 'Tiêu đề nhỏ (Heading 3)',
    description: 'Tiêu đề mục con nhỏ (### Tiêu đề).',
    icon: 'H3',
    keywords: ['heading 3', 'h3', 'tieu de 3', 'header 3'],
  },
  {
    type: 'table',
    label: 'Bảng dữ liệu (Table)',
    description: 'Chèn bảng tương tác có dòng, cột và ô dữ liệu.',
    icon: '📊',
    keywords: ['table', 'bang', 'grid', 'sheet'],
  },
  {
    type: 'to_do',
    label: 'Việc cần làm (To-do list)',
    description: 'Danh sách việc kèm checkbox hoàn thành, có thể trích xuất sang Task.',
    icon: '☑️',
    keywords: ['todo', 'to-do', 'checkbox', 'task', 'checklist'],
  },
  {
    type: 'bulleted_list_item',
    label: 'Danh sách gạch đầu dòng',
    description: 'Danh sách không có thứ tự với dấu chấm tròn.',
    icon: '•',
    keywords: ['bullet', 'list', 'danh sach', 'ul'],
  },
  {
    type: 'numbered_list_item',
    label: 'Danh sách đánh số',
    description: 'Danh sách các bước có thứ tự 1, 2, 3...',
    icon: '1.',
    keywords: ['number', 'ordered', 'danh sach so', 'ol'],
  },
  {
    type: 'toggle',
    label: 'Danh sách đóng mở (Toggle)',
    description: 'Khối tam giác ẩn/hiện nội dung chi tiết bên trong.',
    icon: '▶',
    keywords: ['toggle', 'collapse', 'accordion', 'mo rong'],
  },
  {
    type: 'code',
    label: 'Khối mã nguồn (Code block)',
    description: 'Khối hiển thị code với cú pháp lập trình chuyên nghiệp.',
    icon: '💻',
    keywords: ['code', 'ma nguon', 'snippet', 'developer'],
  },
  {
    type: 'quote',
    label: 'Trích dẫn (Quote)',
    description: 'Đoạn văn trích dẫn ý tưởng nổi bật có đường viền rêu thanh lịch.',
    icon: '❝',
    keywords: ['quote', 'trich dan', 'blockquote'],
  },
  {
    type: 'callout',
    label: 'Hộp ghi chú nổi bật (Callout)',
    description: 'Hộp lưu ý quan trọng với emoji và màu nền kem ấm áp.',
    icon: '💡',
    keywords: ['callout', 'box', 'luu y', 'note', 'alert'],
  },
  {
    type: 'divider',
    label: 'Đường phân cách (Divider)',
    description: 'Đường kẻ ngang phân chia các khối nội dung.',
    icon: '―',
    keywords: ['divider', 'line', 'hr', 'phan cach'],
  },
];

export const EMOJI_SUGGESTIONS = [
  '📝', '💡', '🚀', '🎯', '📚', '📐', '🧠', '⚡', '🌿', '🌱', '🌟', '💼', '📊', '🔥', '🏆', '💎'
];

export const DEFAULT_INITIAL_PAGE: PageDetail = {
  id: 'mock-root-1',
  parentPageId: null,
  title: 'Chào mừng đến với Ghi Chú Gọn',
  icon: '🌿',
  coverImageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
  content: [
    {
      id: 'block-1',
      type: 'heading_1',
      properties: { title: '🌿 Hệ Thống Ghi Chú Tri Thức Phong Cách Notion' },
    },
    {
      id: 'block-2',
      type: 'callout',
      properties: {
        icon: '💡',
        title: 'Mẹo nhanh: Gõ dấu gạch chéo "/" ở bất kỳ dòng nào để mở Menu chèn khối nội dung (Table, To-do, Code...)!',
      },
    },
    {
      id: 'block-3',
      type: 'table',
      properties: {
        has_column_header: true,
        columns: ['Tính năng', 'Trạng thái', 'Lợi ích'],
      },
      content: [
        {
          id: 'row-1',
          type: 'table_row',
          properties: { cells: [['Cây trang lồng nhau', 'Sẵn sàng', 'Tổ chức tri thức không giới hạn']] },
        },
        {
          id: 'row-2',
          type: 'table_row',
          properties: { cells: [['Bảng tính tương tác', 'Sẵn sàng', 'Thêm cột, thêm hàng trực quan']] },
        },
        {
          id: 'row-3',
          type: 'table_row',
          properties: { cells: [['Trích xuất Task 1-click', 'Sẵn sàng', 'Đưa ngay to-do vào Action Dashboard']] },
        },
      ],
    },
    {
      id: 'block-4',
      type: 'heading_2',
      properties: { title: '🎯 Việc Cần Làm Trong Ngày' },
    },
    {
      id: 'block-5',
      type: 'to_do',
      properties: { title: 'Thử tạo một trang con mới bằng nút "+" trên thanh Sidebar', checked: false },
    },
    {
      id: 'block-6',
      type: 'to_do',
      properties: { title: 'Bấm nút "⚡ Trích xuất Task" ở góc trên để đưa to-do này vào Dashboard', checked: false },
    },
    {
      id: 'block-7',
      type: 'code',
      properties: {
        language: 'typescript',
        title: `// Cấu trúc phân cấp Materialized Path của Gọn:\nconst path = "/root_id/child_id/sub_id";\nconsole.log("Truy vấn cây thư mục <15ms!");`,
      },
    },
  ],
  plainTextSummary: 'Chào mừng bạn đến với Gọn Notes...',
  isFavorite: true,
  isArchived: false,
  orderIndex: 0,
  level: 0,
  path: '/mock-root-1',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  breadcrumbs: [
    { id: 'mock-root-1', title: 'Chào mừng đến với Ghi Chú Gọn', icon: '🌿', level: 0 },
  ],
};

export const INITIAL_PAGE_TREE_MOCK: PageTreeItem[] = [
  {
    id: 'mock-root-1',
    parentPageId: null,
    title: 'Chào mừng đến với Ghi Chú Gọn',
    icon: '🌿',
    orderIndex: 0,
    level: 0,
    isFavorite: true,
    hasChildren: true,
    children: [
      {
        id: 'mock-sub-1',
        parentPageId: 'mock-root-1',
        title: 'Mục Tiêu Tháng 10',
        icon: '🎯',
        orderIndex: 0,
        level: 1,
        isFavorite: false,
        hasChildren: false,
        children: [],
      },
    ],
  },
];
