/* stylelint-disable react/jsx-no-undef */
/* NextJS page */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { addEventsList } from '../store/eventsSlice';
import { getAllEvents } from '../services/api';

const IndexPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadEventsToStore() {
      const events = await getAllEvents();
      dispatch(addEventsList(events));
    }
    loadEventsToStore();
  }, []);

  return (
    <>
      <h1>Home Highlights 2.0</h1>
    </>
  );
};

export default IndexPage;
