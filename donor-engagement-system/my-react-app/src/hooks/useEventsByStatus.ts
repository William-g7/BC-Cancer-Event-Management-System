// src/hooks/useEventsByStatus.ts
import { useState, useEffect } from 'react';
import { EventData } from '../types/event';

interface EventsByStatusState {
  finishedEvents: EventData[];
  waitingEvents: EventData[];
  loading: boolean;
  error: string | null;
}

export const useEventsByStatus = (
  fetchFunction: () => Promise<any>,
) => {
  const [state, setState] = useState<EventsByStatusState>({
    finishedEvents: [],
    waitingEvents: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchEvents = async () => {
      if (!mounted) return;
      
      try {
        const result = await fetchFunction();
        if (mounted) {

          const currentTime = new Date().getTime();
          
          const filteredWatingEvents = result.waitingEvents.filter((event: EventData) => {
            const eventTime = new Date(event.start_time).getTime();
            return eventTime >= currentTime;
          });


          setState({
            finishedEvents: result.finishedEvents || [],
            waitingEvents: filteredWatingEvents || [],
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred'
          }));
        }
      }
    };

   
    fetchEvents();

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); 

  return state;
};