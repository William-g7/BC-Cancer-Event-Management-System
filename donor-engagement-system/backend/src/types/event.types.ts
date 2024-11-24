// src/types/event.types.ts
import { DateTime } from 'luxon';

export interface Event {
    id: number;
    name: string;
    start_time: DateTime;
    end_time: DateTime;
    location: string;
    description: string | null;
    // this organizer_id is fundraiser_id
    organizer_id: number;
    deadline: DateTime;
    expected_selection: number;
    selected_count: number;
    image_url?: string | null;
    participant_goal: number | null;
}

export interface CreateEventDTO {
    name: string;
    start_time: string | DateTime;
    end_time: string | DateTime;
    location: string;
    description?: string | null;
    // this organizer_id is fundraiser_id
    organizer_id: number;
    deadline: string | DateTime;
    expected_selection: number;
    selected_count?: number;
    participant_goal: number | null;
}

