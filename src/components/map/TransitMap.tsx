import { useEffect, useState } from 'react';
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { stops } from '@/data/mockData';
import type { BusApproach } from '@/types';

interface TransitMapProps {
  selectedStopId: string;
  buses: BusApproach[];
  selectedBus: BusApproach | null;
}

const stopCoordinates: Record<string, google.maps.LatLngLiteral> = {
  'silk-board': { lat: 12.9176, lng: 77.6238 },
  'majestic': { lat: 12.9784, lng: 77.5713 },
  'banashankari': { lat: 12.9252, lng: 77.5468 },
  'jayanagar': { lat: 12.9293, lng: 77.5838 },
  'koramangala': { lat: 12.9352, lng: 77.6245 },
  'whitefield': { lat: 12.9698, lng: 77.75 },
};

const destinationToStopId: Array<{ match: string; stopId: string }> = [
  { match: 'Majestic', stopId: 'majestic' },
  { match: 'Silk Board', stopId: 'silk-board' },
  { match: 'Banashankari', stopId: 'banashankari' },
  { match: 'Jayanagar', stopId: 'jayanagar' },
  { match: 'Koramangala', stopId: 'koramangala' },
  { match: 'Whitefield', stopId: 'whitefield' },
  { match: 'Electronic City', stopId: 'silk-board' },
];

function getDestinationCoordinate(destination: string): google.maps.LatLngLiteral | null {
  const match = destinationToStopId.find((item) => destination.includes(item.match));
  if (!match) {
    return null;
  }

  return stopCoordinates[match.stopId] ?? null;
}

export function TransitMap({ selectedStopId, buses, selectedBus }: TransitMapProps) {
  const mapsKey =
    import.meta.env.VITE_GOOGLE_PLACES_DIRECTIONS_API_KEY?.trim() ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ||
    '';
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: mapsKey });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [navInfo, setNavInfo] = useState<string>('');

  const sourceCoordinate = stopCoordinates[selectedStopId] ?? stopCoordinates['silk-board'];
  const targetBus = selectedBus ?? buses[0] ?? null;
  const destinationCoordinate = targetBus ? getDestinationCoordinate(targetBus.destination) : null;

  useEffect(() => {
    if (!isLoaded || !targetBus || !destinationCoordinate || !sourceCoordinate || !window.google?.maps) {
      setDirections(null);
      setNavInfo('');
      return;
    }

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: sourceCoordinate,
        destination: destinationCoordinate,
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          const distanceText = leg?.distance?.text;
          const durationText = leg?.duration?.text;
          if (distanceText && durationText) {
            setNavInfo(`${distanceText} • ${durationText}`);
          } else {
            setNavInfo('Route available');
          }
        } else {
          setDirections(null);
          setNavInfo('Transit route unavailable for this destination.');
        }
      },
    );
  }, [destinationCoordinate, isLoaded, sourceCoordinate, targetBus]);

  const fallbackText = !mapsKey
    ? 'Set VITE_GOOGLE_PLACES_DIRECTIONS_API_KEY or VITE_GOOGLE_MAPS_API_KEY in .env.local.'
    : 'Loading map...';

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60">
        <h2 className="text-xs font-semibold font-heading text-foreground uppercase tracking-wider">Live Boarding View</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">Google Maps transit navigation</p>
      </div>
      <div className="relative px-3 py-4 bg-[linear-gradient(165deg,hsl(var(--background)),hsl(var(--secondary)/0.3))]">
        {isLoaded && mapsKey ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '240px', borderRadius: '14px' }}
            center={sourceCoordinate}
            zoom={12}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker position={sourceCoordinate} label="You" title="Selected Stop" />
            {destinationCoordinate && (
              <Marker
                position={destinationCoordinate}
                label={targetBus?.routeNumber ?? 'Bus'}
                title={targetBus?.destination ?? 'Destination'}
              />
            )}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#1d4ed8',
                    strokeWeight: 5,
                    strokeOpacity: 0.82,
                  },
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="h-[240px] rounded-xl border border-border/70 bg-card/70 flex items-center justify-center text-center px-4">
            <p className="text-xs text-muted-foreground">{fallbackText}</p>
          </div>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/85 px-3 py-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Navigation</p>
            <p className="text-xs text-foreground font-medium">
              {targetBus
                ? `${stops.find((stop) => stop.id === selectedStopId)?.shortName ?? 'Stop'} → ${targetBus.destination}`
                : 'Select a bus to view route'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-primary">
            {navInfo || (targetBus ? 'Fetching route...' : 'No route')}
          </span>
        </div>
      </div>
    </div>
  );
}
