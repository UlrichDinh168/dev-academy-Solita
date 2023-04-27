import React, { useCallback, useState, useEffect } from "react";
import Searchbar from '../Searchbar/Searchbar'
import Button from '../shared/Button'
import Table from '../JourneyTable/Table'
import Slider from '../Slider/Slider'
import { findLargestAndSmallest } from '../../components/util'
import { instance } from '../../constant'
import { transformResultsArray } from "../util";
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
const SearchArea = () => {
  const [formSubmit, setFormSubmit] = useState({})
  const [journeys, setJourneys] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
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
  }, [sliderCurrentValue,])


  const onSetFormValues = useCallback(
    (result, name) => {
      setFormSubmit(prevState => ({ ...prevState, [name]: result?.Nimi }))
      setPage(1)
    },
    [formSubmit],
  )

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const resp = await instance.post('/api/journey', {
      data: { ...formSubmit, page }
    })
    console.log(resp, 'resp');
    const convertedResp = transformResultsArray(resp?.data.data.journeys)

    setJourneys({ ...resp?.data.data, journeys: convertedResp })
    setLoading(false);
  }


  const onFetchNextBatch = async (params) => {
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

      <h2>Helsinki Bike Planner</h2>
      <div className="search-area">
        <Searchbar isOrigin={true} onSetFormValues={onSetFormValues} formSubmit={formSubmit} />
        <Searchbar isOrigin={false} onSetFormValues={onSetFormValues} formSubmit={formSubmit} />
        <Button text='Search' disabled={isDisabled} onClick={onSubmit} />
      </div>

      {journeys.length !== 0 ?
        <div className="search-area__content">
          <div className="search-area__content-up">
            <div className="slider">
              <h5>Change both to start filtering</h5>
              <Slider
                name='Duration (sec)'
                onFilter={handleSliderChange}
                min={sliderMinMaxValues?.durationMin}
                max={sliderMinMaxValues?.durationMax}
                value={sliderCurrentValue['Duration (sec)']}
                label={'Duration'}
              />
              <Slider
                name='Covered distance (m)'
                onFilter={handleSliderChange}
                min={sliderMinMaxValues?.distantMin}
                value={sliderCurrentValue['Covered distance (m)']}
                max={sliderMinMaxValues?.distantMax}
                label={'Distance'}
              />
            </div>
            <Table rows={filteredTable} headCells={headCells} type='journey' />
          </div>
          <div className="search-area__end">

            <Button onClick={onFetchNextBatch} text='Load More' disabled={page === journeys.lastPage} />
            {journeys.length !== 0 ? <div className="search-area__last">Page {page} of {journeys.lastPage}</div> : null}

          </div>
        </div>
        : null}
    </div>
  )
}

export default SearchArea