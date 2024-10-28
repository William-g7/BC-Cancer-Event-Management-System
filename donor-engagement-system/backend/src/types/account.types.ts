import { DateTime } from "luxon";

export enum Role {
    FUNDRAISER = 'FUNDRAISER',
    COORDINATOR = 'COORDINATOR'
}

export interface Account {
    account_id: number;
    name: string;
    email: string;
    role: Role;
    created_at: DateTime;
    updated_at: DateTime;
}

