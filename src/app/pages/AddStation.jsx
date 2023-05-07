import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Searchbar from '../components/Searchbar/Searchbar';
import Button from '../components/shared/Button'
import Input from '../components/shared/Input'

import { instance } from '../constant';
import Notification from '../components/shared/Notification'
import PuffLoader from 'react-spinners/PuffLoader'

const center = {
  lat: 60.170,
  lng: 24.939
}

const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AddStation = () => {
  const markerRef = useRef(null)

  const [position, setPosition] = useState(center)
  const [isLoading, setLoading] = useState(false)
  const [alert, setAlert] = useState(false)
  const [formSubmit, setFormSubmit] = useState({
    'FID': '',
    'ID': '',
    'Nimi': "",
    'Namn': " ",
    'Name': "",
    'Osoite': "",
    'Adress': "",
    'Kaupunki': "",
    'Stad': "",
    'Operaattor': " ",
    'Kapasiteet': '',
    'x': '',
    'y': '',
  })

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        setPosition(marker.getLatLng())

        name(marker.getLatLng())

        setFormSubmit(prev => ({ ...prev, x: marker.getLatLng()?.lng, y: marker.getLatLng()?.lat }))
      }
    },
  }), [])

  const name = async (position) => {
    const resp = await instance.post('/api/address-lookup', {
      data: position
    })

    const { coordinates: [x, y], label, region } = resp?.data?.data
    const randomNum = Math.floor(Math.random() * 37) + 8;

    setFormSubmit(prev => ({
      ...prev,
      Nimi: label, Name: label, Namn: label, Osoite: label, Adress: label, Kaupunki: region, Stad: region, Operaattor: 'CityBike Finland', Kapasiteet: randomNum, x, y
    }))
  }


  const onSetFormValues = (result) => {
    const { coordinates: [x, y], label, region } = result
    const randomNum = Math.floor(Math.random() * 37) + 8;


    setPosition({ lat: y, lng: x })
    setFormSubmit({ Nimi: label, Name: label, Namn: label, Osoite: label, Adress: label, Kaupunki: region, Stad: region, Operaattor: 'CityBike Finland', Kapasiteet: randomNum, x, y })
  }

  const onStationCreate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      const resp = await instance.post('/api/add-station', {
        data: formSubmit
      })
      // set notification when create journey successfully
      setAlert({ isOpen: true, severity: 'success', message: resp?.data.message })
    } catch (error) {
      console.log(error, 'error');
      // set notification when create journey fail
      setAlert({ isOpen: true, severity: 'error', message: error?.response.data })
    } finally {
      setLoading(false);
    }
  }


  const handleChange = async (e) => {
    const { value, name } = e.target;
    setFormSubmit(prev => ({ ...prev, [name]: value }))
  };

  const isDisabled = Object.values(formSubmit).every(value => value !== '')
  return (
    <div className='add-station'>
      <div className="wrapper-left">
        <h2 style={{ textAlign: 'center', margin: ' 2rem 0' }}>Add Station</h2>
        <div className="search-area">
          <Searchbar
            placeholder='Dept. station name'
            isOrigin={true}
            onSetFormValues={onSetFormValues}
            formSubmit={formSubmit}
          />
        </div>
        <div className="info">
          <Input
            id='1'
            label='Name'
            name='Name'
            onChange={handleChange}
            value={formSubmit?.['Name']} />
          <Input
            id='1'
            label='Address'
            onChange={handleChange}
            name='Adress'
            value={formSubmit?.['Adress']} />
          <Input
            id='1'
            label='latitude'
            onChange={handleChange}
            name='x'
            value={formSubmit?.['x']} />
          <Input
            id='1'
            label='longitude'
            onChange={handleChange}
            name='y'
            value={formSubmit?.['x']} />

          <Button text='Add Station' disabled={!isDisabled} onClick={onStationCreate} />
          {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', }}><PuffLoader /></div> : null}

        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={center} zoom={11} scrollWheelZoom={true} >
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright">'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Dragable pointer to let user select different location */}
          <Marker icon={greenIcon} position={position} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>
            <Popup >
              <p>{formSubmit['Name']}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <Notification alert={alert} />
    </div>
  )
}

export default AddStation