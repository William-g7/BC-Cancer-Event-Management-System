import { Fundraiser } from './fundraiser';

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
}

export interface CreateEventData {
    name: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    expected_selection: number;
}
