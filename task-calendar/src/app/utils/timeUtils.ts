// src/utils/timeUtils.ts

export interface TimeSlot {
  display: string;
  value: string;
  hour24: number;
  sortOrder: number;
}

// Generate 24-hour time slots in 12-hour format
export const generate24HourSlots = (): TimeSlot[] => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const timeString = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      slots.push({ 
        display: timeString, 
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        hour24: hour,
        sortOrder: hour * 60 + minute
      });
    }
  }
  return slots;
};

export const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM' && hours !== '00') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  return `${hours.padStart(2, '0')}:${minutes}`;
};

export const convertTo12Hour = (time24h: string): string => {
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours, 10);
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${ampm}`;
};

export const addMinutesToTime12h = (time12h: string, minutes: number): string => {
  const time24h = convertTo24Hour(time12h);
  const [hours, mins] = time24h.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  const newTime24h = `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  return convertTo12Hour(newTime24h);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  return `${mins}m`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getWeekDates = (date: Date): Date[] => {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  return week;
};

export const getMonthDates = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);
  
  // Adjust to start on Sunday
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  const dates = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};