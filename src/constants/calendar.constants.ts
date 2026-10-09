import { EisenhowerQuadrantEnum } from "@/constants/dashboard.enums";

/** Màu từng ô Eisenhower trên Schedule-X (sinh ra biến CSS --sx-color-<colorName>[-container]) */
export const CALENDAR_QUADRANT_THEME = {
  [EisenhowerQuadrantEnum.GOLD_ZONE]: {
    colorName: "goldZone",
    lightColors: {
      main: "#c8832a",
      container: "#faebd7",
      onContainer: "#6b4312",
    },
    darkColors: {
      main: "#e2a84e",
      container: "#382613",
      onContainer: "#faebd7",
    },
  },
  [EisenhowerQuadrantEnum.DO_FIRST]: {
    colorName: "doFirst",
    lightColors: {
      main: "#b84e46",
      container: "#fae8e6",
      onContainer: "#632520",
    },
    darkColors: {
      main: "#df7068",
      container: "#381a17",
      onContainer: "#fae8e6",
    },
  },
  [EisenhowerQuadrantEnum.DELEGATE]: {
    colorName: "delegate",
    lightColors: {
      main: "#527a5d",
      container: "#eaf2ec",
      onContainer: "#233b2a",
    },
    darkColors: {
      main: "#6ea07c",
      container: "#1a2b1f",
      onContainer: "#eaf2ec",
    },
  },
  [EisenhowerQuadrantEnum.ELIMINATE]: {
    colorName: "eliminate",
    lightColors: {
      main: "#7c7267",
      container: "#f2ede4",
      onContainer: "#3b352f",
    },
    darkColors: {
      main: "#9e9488",
      container: "#28231f",
      onContainer: "#f2ede4",
    },
  },
} as const;

/** Bước thời gian khi kéo thả / kéo giãn sự kiện trên lịch (phút) */
export const CALENDAR_DND_INTERVAL_MINUTES = 15;

export const CALENDAR_EVENT_LABELS = {
  MARK_DONE: "Đánh dấu hoàn thành",
  MARK_TODO: "Bỏ đánh dấu hoàn thành",
} as const;
