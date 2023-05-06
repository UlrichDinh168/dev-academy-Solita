import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from "leaflet";

const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = ({ Osoite, Name, currentX, currentY, data }) => {
  return (
    <MapContainer center={[currentY, currentX]} zoom={12} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={greenIcon} position={[currentY, currentX]} >
        <Popup>
          <p>{Name}</p>
          <p>{Osoite}</p>
        </Popup>
      </Marker>
      {/* Use flatMap to filter station that also appear in top 5 */}
      {data && data.length !== 0 ? data.flatMap((position, index) => {
        if (position?.y === currentY && position?.x === currentX) return []
        return (
          <Marker key={index} position={[position.y, position.x]}>
            <Popup>
              <p>{position.name}</p>
              <p>{position.address}</p>
            </Popup>
          </Marker>

        )
      }) :
        (
          <Marker position={[currentY, currentX]}>
            <Popup>
              <p>{Name}</p>
              <p>{Osoite}</p>
            </Popup>
          </Marker>
        )
      }
    </MapContainer>
  )
}

export default Map