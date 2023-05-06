import React, { useState } from 'react'
import { instance } from '../constant'
import { YearMonthPciker } from '../components/shared/DatePicker'
import dayjs from 'dayjs';
import PuffLoader from 'react-spinners/PuffLoader'
import { convertMinutesToHours, padNum } from '../components/util';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const stationOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Top 10 Most Busiest Stations',
    },
  },
};

const routeOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Top 10 Most Popular Routes',
    },
  },
};


const Statistics = () => {
  const [basic, setBasic] = useState([])
  const [topRoutes, setTopRoutes] = useState([])
  const [topStations, setTopStations] = useState([])
  const [basicLoading, setBasicLoading] = useState(false)
  const [stationLoading, setStationLoading] = useState(false)

  const [routeLoading, setRouteLoading] = useState(false)
  const [selectedTime, setSelectedTime] = useState(null)

  const stationLabels = topStations?.busiestStations?.length > 0 ? topStations?.busiestStations?.map(station => station.station) : []
  const routeLabels = topRoutes?.popularRoutes?.length > 0 ? topRoutes?.popularRoutes?.map(route => route.route) : []

  const stationData = {
    labels: stationLabels,
    datasets: [
      {
        label: 'Station Name',
        data: topStations?.busiestStations?.length > 0 ? topStations?.busiestStations?.map((station) => station.count) : [],
        backgroundColor: 'grey',
      },
    ],
  };

  const routeData = {
    labels: routeLabels,
    datasets: [
      {
        label: 'Routes',
        data: topRoutes?.popularRoutes?.length > 0 ? topRoutes?.popularRoutes?.map((route) => route.count) : [],
        backgroundColor: 'grey',
      },
    ],
  };


  const fetchData = async (url, data, setLoadingState, setStateFn) => {
    try {
      setLoadingState(true);
      const resp = await instance.post(url, { data });

      setStateFn(resp?.data?.data[0]);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoadingState(false);
    }
  };


  const onChange = async (event) => {
    const dateTime = `${dayjs(event).year()}-${padNum(dayjs(event).month() + 1, 2)}`

    setSelectedTime(dateTime)
    setTimeout(async () => {
      await fetchData('/api/statistic-basic', dateTime, setBasicLoading, setBasic)
    }, 1000);

    setTimeout(async () => {
      await fetchData('/api/statistic-route', dateTime, setRouteLoading, setTopRoutes)
    }, 1000);

    setTimeout(async () => {
      await fetchData('/api/statistic-station', dateTime, setStationLoading, setTopStations)
    }, 1000);
  }


  console.log(topRoutes, 'topRoutes');
  return (
    <div className='statistic-container' >
      <div className="date-container" >
        <YearMonthPciker value={selectedTime} onChange={onChange} />
      </div>

      <div className="basic-container">
        {basicLoading ? < PuffLoader /> :
          basic?.length !== 0 ?
            <BasicComponent basic={basic} />
            : null
        }
      </div>

      <div className="bars-container" >
        <div className="top-station-container">
          {stationLoading ? < PuffLoader /> :
            topStations?.length !== 0 ?
              <div className="bar-container" style={{ width: '100%', height: '400px' }}>
                <Bar options={stationOptions} data={stationData} />
              </div>
              : ''
          }
        </div>

        <div className="top-route-container">
          {routeLoading ? < PuffLoader /> :
            topRoutes?.length !== 0 ?
              <div className="bar-container" style={{ width: '100%', height: '400px' }}>
                <Bar options={routeOptions} data={routeData} />
              </div>
              : null
          }
        </div>
      </div>
    </div>
  )
}

const BasicComponent = ({ basic }) => {
  return (
    <div className='basic-container__wrapper' >

      <div className="basic-container__wrapper-item">
        <p>Total Distance</p>
        <h3>{basic?.totalDistance ? `${(basic?.totalDistance / 1000).toFixed(2)} km` : 'No data'}</h3>
      </div>

      <div className="basic-container__wrapper-item">
        <p>Avg. Distance</p>
        <h3> {basic?.averageDistance ? `${((basic?.averageDistance / 1000).toFixed(2))} km` : 'No data'}</h3>
      </div>

      <div className="basic-container__wrapper-item">
        <p>Total Duration</p>
        <h3> {basic?.totalDuration ? convertMinutesToHours((basic?.totalDuration)) : 'No data'}</h3>
      </div>

      <div className="basic-container__wrapper-item">
        <p>Avg. Duration</p>
        <h3> {basic?.averageDuration ? convertMinutesToHours(basic?.averageDuration) : 'No data'}</h3>
      </div>

      <div className="basic-container__wrapper-item">
        <p>Total journeys</p>
        <h3> {basic?.count ? (basic?.count) : 'No data'}</h3>
      </div>
    </div>
  )
}

export default Statistics