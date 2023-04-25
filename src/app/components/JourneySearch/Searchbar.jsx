import React, { useCallback, useState, useRef, useEffect } from "react";

import Input from "../shared/Input/Input";

const Searchbar = () => {

  const originRef = useRef(null)
  const destRef = useRef(null)



  const [isFocus, setFocus] = useState(false);
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const setValue = useCallback(
    () => {
      if (isOrigin) {
        setInput(origin.name);
      } else {
        setInput(destination.name);
      }
    },
    [setInput, origin.name, destination.name, isOrigin],
  )
  const fetchSearchResults = useCallback(
    async (value) => {
      if (value.length > 2) {
        try {
          await dispatch(itineraryActions.setLoading(true));
          await dispatch(searchResultActions.getAddressSearch(value));
        } catch (err) {
          setSearchResults([]);
          dispatch(
            notificationActions.showNotification({
              type: NOTIFICATION_TYPE.warning,
              message: err?.response?.data?.errors[0]?.message,
            }),
          );
        } finally {
          dispatch(itineraryActions.setLoading(false));
        }
      }
    },
    [dispatch],
  )
  const handleFocus = useCallback(() => {
    setFocus(true);
    isOrigin ? fetchSearchResults(origin?.name) : fetchSearchResults(destination?.name);

  }, [isOrigin, origin.name, destination.name, setFocus, fetchSearchResults]);

  const setAddress = useCallback(
    (payload) => {
      if (isOrigin) {
        dispatch(itineraryActions.setOrigin(payload));
      } else {
        dispatch(itineraryActions.setDestination(payload));
      }
    },
    [isOrigin, dispatch],
  );

  const handleBlur = () => {
    setFocus(false);
    if (!hasInvalidValue(address)) {
      setInput(address?.name);
    } else {
      setInput("");
      setAddress({
        name: "",
        lat: 0.0,
        lon: 0.0,
      });
    }
    dispatch(searchResultActions.getAddressSearch([]));
  };

  const selectResult = (result) => {
    const cleanupResult = {
      name: result?.labelNameArray[0],
      lat: result?.coordinates?.lat,
      lon: result?.coordinates?.lon,
    };
    setAddress(cleanupResult);
    setInput(cleanupResult?.name);
    setFocus(false);
  };

  const handleReset = useCallback(() => {
    setInput("");
    setFocus(true);
    inputRef.current?.focus();

    setAddress({ name: "", lat: 0.0, lon: 0.0 });
  }, [inputRef, setAddress]);

  useEffect(() => {
    if (addressSearch?.length === 0) {
      setSearchResults([]);
    } else {
      setSearchResults(addressSearch);
    }
  }, [addressSearch]);

  useEffect(() => {
    if (input?.length === 0) return setSearchResults([]);
    if (input?.length > 2) {
      setTimeout(() => {
        fetchSearchResults(input);
      }, 300);
    }
  }, [input, fetchSearchResults]);

  useEffect(() => {
    if (origin.name === "" && destination.name === "") {
      dispatch(searchResultActions.setJourneyPlanning([]));
    }
    if (origin.name !== "" && destination.name !== "") {
      setValue();
    }
  }, [origin, destination, dispatch, setValue]);





  return (
    <div className='searchBar__container'>
      <Input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={input}
        focus={isFocus}
        handleClickInputIcon={handleReset}
      />
      <Input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={input}
        focus={isFocus}
        handleClickInputIcon={handleReset}
      />

    </div>
  );
};

export default Searchbar;
