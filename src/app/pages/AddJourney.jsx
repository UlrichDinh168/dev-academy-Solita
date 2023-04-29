import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Searchbar from '../components/Searchbar/Searchbar'
import axios from 'axios';
import Button from '../components/shared/Button'
import Input from '../components/shared/Input'
import DateTimePicker from '../components/shared/DateTimePicker'
import dayjs from 'dayjs';

const AddJourney = () => {
  const now = new Date()
  console.log(now.getTime(), 'now');

  const ISOStringTime = now.toISOString()
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
  const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });


  const [position, setPosition] = useState(center)
  const [position1, setPosition1] = useState(center)
  const [time, setTime] = useState(null)

  const [formSubmit, setFormSubmit] = useState({
    'Departure': ISOStringTime,
    'Return': ISOStringTime,
    'Departure station name': '',
    'Departure station id': '',
    'Return station name': '', 'Return station id': '',
    'Covered distance (m)': '',
    'Duration (sec)': ''
  })
  const [isLoading, setLoading] = useState(false)

  const markerRef = useRef(null)
  const markerRef2 = useRef(null)


  const apiKey = '5119eaf4-9206-46a6-9c06-2e7ffa98d33c';


  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        setPosition(marker.getLatLng())
        console.log(marker.getLatLng(), 'marker.getLatLng()');
      }
    }
    ,
  }), [])

  const eventHandlers2 = useMemo(() => ({
    dragend() {
      const marker = markerRef2.current
      if (marker != null) {
        setPosition1(marker.getLatLng())
      }
    }
    ,
  }), [])


  const calculateRoute = async () => {
    const response = await axios.get(`https://graphhopper.com/api/1/route?point=${position.lat},${position.lng}&point=${position1.lat},${position1.lng}&vehicle=bike&points_encoded=false&locale=en-US&elevation=true&key=${apiKey}`);

    const { time, distance } = response?.data.paths[0]

    const future = (now.getTime() + time); // add 30 seconds (in milliseconds)
    const formatted = new Date(future).toISOString(); // format as string

    setTime(time)

    setFormSubmit(prev => ({ ...prev, ['Duration (sec)']: time, ['Covered distance (m)']: distance, ['Return']: formatted }))

  };


  useEffect(() => {
    if (formSubmit['Departure station name'] !== '' && formSubmit['Return station name'] !== '') {
      calculateRoute();
    }
  }, [position.lat, position.lng, position1.lat, position1.lng]);


  const padNum = (num) => {
    let str = num.toString().padStart(3, '0');
    return (str)
  }


  const onSetFormValues =
    async (result, name) => {
      setFormSubmit(prevState => ({ ...prevState, [name]: result?.Nimi }))

      console.log(result, name, 'done');
      if (name === 'Departure station name') {
        setPosition({ lat: result?.y, lng: result?.x })
        setFormSubmit(prev => ({ ...prev, ['Departure station id']: padNum(result?.ID) }))

      } else {
        setPosition1({ lat: result?.y, lng: result?.x })
        setFormSubmit(prev => ({ ...prev, ['Return station id']: padNum(result?.ID) }))
      }
    }


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const resp = await instance.post('/api/journey', {
      data: { ...formSubmit, }
    })
    console.log(resp, 'resp');
    // const convertedResp = transformResultsArray(resp?.data.data.journeys)

    // setJourneys({ ...resp?.data.data, journeys: convertedResp })
    setLoading(false);
  }

  useEffect(() => {
  }, [])

  const onDateTimeChange = (params) => {
    const newTime = dayjs(params).add(time, 'millisecond')
    console.log(newTime, 'newTime');
    setFormSubmit(prev => ({ ...prev, ['Return']: newTime }))
  }

  // useEffect(() => {
  //   onDateTimeChange()
  // }, [])


  const isDisabled = Object.values(formSubmit).every(value => value !== '')
  console.log(formSubmit, 'formSubmit');
  return (
    <div className='add-journey'>
      <div className="wrapper-left">

        <div className="search-area">

          <Searchbar
            placeholder='Dept. station name'
            isOrigin={true}
            onSetFormValues={onSetFormValues}
            formSubmit={formSubmit} />

          <Searchbar
            placeholder='Dest. station name'
            isOrigin={false}
            onSetFormValues={onSetFormValues}
            formSubmit={formSubmit} />
        </div>
        <div className="date-time">
          <DateTimePicker value={dayjs(formSubmit['Departure'])} onChange={onDateTimeChange} />
          <DateTimePicker value={dayjs(formSubmit['Return'])} disabled />
        </div>

        <div className="info">
          <Input
            id='1'
            label='Covered distance (km)'
            disabled
            value={Number((formSubmit?.['Covered distance (m)']) / 1000).toFixed(2)} />

          <Input
            id='1'
            label='Duration (min)'
            disabled
            value={Math.ceil(formSubmit?.['Duration (sec)'] / 60000)} />
        </div>

        <Button text='Search' disabled={!isDisabled} onClick={onSubmit} />
      </div>
      <div className="map-container">

        <MapContainer
          className='station-leaflet'
          center={center}
          zoom={11}
          scrollWheelZoom={true}  >
          <TileLayer
            attribution='&copy; <a href="https://www.graphhopper.com/">GraphHopper</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker icon={greenIcon} position={position} eventHandlers={eventHandlers} ref={markerRef}>
          </Marker>

          <Marker icon={redIcon} position={position1} eventHandlers={eventHandlers2} ref={markerRef2}>
          </Marker>


        </MapContainer>
      </div>
    </div>
  )
}

export default AddJourney;