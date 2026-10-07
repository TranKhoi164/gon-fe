export const API_ENDPOINTS = {
  // User & Gamification Dashboard Stats
  USER_DASHBOARD_STATS: "/users/me/dashboard-stats",
  USER_CHECKIN: "/users/me/checkin",
  USER_XP_HISTORY: "/users/me/xp-history",
  
  // Goal Funnel (MAZE AIM)
  GOALS_FUNNEL: "/goals/funnel",
  GOALS: "/goals",
  GOAL_BY_ID: (id: string) => `/goals/${id}`,

  // Eisenhower Matrix & Tasks
  TASKS_EISENHOWER: "/tasks/eisenhower",
  TASKS_CALENDAR: "/tasks/calendar",
  TASKS: "/tasks",
  TASK_STATUS: (id: string) => `/tasks/${id}/status`,
  TASK_SCHEDULE: (id: string) => `/tasks/${id}/schedule`,
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  TASK_OCCURRENCE_STATUS: (id: string, date: string) => `/tasks/${id}/occurrences/${date}/status`,
  TASK_OCCURRENCE_OVERRIDE: (id: string, date: string) => `/tasks/${id}/occurrences/${date}`,
  TASK_OCCURRENCE_CANCEL: (id: string, date: string) => `/tasks/${id}/occurrences/${date}`,

  // Daily Habits
  HABITS_TODAY: "/habits/today",
  HABITS: "/habits",
  HABIT_TOGGLE: (id: string) => `/habits/${id}/toggle`,

  // Batching Bucket (Việc vặt gom cụm)
  BATCHING_TASKS: "/tasks/batching",
  BATCHING_COMPLETE_SESSION: "/tasks/batching/complete-session",

  // Rewards & XP Engine
  REWARDS_PENDING: "/rewards/pending",
  REWARD_CLAIM: (id: string) => `/rewards/${id}/claim`,
  XP_RULES: "/xp-rules",

  // Pages & Notion Notes
  PAGES_TREE: "/pages/tree",
  PAGES_FAVORITES: "/pages/favorites",
  PAGES_TRASH: "/pages/trash",
  PAGES_SEARCH: "/pages/search",
  PAGES: "/pages",
  PAGE_BY_ID: (id: string) => `/pages/${id}`,
  PAGE_BREADCRUMBS: (id: string) => `/pages/${id}/breadcrumbs`,
  PAGE_CONTENT: (id: string) => `/pages/${id}/content`,
  PAGE_MOVE: (id: string) => `/pages/${id}/move`,
  PAGE_DUPLICATE: (id: string) => `/pages/${id}/duplicate`,
  PAGE_EXTRACT_TASKS: (id: string) => `/pages/${id}/extract-tasks`,
  PAGE_RESTORE: (id: string) => `/pages/${id}/restore`,
  PAGE_PERMANENT: (id: string) => `/pages/${id}/permanent`,
} as const;
