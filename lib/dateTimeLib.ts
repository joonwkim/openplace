export function getDayDiff(startDate: Date, endDate: Date): number {

  const msInDay = 24 * 60 * 60 * 1000;
  return Math.round(
    Math.abs(Number(endDate) - Number(startDate)) / msInDay
  );
}
export function getHourDiff(startDate: Date, endDate: Date): number {
  const msInHour = 60 * 60 * 1000;
  return Math.round(
    Math.abs(Number(endDate) - Number(startDate)) / msInHour
  );
}
export function getMinsDiff(startDate: Date, endDate: Date): number {
  const msInMin = 60 * 1000;
  return Math.round(
    Math.abs(Number(endDate) - Number(startDate)) / msInMin
  );
}

export function getDaysFromToday(date: Date): number {
  const now = new Date();
  return getDayDiff(now, date);
}
export function getHoursFromToday(date: Date): number {
  const now = new Date();
  return getHourDiff(now, date);
}
export function getMinsFromToday(date: Date): number {
  const now = new Date();
  return getMinsDiff(now, date);
}
