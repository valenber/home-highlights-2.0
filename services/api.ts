import fetch from 'isomorphic-unfetch';
import { AgendaEvent } from '../data/dbSchema';

export async function getAllApiEvents(): Promise<AgendaEvent[]> {
  const res = await fetch('/api/events');
  const body = await res.json();

  return body.data;
}
