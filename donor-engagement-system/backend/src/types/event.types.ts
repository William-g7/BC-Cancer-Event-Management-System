// src/types/event.types.ts
import { DateTime } from 'luxon';

export interface Event {
    id: number;
    name: string;
    start_time: DateTime;
    end_time: DateTime;
    location: string;
    description: string | null;
    organizer_id: number;
    deadline: DateTime;
    expected_selection: number;
    selected_count: number;
}

export interface CreateEventDTO {
    name: string;
    start_time: DateTime;
    end_time: DateTime;
    location: string;
    description?: string;
    organizer_id: number;
    deadline: DateTime;
    expected_selection: number;
    selected_count: number;
}

