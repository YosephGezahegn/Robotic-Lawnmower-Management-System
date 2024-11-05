import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Map: React.FC = () => {
  const location = useSelector(
    (state: RootState) => state.mower.currentLocation
  );

  // Check if location is defined before rendering the map
  if (!location) {
    return <div>Loading map...</div>; // or a placeholder component
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      className="h-full min-h-[300px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]} icon={defaultIcon}>
        <Popup>
          Robotic Lawnmower
          <br />
          Current Location
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
