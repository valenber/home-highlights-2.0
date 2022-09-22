import { eventsMatcher, SearchResult } from './eventsMatcher';
import { useSelector } from 'react-redux';
import { getAllStoreEvents } from 'store/selectors/getAllStoreEvents';
import { Dispatch, SetStateAction, useState } from 'react';

export function useEventSearch(): [
  SearchResult[],
  Dispatch<SetStateAction<string>>,
] {
  const eventsList = useSelector(getAllStoreEvents);
  const [searchTerm, setSearchTerm] = useState('');

  const matchedEvents = eventsMatcher(eventsList, searchTerm);

  return [matchedEvents, setSearchTerm];
}
