export interface Donor {
    id: string;
    name: string;
    largestGiftAppeal: number;
    lastGiftDate: string;
    address: string;
    notes: DonorNote[];
    isSelected: boolean;
    selectedBy?: string;
}

export interface DonorNote {
    id: string;
    content: string;
    author: string;
    createdAt: string;
}
