import React, { useCallback, useState, useEffect } from 'react';
import { findLargestAndSmallest, transformResultsArray } from '../components/util';
import { instance } from '../constant';
import Searchbar from '../components/Searchbar/Searchbar';
import Button from '../components/shared/Button';

import Table from '../components/JourneyTable/Table';
import Slider from '../components/Slider/Slider';
import PuffLoader from 'react-spinners/PuffLoader';
import Notification from '../components/shared/Notification';

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
];

const Journey = () => {
  const [formSubmit, setFormSubmit] = useState({
    'Departure station name': '',
    'Return station name': '',
  });
  const [journeys, setJourneys] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState(false);

  const [filteredTable, setFilteredTable] = useState([]);
  const [sliderCurrentValue, setSliderCurrentValue] = useState({});
  const [sliderMinMaxValues, setSliderMinMaxValues] = useState({
    distantMax: 0,
    distantMin: 0,
    durationMax: 0,
    durationMin: 0,
  });

  /**
   * Find the min,max when first fetch and store values to state <sliderMinMaxValues>.
   */
  useEffect(() => {
    if (journeys.length !== 0) {
      const { largest: distantMax, smallest: distantMin } = findLargestAndSmallest(
        journeys?.journeys,
        'Covered distance (m)'
      );
      const { largest: durationMax, smallest: durationMin } = findLargestAndSmallest(
        journeys?.journeys,
        'Duration (sec)'
      );

      setSliderMinMaxValues({
        distantMin,
        distantMax,
        durationMin,
        durationMax,
      });
    }
  }, [journeys]);

  /**
   * Set the current values when min-max values change.
   * Auto pull the sliders to max when first fetch.
   */
  useEffect(() => {
    setSliderCurrentValue({
      'Covered distance (m)': sliderMinMaxValues.distantMax,
      'Duration (sec)': sliderMinMaxValues.durationMax,
    });
  }, [sliderMinMaxValues]);

  /**
   * Filter table while users move the sliders value
   */
  useEffect(() => {
    const newResult = journeys?.journeys?.filter(
      (item) =>
        item['Covered distance (m)'] <= sliderCurrentValue['Covered distance (m)'] ||
        item['Duration (sec)'] <= sliderCurrentValue['Duration (sec)']
    );

    setFilteredTable(newResult || journeys?.journeys);
  }, [sliderCurrentValue, journeys]);

  const onSetFormValues = useCallback((result, name) => {
    setFormSubmit((prevState) => ({ ...prevState, [name]: result?.Nimi }));
    setPage(1);
  }, []);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const resp = await instance.post('/api/journey/search', {
        data: { ...formSubmit, page },
      });

      // Before dsiplay data, transformResultsArray will transform data in to km and minute
      const convertedResp = transformResultsArray(resp?.data.data.journeys);

      setJourneys({ ...resp?.data.data, journeys: convertedResp });
    } catch (error) {
      console.log(error, 'error');
      setJourneys([]);
      setFilteredTable([]);

      // set error when there's no journey found with the locations combination
      setAlert({
        isOpen: true,
        severity: 'error',
        message: error?.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFetchNextBatch = useCallback(async () => {
    setPage((prev) => prev + 1);
    setLoading(true);
    const resp = await instance.post('/api/journey/search', {
      data: { ...formSubmit, page: page + 1 },
    });

    // Add next batch result to the origin array
    const newResults = [...journeys.journeys, ...resp.data.data.journeys];
    setJourneys((prev) => ({ ...prev, journeys: newResults }));
    setLoading(false);
  }, [formSubmit, journeys, page]);

  const handleSliderChange = useCallback((value, name) => {
    setSliderCurrentValue((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isDisabled = !formSubmit['Departure station name'] && !formSubmit['Return station name'];

  return (
    <div className='journey-wrapper'>
      <h2>Journey lookup</h2>
      <div className='journey-content'>
        <div className='journey-content__left'>
          <div className='search-area'>
            <Searchbar
              isOrigin={true}
              onSetFormValues={onSetFormValues}
              formSubmit={formSubmit}
              genre='base'
              label='Departure'
            />

            <Searchbar
              isOrigin={false}
              onSetFormValues={onSetFormValues}
              formSubmit={formSubmit}
              genre='base'
              label='Destination'
            />

            <Button text='Search' disabled={isDisabled || isLoading} onClick={onSubmit} />
          </div>
          <div className='slider-container'>
            {journeys.length !== 0 ? (
              <>
                <h5>Change both to start filtering</h5>

                <div className='slider'>
                  <Slider
                    name='Duration (sec)'
                    onFilter={handleSliderChange}
                    min={sliderMinMaxValues?.durationMin}
                    max={sliderMinMaxValues?.durationMax}
                    value={sliderCurrentValue['Duration (sec)']}
                    disabled={isLoading} // disabled when loading
                    label='Duration (min)'
                  />

                  <Slider
                    name='Covered distance (m)'
                    onFilter={handleSliderChange}
                    min={sliderMinMaxValues?.distantMin}
                    value={sliderCurrentValue['Covered distance (m)']}
                    max={sliderMinMaxValues?.distantMax}
                    disabled={isLoading} // disabled when loading
                    label='Distance (km)'
                  />
                </div>
              </>
            ) : null}

            <div className='journey-end'>
              {journeys.length !== 0 ? (
                <div
                  className='load-more'
                  style={{
                    maxWidth: '15rem',
                    width: '10rem',
                    textAlign: 'center',
                  }}
                >
                  <Button
                    onClick={onFetchNextBatch}
                    text='Load More'
                    disabled={page === journeys.lastPage || isLoading}
                  />

                  {journeys.length !== 0 ? (
                    <div className='journey-last'>
                      Page {page} of {journeys.lastPage}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className='journey-content__right' data-cy={`journey-content__right`}>
          {isLoading ? (
            <PuffLoader />
          ) : journeys.length !== 0 ? (
            <Table
              rows={filteredTable}
              headCells={headCells}
              type='journey'
              defaultOrderBy='Duration (sec)'
            />
          ) : (
            <p className='ntts'>No data</p>
          )}
        </div>
      </div>
      <Notification alert={alert} />
    </div>
  );
};

export default Journey;
