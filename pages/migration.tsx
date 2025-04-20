/* stylelint-disable react/jsx-no-undef */
/* NextJS page */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { createNewEvent } from 'services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';

const MoveBtn = ({ clickHandler }: { clickHandler: () => void }) => {
  return (
    <Button size="small" color="secondary" onClick={clickHandler}>
      Move
    </Button>
  );
};

export const MigrationPage: React.FC = () => {
  const [faunaEvents, setFaunaEvents] = useState([]);
  const [supabaseEvents, setSupabaseEvents] = useState([]);

  useEffect(() => {
    async function fetchFaunaEvents() {
      try {
        const response = await fetch('/api/v1/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const payload = await response.json();
        setFaunaEvents(payload.data);
      } catch (error) {
        console.error('Error fetching FaunaDB events:', error);
      }
    }

    async function fetchSupabaseEvents() {
      try {
        const response = await fetch('/api/v2/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const payload = await response.json();
        setSupabaseEvents(payload.data);
      } catch (error) {
        console.error('Error fetching Supabase events:', error);
      }
    }
    fetchFaunaEvents();
    fetchSupabaseEvents();
  }, []);

  const faunaNameIndex = faunaEvents.reduce((acc, event) => {
    acc[event.name] = event;
    return acc;
  }, {});

  const supabaseNameIndex = supabaseEvents.reduce((acc, event) => {
    acc[event.name] = event;
    return acc;
  }, {});

  async function moveEvent(eventName: string) {
    const faunaEvent = faunaNameIndex[eventName];

    if (supabaseNameIndex[eventName]) {
      console.warn('Event already exists in Supabase:', eventName);
      return;
    }

    const newEvent = faunaEvent;
    delete newEvent.id;
    delete newEvent.lang;
    delete newEvent.last_update;

    console.log('Moving event:', newEvent);

    const { event } = await createNewEvent(newEvent);
    if (event) {
      setSupabaseEvents((prev) => [...prev, event]);
    }

    console.log(`Event ${eventName} moved to Supabase`);
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Migration Tool</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main>
        <h1>Welcome to the Migration tool!</h1>
        <Link href="/">Home</Link>

        <p>FaunaDB Events count: {faunaEvents.length}</p>
        <p>SupaBase Events count: {supabaseEvents.length}</p>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <ul>
            {faunaEvents.map((event) => (
              <li key={event.id}>
                {event.name}{' '}
                {!supabaseNameIndex[event.name] ? (
                  <MoveBtn clickHandler={() => moveEvent(event.name)} />
                ) : (
                  <CheckCircle color="success" />
                )}
              </li>
            ))}
          </ul>

          <ul>
            {supabaseEvents.map((event) => (
              <li key={event.id}>{event.name}</li>
            ))}
          </ul>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default MigrationPage;
