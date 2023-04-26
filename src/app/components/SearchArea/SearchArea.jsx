import React from 'react'
import Searchbar from '../Searchbar/Searchbar'
import Button from '../shared/Button'

const SearchArea = ({ handleChange }) => {

  return (
    <div>
      <p>Helsinki Bike Planner</p>
      <Searchbar isOrigin={true} />
      <Searchbar isOrigin={false} />
      <Button text='Search' />

    </div>
  )
}

export default SearchArea