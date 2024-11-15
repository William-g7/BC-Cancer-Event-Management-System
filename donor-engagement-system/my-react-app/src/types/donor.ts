import { DateTime } from 'luxon';
export interface Donor {
    id: number;
    first_name: string;
    last_name: string;
    pmm: string;
    vmm: string;
    smm: string;
    nick_name: string;
    largest_gift: number;
    total_donations: number;
    largest_gift_appeal: string;
    last_gift_appeal: string;
    last_gift_date: DateTime;
    last_gift_amount: number;
    address_line1: string;
    address_line2: string;
    city: string;
    phone_restrictions: string;
    communication_restrictions: string;
    email_restrictions: string;
    state: string;
}
