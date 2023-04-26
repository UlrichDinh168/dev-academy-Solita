import React, { useCallback, useState, useRef, useEffect } from "react";
import Searchbar from '../Searchbar/Searchbar'
import Button from '../shared/Button'
import Table from '../Table/Table'
import { instance } from '../../constant'
import { Box } from "@mui/material";

const SearchArea = () => {
  const [formSubmit, setFormSubmit] = useState({})
  const [journeys, setJourneys] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

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

  const isDisabled = !formSubmit["Departure station name"] && !formSubmit["Return station name"]
  console.log(journeys, 'journeys');

  return (
    <div>
      <p>Helsinki Bike Planner</p>
      {/* <Box component="form" onSubmit={onSubmit}> */}

      <Searchbar isOrigin={true} onSetFormValues={onSetFormValues} />
      <Searchbar isOrigin={false} onSetFormValues={onSetFormValues} />
      <Button text='Search' disabled={isDisabled} onClick={onSubmit} />
      <Button text='More' onClick={onFetchNextBatch} />
      {journeys.length !== 0 ? <Table rows={journeys.results} /> : null}
      {/* </Box> */}

    </div>
  )
}

export default SearchArea