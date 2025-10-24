export interface TimelineEntry {
  date: string;
  entryCount: number;
  photoCount: number;
  hasPhotos: boolean;
}

export interface TimelineData {
  entries: TimelineEntry[];
  startDate: string;
  endDate: string;
  totalDays: number;
}

/**
 * Generate synthetic timeline data for 2-3 years
 * Creates realistic patterns: busy periods, quiet periods, photo clusters
 */
export function generateSyntheticTimelineData(): TimelineData {
  const startDate = new Date('2022-01-01');
  const endDate = new Date('2023-12-31'); // Reduced to 2 years for maximum density
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const entries: TimelineEntry[] = [];
  
  // Generate realistic patterns
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Skip some days (weekends less likely, holidays more likely)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = isHolidayPeriod(currentDate);
    
    // Base probability of having entries - high density for viewport compression
    let baseProbability = 0.7; // 70% chance on random days
    if (isWeekend) baseProbability *= 0.9; // Slightly less likely on weekends
    if (isHoliday) baseProbability *= 1.2; // More likely on holidays
    
    // Add some clustering - if yesterday had entries, more likely today will too
    const yesterdayHadEntries = i > 0 && entries[i - 1].entryCount > 0;
    if (yesterdayHadEntries) baseProbability *= 1.3;
    
    const hasEntries = Math.random() < baseProbability;
    
    if (hasEntries) {
      // Entry count (1-5 entries per day)
      const entryCount = Math.floor(Math.random() * 5) + 1;

      // Photo count (1-10 photos per day when present, median ~6)
      // 90% of entries have photos, distributed around higher median
      let photoCount = 0;
      if (Math.random() < 0.9) { // 90% of entries have photos
        // Distribution weighted toward 4-8 photos
        const rand = Math.random();
        if (rand < 0.05) photoCount = 1;
        else if (rand < 0.1) photoCount = 2;
        else if (rand < 0.15) photoCount = 3;
        else if (rand < 0.25) photoCount = 4;
        else if (rand < 0.4) photoCount = 5;
        else if (rand < 0.55) photoCount = 6;
        else if (rand < 0.7) photoCount = 7;
        else if (rand < 0.8) photoCount = 8;
        else if (rand < 0.9) photoCount = 9;
        else photoCount = 10;
      }
      
      entries.push({
        date: dateStr,
        entryCount,
        photoCount,
        hasPhotos: photoCount > 0
      });
    } else {
      entries.push({
        date: dateStr,
        entryCount: 0,
        photoCount: 0,
        hasPhotos: false
      });
    }
  }
  
  return {
    entries,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    totalDays
  };
}

function isHolidayPeriod(date: Date): boolean {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Christmas period
  if (month === 11 && day >= 20) return true;
  if (month === 0 && day <= 5) return true;
  
  // Summer vacation period
  if (month >= 5 && month <= 7) return true;
  
  // Spring break
  if (month === 2 && day >= 15 && day <= 25) return true;
  
  return false;
}
