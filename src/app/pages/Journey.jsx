import React, { useState, useEffect } from 'react';
import SearchArea from '../components/SearchArea';
import { instance } from '../constant'

const Journey = () => {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [journey, setJourney] = useState([])
  const [searchResult, setSearchResult] = useState([])



  const search = async (e) => {
    e.preventDefault();
    setLoading(true)
    setPage(1)

    const resp = await instance.post('/api/journey', {

      data: form
    })
    setJourney(resp);


    setLoading(false);
  }

  return (
    <>
      <div>Journey</div>

      <SearchArea />

    </>
  )
}

export default Journey