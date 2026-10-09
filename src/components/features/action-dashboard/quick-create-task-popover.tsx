"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, AlignLeft, Clock, Loader2, Repeat, Tag, X } from "lucide-react";

import { Popover, PopoverAnchor, PopoverContent } from "@/components/shadcn/popover";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { CustomRecurrenceModal } from "./custom-recurrence-modal";
import { Presence } from "@/components/ui/presence";

import { cn } from "@/lib/utils";
import { EisenhowerQuadrant, TaskType } from "@/types/dashboard.types";
import {
  QuickCreateAnchor,
  QuickCreateDraft,
  QuickCreateHandlers,
} from "@/types/calendar-quick-create.types";
import { TaskTypeEnum } from "@/constants/dashboard.enums";
import {
  QUICK_CREATE_LABELS as L,
  QUICK_CREATE_POPOVER_WIDTH,
  QUICK_CREATE_QUADRANT_OPTIONS,
  QUICK_CREATE_RECURRENCE_OPTIONS,
} from "@/constants/calendar-quick-create.constants";
import {
  buildPresetRecurrence,
  formatRecurrenceSummary,
  getRecurrencePreset,
  RecurrencePreset,
} from "@/utils/recurrence";
import { TimePicker } from "@/components/ui/time-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { addMinutesToTime, diffMinutes, draftToTaskDto } from "@/utils/quickCreateTask";

export interface QuickCreateTaskPopoverProps {
  /** false → Radix chạy exit animation; component cha unmount sau khi exit xong */
  open: boolean;
  anchor: QuickCreateAnchor;
  /** id của sự kiện nháp trên lịch — popover neo cạnh ô này (giống Google Calendar) */
  anchorEventId: string;
  initialDraft: QuickCreateDraft;
  onClose: () => void;
  /** Báo draft hiện tại lên lịch để vẽ sự kiện nháp ngay lập tức */
  onPreviewChange: (draft: QuickCreateDraft) => void;
  /** Tạo công việc — chỉ gọi khi người dùng bấm Lưu */
  onCreate: QuickCreateHandlers["onCreate"];
}

