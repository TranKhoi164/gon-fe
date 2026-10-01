import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import {
  CreatePagePayload,
  MovePagePayload,
  PageDetail,
  PageSummary,
  PageTreeItem,
  UpdatePageContentPayload,
  UpdatePageMetadataPayload,
} from '@/types/notes.types';
import { Task } from '@/types/dashboard.types';
import { DEFAULT_INITIAL_PAGE, INITIAL_PAGE_TREE_MOCK } from '@/constants/notes.constants';

const LOCAL_STORAGE_KEY_PAGES = 'gon_notes_local_pages';
const LOCAL_STORAGE_KEY_TREE = 'gon_notes_local_tree';

function getLocalPages(): Record<string, PageDetail> {
  if (typeof window === 'undefined') return { [DEFAULT_INITIAL_PAGE.id]: DEFAULT_INITIAL_PAGE };
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PAGES);
    if (!raw) return { [DEFAULT_INITIAL_PAGE.id]: DEFAULT_INITIAL_PAGE };
    return JSON.parse(raw);
  } catch {
    return { [DEFAULT_INITIAL_PAGE.id]: DEFAULT_INITIAL_PAGE };
  }
}

function setLocalPages(pages: Record<string, PageDetail>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PAGES, JSON.stringify(pages));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

function getLocalTree(): PageTreeItem[] {
  if (typeof window === 'undefined') return INITIAL_PAGE_TREE_MOCK;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_TREE);
    if (!raw) return INITIAL_PAGE_TREE_MOCK;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PAGE_TREE_MOCK;
  }
}

