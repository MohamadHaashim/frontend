import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker images
import markerImage1 from "../../assets/flags/Marker1.png";
import markerImage2 from "../../assets/flags/Marker2.png";
import markerImage3 from "../../assets/flags/Marker3.png";
import markerImage4 from "../../assets/flags/Marker4.png";

const locations = [
  {
    name: "Marker 1",
    position: [36.7783, 119.4179],
    icon: markerImage1,
    direction: "North",
  },
  {
    name: "Marker 2",
    position: [56.1304, 106.3468],
    icon: markerImage2,
    direction: "West",
  },
  {
    name: "Marker 3",
    position: [23.6345, 102.5528],
    icon: markerImage3,
    direction: "West",
  },
  {
    name: "Marker 4",
    position: [14.235, 51.9253],
    icon: markerImage4,
    direction: "South",
  },
  {
    name: "Marker 2",
    position: [54.526, 15.2551],
    icon: markerImage2,
    direction: "East",
  },
  {
    name: "Marker 2",
    position: [40.4637, 3.7492],
    icon: markerImage2,
    direction: "West",
  },

  // Add more markers as needed
];

const CustomMap = () => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{
        height: "250px",
        width: "100%",
        backgroundcolor: "#fff",
        textDecoration: "none",
        position: "absolute",
        width: " 100%",
        zIndex:"1"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a> contributors'
      />

      {locations.map((location, index) => (
        <Marker
          key={index}
          position={location.position}
          icon={new L.Icon({ iconUrl: location.icon, iconSize: [35, 32] })}
          s
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CustomMap;
