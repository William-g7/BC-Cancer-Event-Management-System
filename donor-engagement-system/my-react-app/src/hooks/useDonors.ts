import { useState, useEffect } from 'react';
import { Donor } from '../types/donor.ts';

export const useDonors = (fetchDonorsFunction: () => Promise<Donor[]>) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    const loadDonors = async () => {
      try {
        console.log('Starting donor fetch...');
        setLoading(true);
        const donors = await fetchDonorsFunction();
        console.log('Received donors:', donors);
        setDonors(Array.isArray(donors) ? donors : []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Hook error: Failed to fetch donors';
        console.error('Donor fetch hook error:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    loadDonors();
  }, [fetchDonorsFunction]);

  return { donors, loading, error };

}

export const useEventAndDonors = (fetchFunction: () => Promise<{ event: Event, donors: Donor[] }>) => {
    const [data, setData] = useState<{ event: Event | null, donors: Donor[] }>({ event: null, donors: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const result = await fetchFunction();
          setData(result);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [fetchFunction]);
  
    return { data, loading, error };
  };