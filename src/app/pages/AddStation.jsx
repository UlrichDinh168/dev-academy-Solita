import React, { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Searchbar from '../components/Searchbar/Searchbar';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';

import { instance } from '../constant';
import Notification from '../components/shared/Notification';
import PuffLoader from 'react-spinners/PuffLoader';
import L from 'leaflet';

const center = {
  lat: 60.17,
  lng: 24.939,
};

const greenIcon = new L.Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AddStation = () => {
  const markerRef = useRef(null);

  const [position, setPosition] = useState(center);
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [formSubmit, setFormSubmit] = useState({
    FID: '',
    ID: '',
    Nimi: '',
    Namn: ' ',
    Name: '',
    Osoite: '',
    Adress: '',
    Kaupunki: '',
    Stad: '',
    Operaattor: ' ',
    Kapasiteet: '',
    latitude: '',
    longitude: '',
  });

  // Using useMemo to memoize their references, prevent re-rendering.
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());

          geoSearch(marker.getLatLng());

          setFormSubmit((prev) => ({
            ...prev,
            latitude: marker.getLatLng()?.lng,
            longitude: marker.getLatLng()?.lat,
          }));
        }
      },
    }),
    []
  );

  // Auto search for the station name and locations base on Marker's movement.
  const geoSearch = async (position) => {
    const resp = await instance.post('/api/address-lookup', {
      data: position,
    });

    const {
      coordinates: [latitude, longitude],
      label,
      region,
      Name,
    } = resp.data.data;
    const randomNum = Math.floor(Math.random() * 37) + 8;

    setFormSubmit((prev) => ({
      ...prev,
      Nimi: label,
      Name: label,
      Namn: label,
      Osoite: Name,
      Adress: Name,
      Kaupunki: region,
      Stad: region,
      Operaattor: 'CityBike Finland',
      Kapasiteet: randomNum,
      latitude,
      longitude,
    }));
  };

  const onSetFormValues = (result) => {
    const {
      coordinates: [latitude, longitude],
      label,
      region,
      Name,
      postalcode,
    } = result;
    const randomNum = Math.floor(Math.random() * 37) + 8;
    const address = `${Name}, ${postalcode}`;

    setPosition({ lat: longitude, lng: latitude });
    setFormSubmit({
      Nimi: label,
      Name: label,
      Namn: label,
      Osoite: address,
      Adress: address,
      Kaupunki: region,
      Stad: region,
      Operaattor: 'CityBike Finland',
      Kapasiteet: randomNum,
      latitude,
      longitude,
    });
  };

  const onStationCreate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const resp = await instance.post('/api/station/add', {
        data: formSubmit,
      });
      // set notification when create journey successfully
      setAlert({
        isOpen: true,
        severity: 'success',
        message: resp?.data.message,
      });
    } catch (error) {
      console.log(error, 'error');
      // set notification when create journey fail
      setAlert({
        isOpen: true,
        severity: 'error',
        message: error?.response.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setFormSubmit((prev) => ({ ...prev, [name]: value }));
  };

  const isDisabled = Object.values(formSubmit).every((value) => value !== '');

  return (
    <div className='add-station'>
      <div className='wrapper-left'>
        <h2 style={{ textAlign: 'center', margin: ' 2rem 0' }}>Add Station</h2>
        <div className='search-area'>
          <Searchbar isOrigin={true} onSetFormValues={onSetFormValues} formSubmit={formSubmit} />
        </div>
        <div className='info'>
          <Input
            id='1'
            label='Address'
            onChange={handleChange}
            name='Adress'
            value={formSubmit?.['Adress']}
          />
          <Input
            id='1'
            label='Latitude'
            onChange={handleChange}
            name='latitude'
            type='number'
            value={formSubmit?.['latitude']}
          />
          <Input
            id='1'
            label='Longitude'
            onChange={handleChange}
            type='number'
            name='longitude'
            value={formSubmit?.['longitude']}
          />

          <Button text='Add Station' disabled={!isDisabled} onClick={onStationCreate} />
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <PuffLoader />
            </div>
          ) : null}
        </div>
      </div>

      <div className='map-container'>
        <MapContainer center={center} zoom={11} scrollWheelZoom={true}>
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright">'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {/* Dragable pointer to let user select different location */}
          <Marker
            icon={greenIcon}
            position={position}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
          >
            <Popup>
              <p>{formSubmit['Name']}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <Notification alert={alert} />
    </div>
  );
};

export default AddStation;
