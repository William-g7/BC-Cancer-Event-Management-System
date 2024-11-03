export interface Donor {
    id: number;
    first_name: string;
    last_name: string;
    nick_name: string;
    largest_gift: number;
    total_donations: number;
    last_gift_date: string;
    last_gift: number;
    address_line1: string;
    address_line2: string;
    city: string;
    phone_restrictions: string;
    email_restrictions: string;
}
