import React, { useEffect, useState } from 'react'
import { instance } from '../constant'
import { MonthPicker, YearPicker, YearMonthPciker } from '../components/shared/DatePicker'
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import { Card, Box, Grid } from '@mui/material';
import PuffLoader from 'react-spinners/PuffLoader'
import { styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));
// TODO: 
// - Average duration per month
// - Busiest departure stations per month
// - Popular routes per month
// - Monthly trends:  the number of journeys and the total distance traveled per month over time.

const Statistics = () => {
  const [basic, setBasic] = useState([])
  const [advanced, setAdvanced] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const [selectedTime, setSelectedTime] = useState(null)
  const [displayBasicData, setDisplayBasicData] = useState([])
  const [displayAdvancedData, setDisplayAdvancedData] = useState([])

  const fetch1 = async () => {
    try {
      setLoading(true)
      console.log(loading, 'load');
      const resp = await instance.get('/api/statistic-1')
      setBasic(resp?.data?.data)
      console.log(resp, 'resp');
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch1()
  }, [])

  const fetch2 = async () => {
    try {
      setLoading2(true)
      const resp_2 = await instance.get('/api/statistic-2')
      setDisplayAdvancedData(resp_2?.data?.data)
      console.log(resp_2, 'resp_2');

    } catch (error) {
      console.log(error, 'error');

    } finally {
      setLoading2(false);
    }
  }

  useEffect(() => {
    fetch2()


  }, [])

  const name = async (selectedTime) => {
    const newValue = basic.filter(item => {
      const dateTime1 = `${dayjs(selectedTime).year()}-${dayjs(selectedTime).month()}`
      const dateTime2 = `${dayjs(item._id).year()}-${dayjs(item._id).month() - 1}`

      console.log(dateTime1, 'dateTime1');
      console.log(dateTime2, 'dateTime2');
      console.log(dateTime1 === dateTime2, '===');
      if (dateTime1 === dateTime2) return item
    })
    console.log(newValue, 'newValue');
    // await fetch1()
    // await fetch2()
    return newValue
  }

  useEffect(() => {
    const st = name(selectedTime)
    setDisplayBasicData(st)
    console.log(st, 'st');
  }, [selectedTime, basic])


  const onChange = async (event) => {
    console.log(event, 'event');
    setSelectedTime(event)

  }
  console.log(new Date("2021-05-01T00:00:00Z"), 'Date');
  return (
    <div>
      {/* <YearPicker value={selectedTime} onChange={onChange} />
      <MonthPicker value={selectedTime} onChange={onChange} /> */}
      <YearMonthPciker value={selectedTime} onChange={onChange} />

      {loading ? < PuffLoader /> :
        displayBasicData.length !== 0 ?
          <Grid item xs={6} >
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
                display: 'grid',
                gridTemplateColumns: { md: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.averageDistance}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.averageDuration}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.totalDistance}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.totalDuration}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.count}
              </Item>
            </Box>
          </Grid> : null
      }
      {loading2 ? < PuffLoader /> :
        displayAdvancedData.length !== 0 ?
          <Grid item xs={6} >
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
                display: 'grid',
                gridTemplateColumns: { md: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.averageDistance}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.averageDuration}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.totalDistance}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.totalDuration}
              </Item>
              <Item elevation={24}>
                Title
                {displayBasicData[0]?.count}
              </Item>
            </Box>
          </Grid> : null
      }
    </div>
  )
}

export default Statistics