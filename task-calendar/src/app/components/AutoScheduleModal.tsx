import React, { useState } from 'react';
import { X, Calendar, Clock, Zap } from 'lucide-react';
import { generate24HourSlots } from '../utils/timeUtils';

export interface AutoScheduleRange {
  startDate: string;
  endDate: string;
  timeRange: {
    start: string;
    end: string;
  };
  daysOfWeek: number[];
}

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (range: AutoScheduleRange) => void;
  currentDate: Date;
}

const AutoScheduleModal: React.FC<AutoScheduleModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  currentDate
}) => {
  const timeSlots = generate24HourSlots();
  const [scheduleRange, setScheduleRange] = useState<AutoScheduleRange>({
    startDate: currentDate.toISOString().split('T')[0],
    endDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeRange: { start: '9:00 AM', end: '5:00 PM' },
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' }
  ];

  const quickPresets = [
    {
      name: 'This Week',
      range: {
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timeRange: { start: '9:00 AM', end: '5:00 PM' },
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    },
    {
      name: 'Next 2 Weeks',
      range: {
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timeRange: { start: '9:00 AM', end: '5:00 PM' },
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    },
    {
      name: 'This Month',
      range: {
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
        timeRange: { start: '8:00 AM', end: '6:00 PM' },
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState(0);

  if (!isOpen) return null;

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    if (index < quickPresets.length) {
      setScheduleRange(quickPresets[index].range);
    }
  };

  const handleDayToggle = (dayValue: number) => {
    const newDays = scheduleRange.daysOfWeek.includes(dayValue)
      ? scheduleRange.daysOfWeek.filter(d => d !== dayValue)
      : [...scheduleRange.daysOfWeek, dayValue].sort();
    
    setScheduleRange(prev => ({ ...prev, daysOfWeek: newDays }));
  };

  const handleSchedule = () => {
    if (scheduleRange.daysOfWeek.length === 0) {
      alert('Please select at least one day of the week.');
      return;
    }
    onSchedule(scheduleRange);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Auto Schedule
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickPresets.map((preset, index) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(index)}
                  className={`p-2 text-xs text-center border rounded-lg transition-colors ${
                    selectedPreset === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={scheduleRange.startDate}
                onChange={(e) => setScheduleRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={scheduleRange.endDate}
                onChange={(e) => setScheduleRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Start Time
              </label>
              <select
                value={scheduleRange.timeRange.start}
                onChange={(e) => setScheduleRange(prev => ({
                  ...prev,
                  timeRange: { ...prev.timeRange, start: e.target.value }
                }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {timeSlots.map(slot => (
                  <option key={slot.display} value={slot.display}>{slot.display}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Time
              </label>
              <select
                value={scheduleRange.timeRange.end}
                onChange={(e) => setScheduleRange(prev => ({
                  ...prev,
                  timeRange: { ...prev.timeRange, end: e.target.value }
                }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {timeSlots.map(slot => (
                  <option key={slot.display} value={slot.display}>{slot.display}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Schedule Days
            </label>
            <div className="flex gap-1">
              {daysOfWeek.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`flex-1 py-1 px-1 rounded text-xs font-medium transition-colors ${
                    scheduleRange.daysOfWeek.includes(day.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-800 space-y-1">
              <p>
                <strong>Dates:</strong> {scheduleRange.startDate} to {scheduleRange.endDate}
              </p>
              <p>
                <strong>Time:</strong> {scheduleRange.timeRange.start} - {scheduleRange.timeRange.end}
              </p>
              <p>
                <strong>Days:</strong> {
                  scheduleRange.daysOfWeek.length === 7 
                    ? 'All days'
                    : scheduleRange.daysOfWeek.map(d => daysOfWeek[d].short).join(', ')
                }
              </p>
            </div>
          </div>
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
            onClick={handleSchedule}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoScheduleModal;