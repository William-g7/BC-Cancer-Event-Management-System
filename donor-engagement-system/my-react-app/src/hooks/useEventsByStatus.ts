// src/hooks/useEventsByStatus.ts
import { useState, useEffect } from 'react';
import { EventData } from '../types/event';

interface EventsByStatusData {
  finishedEvents: EventData[];
  waitingEvents: EventData[];
}

interface EventsByStatusState extends EventsByStatusData {
  loading: boolean;
  error: string | null;
}

export const useEventsByStatus = (
  fetchFunction: () => Promise<EventsByStatusData>
): EventsByStatusState => {
  const [state, setState] = useState<EventsByStatusState>({
    finishedEvents: [],
    waitingEvents: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await fetchFunction();
        setState({
          ...result,
          loading: false,
          error: null
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    };

    fetchEvents();
  }, [fetchFunction]);

  return state;
};