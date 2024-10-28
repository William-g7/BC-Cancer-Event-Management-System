import { Event } from "./event.types";

export interface Fundraiser {
    fundraiser_id: number;
    account_id: number;
    name: string;
    assigned_events: Event[];
    lead_event: Event;
}