function setLocalTree(tree: PageTreeItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_TREE, JSON.stringify(tree));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export const notesService = {
  /**
   * 1. Lấy toàn bộ cây thư mục trang cho Sidebar
   */
  async getTree(): Promise<PageTreeItem[]> {
    try {
      const data = await apiClient.get<PageTreeItem[], PageTreeItem[]>(API_ENDPOINTS.PAGES_TREE);
      if (Array.isArray(data) && data.length > 0) {
        setLocalTree(data);
        return data;
      }
      return getLocalTree();
    } catch {
      return getLocalTree();
    }
  },

  /**
   * 2. Lấy chi tiết trang và nội dung các khối
   */
  async getPage(id: string): Promise<PageDetail> {
    try {
      const data = await apiClient.get<PageDetail, PageDetail>(API_ENDPOINTS.PAGE_BY_ID(id));
      if (data && data.id) {
        const local = getLocalPages();
        local[data.id] = data;
        setLocalPages(local);
        return data;
      }
      return getLocalPages()[id] || DEFAULT_INITIAL_PAGE;
    } catch {
      const local = getLocalPages();
      return local[id] || DEFAULT_INITIAL_PAGE;
    }
  },

  /**
   * 3. Tạo trang mới (Root page hoặc Sub-page)
   */
  async createPage(payload: CreatePagePayload): Promise<PageDetail> {
    try {
      const data = await apiClient.post<PageDetail, PageDetail>(API_ENDPOINTS.PAGES, payload);
      if (data && data.id) {
        const local = getLocalPages();
        local[data.id] = data;
        setLocalPages(local);
        return data;
      }
      throw new Error('No data returned');
    } catch {
      // Fallback local creation
      const newId = `local-${Date.now()}`;
      const newPage: PageDetail = {
        id: newId,
        parentPageId: payload.parentPageId ?? null,
        title: payload.title || 'Không có tiêu đề',
        icon: payload.icon ?? '📝',
        coverImageUrl: payload.coverImageUrl ?? null,
        content: [
          {
            id: `b-${Date.now()}`,
            type: 'paragraph',
            properties: { title: '' },
          },
        ],
        plainTextSummary: null,
        isFavorite: false,
        isArchived: false,
        orderIndex: 0,
        level: payload.parentPageId ? 1 : 0,
        path: `/${newId}`,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const local = getLocalPages();
      local[newId] = newPage;
      setLocalPages(local);

      // Cập nhật local tree
      const tree = getLocalTree();
      if (payload.parentPageId) {
        function addToParent(items: PageTreeItem[]): boolean {
          for (const item of items) {
            if (item.id === payload.parentPageId) {
              item.children = item.children || [];
              item.children.push({
                id: newId,
                parentPageId: payload.parentPageId,
                title: newPage.title,
                icon: newPage.icon,
                orderIndex: item.children.length,
                level: item.level + 1,
                isFavorite: false,
                hasChildren: false,
                children: [],
              });
              item.hasChildren = true;
              return true;
            }
            if (item.children && addToParent(item.children)) return true;
          }
          return false;
        }
        addToParent(tree);
      } else {
        tree.push({
          id: newId,
          parentPageId: null,
          title: newPage.title,
          icon: newPage.icon,
          orderIndex: tree.length,
          level: 0,
          isFavorite: false,
          hasChildren: false,
          children: [],
        });
      }
      setLocalTree(tree);

      return newPage;
    }
  },

  /**
   * 4. Cập nhật metadata (title, icon, coverImageUrl, isFavorite)
   */
  async updatePageMetadata(id: string, payload: UpdatePageMetadataPayload): Promise<PageDetail> {
    try {
      const data = await apiClient.patch<PageDetail, PageDetail>(API_ENDPOINTS.PAGE_BY_ID(id), payload);
      return data;
    } catch {
      const local = getLocalPages();
      if (local[id]) {
        local[id] = { ...local[id], ...payload, updatedAt: new Date().toISOString() };
        setLocalPages(local);
        return local[id];
      }
      return DEFAULT_INITIAL_PAGE;
    }
  },

  /**
   * 5. Autosave nội dung các khối
   */
  async updateContent(id: string, payload: UpdatePageContentPayload): Promise<PageDetail> {
    try {
      const data = await apiClient.patch<PageDetail, PageDetail>(API_ENDPOINTS.PAGE_CONTENT(id), payload);
      return data;
    } catch {
      const local = getLocalPages();
      if (local[id]) {
        local[id].content = payload.content;
        local[id].version = (payload.version || 1) + 1;
        local[id].updatedAt = new Date().toISOString();
        setLocalPages(local);
        return local[id];
      }
      return DEFAULT_INITIAL_PAGE;
    }
  },

  /**
   * 6. Di chuyển vị trí hoặc cha của trang
   */
  async movePage(id: string, payload: MovePagePayload): Promise<PageDetail> {
    try {
      const data = await apiClient.patch<PageDetail, PageDetail>(API_ENDPOINTS.PAGE_MOVE(id), payload);
      return data;
    } catch {
      return this.getPage(id);
    }
  },

  /**
   * 7. Nhân bản trang
   */
  async duplicatePage(id: string): Promise<PageDetail> {
    try {
      const data = await apiClient.post<PageDetail, PageDetail>(API_ENDPOINTS.PAGE_DUPLICATE(id));
      return data;
    } catch {
      const src = await this.getPage(id);
      return this.createPage({
        title: `${src.title} (Bản sao)`,
        icon: src.icon,
        parentPageId: src.parentPageId,
      });
    }
  },

  /**
   * 8. Chuyển vào thùng rác
   */
  async archivePage(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API_ENDPOINTS.PAGE_BY_ID(id));
      return true;
    } catch {
      const local = getLocalPages();
      if (local[id]) {
        local[id].isArchived = true;
        setLocalPages(local);
      }
      return true;
    }
  },

  /**
   * 9. Khôi phục từ thùng rác
   */
  async restorePage(id: string): Promise<boolean> {
    try {
      await apiClient.post(API_ENDPOINTS.PAGE_RESTORE(id));
      return true;
    } catch {
      const local = getLocalPages();
      if (local[id]) {
        local[id].isArchived = false;
        setLocalPages(local);
      }
      return true;
    }
  },

  /**
   * 10. Lấy danh sách thùng rác
   */
  async getTrash(): Promise<PageSummary[]> {
    try {
      const data = await apiClient.get<PageSummary[], PageSummary[]>(API_ENDPOINTS.PAGES_TRASH);
      return data;
    } catch {
      const local = getLocalPages();
      return Object.values(local).filter((p) => p.isArchived);
    }
  },

  /**
   * 11. Lấy danh sách trang Yêu thích
   */
  async getFavorites(): Promise<PageSummary[]> {
    try {
      const data = await apiClient.get<PageSummary[], PageSummary[]>(API_ENDPOINTS.PAGES_FAVORITES);
      return data;
    } catch {
      const local = getLocalPages();
      return Object.values(local).filter((p) => p.isFavorite && !p.isArchived);
    }
  },

  /**
   * 12. Tìm kiếm trang theo từ khóa
   */
  async searchPages(search: string): Promise<PageSummary[]> {
    try {
      const res = await apiClient.get<{ data: PageSummary[] }, { data: PageSummary[] }>(
        `${API_ENDPOINTS.PAGES_SEARCH}?search=${encodeURIComponent(search)}`
      );
      return res?.data || [];
    } catch {
      const local = getLocalPages();
      const term = search.toLowerCase();
      return Object.values(local).filter(
        (p) =>
          !p.isArchived &&
          (p.title.toLowerCase().includes(term) || (p.plainTextSummary || '').toLowerCase().includes(term))
      );
    }
  },

  /**
   * 13. Trích xuất các block to-do thành Task trong Action Dashboard
   */
  async extractTasks(id: string, blockIds?: string[]): Promise<Task[]> {
    try {
      const data = await apiClient.post<Task[], Task[]>(API_ENDPOINTS.PAGE_EXTRACT_TASKS(id), {
        blockIds,
      });
      return data || [];
    } catch {
      return [];
    }
  },
};
