import axios from 'axios';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Searchbar from '../components/Searchbar/Searchbar';
import Button from '../components/shared/Button'
import Input from '../components/shared/Input'
import { instance } from '../constant';
import Notification from '../components/shared/Notification'
import PuffLoader from 'react-spinners/PuffLoader'

const AddStation = () => {
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
        setFormSubmit(prev => ({ ...prev, x: marker.getLatLng()?.lng, y: marker.getLatLng()?.lat }))
      }
    },
  }), [])

  const onSetFormValues =
    async (result) => {
      console.log(result, 'result');
      const { coordinates: [x, y], label, region, Name, postalcode } = result
      const randomNum = Math.floor(Math.random() * 37) + 8;

      const array = Name.split(',')
      const newAddress = `${array[1]},${array[2]},${postalcode}`


      setPosition({ lat: y, lng: x })
      setFormSubmit({ Nimi: label, Name: label, Namn: label, Osoite: newAddress, Adress: newAddress, Kaupunki: region, Stad: region, Operaattor: 'CityBike Finland', Kapasiteet: randomNum, x, y })
    }


  const onStationCreate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      const resp = await instance.post('/api/add-station', {
        data: formSubmit
      })

      setAlert({ isOpen: true, severity: 'success', message: resp?.data.message })
      console.log(resp, 'resp');
    } catch (error) {
      console.log(error, 'error');
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
  console.log(formSubmit, 'formsubmit');
  console.log(alert, 'alert');
  return (
    <div className='add-station'>
      <div className="wrapper-left">
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
          <Button text='Add Journey' disabled={!isDisabled} onClick={onStationCreate} />
          {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', }}><PuffLoader /></div> : null}
        </div>
      </div>
      <div className="map-container">
        <MapContainer
          className='station-leaflet'

          center={center} zoom={11} scrollWheelZoom={true} >
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright">'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker icon={greenIcon} position={position} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>
            <Popup >
              <p>{formSubmit['Name']}</p>
              <p>{formSubmit['Adress']}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <Notification alert={alert} />
    </div>
  )
}

export default AddStation