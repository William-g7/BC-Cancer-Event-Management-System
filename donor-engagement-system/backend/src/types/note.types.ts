
import { DateTime } from "luxon";

export interface DonorNote {
    note_id: number;
    donor_id: number;
    account_id: number;
    content: string;
    created_at: DateTime;
}

export interface CreateNoteDTO {
    donor_id: number;
    account_id: number;
    content: string;
    created_at: DateTime;

}
