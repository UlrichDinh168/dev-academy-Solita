import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import dayjs from 'dayjs';
import { instance } from '../constant';
import { padNum } from '../components/util';

import Searchbar from '../components/Searchbar/Searchbar'
import Button from '../components/shared/Button'
import Input from '../components/shared/Input'
import PuffLoader from 'react-spinners/PuffLoader'
import Notification from '../components/shared/Notification'
import DateTimePicker from '../components/shared/DateTimePicker'


const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const center = {
  lat: 60.170,
  lng: 24.939
}


const AddJourney = () => {
  const now = new Date()
  const ISOStringTime = now.toISOString()

  const [departure, setDeparture] = useState(center)
  const [destination, setDestination] = useState(center)
  const [time, setTime] = useState(null)
  const [alert, setAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [formSubmit, setFormSubmit] = useState({
    'Departure': ISOStringTime,
    'Return': ISOStringTime,
    'Departure station name': '',
    'Departure station id': '',
    'Return station name': '', 'Return station id': '',
    'Covered distance (m)': '',
    'Duration (sec)': ''
  })

  const departureMarkerRef = useRef(null)
  const destinationMarkerRef = useRef(null)

  const departureHandler = useMemo(() => ({
    dragend() {
      const marker = departureMarkerRef?.current
      if (marker != null) {
        setDeparture(marker?.getLatLng())
      }
    },
  }), [])

  const destinationHandler = useMemo(() => ({
    dragend() {
      const marker = destinationMarkerRef?.current
      if (marker != null) {
        setDestination(marker?.getLatLng())
      }
    },
  }), [])


  /**
   * Calculates the route between two locations and updates the state with relevant information
   * @param {array} departure 
   * @param {array} destination 
   */
  const calculateRoute = async (departure, destination) => {
    const response = await instance.post(`/api/get-routes`, {
      data: { departure, destination }
    });

    const data = response?.data?.data[0]

    if (!data) {
      setAlert({ isOpen: true, severity: 'warning', message: 'Same location' })
      return
    }


    // sum total of time + duration from all the legs sent by HSL Digitransit.
    const newData = data?.legs?.reduce((acc, cur) => {
      acc.totalTime += cur['duration'];
      acc.totalDistance += cur['distance'];
      return acc;
    }, { totalTime: 0, totalDistance: 0 })


    const future = (now.getTime() + newData.totalTime);
    const formatted = new Date(future).toISOString(); // format as string

    setTime(newData.totalTime)

    setFormSubmit(prev => ({ ...prev, ['Duration (sec)']: newData.totalTime, ['Covered distance (m)']: Number((newData.totalDistance).toFixed(2)), ['Return']: formatted }))
  };


  useEffect(() => {
    if (formSubmit['Departure station name'] !== '' && formSubmit['Return station name'] !== '') {
      calculateRoute([departure.lat, departure.lng], [destination.lat, destination.lng]);
    }
  }, [departure.lat, departure.lng, destination.lat, destination.lng]);


  const onSetFormValues =
    async (result, name) => {
      setFormSubmit(prevState => ({ ...prevState, [name]: result?.Nimi }))

      if (name === 'Departure station name') {
        setDeparture({ lat: result?.y, lng: result?.x })
        setFormSubmit(prev => ({ ...prev, ['Departure station id']: padNum(result?.ID, 3) }))

      } else {
        setDestination({ lat: result?.y, lng: result?.x })
        setFormSubmit(prev => ({ ...prev, ['Return station id']: padNum(result?.ID, 3) }))
      }
    }


  const onJourneyCreate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      const resp = await instance.post('/api/add-journey', {
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

  const onDateTimeChange = (params) => {
    // Auto add duration when user change starting time
    const newTime = dayjs(params).add(time * 1000, 'millisecond')
    setFormSubmit(prev => ({ ...prev, ['Return']: newTime }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let newVal
    if (name === 'Covered distance (m)') {
      newVal = Number((value * 1000).toFixed(2))
    } else {
      newVal = value * 60

    }

    setFormSubmit(prev => ({ ...prev, [name]: newVal }))
  }

  const isDisabled = Object.values(formSubmit).every(value => value !== '')

  return (
    <div className='add-journey'>
      <div className="wrapper-left">
        <h2 style={{ textAlign: 'center', margin: ' 2rem 0' }}>Add Journey</h2>
        <div className="search-area">
          <Searchbar
            placeholder='Dept. station name'
            isOrigin={true}
            onSetFormValues={onSetFormValues}
            type='base'
            formSubmit={formSubmit}
          />

          <Searchbar
            placeholder='Dest. station name'
            type='base'
            isOrigin={false}
            onSetFormValues={onSetFormValues}
            formSubmit={formSubmit}
          />
        </div>

        <div className="date-time">
          <DateTimePicker value={dayjs(formSubmit['Departure'])} onChange={onDateTimeChange} />
          <DateTimePicker value={dayjs(formSubmit['Return'])} disabled />
        </div>

        <div className="info">
          <Input
            id='1'
            onChange={handleChange}
            label='Covered distance (km)'
            name='Covered distance (m)'
            value={(formSubmit?.['Covered distance (m)'] / 1000)}
          />

          <Input
            id='1'
            label='Duration (min)'
            name='Duration (sec)'
            onChange={handleChange}
            value={Math.ceil(formSubmit?.['Duration (sec)'] / 60)}
          />
        </div>

        <Button text='Add Journey' disabled={!isDisabled} onClick={onJourneyCreate} />
        {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', }}><PuffLoader /></div> : null}

      </div>

      <div className="map-container">
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.graphhopper.com/">GraphHopper</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          <Marker icon={greenIcon} position={departure} eventHandlers={departureHandler} ref={departureMarkerRef}>
          </Marker>

          <Marker icon={redIcon} position={destination} eventHandlers={destinationHandler} ref={destinationMarkerRef}>
          </Marker>

        </MapContainer>
      </div>

      <Notification alert={alert} />
    </div>
  )
}

export default AddJourney;