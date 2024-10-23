import { type FC } from 'react';
import { Donor } from '@/types/donor';

interface DonorTableProps {
    donors: Donor[];
    onSelect: (donorId: string) => void;
}

export const DonorTable: FC<DonorTableProps> = ({ donors, onSelect }) => {
    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Largest Gift</th>
                    <th>Last Gift Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {donors.map(donor => (
                    <tr key={donor.id}>
                        <td>{donor.name}</td>
                        <td>{donor.largestGiftAppeal}</td>
                        <td>{donor.lastGiftDate}</td>
                        <td>
                            <button onClick={() => onSelect(donor.id)}>
                                Select
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
