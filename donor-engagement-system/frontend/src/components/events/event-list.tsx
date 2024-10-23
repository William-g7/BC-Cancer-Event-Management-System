import { type FC } from 'react';
import { Event } from '@/types/event';

interface EventListProps {
    events: Event[];
}

export const EventList: FC<EventListProps> = ({ events }) => {
    return (
        <div>
            {events.map(event => (
                <div key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                </div>
            ))}
        </div>
    );
};
