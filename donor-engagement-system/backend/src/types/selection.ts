import { DateTime } from "luxon";

export enum SelectionStatus {
    UNSELECTED = 'UNSELECTED',
    SELECTED = 'SELECTED',
    CONFIRMED = 'CONFIRMED',
}

export interface DonorSelection {
    selection_id: number;
    event_id: number;
    donor_id: number;
    account_id: number;
    status: SelectionStatus;
    selectedAt: DateTime;
    updatedAt: DateTime;
}

export interface CreateDonorSelectionDTO {
    event_id: number;
    donor_id: number;
    account_id: number;
}
