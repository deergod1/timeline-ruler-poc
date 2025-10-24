# Timeline Ruler Specification

**Priority:** Pre-MVP (Family Need)
**Problem:** Navigating to specific dates in long journals requires scrolling through dozens of entries
**Target Users:** Contributors and family owners (not elderly viewers)
**Implementation:** Separate route for proof of concept

## Core Requirements

### Visual Timeline
- **Vertical ruler** on right side of journal view
- **Activity density visualization** - thicker lines where more entries exist
- **Date markers** - clickable dates for quick navigation
- **Current position indicator** - shows where user is in timeline
- **Progressive magnification** - logarithmic scaling around focal point
- **Focal point expansion** - detailed view around target date
- **Distance-based compression** - entries further from focus get smaller

### Quick Navigation
- **Click to jump** - click any date to navigate directly there
- **Continuous drag** - drag timeline like scroll bar for fluid exploration
- **Möbius translation** - smooth, hardware-accelerated time navigation
- **Inertia-based motion** - flick timeline to coast and settle on new focus
- **No loading** - jump without fetching intermediate entries
- **Smooth scroll** - animate to target entry after jump
- **Breadcrumb** - show current date in timeline

### Activity Visualization
- **Entry density** - visual thickness indicates entry count per day
- **Photo indicators** - small dots for entries with photos
- **Recent activity** - highlight recent entries with different color
- **Gap detection** - show periods with no entries
- **Logarithmic scaling** - focal point gets maximum detail, distant entries compress
- **Variable elasticity** - timeline stretches and compresses based on focus
- **Logarithmic expansion** - mathematical scaling around focal point
- **Magnification effect** - like camera lens or microscope around target date
- **Progressive disclosure** - nearby dates show more detail than distant ones
- **Focus mode enhancement** - collapse surrounding entries when focusing on target
- **Dynamic LOD** - aggressive aggregation in compression zones (year/month/week/day)
- **Performance optimization** - detailed calculations only on visible, magnified data

## Technical Implementation

### Proof of Concept Route
- **New route**: `/families/[id]/timeline` - separate from main journal
- **Test environment** - doesn't affect existing journal experience
- **Gradual rollout** - can be enabled/disabled per family
- **Fallback** - always have main journal as backup

### Data Requirements
- **Entry count per date** - for density visualization
- **Photo count per entry** - for photo indicators
- **Date range** - first entry to last entry
- **Current position** - which entry is currently visible

### UI Components
- **TimelineRuler** - vertical timeline component
- **DateMarker** - clickable date with density indicator
- **PositionIndicator** - current scroll position marker
- **ActivityBar** - density visualization bar
- **FocalPoint** - magnified area around target date
- **CompressionZone** - compressed entries outside focal area
- **MagnificationLens** - logarithmic scaling component

### Navigation Logic
- **Direct jump** - navigate to specific date without loading intermediate entries
- **Position sync** - update timeline position as user scrolls
- **Smooth animation** - scroll to target entry with animation
- **State management** - track current date and timeline position
- **Focal state persistence** - remember focus point across sessions
- **Context restoration** - return to last viewed date and magnification level

### User Experience
- **Contributors only** - not shown to elderly viewers
- **Optional feature** - can be toggled on/off
- **Progressive enhancement** - main journal still works without it
- **Compact view replacement** - may deprecate current compact toggle

## Success Criteria
- Navigate to September 9th entry in <2 seconds
- Visual timeline shows entry density at a glance
- No loading of intermediate entries during navigation
- Timeline updates as user scrolls through journal
- Works with existing infinite scroll system

## Future Enhancements
- **Zoom levels** - different timeline scales (day/week/month)
- **Search integration** - highlight search results in timeline
- **Bookmarking** - mark important dates in timeline
- **Export** - timeline view for printing
