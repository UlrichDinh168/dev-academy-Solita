import React, { useCallback, useState, useRef, useEffect } from "react";
import Searchbar from '../Searchbar/Searchbar'
import Button from '../shared/Button'
import { instance } from '../../constant'
import { Box } from "@mui/material";

const SearchArea = ({ handleChange }) => {
  const [formSubmit, setFormSubmit] = useState({})
  const [journey, setJourney] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const onSetFormValues = useCallback(
    (result, name) => {
      setFormSubmit(prevState => ({ ...prevState, [name]: result?.Nimi }))
      setPage(1)

    },
    [formSubmit],
  )
  console.log(formSubmit, 'formSubmit');

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    setLoading(true)
    const resp = await instance.post('/api/journey', {
      data: { ...formSubmit, page }
    })

    console.log(resp, 'resp');
    setJourney(resp)
    setLoading(false);
  }
  const isDisabled = !formSubmit["Departure station name"] && !formSubmit["Return station name"]
  console.log(isDisabled, 'isDisabled');
  return (
    <div>
      <p>Helsinki Bike Planner</p>
      {loading ? 'loading' : null}
      <Box component="form" onSubmit={onSubmit}>

        <Searchbar isOrigin={true} onSetFormValues={onSetFormValues} />
        <Searchbar isOrigin={false} onSetFormValues={onSetFormValues} />
        <Button text='Search' disabled={isDisabled} />
      </Box>

    </div>
  )
}

export default SearchArea