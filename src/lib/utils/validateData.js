const validateData = (journeyRow) => {
  const departureTime = Date.parse(journeyRow['Departure']);
  const arrivalTime = Date.parse(journeyRow['Return']);
  const departureStationId = parseInt(journeyRow['Departure station id']);
  const arrivalStationId = parseInt(journeyRow['Return station id']);
  const coveredDistance = parseInt(journeyRow['Covered distance (m)']);
  const duration = parseInt(journeyRow['Duration (sec)']);

  return (
    !isNaN(departureTime) &&
    !isNaN(arrivalTime) &&
    departureTime < arrivalTime &&
    departureStationId > 0 &&
    arrivalStationId > 0 &&
    coveredDistance > 10 &&
    duration > 10
  );
};

// module.exports = { validateData }
export { validateData };
