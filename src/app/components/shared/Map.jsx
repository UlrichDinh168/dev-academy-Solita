import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from "leaflet";

const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = ({ Osoite, Name, currentX, currentY, data }) => {
  return (
    <MapContainer center={[currentY, currentX]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <MarkerClusterGroup> */}
      <Marker icon={greenIcon} position={[currentY, currentX]} >
        <Popup>
          <p>{Name}</p>
          <p>{Osoite}</p>
        </Popup>
      </Marker>
      {data && data.length !== 0 ? data.map((position) => (
        <Marker position={[position.y, position.x]}>
          <Popup>
            <p>{position.name}</p>
            <p>{position.address}</p>
          </Popup>
        </Marker>

      )) :
        (
          <Marker position={[currentY, currentX]}>
            <Popup>
              <p>{Name}</p>
              <p>{Osoite}</p>
            </Popup>
          </Marker>
        )
      }
      {/* </MarkerClusterGroup> */}

    </MapContainer>
  )
}

export default Map