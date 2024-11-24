
import { DateTime } from "luxon";

export interface DonorNotes{
    id: number;
    donor_id: number;
    fundraiser_name:string;
    note:string;
    created_at: DateTime;
}
export interface Fundraisers{
    id:number;
    account_id:number;
}
export interface CreateNoteDTO {
    donor_id: number;
    account_id: number;
    content: string;
    created_at: DateTime;

}
