// src/types/calendar.ts

export type Priority = 'low' | 'medium' | 'high';
export type ViewType = 'day' | 'week' | 'month';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Task {
  id: string;
  title: string;
  duration: number;
  priority: Priority;
  canOverlap: boolean;
  color: string;
  description?: string;
  scheduled: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  isTask: boolean;
  taskId?: string;
  canOverlap?: boolean;
  priority?: Priority;
  description?: string;
  location?: string;
  attendees?: string[];
  repeat?: RepeatSettings;
}

export interface RepeatSettings {
  type: RepeatType;
  interval: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  endDate?: string;
  occurrences?: number;
}

export interface AutoScheduleRange {
  startDate: string;
  endDate: string;
  timeRange: {
    start: string; // e.g., "9:00 AM"
    end: string;   // e.g., "5:00 PM"
  };
  daysOfWeek: number[]; // Which days to schedule on
}

export interface DragState {
  draggedTask: Task | null;
  draggedEvent: CalendarEvent | null;
  dragOverSlot: { time: string; date: string } | null;
}