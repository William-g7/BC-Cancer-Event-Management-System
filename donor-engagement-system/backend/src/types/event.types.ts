// src/types/event.types.ts
import { DateTime } from 'luxon';
import { Fundraiser } from './fundtaiser';

export interface Event {
    event_id: number;
    name: string;
    start_time: DateTime;
    end_time: DateTime;
    location: string;
    description?: string;
    estimate_invitation: number;
    total_selected: number;
    created_at: DateTime;
    updated_at: DateTime;
    assigned_fundraisers: Fundraiser[];
    lead_fundraiser: Fundraiser;    
}

export interface CreateEventDTO {
    name: string;
    start_time: DateTime;
    end_time: DateTime;
    location: string;
    description?: string;
    estimate_invitation: number;
}
