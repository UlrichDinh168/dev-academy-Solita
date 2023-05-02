import React, { useCallback, useState, useEffect } from "react";
import Searchbar from '../components/Searchbar/Searchbar'
import Button from '../components/shared/Button'
import Table from '../components/JourneyTable/Table'
import Slider from '../components/Slider/Slider'
import { findLargestAndSmallest } from '../components/util'
import { instance } from '../constant'
import { transformResultsArray } from "../components/util";
import PuffLoader from 'react-spinners/PuffLoader'
import Notification from '../components/shared/Notification'

const headCells = [
  {
    id: 'Departure station name',
    numeric: false,
    disablePadding: false,
    label: 'Departure',
  },
  {
    id: 'Return station name',
    numeric: true,
    disablePadding: false,
    label: 'Destination',
  },
  {
    id: 'Covered distance (m)',
    numeric: true,
    disablePadding: false,
    label: 'Distance (km)',
  },
  {
    id: 'Duration (sec)',
    numeric: true,
    disablePadding: false,
    label: 'Duration (min)',
  },
]
const Journey = () => {
  const [formSubmit, setFormSubmit] = useState({})
  const [journeys, setJourneys] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [alert, setAlert] = useState(false)

  const [sliderMinMaxValues, setSliderMinMaxValues] = useState({
    distantMax: 0, distantMin: 0, durationMax: 0, durationMin: 0
  })
  const [filteredTable, setFilteredTable] = useState([])
  const [sliderCurrentValue, setSliderCurrentValue] = useState({})

  useEffect(() => {
    if (journeys.length !== 0) {
      const { largest: distantMax, smallest: distantMin } = findLargestAndSmallest(journeys?.journeys, 'Covered distance (m)')
      const { largest: durationMax, smallest: durationMin } = findLargestAndSmallest(journeys?.journeys, 'Duration (sec)')

      setSliderMinMaxValues({ distantMin, distantMax, durationMin, durationMax })
    }
  }, [journeys])


  useEffect(() => {
    setSliderCurrentValue({
      'Covered distance (m)': sliderMinMaxValues.distantMax,
      'Duration (sec)': sliderMinMaxValues.durationMax
    })
  }, [sliderMinMaxValues])


  useEffect(() => {
    const newResult = journeys?.journeys?.filter(item => item['Covered distance (m)'] <= sliderCurrentValue['Covered distance (m)'] || item['Duration (sec)'] <= sliderCurrentValue['Duration (sec)'])

    setFilteredTable(newResult || journeys?.journeys)
  }, [sliderCurrentValue])


  const onSetFormValues = useCallback(
    (result, name) => {
      setFormSubmit(prevState => ({ ...prevState, [name]: result?.Nimi }))
      setPage(1)
    },
    [formSubmit],
  )

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      const resp = await instance.post('/api/journey', {
        data: { ...formSubmit, page }
      })
      console.log(resp, 'resp');

      const convertedResp = transformResultsArray(resp?.data.data.journeys)

      setJourneys({ ...resp?.data.data, journeys: convertedResp })
    } catch (error) {
      console.log(error, 'error');
      setJourneys([])
      setFilteredTable([])
      setAlert({ isOpen: true, severity: 'error', message: error?.response.data.message })

    } finally {
      setLoading(false);
    }
  }


  const onFetchNextBatch = async () => {
    setPage(prev => prev + 1)
    setLoading(true)
    const resp = await instance.post('/api/journey', {
      data: { ...formSubmit, page: page + 1 }
    })

    const newResults = [...journeys.journeys, ...resp?.data.data.journeys]
    console.log(newResults, 'newResults');
    setJourneys(prev => ({ ...prev, journeys: newResults }))
    setLoading(false);
  }


  const handleSliderChange = useCallback(
    (value, name) => {
      setSliderCurrentValue(prev => ({ ...prev, [name]: value }))
    },
    [sliderCurrentValue]
  )

  const isDisabled = !formSubmit["Departure station name"] && !formSubmit["Return station name"]

  return (
    <div className="search-area__wrapper">

      <h2 style={{ textAlign: 'center', margin: ' 2rem 0' }}>Journey lookup</h2>
      <div className="search-area__content">

        <div className="search-area__content-left">
          <div className="search-area">
            <Searchbar isOrigin={true} onSetFormValues={onSetFormValues} formSubmit={formSubmit} type='base' label='Departure' />
            <Searchbar isOrigin={false} onSetFormValues={onSetFormValues} formSubmit={formSubmit} type='base' label='Destination' />
            <Button text='Search' disabled={isDisabled || isLoading} onClick={onSubmit} />
          </div>
          <div className="slider">
            {journeys.length !== 0 ? <>
              <h5>Change both to start filtering</h5>

              <Slider
                name='Duration (sec)'
                onFilter={handleSliderChange}
                min={sliderMinMaxValues?.durationMin}
                max={sliderMinMaxValues?.durationMax}
                value={sliderCurrentValue['Duration (sec)']}
                disabled={isLoading}
                label='Duration (min)'
              />
              <Slider
                name='Covered distance (m)'
                onFilter={handleSliderChange}
                min={sliderMinMaxValues?.distantMin}
                value={sliderCurrentValue['Covered distance (m)']}
                max={sliderMinMaxValues?.distantMax}
                disabled={isLoading}
                label='Distance (km)'
              /></> : null}

          </div>
        </div>
        <div className="search-area__content-right">

          {isLoading ? <PuffLoader /> :
            journeys.length !== 0 ?
              <div className="">
                <Table rows={filteredTable} headCells={headCells} type='journey' />
                <div className="search-area__end">
                  <div className="load-more" style={{ maxWidth: '15rem', width: '10rem' }}>
                    <Button onClick={onFetchNextBatch} text='Load More' disabled={page === journeys.lastPage} />
                  </div>
                  {journeys.length !== 0 ? <div className="search-area__last">Page {page} of {journeys.lastPage}</div> : null}
                </div>
              </div>

              : <p className="ntts">No data</p>}
        </div>

      </div>
      <Notification alert={alert} />

    </div>
  )
}

export default Journey