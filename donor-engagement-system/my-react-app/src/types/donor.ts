import { DateTime } from 'luxon';
export interface Donor {
    id: number;
    first_name: string;
    last_name: string;
    total_donations: number;
    largest_gift: number;
    largest_gift_appeal: string;
    last_gift_appeal: string;
    last_gift_date: string;
    last_gift_amount: number;
    address_line1: string;
    address_line2: string;
    city: string;
    phone_restrictions: string;
    communication_restrictions: string;
    email_restrictions: string;
    state: string;
}
