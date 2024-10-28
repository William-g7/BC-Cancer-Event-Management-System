import { DateTime } from 'luxon';

export interface Donor {
    donor_id: number;
    name: string;
    is_selected: boolean;
    created_at: DateTime;
    updated_at: DateTime;
}
