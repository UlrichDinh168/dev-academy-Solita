import React, { useCallback, useState, useRef, useEffect } from "react";
import Searchbar from '../Searchbar/Searchbar'
import Button from '../shared/Button'
import Table from '../JourneyTable/Table'
import Slider from '../Slider/Slider'
import findLargestAndSmallest from '../Slider/utils'
import { instance } from '../../constant'
import { Box } from "@mui/material";

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
      const { largest: distantMax, smallest: distantMin } = findLargestAndSmallest(journeys?.results, 'Covered distance (m)')
      const { largest: durationMax, smallest: durationMin } = findLargestAndSmallest(journeys?.results, 'Duration (sec)')
      console.log(distantMin, distantMax, durationMin, durationMax, 'min-max');

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
    console.log(sliderCurrentValue, 'sliderCurrentValue---');
    const newResult = journeys?.results?.filter(item => item['Covered distance (m)'] <= sliderCurrentValue['Covered distance (m)'] || item['Duration (sec)'] <= sliderCurrentValue['Duration (sec)'])

    console.log(newResult, 'neww');
    // setList(prev => ({ ...prev, results: newResult }))
    setFilteredTable(newResult || journeys?.results)
  }, [sliderCurrentValue,])

  console.log(sliderCurrentValue, 'currentVal');

  const onSetFormValues = useCallback(
    (result, name) => {
      setFormSubmit(prevState => ({ ...prevState, [name]: result?.Nimi }))
      setPage(1)

    },
    [formSubmit],
  )

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    setLoading(true)
    const resp = await instance.post('/api/journey', {
      data: { ...formSubmit, page }
    })

    setJourneys(resp?.data.data.paginatedResults)
    setLoading(false);
  }

  const onFetchNextBatch = async (params) => {
    console.log('here');
    setPage(prev => prev + 1)

    setLoading(true)
    console.log(page, 'page');
    const resp = await instance.post('/api/journey', {
      data: { ...formSubmit, page: page + 1 }
    })

    console.log(resp, 'resp');

    const newResults = [...journeys.results, ...resp?.data.data.paginatedResults.results]
    console.log(newResults, 'newResults');
    setJourneys(prev => ({ ...prev, results: newResults }))
    setLoading(false);
  }

  const handleSliderChange = (value, name) => {
    // setForm(prev => ({ ...prev, [name]: value }))
    console.log(name, value, 'value');
    setSliderCurrentValue(prev => ({ ...prev, [name]: value }))
  }

  const isDisabled = !formSubmit["Departure station name"] && !formSubmit["Return station name"]
  console.log(journeys, 'journeys');

  return (
    <div>
      <p>Helsinki Bike Planner</p>
      {/* <Box component="form" onSubmit={onSubmit}> */}

      <Searchbar isOrigin={true} onSetFormValues={onSetFormValues} />
      <Searchbar isOrigin={false} onSetFormValues={onSetFormValues} />
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
      <Button text='Search' disabled={isDisabled} onClick={onSubmit} />
      <Button text='More' onClick={onFetchNextBatch} />
      {journeys.length !== 0 ? <Table rows={filteredTable} /> : null}
      {/* </Box> */}

    </div>
  )
}

export default SearchArea