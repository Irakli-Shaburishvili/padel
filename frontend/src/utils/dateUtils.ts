export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const d = new Date(time);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatPrice(amount: number, currency = 'GEL'): string {
  return `${amount.toFixed(2)} ${currency}`;
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
}

export function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes = 30
): { start: string; end: string; label: string }[] {
  const slots = [];
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  
  let current = new Date(start);
  
  while (current < end) {
    const slotEnd = new Date(current.getTime() + intervalMinutes * 60000);
    if (slotEnd <= end) {
      const startStr = current.toTimeString().substring(0, 5);
      const endStr = slotEnd.toTimeString().substring(0, 5);
      
      slots.push({
        start: startStr,
        end: endStr,
        label: `${startStr} - ${endStr}`,
      });
    }
    current = slotEnd;
  }
  
  return slots;
}