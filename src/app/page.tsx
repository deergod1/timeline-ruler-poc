'use client';

import { useState, useEffect } from 'react';
import { TimelineRuler } from '@/components/TimelineRuler';
import { generateSyntheticTimelineData, TimelineData } from '@/lib/synthetic-data';

export default function Home() {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    // Generate synthetic data on mount
    const data = generateSyntheticTimelineData();
    setTimelineData(data);

    // Set initial current date to a random active entry
    const activeEntries = data.entries.filter(entry => entry.entryCount > 0);
    if (activeEntries.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeEntries.length);
      setCurrentDate(activeEntries[randomIndex].date);
    }
  }, []);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setCurrentDate(date);
    console.log('Navigated to:', date);
    // TODO: Set focus for fisheye magnification effect
  };

  if (!timelineData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Generating timeline data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Main content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Timeline Ruler POC - Step 3</h1>

          <div className="bg-gray-100 p-6 rounded-lg mb-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Focus</h2>
            {currentDate && (
              <div className="text-lg text-gray-700">
                <strong className="text-gray-900">Date:</strong> {new Date(currentDate).toLocaleDateString()}
                <br />
                <strong className="text-gray-900">Entries:</strong> {timelineData.entries.find(e => e.date === currentDate)?.entryCount || 0}
                <br />
                <strong className="text-gray-900">Photos:</strong> {timelineData.entries.find(e => e.date === currentDate)?.photoCount || 0}
              </div>
            )}
          </div>

          <div className="bg-blue-100 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Step 3 Features: Focus-Based Magnification</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
              <li>✅ Vertical timeline with synthetic 2 year data (90% photo frequency)</li>
              <li>✅ Equal-height bars with proportional photo width (right-to-left)</li>
              <li>✅ Click-to-magnify: Click any date to set focus point</li>
              <li>✅ Progressive magnification: 5-day window around focus (1x to 3.5x)</li>
              <li>✅ Fisheye effect: Closer dates get more magnification</li>
              <li>✅ Bottom-to-top distribution: Newest at bottom, oldest at top</li>
              <li>✅ Real-time date display on hover (left of ruler)</li>
              <li>✅ Year markers positioned on compressed timeline</li>
              <li>✅ Focus point indicator in tooltips</li>
              <li>✅ Smooth transitions and animations</li>
              <li>🔄 Ready for Step 4: Advanced interaction (drag navigation, inertia)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline ruler - fixed to right side */}
      <div className="fixed right-0 top-0 bottom-0 w-24 z-10">
        <TimelineRuler
          data={timelineData}
          onDateClick={handleDateClick}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}