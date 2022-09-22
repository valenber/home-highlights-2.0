import { eventsMatcher, SearchResult } from './eventsMatcher';
import { useSelector } from 'react-redux';
import { getAllStoreEvents } from 'store/selectors/getAllStoreEvents';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useEventSearch(
  initialSearchTerm?: string,
): [SearchResult[], Dispatch<SetStateAction<string>>] {
  const eventsList = useSelector(getAllStoreEvents);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!searchTerm.length && initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const matchedEvents = eventsMatcher(eventsList, searchTerm);

  return [matchedEvents, setSearchTerm];
}
