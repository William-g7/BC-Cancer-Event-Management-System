import { DateTime } from 'luxon';
export interface Donor {
    id: number;
    first_name: string;
    last_name: string;
    total_donations: number;
    last_gift_date: string;
    city: string;
    state: string;
}
