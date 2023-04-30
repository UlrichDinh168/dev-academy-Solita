import React, { useCallback, useState, useEffect } from "react";
import { instance } from '../constant'
import Button from '../components/shared/Button'
import Table from '../components/JourneyTable/Table'
import Input from "../components/shared/Input";
import PuffLoader from 'react-spinners/PuffLoader'

import Searchbar from "../components/Searchbar/Searchbar";
const headCells = [
  {
    id: 'Name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'Operaattor',
    numeric: true,
    disablePadding: false,
    label: 'Operaattor',
  },
  {
    id: 'Osoite',
    numeric: true,
    disablePadding: false,
    label: 'Address',
  },
  {
    id: 'Kaupunki',
    numeric: true,
    disablePadding: false,
    label: 'Kaupunki',
  },
]

const Station = () => {
  const [stations, setStations] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [formSubmit, setFormSubmit] = useState({})
  const [input, setInput] = useState("");
  const [filteredTable, setFilteredTable] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const resp = await instance.get('/api/station')
      setStations(resp?.data.data)
    }
    fetch()
  }, [])


  useEffect(() => {
    setFilteredTable()
  }, [input])


  const handleChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { value, name } = e.target;
    setInput(value);
    if (value.length >= 2) {
      const resp = await instance.post('/api/search', {
        data: value
      })
      setStations(prev => ({ ...prev, stations: resp.data.data }))
    }
  };


  const onFetchNextBatch = async (params) => {
    setPage(prev => prev + 1)
    setLoading(true)
    const resp = await instance.post('/api/station', { data: { page: page + 1 } })

    const newResults = [...stations.stations, ...resp?.data.data.stations]

    setStations(prev => ({ ...prev, stations: newResults }))
    setLoading(false);
  }

  console.log(stations, 'station');

  return (
    <div>
      {/* <Input onChange={handleChange}

        value={input}
      /> */}
      <Table rows={stations?.stations} headCells={headCells} type='station' />
      <Button onClick={onFetchNextBatch} text='Load More' disabled={page === stations.lastPage} />
      {stations.length !== 0 ? <div className="search-area__last">Page {page} of {stations.lastPage}</div> : null}
      {isLoading ? <PuffLoader /> : null}

    </div>
  )
}

export default Station