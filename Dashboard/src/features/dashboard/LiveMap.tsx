import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon in react-leaflet
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// A dummy list of driver locations around a central point (Airport)
const driverLocations = [
  { id: 1, lat: 24.726214, lng: 46.626772, name: 'Ahmed', status: 'Available' },
  { id: 2, lat: 24.717140, lng: 46.611107, name: 'Mohammed', status: 'On Trip' },
  { id: 3, lat: 24.733596, lng: 46.643209, name: 'Ali', status: 'Available' },
  { id: 4, lat: 24.711848, lng: 46.634626, name: 'Omar', status: 'On Trip' },
  { id: 5, lat: 24.743120, lng: 46.617889, name: 'Khaled', status: 'Available' },
];

export const LiveMap: React.FC = () => {
  // Center map on Riyadh as an example airport location
  const centerPosition: [number, number] = [24.7136, 46.6753];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Real-time Operations Map</h2>
        <p className="text-sm text-slate-500">Live locations of active drivers and active trips</p>
      </div>
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200">
        <MapContainer center={centerPosition} zoom={11} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {driverLocations.map((driver) => (
            <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={customIcon}>
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-slate-800">{driver.name}</p>
                  <p className="text-xs text-slate-500">
                    Status: <span className={driver.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}>{driver.status}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
