import { Fundraiser } from './fundraiser';
import { DateTime } from 'luxon';
export interface EventData {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string | null;
    organizer_id: number;
    deadline: string;
    expected_selection: number;
    selected_count: number;
    assigned_fundraisers?: Fundraiser[];
    organizer?: Fundraiser;
    image_url?: string | null;
    participant_goal: number | null;
}

export interface DonorNotes{
    id: number;
    donor_id: number;
    fundraiser_name:string;
    note:string;
    created_at: DateTime;
}

export interface CreateEventData {
    name: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    expected_selection: number;
    participant_goal: number | null;
}
