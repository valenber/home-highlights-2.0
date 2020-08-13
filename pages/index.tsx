/* stylelint-disable react/jsx-no-undef */
/* NextJS page */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { addEventsList } from '../store/eventsSlice';
import { getAllApiEvents } from '../services/api';
import { useSelector } from 'react-redux';
import { getAllStoreEvents } from '../store/selectors/getAllStoreEvents';
import { EventsLoadingProgressSpinner } from '../features/view-highlighted-events/components/EventsLoadingProgressSpinner';
import { HighlightedEventsView } from '../features/view-highlighted-events/HighlightedEventsView';

const IndexPage = () => {
  const dispatch = useAppDispatch();
  const storeEvents = useSelector(getAllStoreEvents);

  useEffect(() => {
    // load events to store
    (async function() {
      const events = await getAllApiEvents();
      dispatch(addEventsList(events));
    })();
  }, []);

  return (
    <>
      {!storeEvents.length && <EventsLoadingProgressSpinner />}

      {storeEvents.length > 0 && <HighlightedEventsView />}
    </>
  );
};

export default IndexPage;
