'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, Clock, AlertCircle, Trash2, GripVertical, ChevronLeft, ChevronRight, Edit2, Zap, X, MapPin, User, Flag } from 'lucide-react';

// Import utilities (in real app these would be from separate files)
import { 
  generate24HourSlots, 
  addMinutesToTime12h, 
  formatDuration, 
  formatDate, 
  formatDateShort 
} from '../utils/timeUtils';

// Import components (in real app these would be from separate files)
import EventDetailModal, { CalendarEvent } from './EventDetailModal';
import AutoScheduleModal, { AutoScheduleRange } from './AutoScheduleModal';

// Types
export interface Task {
  id: string;
  title: string;
  duration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  canOverlap: boolean;
  color: string;
  description?: string;
  location?: string;
  category?: string;
  estimatedEffort?: 'low' | 'medium' | 'high';
  deadline?: string;
  reminderTime?: string;
  notes?: string;
  scheduled: boolean;
}

// Enhanced Task Creation Modal
const TaskCreationModal = ({ isOpen, onClose, onSave, colorOptions }) => {
  const timeSlots = generate24HourSlots();
  const [newTask, setNewTask] = useState({
    title: '',
    duration: 30,
    priority: 'medium',
    canOverlap: false,
    color: '#4285f4',
    description: '',
    location: '',
    category: '',
    estimatedEffort: 'medium',
    deadline: '',
    reminderTime: '15',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newTask.title.trim()) return;
    onSave(newTask);
    // Reset form
    setNewTask({
      title: '',
      duration: 30,
      priority: 'medium',
      canOverlap: false,
      color: '#4285f4',
      description: '',
      location: '',
      category: '',
      estimatedEffort: 'medium',
      deadline: '',
      reminderTime: '15',
      notes: ''
    });
  };

  const categories = [
    'Work', 'Personal', 'Health', 'Learning', 'Meetings', 'Projects', 'Admin', 'Creative'
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600', icon: '🟢' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', icon: '🟡' },
    { value: 'high', label: 'High', color: 'text-orange-600', icon: '🟠' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', icon: '🔴' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-90vh overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({...prev, description: e.target.value}))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a description..."
            />
          </div>

          {/* Duration, Priority, Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={newTask.duration}
                onChange={(e) => setNewTask(prev => ({...prev, duration: parseInt(e.target.value) || 30}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({...prev, priority: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({...prev, category: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location and Effort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={newTask.location}
                onChange={(e) => setNewTask(prev => ({...prev, location: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Where will this task be done?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Effort
              </label>
              <select
                value={newTask.estimatedEffort}
                onChange={(e) => setNewTask(prev => ({...prev, estimatedEffort: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low - Light work</option>
                <option value="medium">Medium - Moderate effort</option>
                <option value="high">High - Intensive work</option>
              </select>
            </div>
          </div>

          {/* Deadline and Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask(prev => ({...prev, deadline: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder (minutes before)
              </label>
              <select
                value={newTask.reminderTime}
                onChange={(e) => setNewTask(prev => ({...prev, reminderTime: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">No reminder</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="1440">1 day</option>
              </select>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setNewTask(prev => ({...prev, color}))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    newTask.color === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newTask.canOverlap}
                onChange={(e) => setNewTask(prev => ({...prev, canOverlap: e.target.checked}))}
                className="mr-3 rounded"
              />
              <span className="text-sm text-gray-700">
                Allow this task to overlap with other events
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={newTask.notes}
              onChange={(e) => setNewTask(prev => ({...prev, notes: e.target.value}))}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes or requirements..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!newTask.title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Calendar Component
const TaskCalendarMVP = () => {
  const scrollContainerRef = useRef(null);
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Design Review Meeting',
      duration: 60,
      priority: 'high',
      canOverlap: false,
      color: '#ea4335',
      description: 'Review new UI designs with the team',
      location: 'Conference Room A',
      category: 'Meetings',
      scheduled: false
    },
    {
      id: 'task-2',
      title: 'Code Review',
      duration: 30,
      priority: 'medium',
      canOverlap: true,
      color: '#4285f4',
      description: 'Review pull requests from team members',
      category: 'Work',
      scheduled: false
    },
    {
      id: 'task-3',
      title: 'Email Processing',
      duration: 45,
      priority: 'low',
      canOverlap: true,
      color: '#34a853',
      description: 'Process and respond to daily emails',
      category: 'Admin',
      scheduled: false
    }
  ]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: 'event-1',
      title: 'Morning Standup',
      startTime: '9:00 AM',
      endTime: '9:30 AM',
      date: '2025-07-02',
      color: '#9aa0a6',
      isTask: false,
      canOverlap: false,
      description: 'Daily team standup meeting'
    }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date('2025-07-02'));
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState<CalendarEvent | null>(null);
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ time: string; date: string } | null>(null);
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);

  const timeSlots = generate24HourSlots();
  const colorOptions = ['#ea4335', '#fbbc04', '#34a853', '#4285f4', '#9aa0a6', '#ff6d01', '#9c27b0', '#795548'];

  // Auto-scroll to 6 AM on component mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const sixAMIndex = timeSlots.findIndex(slot => slot.hour24 === 6);
      const scrollTop = sixAMIndex * 60;
      scrollContainerRef.current.scrollTop = scrollTop;
    }
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-600 bg-red-100';
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getEventHeight = (event: CalendarEvent) => {
    const startSlot = timeSlots.find(slot => slot.display === event.startTime);
    const endSlot = timeSlots.find(slot => slot.display === event.endTime);
    if (!startSlot || !endSlot) return 60;
    const duration = endSlot.sortOrder - startSlot.sortOrder;
    return Math.max((duration / 30) * 60, 60);
  };

  const getEventAtTime = (timeSlot: string) => {
    const targetDate = formatDateShort(currentDate);
    return calendarEvents.find(event => 
      event && event.date === targetDate &&
      event.startTime <= timeSlot && 
      event.endTime > timeSlot
    );
  };

  // Click to add event
  const handleSlotClick = (timeSlot: string) => {
    console.log('Slot clicked:', timeSlot);
    const targetDate = formatDateShort(currentDate);
    const endTime = addMinutesToTime12h(timeSlot, 60);
    
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: 'New Event',
      startTime: timeSlot,
      endTime: endTime,
      date: targetDate,
      color: '#4285f4',
      isTask: false,
      canOverlap: false
    };
    
    console.log('Creating new event:', newEvent);
    setCalendarEvents(prev => [...prev, newEvent]);
    setShowEventDetail(newEvent);
  };

  // Enhanced auto-scheduling
  const findAvailableSlotInRange = (task: Task, scheduleRange: AutoScheduleRange) => {
    const startDate = new Date(scheduleRange.startDate);
    const endDate = new Date(scheduleRange.endDate);
    const taskDurationMinutes = task.duration;
    const slotsNeeded = Math.ceil(taskDurationMinutes / 30);
    
    console.log('Finding slot for task:', task.title, 'Duration:', taskDurationMinutes);
    
    const startTimeSlot = timeSlots.find(slot => slot.display === scheduleRange.timeRange.start);
    const endTimeSlot = timeSlots.find(slot => slot.display === scheduleRange.timeRange.end);
    
    if (!startTimeSlot || !endTimeSlot) return null;
    
    const validTimeSlots = timeSlots.filter(slot => 
      slot.sortOrder >= startTimeSlot.sortOrder && 
      slot.sortOrder <= endTimeSlot.sortOrder - (slotsNeeded * 30)
    );

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (!scheduleRange.daysOfWeek.includes(dayOfWeek)) continue;
      
      const dateStr = formatDateShort(d);
      const dayEvents = calendarEvents.filter(event => event.date === dateStr);
      
      const blockedSlots = new Set<number>();
      dayEvents.forEach(event => {
        if (!task.canOverlap || !event.canOverlap) {
          const eventStartSlot = timeSlots.find(slot => slot.display === event.startTime);
          const eventEndSlot = timeSlots.find(slot => slot.display === event.endTime);
          
          if (eventStartSlot && eventEndSlot) {
            const startIndex = timeSlots.indexOf(eventStartSlot);
            const endIndex = timeSlots.indexOf(eventEndSlot);
            for (let i = startIndex; i < endIndex; i++) {
              blockedSlots.add(i);
            }
          }
        }
      });

      for (let slot of validTimeSlots) {
        const startIndex = timeSlots.indexOf(slot);
        let canFit = true;
        
        for (let j = startIndex; j < startIndex + slotsNeeded && j < timeSlots.length; j++) {
          if (blockedSlots.has(j)) {
            canFit = false;
            break;
          }
        }
        
        if (canFit) {
          const endTime = addMinutesToTime12h(slot.display, taskDurationMinutes);
          console.log('Found available slot:', slot.display, 'to', endTime, 'on', dateStr);
          return { startTime: slot.display, endTime, date: dateStr };
        }
      }
    }
    
    return null;
  };

  const autoScheduleAllTasksInRange = async (scheduleRange: AutoScheduleRange) => {
    console.log('Starting auto-schedule with range:', scheduleRange);
    setIsAutoScheduling(true);
    const unscheduledTasks = tasks.filter(task => !task.scheduled);
    
    const sortedTasks = [...unscheduledTasks].sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    let scheduledCount = 0;
    let newEvents: CalendarEvent[] = [];
    
    for (let task of sortedTasks) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const slot = findAvailableSlotInRange(task, scheduleRange);
      if (slot) {
        const scheduledEvent: CalendarEvent = {
          id: `scheduled-${task.id}-${Date.now()}`,
          title: task.title,
          startTime: slot.startTime,
          endTime: slot.endTime,
          date: slot.date,
          color: task.color,
          isTask: true,
          taskId: task.id,
          canOverlap: task.canOverlap,
          priority: task.priority,
          description: task.description,
          location: task.location
        };
        
        newEvents.push(scheduledEvent);
        scheduledCount++;
      }
    }
    
    if (newEvents.length > 0) {
      setCalendarEvents(prev => [...prev, ...newEvents]);
      setTasks(prev => prev.map(t => {
        const wasScheduled = newEvents.some(event => event.taskId === t.id);
        return wasScheduled ? { ...t, scheduled: true } : t;
      }));
    }
    
    setIsAutoScheduling(false);
    
    if (scheduledCount > 0) {
      alert(`Successfully scheduled ${scheduledCount} task(s)!`);
    } else {
      alert('No available slots found for tasks in the specified range.');
    }
  };

  // Drag and Drop handlers
  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleEventDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ time: timeSlot, date: formatDateShort(currentDate) });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    const targetDate = formatDateShort(currentDate);
    setDragOverSlot(null);
    
    if (draggedTask && !draggedTask.scheduled) {
      const endTime = addMinutesToTime12h(timeSlot, draggedTask.duration);
      const scheduledEvent: CalendarEvent = {
        id: `scheduled-${draggedTask.id}-${Date.now()}`,
        title: draggedTask.title,
        startTime: timeSlot,
        endTime: endTime,
        date: targetDate,
        color: draggedTask.color,
        isTask: true,
        taskId: draggedTask.id,
        canOverlap: draggedTask.canOverlap,
        priority: draggedTask.priority,
        description: draggedTask.description,
        location: draggedTask.location
      };
      
      setCalendarEvents(prev => [...prev, scheduledEvent]);
      setTasks(prev => prev.map(t => 
        t.id === draggedTask.id ? { ...t, scheduled: true } : t
      ));
      setDraggedTask(null);
    } else if (draggedEvent) {
      const duration = getEventDuration(draggedEvent);
      const endTime = addMinutesToTime12h(timeSlot, duration);
      
      setCalendarEvents(prev => prev.map(event => 
        event.id === draggedEvent.id 
          ? { ...event, startTime: timeSlot, endTime, date: targetDate }
          : event
      ));
      setDraggedEvent(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedEvent(null);
    setDragOverSlot(null);
  };

  const getEventDuration = (event: CalendarEvent) => {
    const startSlot = timeSlots.find(slot => slot.display === event.startTime);
    const endSlot = timeSlots.find(slot => slot.display === event.endTime);
    if (!startSlot || !endSlot) return 30;
    return endSlot.sortOrder - startSlot.sortOrder;
  };

  const addNewTask = (taskData: any) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
      scheduled: false
    };
    
    setTasks(prev => [...prev, task]);
    setShowTaskForm(false);
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setCalendarEvents(prev => prev.filter(e => e.taskId !== taskId));
  };

  const removeEvent = (eventId: string) => {
    const event = calendarEvents.find(e => e.id === eventId);
    if (event && event.isTask) {
      setTasks(prev => prev.map(t => 
        t.id === event.taskId ? { ...t, scheduled: false } : t
      ));
    }
    setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-normal text-gray-900">Calendar</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Today
              </button>
              <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-normal text-gray-700 ml-4">{formatDate(currentDate)}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAutoScheduleModal(true)}
              disabled={isAutoScheduling || tasks.filter(t => !t.scheduled).length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAutoScheduling 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              {isAutoScheduling ? 'Scheduling...' : 'Auto Schedule'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Task Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
              <button
                onClick={() => setShowTaskForm(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.scheduled).length}
                </div>
                <div className="text-xs text-gray-600">Scheduled</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {tasks.filter(task => !task.scheduled).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 rounded-lg border border-gray-200 ${getPriorityColor(task.priority)} ${
                    draggedTask?.id === task.id ? 'opacity-50' : 'hover:shadow-md'
                  } transition-all cursor-grab active:cursor-grabbing`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: task.color }}
                        />
                        <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2 ml-7">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(task.duration)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        {task.category && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {task.category}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 ml-7 line-clamp-2">{task.description}</p>
                      )}
                      {task.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 ml-7">
                          <MapPin className="w-3 h-3" />
                          {task.location}
                        </div>
                      )}
                      {task.deadline && (
                        <div className="text-xs text-orange-600 mt-1 ml-7">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {tasks.filter(task => !task.scheduled).length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No unscheduled tasks</p>
                  <p className="text-xs text-gray-400 mt-1">Create a new task to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Main Area */}
        <div className="flex-1 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex border-b bg-white sticky top-0 z-10">
              <div className="w-20 flex-shrink-0 p-4 text-sm font-medium text-gray-500 border-r">
                GMT-05
              </div>
              <div className="flex-1 p-4 text-sm font-medium text-gray-900">
                {formatDate(currentDate)}
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <div className="relative">
                {timeSlots.map((timeSlot) => {
                  const event = getEventAtTime(timeSlot.display);
                  const isEventStart = event && event.startTime === timeSlot.display;
                  const isDragOver = dragOverSlot?.time === timeSlot.display;
                  const isHourMark = timeSlot.display.includes(':00');
                  
                  return (
                    <div 
                      key={timeSlot.display} 
                      className={`relative flex border-r ${isHourMark ? 'border-b border-gray-200' : 'border-b border-gray-100'}`}
                      style={{ height: '60px' }}
                      onDragOver={(e) => handleDragOver(e, timeSlot.display)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, timeSlot.display)}
                      onClick={() => {
                        if (!event) {
                          handleSlotClick(timeSlot.display);
                        }
                      }}
                    >
                      <div className="w-20 flex-shrink-0 p-2 border-r bg-gray-50">
                        {isHourMark && (
                          <div className="text-xs text-gray-600 font-medium">
                            {timeSlot.display}
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex-1 relative cursor-pointer ${
                        isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'hover:bg-gray-50'
                      }`}>
                        {isDragOver && (
                          <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-medium text-sm z-10">
                            Drop here
                          </div>
                        )}
                        
                        {!event && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs opacity-0 hover:opacity-100 transition-opacity">
                            Click to add event
                          </div>
                        )}
                        
                        {isEventStart && (
                          <div 
                            className="absolute left-2 right-2 rounded-lg shadow-sm cursor-move z-20 overflow-hidden"
                            style={{ 
                              backgroundColor: event.color,
                              height: `${getEventHeight(event)}px`,
                              top: '4px'
                            }}
                            draggable
                            onDragStart={(e) => handleEventDragStart(e, event)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEventDetail(event);
                            }}
                          >
                            <div className="p-3 h-full flex flex-col text-white">
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">{event.title}</div>
                                <div className="text-xs opacity-90">
                                  {event.startTime} - {event.endTime}
                                </div>
                                {event.location && (
                                  <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                                    <MapPin className="w-2 h-2" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-end gap-1 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEventDetail(event);
                                  }}
                                  className="text-white hover:text-yellow-200 p-1 opacity-70 hover:opacity-100"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeEvent(event.id);
                                  }}
                                  className="text-white hover:text-red-200 p-1 opacity-70 hover:opacity-100"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskCreationModal
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSave={addNewTask}
        colorOptions={colorOptions}
      />

      {showEventDetail && (
        <EventDetailModal
          event={showEventDetail}
          isOpen={!!showEventDetail}
          onClose={() => setShowEventDetail(null)}
          onSave={(updatedEvent) => {
            setCalendarEvents(prev => prev.map(event => 
              event.id === updatedEvent.id ? updatedEvent : event
            ));
            setShowEventDetail(null);
          }}
          onDelete={removeEvent}
          colorOptions={colorOptions}
        />
      )}

      {showAutoScheduleModal && (
        <AutoScheduleModal
          isOpen={showAutoScheduleModal}
          onClose={() => setShowAutoScheduleModal(false)}
          onSchedule={autoScheduleAllTasksInRange}
          currentDate={currentDate}
        />
      )}

      {/* Instructions */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <h4 className="font-medium text-gray-900 mb-2">Quick Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click empty time slots to add events</li>
          <li>• Click events to view/edit details</li>
          <li>• Drag tasks from sidebar to schedule</li>
          <li>• Use "Auto Schedule" for bulk planning</li>
          <li>• Enhanced task creation with priorities & categories</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskCalendarMVP;