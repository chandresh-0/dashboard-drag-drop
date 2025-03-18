import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]} // Default coordinates (London)
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      {/* Tile Layer (OpenStreetMap) */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker */}
      <Marker position={[51.505, -0.09]}>
        <Popup>A simple popup on the marker.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
