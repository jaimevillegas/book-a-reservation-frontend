import axios from 'axios';

const fetchReservations = (username) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_RESERVATIONS_REQUEST' });
    const response = await axios.get('http://localhost:3000/reservations/list_reservation');
    const filteredReservations = response.data.filter(
      (reservation) => reservation[3] === username,
    );
    const reservationsWithGlampingDetails = await Promise.all(
      filteredReservations.map(async (reservation) => {
        const glampingId = reservation[4];
        const glampingDetailsResponse = await axios.get(`http://localhost:3000/glampings/list_glampings_details/${glampingId}`);
        const glampingDetails = glampingDetailsResponse.data;

        return {
          ...reservation,
          glampingName: glampingDetails.name,
          glampingCity: glampingDetails.location,
        };
      }),
    );

    dispatch({ type: 'FETCH_RESERVATIONS_SUCCESS', payload: reservationsWithGlampingDetails });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    dispatch({ type: 'FETCH_RESERVATIONS_FAILURE', payload: 'Error fetching reservations.' });
  }
};

export default fetchReservations;
