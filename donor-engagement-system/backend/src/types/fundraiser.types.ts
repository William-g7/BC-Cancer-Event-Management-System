
export interface Fundraiser {
    id: number;
    account_id: number;
    name: string;
    role: string;
}

export interface FundraiserStatus {
    event_fundraiser_id: number;
    fundraiserId: number;
    status: 'confirmed' | 'in_progress';
}