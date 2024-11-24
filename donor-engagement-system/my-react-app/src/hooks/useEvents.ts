import { useState, useEffect } from 'react';
import { EventData } from '../types/event';

export const useEvents = (fetchEvents: () => Promise<EventData[]>) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();
        setEvents(Array.isArray(data) ? data: []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [fetchEvents]);

  return { events, loading, error };
};

export const useSingleEvent = (fetchEvent: () => Promise<EventData>) => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvent = async () => {
      try {
        setLoading(true);
        const data = await fetchEvent();
        setEvent(data);
        console.log(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    getEvent();
  }, [fetchEvent]);

  return { event, loading, error };
};