import { DateTime } from "luxon";

export interface Notification {
    notification_id: number;
    account_id: number;
    title: string;
    content: string;
    created_at: DateTime;
    viewed_at: DateTime;
}