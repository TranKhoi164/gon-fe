"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserDashboardStats } from "@/types/dashboard.types";
import { PageSummary, PageTreeItem } from "@/types/notes.types";
import { PageTreeNode } from "@/components/features/notes/page-tree-node";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, STORAGE_KEYS } from "@/constants/routes.constants";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  RotateCcw,
  BarChart3,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  LogOut,
  User,
  Flame,
  Award,
  Plus,
  Trash2,
  Star,
  X,
  ChevronRight,
} from "lucide-react";

export interface SidebarNotesProps {
  tree: PageTreeItem[];
  favorites?: PageSummary[];
  trashList?: PageSummary[];
  activePageId?: string;
  onSelectPage?: (id: string) => void;
  onCreateRootPage?: () => void;
  onAddSubPage?: (parentId: string) => void;
  onArchivePage?: (id: string) => void;
  onRestorePage?: (id: string) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export interface SidebarProps {
  userStats?: UserDashboardStats;
  onOpenFastCapture?: () => void;
  className?: string;
  defaultCollapsed?: boolean;
  notesProps?: SidebarNotesProps;
}

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: "Trang chủ Action", href: "/dashboard", icon: LayoutDashboard },
  { label: "Ghi chú Notion", href: "/notes", icon: FileText },
  { label: "Tri thức PARA", href: "/knowledge", icon: FolderTree },
  { label: "Micro-Review", href: "/review", icon: RotateCcw },
  { label: "Quantified Self", href: "/analytics", icon: BarChart3 },
  { label: "Cài đặt", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  userStats,
  onOpenFastCapture = () => {},
  className,
  defaultCollapsed = false,
  notesProps,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const [isNotesTreeOpen, setIsNotesTreeOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gon_notes_tree_open");
      if (saved !== null) return saved === "true";
    }
    return true;
  });

  const toggleNotesTree = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsNotesTreeOpen((prev) => {
      const next = !prev;
      localStorage.setItem("gon_notes_tree_open", String(next));
      return next;
    });
  };

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gon_sidebar_collapsed");
      if (saved !== null) return saved === "true";
    }
    return defaultCollapsed;
  });

  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as "light" | "dark" | null;
      if (saved) return saved;
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeMode);
  }, [themeMode]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("gon_sidebar_collapsed", String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    const next = themeMode === "light" ? "dark" : "light";
    setThemeMode(next);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, next);
  };

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.LANDING);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 rounded-xl bg-surface shadow-warm border-0 p-3 select-none sticky top-4 transition-all duration-200 z-30 shrink-0",
        isCollapsed ? "w-16 items-center" : "w-64",
        className
      )}
    >
      {/* 1. Header / Brand & Collapse Toggle */}
      <div
        className={cn(
          "flex items-center pb-3 border-b border-border-subtle",
          isCollapsed ? "justify-center w-full" : "justify-between"
        )}
      >
        {!isCollapsed ? (
          <Link href={user ? ROUTES.DASHBOARD : ROUTES.LANDING} className="flex items-center gap-2.5 min-w-0 group">
            <div className="h-8 w-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-serif-display font-bold text-lg shadow-warm-xs shrink-0 transition-transform group-hover:scale-105">
              G
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif-display font-bold italic text-base text-text-primary leading-tight">
                Gọn Web
              </span>
              <span className="text-[9px] uppercase tracking-widest text-text-tertiary">
                Personal OS
              </span>
            </div>
          </Link>
        ) : (
          <button
            onClick={toggleCollapse}
            className="h-8 w-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-serif-display font-bold text-lg shadow-warm-xs hover:opacity-90 transition-opacity cursor-pointer"
            title="Mở rộng sidebar"
          >
            G
          </button>
        )}

        {!isCollapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
            title="Thu gọn sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Fast Capture (Ctrl+K) */}
      <div className="my-3 w-full">
        {!isCollapsed ? (
          <button
            type="button"
            onClick={onOpenFastCapture}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-surface-secondary/80 hover:bg-surface-secondary text-xs text-text-secondary hover:text-text-primary shadow-warm-xs transition-all cursor-pointer border-0"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
              <span className="truncate">Tìm kiếm...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface rounded text-text-tertiary shadow-warm-xs shrink-0">
              Ctrl+K
            </kbd>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenFastCapture}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg bg-surface-secondary/80 hover:bg-surface-secondary text-text-secondary hover:text-text-primary shadow-warm-xs transition-all cursor-pointer border-0"
            title="Tìm kiếm & Tạo nhanh (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 space-y-1 w-full overflow-y-auto pr-0.5">
        {!isCollapsed && (
          <p className="px-2.5 pt-1 pb-1.5 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-serif-display">
            Điều Hướng
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const isNotesItem = item.href === "/notes";
          const showNotesTree = isNotesItem && notesProps && isNotesTreeOpen && (isActive || pathname?.startsWith("/notes"));

          if (isCollapsed) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-10 h-10 mx-auto flex items-center justify-center rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-on-primary shadow-warm-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                )}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          }

          return (
            <div key={item.href} className="space-y-1">
              <div
                className={cn(
                  "group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-on-primary font-semibold shadow-warm-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                )}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 min-w-0 flex-1"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>

                {isNotesItem && notesProps && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    {notesProps.onCreateRootPage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isNotesTreeOpen) {
                            setIsNotesTreeOpen(true);
                            localStorage.setItem("gon_notes_tree_open", "true");
                          }
                          notesProps.onCreateRootPage?.();
                        }}
                        className={cn(
                          "p-1 rounded-md transition-colors cursor-pointer",
                          isActive
                            ? "hover:bg-primary-hover text-on-primary"
                            : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
                        )}
                        title="Tạo trang ghi chú mới (+)"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={toggleNotesTree}
                      className={cn(
                        "p-1 rounded-md transition-colors cursor-pointer",
                        isActive
                          ? "hover:bg-primary-hover text-on-primary"
                          : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
                      )}
                      title={isNotesTreeOpen ? "Thu gọn danh sách trang" : "Mở rộng danh sách trang"}
                    >
                      <ChevronRight
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isNotesTreeOpen && "rotate-90"
                        )}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Embedded Notes Hierarchy under 'Ghi chú Notion' */}
              {showNotesTree && (
                <div className="mt-1 mb-2 ml-2 pl-2 border-l border-border-subtle space-y-2">
                  {/* Search bar inside notes */}
                  {notesProps.onSearchChange && (
                    <div className="relative my-1">
                      <Search className="absolute left-2.5 top-2 w-3 h-3 text-text-tertiary" />
                      <input
                        type="text"
                        value={notesProps.searchTerm || ""}
                        onChange={(e) => notesProps.onSearchChange?.(e.target.value)}
                        placeholder="Tìm kiếm trang..."
                        className="w-full pl-7 pr-6 py-1 rounded-md bg-surface-secondary/80 focus:bg-surface text-[11px] text-text-primary placeholder:text-text-tertiary focus:outline-none shadow-warm-xs transition-all"
                      />
                      {notesProps.searchTerm && (
                        <button
                          type="button"
                          onClick={() => notesProps.onSearchChange?.("")}
                          className="absolute right-1.5 top-1.5 p-0.5 text-text-tertiary hover:text-text-primary rounded cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Favorites section */}
                  {notesProps.favorites && notesProps.favorites.length > 0 && !notesProps.searchTerm && (
                    <div className="space-y-0.5 pt-1">
                      <p className="px-2 text-[9px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                        <span>Yêu thích</span>
                      </p>
                      {notesProps.favorites.map((fav) => (
                        <div
                          key={fav.id}
                          onClick={() => notesProps.onSelectPage?.(fav.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs cursor-pointer transition-colors",
                            fav.id === notesProps.activePageId
                              ? "bg-primary-soft text-primary font-bold shadow-warm-xs"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                          )}
                        >
                          <FileText className="w-3 h-3 text-text-tertiary shrink-0 stroke-[1.8]" />
                          <span className="truncate flex-1 text-[11px]">{fav.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Page Tree */}
                  <div className="space-y-0.5 pt-1">
                    <div className="px-2 flex items-center justify-between text-[9px] font-bold text-text-tertiary uppercase tracking-wider">
                      <span>Cây trang ghi chú</span>
                      {notesProps.onCreateRootPage && (
                        <button
                          type="button"
                          onClick={notesProps.onCreateRootPage}
                          className="p-0.5 text-text-tertiary hover:text-primary transition-colors rounded cursor-pointer"
                          title="Thêm trang mới"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {notesProps.tree.length === 0 ? (
                      <div className="p-2 text-center text-[11px] text-text-tertiary italic">
                        Chưa có trang nào
                      </div>
                    ) : (
                      <div className="space-y-0.5 max-h-56 overflow-y-auto pr-0.5">
                        {notesProps.tree.map((node) => (
                          <PageTreeNode
                            key={node.id}
                            item={node}
                            activePageId={notesProps.activePageId || ""}
                            onSelectPage={(id) => notesProps.onSelectPage?.(id)}
                            onAddSubPage={(parentId) => notesProps.onAddSubPage?.(parentId)}
                            onArchivePage={(id) => notesProps.onArchivePage?.(id)}
                            depth={0}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trash Bin */}
                  {notesProps.trashList && (
                    <div className="pt-1 border-t border-border-subtle">
                      <button
                        type="button"
                        onClick={() => setIsTrashOpen(!isTrashOpen)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Trash2 className="w-3 h-3" />
                          <span>Thùng rác</span>
                        </span>
                        <span className="text-[10px] bg-surface-tertiary px-1.5 py-0.2 rounded-full font-semibold">
                          {notesProps.trashList.length}
                        </span>
                      </button>
                      {isTrashOpen && (
                        <div className="mt-1 p-1.5 rounded-lg bg-surface-secondary/70 space-y-1 text-[11px] max-h-32 overflow-y-auto">
                          {notesProps.trashList.length === 0 ? (
                            <p className="text-[10px] text-text-tertiary text-center py-1">Thùng rác trống</p>
                          ) : (
                            notesProps.trashList.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-1 py-0.5 px-1 rounded hover:bg-surface transition-colors">
                                <span className="truncate flex-1 text-text-secondary">{item.title}</span>
                                {notesProps.onRestorePage && (
                                  <button
                                    type="button"
                                    onClick={() => notesProps.onRestorePage?.(item.id)}
                                    className="text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
                                    title="Khôi phục"
                                  >
                                    <RotateCcw className="w-2.5 h-2.5" />
                                    <span>Khôi phục</span>
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 4. Gamified Stats Bar (Streak & Level) */}
      {userStats && (
        <div className="my-2.5 w-full">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-lg bg-surface-secondary/70 shadow-warm-xs space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-accent-gold font-bold">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-accent-gold" />
                  <span>{userStats.streakCount} Ngày</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-text-tertiary font-semibold">
                  <Award className="w-3 h-3 text-primary" />
                  <span>Lv.{userStats.level}</span>
                </div>
              </div>
              <p className="text-[10px] text-text-tertiary truncate">
                {userStats.tierTitle || "Tập sự kỷ luật"}
              </p>
            </div>
          ) : (
            <div
              className="w-10 h-10 mx-auto flex flex-col items-center justify-center rounded-lg bg-surface-secondary/70 shadow-warm-xs text-accent-gold text-[10px] font-bold cursor-default"
              title={`${userStats.streakCount} Ngày Streak • Level ${userStats.level}`}
            >
              <Flame className="w-3.5 h-3.5 text-accent-gold" />
              <span className="leading-none mt-0.5">{userStats.streakCount}d</span>
            </div>
          )}
        </div>
      )}

      {/* 5. Footer: Theme Toggle & User Account */}
      <div className="pt-2 border-t border-border-subtle w-full space-y-1">
        {/* Theme Toggle Button */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all cursor-pointer border-0"
          >
            {themeMode === "light" ? (
              <Sun className="w-3.5 h-3.5 text-accent-gold shrink-0" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
            <span className="truncate">
              {themeMode === "light" ? "Giao diện Sáng" : "Giao diện Tối"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all cursor-pointer border-0"
            title={themeMode === "light" ? "Chuyển sang chế độ Tối" : "Chuyển sang chế độ Sáng"}
          >
            {themeMode === "light" ? (
              <Sun className="w-4 h-4 text-accent-gold" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
        )}

        {/* User Account / Auth Section */}
        {user ? (
          !isCollapsed ? (
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-secondary/50">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1 rounded-md text-text-tertiary hover:text-error hover:bg-error-soft transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center cursor-default"
                title={`Tài khoản: ${user.name}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1 rounded-md text-text-tertiary hover:text-error hover:bg-error-soft transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          )
        ) : (
          !isCollapsed ? (
            <Link
              href={ROUTES.LOGIN}
              className="w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-warm-xs hover:bg-primary-hover transition-colors"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Đăng nhập</span>
            </Link>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg bg-primary text-on-primary shadow-warm-xs hover:bg-primary-hover transition-colors"
              title="Đăng nhập"
            >
              <User className="w-4 h-4" />
            </Link>
          )
        )}

        {/* Collapsed expand button at bottom */}
        {isCollapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="w-10 h-7 mx-auto flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer pt-1"
            title="Mở rộng sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
