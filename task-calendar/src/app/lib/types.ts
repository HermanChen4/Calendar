export interface Task {
  id: string
  title: string
  duration: number
  priority: 'low' | 'medium' | 'high'
  can_overlap: boolean
  color: string
  description?: string
  scheduled: boolean
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  event_date: string
  color: string
  is_task: boolean
  task_id?: string
  can_overlap?: boolean
  priority?: 'low' | 'medium' | 'high'
  created_at?: string
  user_id?: string
}