import { DateTime } from 'luxon';

export interface Donor {
    id: number;
    first_name: string;
    last_name: string;
    nick_name: string | null;
    largest_gift: number | null;
    total_donations: number | null;
    largest_gift_appeal: string | null;
    last_gift_appeal: string | null;
    last_gift_date: DateTime | null;
    last_gift_amount: number | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    phone_restrictions: string | null;
    communication_restrictions: string | null;
    email_restrictions: string | null;
}
