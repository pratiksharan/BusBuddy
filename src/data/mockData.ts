import type { BusStop, BusApproach, Scenario, AppFilters } from '@/types';

export const stops: BusStop[] = [
  { id: 'silk-board', name: 'Silk Board Junction', shortName: 'Silk Board' },
  { id: 'majestic', name: 'Kempegowda Bus Station (Majestic)', shortName: 'Majestic' },
  { id: 'banashankari', name: 'Banashankari Bus Stand', shortName: 'Banashankari' },
  { id: 'jayanagar', name: 'Jayanagar 4th Block', shortName: 'Jayanagar' },
  { id: 'koramangala', name: 'Koramangala Water Tank', shortName: 'Koramangala' },
  { id: 'whitefield', name: 'Whitefield Bus Stop', shortName: 'Whitefield' },
];

export const scenarios: Scenario[] = [
  { id: 'morning-silk', label: 'Morning Peak – Silk Board', stopId: 'silk-board', timeOfDay: 'morning_peak', weather: 'clear', profile: 'solo' },
  { id: 'evening-majestic', label: 'Evening Rush – Majestic', stopId: 'majestic', timeOfDay: 'evening_peak', weather: 'clear', profile: 'solo' },
  { id: 'rain-banashankari', label: 'Light Rain – Banashankari', stopId: 'banashankari', timeOfDay: 'afternoon', weather: 'light_rain', profile: 'student' },
  { id: 'jayanagar-afternoon', label: 'Jayanagar Afternoon', stopId: 'jayanagar', timeOfDay: 'afternoon', weather: 'clear', profile: 'woman' },
];

