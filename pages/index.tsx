/* stylelint-disable react/jsx-no-undef */
/* NextJS page */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store';
import { addEventsList } from '../store/eventsSlice';
import { getAllApiEvents } from '../services/api';
import { useSelector } from 'react-redux';
import { getAllStoreEvents } from '../store/selectors/getAllStoreEvents';
import { EventsLoadingProgressSpinner } from '../features/view-highlighted-events/components/EventsLoadingProgressSpinner';
import { EventsView } from '../features/view-highlighted-events/EventsView';
import { EventsLoadingError } from '../features/view-highlighted-events/components/EventsLoadingError';

const IndexPage = () => {
  const dispatch = useAppDispatch();
  const storeEvents = useSelector(getAllStoreEvents);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    // load events to store
    (async function() {
      setLoadingState(true);
      const { events, error } = await getAllApiEvents();

      setLoadingState(false);
      setFetchingError(error);
      dispatch(addEventsList(events));
    })();
  }, []);

  return (
    <>
      {loadingState && <EventsLoadingProgressSpinner />}

      {fetchingError && <EventsLoadingError message={fetchingError} />}

      {storeEvents && <EventsView />}
    </>
  );
};

export default IndexPage;
