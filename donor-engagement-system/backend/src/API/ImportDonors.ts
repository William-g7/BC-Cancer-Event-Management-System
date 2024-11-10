import { Pool } from 'mysql2/promise';
import pool from '../config/database';

async function fetchAllDonors(): Promise<any[]> {
    const baseUrl = 'https://bc-cancer-faux.onrender.com/donors';
    
    try {
        console.log('Starting API fetch...');
        const response = await fetch(`${baseUrl}?limit=2000&format=json`);
        
        if (!response.ok) {
            console.error('API Response:', await response.text());
            throw new Error(`API returned status: ${response.status}`);
        }
        
        const rawData = await response.json();
        
        // Transform the array data into objects using headers
        const donors = rawData.data.map((donorArray: any[]) => {
            const donor: any = {};
            rawData.headers.forEach((header: string, index: number) => {
                donor[header] = donorArray[index];
            });
            return donor;
        });

        // Log the first transformed donor
        if (donors.length > 0) {
            console.log('First Transformed Donor:', {
                donor: donors[0],
                fields: Object.keys(donors[0]).map(key => ({
                    field: key,
                    type: typeof donors[0][key],
                    value: donors[0][key],
                    isNull: donors[0][key] === null,
                    isUndefined: donors[0][key] === undefined
                }))
            });
        }
        
        return donors;
    } catch (error) {
        console.error('Error fetching donors:', error);
        throw error;
    }
}

async function insertDonors(pool: Pool, donors: any[]) {
    const query = `
        INSERT IGNORE INTO Donors (
            pmm,
            vmm,
            smm,
            first_name, 
            last_name,
            nick_name,
            largest_gift,
            total_donations,
            largest_gift_appeal,
            last_gift_appeal,
            last_gift_date,
            last_gift_amount,
            address_line1,
            address_line2,
            city,
            phone_restrictions,
            communication_restrictions,
            email_restrictions
        ) VALUES ?
    `;

    try {
        // Log a sample donor before insertion
        if (donors.length > 0) {
            console.log('Sample donor for insertion:', donors[0]);
        }

        const values = donors.map(donor => [
            donor.pmm || null,
            donor.vmm || null,
            donor.smm || null,
            donor.first_name || donor.firstName, 
            donor.last_name || donor.lastName,
            donor.nick_name || null,
            donor.largest_gift || null,
            donor.total_donations || null,
            donor.largest_gift_appeal || null,
            donor.last_gift_appeal || null,
            donor.last_gift_date ? new Date(donor.last_gift_date * 1000).toISOString().slice(0, 19).replace('T', ' ') : null,
            donor.last_gift_amount || null,
            donor.address_line1 || null,
            donor.address_line2 || null,
            donor.city || null,
            donor.phone_restrictions || null,
            donor.communication_restrictions || null,
            donor.email_restrictions || null
        ]);

        const [result] = await pool.query(query, [values]);
        console.log(`Successfully inserted ${donors.length} donors`);
        return result;
    } catch (error) {
        console.error('Error inserting donors:', {
            error,
            sampleDonor: donors[0],
            totalDonors: donors.length
        });
        throw error;
    }
}

async function main() {
    try {
        const donors = await fetchAllDonors();
        console.log('Fetched donors successfully');
        await insertDonors(pool, donors);
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await pool.end();
    }
}

main();