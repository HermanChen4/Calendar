import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Repeat, Trash2 } from 'lucide-react';
import { generate24HourSlots } from '../utils/timeUtils';

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
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  location?: string;
  attendees?: string[];
  repeat?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
    occurrences?: number;
  };
}

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  colorOptions?: string[];
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  colorOptions = ['#ea4335', '#fbbc04', '#34a853', '#4285f4', '#9aa0a6', '#ff6d01', '#9c27b0', '#795548']
}) => {
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const timeSlots = generate24HourSlots();

  useEffect(() => {
    if (event) {
      setEditedEvent({ ...event });
    }
  }, [event]);

  if (!isOpen || !editedEvent) return null;

  const handleSave = () => {
    if (editedEvent && editedEvent.title.trim()) {
      onSave(editedEvent);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editedEvent && window.confirm('Are you sure you want to delete this event?')) {
      onDelete(editedEvent.id);
      onClose();
    }
  };

  const updateEvent = (updates: Partial<CalendarEvent>) => {
    setEditedEvent(prev => prev ? { ...prev, ...updates } : null);
  };

  const repeatOptions = [
    { value: 'none', label: 'No repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'S' },
    { value: 1, label: 'Monday', short: 'M' },
    { value: 2, label: 'Tuesday', short: 'T' },
    { value: 3, label: 'Wednesday', short: 'W' },
    { value: 4, label: 'Thursday', short: 'T' },
    { value: 5, label: 'Friday', short: 'F' },
    { value: 6, label: 'Saturday', short: 'S' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editedEvent.id.startsWith('event-') ? 'New Event' : 'Edit Event'}
          </h2>
          <div className="flex items-center gap-1">
            {!editedEvent.id.startsWith('event-') && (
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={editedEvent.title || ''}
              onChange={(e) => updateEvent({ title: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter event title"
              autoFocus
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={editedEvent.date || ''}
                onChange={(e) => updateEvent({ date: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Start
              </label>
              <select
                value={editedEvent.startTime || '9:00 AM'}
                onChange={(e) => updateEvent({ startTime: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {timeSlots.map(slot => (
                  <option key={slot.display} value={slot.display}>{slot.display}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End
              </label>
              <select
                value={editedEvent.endTime || '10:00 AM'}
                onChange={(e) => updateEvent({ endTime: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {timeSlots.map(slot => (
                  <option key={slot.display} value={slot.display}>{slot.display}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex gap-1">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateEvent({ color })}
                  className={`w-6 h-6 rounded-full border-2 ${
                    editedEvent.color === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>

          {showAdvanced && (
            <>
              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editedEvent.description || ''}
                  onChange={(e) => updateEvent({ description: e.target.value })}
                  rows={2}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add a description..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={editedEvent.location || ''}
                  onChange={(e) => updateEvent({ location: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Users className="w-3 h-3 inline mr-1" />
                  Attendees
                </label>
                <input
                  type="text"
                  value={editedEvent.attendees?.join(', ') || ''}
                  onChange={(e) => updateEvent({ 
                    attendees: e.target.value.split(',').map(email => email.trim()).filter(email => email)
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Email addresses, separated by commas"
                />
              </div>

              {/* Repeat Settings */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Repeat className="w-3 h-3 inline mr-1" />
                  Repeat
                </label>
                <select
                  value={editedEvent.repeat?.type || 'none'}
                  onChange={(e) => updateEvent({
                    repeat: {
                      type: e.target.value as any,
                      interval: 1,
                      daysOfWeek: [],
                    }
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {repeatOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                {/* Weekly repeat days */}
                {editedEvent.repeat?.type === 'weekly' && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-700 mb-1">Repeat on</label>
                    <div className="flex gap-1">
                      {daysOfWeek.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => {
                            const currentDays = editedEvent.repeat?.daysOfWeek || [];
                            const newDays = currentDays.includes(day.value)
                              ? currentDays.filter(d => d !== day.value)
                              : [...currentDays, day.value];
                            
                            updateEvent({
                              repeat: {
                                ...editedEvent.repeat!,
                                daysOfWeek: newDays
                              }
                            });
                          }}
                          className={`w-6 h-6 rounded-full text-xs font-medium ${
                            editedEvent.repeat?.daysOfWeek?.includes(day.value)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {day.short}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={editedEvent.canOverlap || false}
                    onChange={(e) => updateEvent({ canOverlap: e.target.checked })}
                    className="mr-2 rounded"
                  />
                  <span className="text-gray-700">Allow overlapping events</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editedEvent.title?.trim()}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;