export interface StayEvent {
  startDate: Date;
  endDate: Date;
  summary: string;
  uid: string;
}

export function isStayAvailable(start: Date, end: Date, events: StayEvent[]): boolean {
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return false;
  return !events.some(event => {
    const blocksStay = event.uid.startsWith('manual-') || !/not available/i.test(event.summary);
    return blocksStay && start < event.endDate && end > event.startDate;
  });
}
