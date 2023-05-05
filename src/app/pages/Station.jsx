import React, { useCallback, useState, useEffect } from "react";
import { instance } from '../constant'
import Table from '../components/JourneyTable/Table'
import Input from "../components/shared/Input";
import PuffLoader from 'react-spinners/PuffLoader'

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
  {
    id: 'Kapasiteet',
    numeric: true,
    disablePadding: false,
    label: 'Capacity',
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
      setStations(resp?.data?.data)
      setFilteredTable(resp?.data?.data)

    }
    fetch()
  }, [])


  useEffect(() => {
    const newarr = [...stations]
    const filteredData = newarr.filter((item) =>
      item.Name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredTable(filteredData || stations)
  }, [input])


  const handleChange = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { value, name } = e.target;
      setInput(value);

    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  console.log(input, 'input');

  console.log(stations, 'station');
  return (
    <div className="station-container">
      <h2 style={{ textAlign: 'center', margin: ' 2rem 0' }}>Station lookup</h2>

      <Input label='Station name'
        onChange={handleChange}
        placeholder='Type to search ...'
        value={input}
      />
      <Table rows={filteredTable} headCells={headCells} type='station' />


    </div>
  )
}

export default Station