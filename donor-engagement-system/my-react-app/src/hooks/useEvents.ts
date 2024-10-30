import { useState, useEffect } from 'react';
import { Event } from '../types/event';
import { eventService } from '../services/eventService';

interface UseEventsReturn {
    upcomingEvents: Event[];
    pendingEvents: Event[];
    isLoading: boolean;
    error: Error | null;
    refreshEvents: () => Promise<void>;
}

export const useEvents = (fundraiserId: number): UseEventsReturn => {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const dashboardEvents = await eventService.getDashboardEvents(fundraiserId);
            
            // Split events into upcoming and pending based on some criteria
            const upcoming = dashboardEvents.filter(event => 
                new Date(event.start_time) > new Date() && event.selected_count >= event.expected_selection
            );
            
            const pending = dashboardEvents.filter(event => 
                new Date(event.start_time) > new Date() && event.selected_count < event.expected_selection
            );
            
            setUpcomingEvents(upcoming);
            setPendingEvents(pending);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [fundraiserId]);

    return {
        upcomingEvents,
        pendingEvents,
        isLoading,
        error,
        refreshEvents: fetchEvents
    };
}; 