export function getMockBuses(filters: AppFilters): BusApproach[] {
  const busesMap: Record<string, BusApproach[]> = {
    'silk-board': [
      {
        id: 'r500d-silk-majestic',
        routeNumber: '500D',
        destination: 'Majestic',
        eta: 3,
        crowdLevel: 'moderate',
        boardingChance: 72,
        confidence: 85,
        recommendation: 'board',
        reasons: [
          { label: 'Crowd Level', impact: 'positive', detail: 'Moderate crowd — doors accessible' },
          { label: 'ETA', impact: 'positive', detail: 'Arriving in 3 min — good timing' },
          { label: 'Next Bus', impact: 'neutral', detail: 'Next 500D in 18 min' },
          { label: 'Route Demand', impact: 'negative', detail: 'High demand corridor at peak' },
        ],
        aiExplanation: "This 500D has moderate crowding based on recent passenger flow data. At Silk Board during morning peak, about 70% of buses on this route allow boarding. Given current conditions, you have a strong chance of getting on. The next bus on this route is 18 minutes away, so boarding this one is recommended.",
      },
      {
        id: 'r356-silk-banashankari',
        routeNumber: '356',
        destination: 'Banashankari',
        eta: 7,
        crowdLevel: 'high',
        boardingChance: 35,
        confidence: 78,
        recommendation: 'wait',
        reasons: [
          { label: 'Crowd Level', impact: 'negative', detail: 'High crowd — limited door access' },
          { label: 'Next Bus', impact: 'positive', detail: 'Another 356 in 12 min' },
          { label: 'Weather', impact: 'neutral', detail: 'Clear skies — waiting is comfortable' },
          { label: 'Time Window', impact: 'positive', detail: 'Peak subsiding in 20 min' },
        ],
        aiExplanation: "The approaching 356 is quite crowded from upstream stops. Historical patterns show this route clears up within 15–20 minutes as morning peak subsides. Another 356 follows in 12 minutes and typically has 40% less crowding. Waiting is the smarter play here.",
      },
      {
        id: 'r201r-silk-whitefield',
        routeNumber: '201R',
        destination: 'Whitefield',
        eta: 2,
        crowdLevel: 'packed',
        boardingChance: 12,
        confidence: 92,
        recommendation: 'skip',
        reasons: [
          { label: 'Crowd Level', impact: 'negative', detail: 'Packed — doors barely opening' },
          { label: 'Safety', impact: 'negative', detail: 'Risk of being pushed at doors' },
          { label: 'Alternative', impact: 'positive', detail: 'Volvo 500K in 9 min with seats' },
          { label: 'Confidence', impact: 'positive', detail: '92% confidence in this assessment' },
        ],
        aiExplanation: "This 201R is at maximum capacity. Passenger sensors indicate doors will barely open. With a boarding success rate of only 12%, attempting to board would likely result in wasted effort and potential safety issues. A Volvo 500K with available seats arrives in 9 minutes — strongly recommend skipping this one.",
      },
    ],
    'majestic': [
      {
        id: 'r401-majestic-electroniccity',
        routeNumber: '401',
        destination: 'Electronic City',
        eta: 5,
        crowdLevel: 'high',
        boardingChance: 28,
        confidence: 88,
        recommendation: 'skip',
        reasons: [
          { label: 'Crowd Level', impact: 'negative', detail: 'Packed from Majestic origin rush' },
          { label: 'Queue Length', impact: 'negative', detail: '~40 people waiting ahead' },
          { label: 'Alternative', impact: 'positive', detail: 'BMTC Volvo in 8 min' },
          { label: 'Peak Status', impact: 'negative', detail: 'Evening peak — worst congestion' },
        ],
        aiExplanation: "Majestic during evening peak is notoriously crowded. This 401 has been filling up rapidly. With ~40 commuters queued ahead and high upstream loading, your boarding probability is very low. The BMTC Volvo arriving in 8 minutes is a much better option.",
      },
      {
        id: 'r600v-majestic-koramangala',
        routeNumber: '600V',
        destination: 'Koramangala',
        eta: 8,
        crowdLevel: 'low',
        boardingChance: 91,
        confidence: 82,
        recommendation: 'board',
        reasons: [
          { label: 'Crowd Level', impact: 'positive', detail: 'Low crowd — seats likely available' },
          { label: 'Route Type', impact: 'positive', detail: 'Volvo AC — comfortable ride' },
          { label: 'Frequency', impact: 'neutral', detail: 'Runs every 25 min' },
          { label: 'Distance', impact: 'neutral', detail: '~45 min to destination' },
        ],
        aiExplanation: "This Volvo 600V typically runs with lower occupancy on this route. Evening departure from Majestic to Koramangala sees lighter loads compared to IT corridor routes. High probability of getting a seat. Recommended for a comfortable commute.",
      },
    ],
    'banashankari': [
      {
        id: 'r210-banashankari-jayanagar',
        routeNumber: '210',
        destination: 'Jayanagar',
        eta: 4,
        crowdLevel: 'moderate',
        boardingChance: 65,
        confidence: 75,
        recommendation: 'board',
        reasons: [
          { label: 'Crowd Level', impact: 'neutral', detail: 'Moderate — standing room available' },
          { label: 'Rain Impact', impact: 'negative', detail: 'Light rain increasing demand' },
          { label: 'Short Route', impact: 'positive', detail: 'Only 15 min ride' },
          { label: 'Frequency', impact: 'positive', detail: 'Next bus in 10 min' },
        ],
        aiExplanation: "Light rain at Banashankari is causing a slight uptick in bus demand as auto/walk commuters switch to buses. This 210 has moderate crowding but the short route to Jayanagar means quick turnover. Board if you can — the rain may worsen.",
      },
      {
        id: 'r365e-banashankari-majestic',
        routeNumber: '365E',
        destination: 'Majestic',
        eta: 11,
        crowdLevel: 'low',
        boardingChance: 88,
        confidence: 70,
        recommendation: 'board',
        reasons: [
          { label: 'Crowd Level', impact: 'positive', detail: 'Low — plenty of space' },
          { label: 'ETA', impact: 'neutral', detail: '11 min away — plan ahead' },
          { label: 'Weather', impact: 'negative', detail: 'Rain may increase crowd by arrival' },
          { label: 'Confidence', impact: 'neutral', detail: '70% confidence — conditions changing' },
        ],
        aiExplanation: "This 365E is currently lightly loaded, but note the 70% confidence score. Rain conditions are evolving and may push more commuters to this route by the time it arrives. Currently looks good for boarding, but keep monitoring.",
      },
    ],
    'jayanagar': [
      {
        id: 'r201-jayanagar-silk',
        routeNumber: '201',
        destination: 'Silk Board',
        eta: 6,
        crowdLevel: 'low',
        boardingChance: 85,
        confidence: 80,
        recommendation: 'board',
        reasons: [
          { label: 'Crowd Level', impact: 'positive', detail: 'Light afternoon crowd' },
          { label: 'Time', impact: 'positive', detail: 'Off-peak — relaxed boarding' },
          { label: 'Frequency', impact: 'neutral', detail: 'Runs every 15 min' },
          { label: 'Comfort', impact: 'positive', detail: 'Seats likely available' },
        ],
        aiExplanation: "Jayanagar in the afternoon is a pleasant time to commute. This 201 is lightly loaded with afternoon off-peak patterns. High probability of getting a seat for the ride to Silk Board. No reason to wait — board comfortably.",
      },
      {
        id: 'r500c-jayanagar-whitefield',
        routeNumber: '500C',
        destination: 'Whitefield',
        eta: 14,
        crowdLevel: 'moderate',
        boardingChance: 55,
        confidence: 68,
        recommendation: 'wait',
        reasons: [
          { label: 'ETA', impact: 'negative', detail: '14 min away — long wait' },
          { label: 'Crowd Trend', impact: 'neutral', detail: 'May fill up from Banashankari' },
          { label: 'Alternative', impact: 'positive', detail: 'Metro option nearby' },
          { label: 'Confidence', impact: 'neutral', detail: '68% — uncertain conditions' },
        ],
        aiExplanation: "This 500C is 14 minutes out and may accumulate passengers from Banashankari. The confidence is moderate at 68% — conditions are uncertain. Consider the nearby metro as an alternative, or wait and reassess when the bus is closer.",
      },
    ],
  };

  const defaultBuses = busesMap['silk-board'];
  let buses = busesMap[filters.stopId] || defaultBuses;

  // Adjust based on profile
  if (filters.profile === 'senior' || filters.profile === 'woman') {
    buses = buses.map(b => ({
      ...b,
      boardingChance: Math.max(5, b.boardingChance - 10),
      recommendation: b.boardingChance - 10 < 40 ? (b.recommendation === 'board' ? 'wait' : b.recommendation) : b.recommendation,
    }));
  }

  return buses;
}