export const QuickCreateTaskPopover: React.FC<QuickCreateTaskPopoverProps> = ({
  anchor,
  anchorEventId,
  initialDraft,
  onClose,
  onPreviewChange,
  onCreate,
  open,
}) => {
  const [draft, setDraft] = useState<QuickCreateDraft>(initialDraft);
  const [isCustomRecurrenceOpen, setIsCustomRecurrenceOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Neo popover vào ô sự kiện nháp; nếu ô chưa render (vd. ngoài vùng giờ hiển thị) thì neo vào điểm click
  const pointRef = useRef<HTMLSpanElement>(null);
  const virtualAnchorRef = useRef({
    getBoundingClientRect: (): DOMRect => {
      const eventEl = document.querySelector(`[data-event-id="${anchorEventId}"]`);
      const el = eventEl ?? pointRef.current;
      return el ? el.getBoundingClientRect() : new DOMRect(anchor.x, anchor.y, 0, 0);
    },
  });

  useEffect(() => {
    onPreviewChange(draft);
  }, [draft, onPreviewChange]);

  const canSave = draft.title.trim().length > 0 && !isSaving;

  // Chỉ lưu khi người dùng bấm Lưu; onCreate chờ refetch xong nên task thật hiện ra trước khi gỡ nháp
  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setHasError(false);
    try {
      await onCreate(draftToTaskDto(draft));
      onClose();
    } catch (err) {
      console.error("Quick create task error:", err);
      setHasError(true);
      setIsSaving(false);
    }
  };

  const update = (patch: Partial<QuickCreateDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  // Đổi giờ bắt đầu thì giữ nguyên thời lượng (giống Google Calendar)
  const handleStartTimeChange = (value: string) => {
    if (!value) return;
    const duration = diffMinutes(draft.startTime, draft.endTime) || 60;
    update({ startTime: value, endTime: addMinutesToTime(value, duration) });
  };

  const handleRecurrencePresetChange = (preset: RecurrencePreset) => {
    const config = buildPresetRecurrence(preset, draft.scheduledDate);
    if (config === undefined) {
      setIsCustomRecurrenceOpen(true);
      return;
    }
    update({ recurrence: config });
  };

  // Không đóng popover khi đang thao tác trong modal tùy chỉnh lặp lại
  const preventWhileNested = (e: Event) => {
    if (isCustomRecurrenceOpen) e.preventDefault();
  };

  return (
    <>
      <Popover open={open} onOpenChange={(next) => !next && onClose()}>
        <span
          ref={pointRef}
          aria-hidden
          className="pointer-events-none absolute size-px"
          style={{ left: anchor.x, top: anchor.y }}
        />
        <PopoverAnchor virtualRef={virtualAnchorRef} />

        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          updatePositionStrategy="always"
          collisionPadding={16}
          style={{ width: QUICK_CREATE_POPOVER_WIDTH }}
          className="max-w-[calc(100vw-32px)] p-0 overflow-hidden bg-surface border-border shadow-warm-lg"
          onInteractOutside={preventWhileNested}
          onFocusOutside={preventWhileNested}
          onEscapeKeyDown={preventWhileNested}
        >
          {/* Header: lỗi lưu (nếu có) & nút đóng */}
          <div className="flex items-center justify-between gap-2 pl-4 pr-2 py-1.5 bg-surface-secondary/60">
            <span
              className={cn(
                "flex items-center gap-1.5 text-[11px] text-destructive [&_svg]:size-3.5",
                !hasError && "invisible"
              )}
              aria-live="polite"
            >
              <AlertCircle />
              {L.STATUS_ERROR}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label={L.CLOSE}>
              <X />
            </Button>
          </div>

          <div className="px-4 pt-2 pb-3 space-y-3">
            <Input
              autoFocus
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSave();
                }
              }}
              placeholder={L.TITLE_PLACEHOLDER}
              className="h-10 px-0 text-lg font-serif-display font-semibold border-0 border-b-2 border-primary/30 rounded-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:border-primary"
            />

            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={draft.type}
              onValueChange={(value) => value && update({ type: value as TaskType })}
            >
              <ToggleGroupItem value={TaskTypeEnum.EISENHOWER} className="px-3 text-xs">
                {L.TYPE_EISENHOWER}
              </ToggleGroupItem>
              <ToggleGroupItem value={TaskTypeEnum.BATCHING} className="px-3 text-xs">
                {L.TYPE_BATCHING}
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Ngày & giờ */}
            <div className="flex items-start gap-3">
              <Clock className="size-4 mt-2 shrink-0 text-muted-foreground" />
              <div className="flex flex-wrap items-center gap-1.5">
                <DatePicker
                  value={draft.scheduledDate}
                  onChange={(v) => update({ scheduledDate: v })}
                  showIcon={false}
                />
                <Presence show={!draft.isAllDay} variant="pop" as="span" className="flex items-center gap-1.5">
                  <TimePicker value={draft.startTime} onChange={handleStartTimeChange} />
                  <span className="text-xs text-muted-foreground">–</span>
                  <TimePicker
                    value={draft.endTime}
                    onChange={(v) => update({ endTime: v })}
                    durationFrom={draft.startTime}
                  />
                </Presence>
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer select-none ml-1">
                  <Checkbox
                    checked={draft.isAllDay}
                    onCheckedChange={(checked) => update({ isAllDay: checked === true })}
                  />
                  {L.ALL_DAY}
                </label>
              </div>
            </div>

            {/* Lặp lại */}
            <div className="flex items-center gap-3">
              <Repeat className="size-4 shrink-0 text-muted-foreground" />
              <Select
                value={getRecurrencePreset(draft.recurrence)}
                onValueChange={(value) => handleRecurrencePresetChange(value as RecurrencePreset)}
              >
                <SelectTrigger size="sm" className="flex-1 min-w-0 text-xs">
                  <SelectValue placeholder={L.RECURRENCE_PLACEHOLDER}>
                    {draft.recurrence ? formatRecurrenceSummary(draft.recurrence) : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {QUICK_CREATE_RECURRENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Presence show={!!draft.recurrence} variant="pop" as="span">
                <Button
                  variant="link"
                  size="xs"
                  className="px-0"
                  onClick={() => setIsCustomRecurrenceOpen(true)}
                >
                  {L.EDIT_RULE}
                </Button>
              </Presence>
            </div>

            {/* Mức ưu tiên Eisenhower */}
            <Presence show={draft.type === TaskTypeEnum.EISENHOWER} variant="collapse" className="flex items-center gap-3">
                <Tag className="size-4 shrink-0 text-muted-foreground" aria-label={L.QUADRANT} />
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  value={draft.quadrant}
                  onValueChange={(value) => value && update({ quadrant: value as EisenhowerQuadrant })}
                  className="flex-wrap"
                >
                  {QUICK_CREATE_QUADRANT_OPTIONS.map((opt) => (
                    <ToggleGroupItem
                      key={opt.key}
                      value={opt.key}
                      title={opt.hint}
                      className="px-2 text-[11px] gap-1.5"
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: opt.color }} />
                      {opt.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
            </Presence>

            {/* Mô tả */}
            <div className="flex items-start gap-3">
              <AlignLeft className="size-4 mt-2 shrink-0 text-muted-foreground" />
              <Textarea
                value={draft.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder={L.DESCRIPTION_PLACEHOLDER}
                className="min-h-16 text-xs resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={onClose}>
              {L.CANCEL}
            </Button>
            <Button size="sm" onClick={() => void handleSave()} disabled={!canSave}>
              {isSaving && <Loader2 className="animate-spin" />}
              {isSaving ? L.STATUS_SAVING : L.SAVE}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Modal tùy chỉnh lặp lại được portal ra body để nằm trên popover */}
      {createPortal(
          <CustomRecurrenceModal
            isOpen={isCustomRecurrenceOpen}
            onClose={() => setIsCustomRecurrenceOpen(false)}
            onApply={(config) => update({ recurrence: config })}
            initialConfig={draft.recurrence}
            baseDate={draft.scheduledDate}
          />,
          document.body
        )}
    </>
  );
};
