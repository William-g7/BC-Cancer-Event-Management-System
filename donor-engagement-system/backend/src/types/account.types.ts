import { DateTime } from 'luxon';

export enum Role {
    FUNDRAISER = 'FUNDRAISER',
    COORDINATOR = 'COORDINATOR'
}

export interface Account {
    id: number;
    name: string;
    password_hash: string;
    role: Role;
}

