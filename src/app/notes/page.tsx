'use client';

import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/shared/sidebar';
import { ExtractTasksModal } from '@/components/features/notes/extract-tasks-modal';

const NotionBlockEditor = dynamic(
  () =>
    import('@/components/features/notes/notion-block-editor').then(
      (m) => m.NotionBlockEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-surface rounded-xl text-text-tertiary text-xs">
        Đang tải trình soạn thảo BlockNote...
      </div>
    ),
  }
);
import { useNotesPage } from '@/hooks/useNotesPage';
import { Presence } from '@/components/ui/presence';
import { useRetainedValue } from '@/hooks/usePresence';
import { CheckCircle2 } from 'lucide-react';

export default function NotesPage() {
  const {
    tree,
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
  } = useNotesPage();
  // Giữ nội dung toast trong lúc chạy exit transition
  const displayedToast = useRetainedValue(toastMessage);

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Unified Navigation Sidebar with embedded notes tree under 'Ghi chú Notion' */}
      <Sidebar
        notesProps={{
          tree,
          favorites,
          trashList,
          activePageId,
          onSelectPage: loadPage,
          onCreateRootPage: handleCreateRootPage,
          onAddSubPage: handleAddSubPage,
          onArchivePage: handleArchivePage,
          onRestorePage: handleRestorePage,
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
      />

      {/* Main Content: Full-width Notion Block Canvas Editor */}
      <main className="flex-1 overflow-hidden py-4 pr-4 pl-2 h-screen flex flex-col min-w-0">
        <NotionBlockEditor
          key={activePage.id}
          page={activePage}
          onUpdateMetadata={handleUpdateMetadata}
          onSaveContent={handleSaveContent}
          onExtractTasksClick={() => setIsExtractModalOpen(true)}
          onDuplicateClick={handleDuplicatePage}
          onDeleteClick={() => handleArchivePage(activePage.id)}
          saveStatus={saveStatus}
        />
      </main>

      {/* Action Funnel Modal */}
      <ExtractTasksModal
        pageId={activePage.id}
        pageTitle={activePage.title}
        blocks={activePage.content || []}
        isOpen={isExtractModalOpen}
        onClose={() => setIsExtractModalOpen(false)}
        onSuccess={(count) =>
          showToast(`⚡ Đã trích xuất ${count} việc to-do thành công sang Action Dashboard!`)
        }
      />

      {/* Floating Action Toast Notification */}
      <Presence
        show={!!toastMessage}
        className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-surface-dark border border-border-dark text-text-primary-dark text-xs font-semibold shadow-warm-lg flex items-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2]" />
        <span>{displayedToast}</span>
      </Presence>
    </div>
  );
}
