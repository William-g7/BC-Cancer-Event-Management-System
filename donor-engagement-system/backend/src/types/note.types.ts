
import { DateTime } from "luxon";

export interface DonorNote {
    id: number;              // 修改为与数据库字段一致
    donor_id: number;
    fundraiser_id: number;   // 修改为与数据库字段一致
    note: string;            // 与数据库字段 "note" 一致
    created_at: Date;        // 修改为标准 Date 类型，方便兼容数据库
}

export interface CreateNoteDTO {
    donor_id: number;
    fundraiser_id: number;   // 修改为与数据库字段一致
    note: string;            // 与数据库字段 "note" 一致
    created_at: Date;        // 修改为标准 Date 类型
}
