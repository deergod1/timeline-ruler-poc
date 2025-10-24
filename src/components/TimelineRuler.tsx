'use client';

import { useState } from 'react';
import { TimelineData, TimelineEntry } from '@/lib/synthetic-data';

interface TimelineRulerProps {
  data: TimelineData;
  onDateClick: (date: string) => void;
  currentDate?: string;
}

export function TimelineRuler({ data, onDateClick, currentDate }: TimelineRulerProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [focusDate, setFocusDate] = useState<string | null>(currentDate || null); // Initialize with current date

  // Calculate max entry count for scaling
  const maxEntries = Math.max(...data.entries.map(entry => entry.entryCount));

  // Define recent activity (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  // Check if entry is recent
  const isRecent = (dateStr: string) => dateStr >= thirtyDaysAgoStr;

  // Generate year markers with progressive opacity
  const generateYearMarkers = () => {
    const years = new Set<number>();
    data.entries.forEach(entry => {
      const year = new Date(entry.date).getFullYear();
      years.add(year);
    });

    const sortedYears = Array.from(years).sort((a, b) => b - a); // Newest first
    const currentYear = new Date().getFullYear();

    return sortedYears.map((year, index) => {
      const distanceFromCurrent = Math.abs(year - currentYear);
      const opacity = Math.max(0.3, 1 - (distanceFromCurrent * 0.2)); // Fade with distance
      return { year, opacity, index };
    });
  };

  const yearMarkers = generateYearMarkers();

  // Get active entries only (no gaps for Step 3 magnification)
  const activeEntries = data.entries.filter(entry => entry.entryCount > 0);

  // Sort by date (newest first for bottom-to-top layout)
  const sortedEntries = [...activeEntries].sort((a, b) => b.date.localeCompare(a.date));

  // Calculate magnification based on focus date
  const getMagnificationFactor = (entryDate: string, focusDate: string | null): number => {
    if (!focusDate) return 1;

    const entryTime = new Date(entryDate).getTime();
    const focusTime = new Date(focusDate).getTime();

    // Find entries within 5 days of focus (as per spec)
    const timeDiff = Math.abs(entryTime - focusTime);
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff <= 5) {
      // More realistic magnification: closer = more magnification
      // Target: middle bar should be 75px tall (baseHeight = 8px, so need ~9.375x magnification)
      const maxMagnification = 9.375; // 75px / 8px base height
      return 1 + (5 - daysDiff) * (maxMagnification - 1) / 5; // 1x to 9.375x magnification
    }

    return 1; // No magnification outside 5-day window
  };

  return (
    <div className="relative w-24 bg-gray-50 border-l-2 border-gray-300 h-screen overflow-y-auto shadow-lg">
      {/* Real-time date display on hover - positioned adjacent to timeline */}
      {hoveredDate && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full z-30 pointer-events-none">
          <div className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-medium whitespace-nowrap shadow-lg">
            {new Date(hoveredDate).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: '2-digit'
            })}
          </div>
        </div>
      )}

      {/* Year markers floating to the left */}
      <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10">
        {yearMarkers.map(marker => (
          <div
            key={marker.year}
            className="absolute text-sm font-bold text-gray-700 select-none bg-white px-1 rounded shadow-sm border"
            style={{
              top: `${(marker.index * 80) + 20}px`, // Compressed spacing
              left: '-40px',
              opacity: marker.opacity,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center'
            }}
          >
            {marker.year}
          </div>
        ))}
      </div>

      <div className="p-0.5 space-y-0 pl-4">
        {sortedEntries.map((entry, index) => {
          const magnification = getMagnificationFactor(entry.date, focusDate);
          const isCurrent = currentDate === entry.date;
          const isHovered = hoveredDate === entry.date;
          const entryIsRecent = isRecent(entry.date);

          // Calculate bar dimensions with magnification
          const baseHeight = 8;
          const magnifiedHeight = baseHeight * magnification;

          return (
            <div
              key={`entry-${entry.date}-${index}`}
              className="relative group cursor-pointer transition-all duration-700 ease-in-out"
              style={{
                height: `${magnifiedHeight}px`,
                marginBottom: index < sortedEntries.length - 1 ? '4px' : '0px'
              }}
              onClick={() => {
                setFocusDate(entry.date);
                onDateClick(entry.date);
              }}
              onMouseEnter={() => setHoveredDate(entry.date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {/* Photo bar with magnification */}
              <div className="relative w-16 h-full bg-gray-200 rounded-sm overflow-hidden">
                <div
                  className={`h-full rounded-sm transition-all duration-500 ${
                    focusDate === entry.date
                      ? 'bg-purple-500 shadow-lg ring-2 ring-purple-300'
                      : isCurrent
                      ? 'bg-blue-500'
                      : isHovered
                      ? 'bg-blue-400'
                      : entryIsRecent
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${(entry.photoCount / 10) * 100}%`,
                    marginLeft: 'auto'
                  }}
                />
              </div>

              {/* Date label (show on hover) */}
              {isHovered && (
                <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-20 border border-gray-700">
                  <div className="font-semibold text-lg">{new Date(entry.date).toLocaleDateString()}</div>
                  <div className="text-gray-300">{entry.entryCount} entries</div>
                  {entry.hasPhotos && <div className="text-yellow-300 mt-1">📷 {entry.photoCount} photos</div>}
                  {entryIsRecent && <div className="text-green-300 mt-1">🟢 Recent activity</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
