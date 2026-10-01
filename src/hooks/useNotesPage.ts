'use client';

import { useState, useEffect, useCallback } from 'react';
import { notesService } from '@/services/notesService';
import { NotionBlock, PageDetail, PageSummary, PageTreeItem } from '@/types/notes.types';
import { DEFAULT_INITIAL_PAGE } from '@/constants/notes.constants';

export function useNotesPage() {
  const [tree, setTree] = useState<PageTreeItem[]>([]);
  const [favorites, setFavorites] = useState<PageSummary[]>([]);
  const [trashList, setTrashList] = useState<PageSummary[]>([]);
  const [activePageId, setActivePageId] = useState<string>(DEFAULT_INITIAL_PAGE.id);
  const [activePage, setActivePage] = useState<PageDetail>(DEFAULT_INITIAL_PAGE);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refreshSidebar = useCallback(async () => {
    const [fetchedTree, fetchedFavs, fetchedTrash] = await Promise.all([
      notesService.getTree(),
      notesService.getFavorites(),
      notesService.getTrash(),
    ]);
    setTree(fetchedTree);
    setFavorites(fetchedFavs);
    setTrashList(fetchedTrash);
  }, []);

  // Load page detail by ID
  const loadPage = useCallback(async (id: string) => {
    setActivePageId(id);
    const page = await notesService.getPage(id);
    setActivePage(page);
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await refreshSidebar();
      const treeData = await notesService.getTree();
      if (treeData && treeData.length > 0 && isMounted) {
        const firstId = treeData[0].id;
        setActivePageId(firstId);
        const page = await notesService.getPage(firstId);
        if (isMounted) setActivePage(page);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [refreshSidebar]);

  const handleCreateRootPage = useCallback(async () => {
    const newPage = await notesService.createPage({
      title: 'Không có tiêu đề',
      icon: '📝',
    });
    await refreshSidebar();
    await loadPage(newPage.id);
    showToast('Đã tạo trang mới');
  }, [loadPage, refreshSidebar, showToast]);

  const handleAddSubPage = useCallback(async (parentId: string) => {
    const newPage = await notesService.createPage({
      title: 'Trang con mới',
      parentPageId: parentId,
      icon: '📄',
    });
    await refreshSidebar();
    await loadPage(newPage.id);
    showToast('Đã thêm trang con lồng nhau');
  }, [loadPage, refreshSidebar, showToast]);

  const handleUpdateMetadata = useCallback(async (payload: {
    title?: string;
    icon?: string | null;
    coverImageUrl?: string | null;
    isFavorite?: boolean;
  }) => {
    setActivePage((prev) => ({ ...prev, ...payload }));
    await notesService.updatePageMetadata(activePage.id, payload);
    await refreshSidebar();
  }, [activePage.id, refreshSidebar]);

  const handleSaveContent = useCallback(async (content: NotionBlock[], version: number) => {
    setSaveStatus('saving');
    try {
      const updated = await notesService.updateContent(activePage.id, {
        content,
        version,
      });
      setActivePage((prev) => ({ ...prev, version: updated.version, content }));
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, [activePage.id]);

  const handleArchivePage = useCallback(async (id: string) => {
    await notesService.archivePage(id);
    await refreshSidebar();
    showToast('Đã chuyển trang vào thùng rác');
    if (activePageId === id) {
      const remainingTree = await notesService.getTree();
      if (remainingTree.length > 0) {
        await loadPage(remainingTree[0].id);
      } else {
        await handleCreateRootPage();
      }
    }
  }, [activePageId, handleCreateRootPage, loadPage, refreshSidebar, showToast]);

  const handleRestorePage = useCallback(async (id: string) => {
    await notesService.restorePage(id);
    await refreshSidebar();
    await loadPage(id);
    showToast('Đã khôi phục trang từ thùng rác');
  }, [loadPage, refreshSidebar, showToast]);

  const handleDuplicatePage = useCallback(async () => {
    const dup = await notesService.duplicatePage(activePage.id);
    await refreshSidebar();
    await loadPage(dup.id);
    showToast('Đã nhân bản trang thành công');
  }, [activePage.id, loadPage, refreshSidebar, showToast]);

  // Filter tree when search is active
  const displayedTree = searchTerm
    ? tree.filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : tree;

  return {
    tree: displayedTree,
    favorites,
    trashList,
    activePageId,
    activePage,
    saveStatus,
    searchTerm,
    isExtractModalOpen,
    toastMessage,
    setSearchTerm,
    setIsExtractModalOpen,
    showToast,
    loadPage,
    handleCreateRootPage,
    handleAddSubPage,
    handleUpdateMetadata,
    handleSaveContent,
    handleArchivePage,
    handleRestorePage,
    handleDuplicatePage,
  };
}
