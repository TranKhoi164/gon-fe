import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createResizePlugin } from "@schedule-x/resize";

/**
 * Schedule-X v4 không phát hành bản public của plugin drag & drop / resize (npm chỉ có 3.7.3, MIT).
 * Core v4.9 gọi plugin qua interface đã đổi tên:
 *   startTimeGridDrag / startDateGridDrag / startMonthGridDrag   (v3: create*DragHandler)
 * còn resize giữ nguyên tên (createTimeGridEventResizer / createDateGridEventResizer).
 * Bản v3.7.3 đã dùng Temporal và chỉ đụng tới các API nội bộ mà v4 vẫn giữ, nên bọc lại bằng adapter.
 * ⚠️ Khi nâng cấp @schedule-x/calendar cần kiểm tra lại adapter này.
 */
type DragAndDropV3 = ReturnType<typeof createDragAndDropPlugin>;

export function createCalendarPlugins(minutesPerInterval: number) {
  const dragAndDrop = createDragAndDropPlugin(minutesPerInterval);
  const v4DragAndDrop = Object.assign(dragAndDrop, {
    startTimeGridDrag: (...args: Parameters<DragAndDropV3["createTimeGridDragHandler"]>) =>
      dragAndDrop.createTimeGridDragHandler(...args),
    startDateGridDrag: (...args: Parameters<DragAndDropV3["createDateGridDragHandler"]>) =>
      dragAndDrop.createDateGridDragHandler(...args),
    startMonthGridDrag: (...args: Parameters<DragAndDropV3["createMonthGridDragHandler"]>) =>
      dragAndDrop.createMonthGridDragHandler(...args),
  });

  return [v4DragAndDrop, createResizePlugin(minutesPerInterval)];
}
