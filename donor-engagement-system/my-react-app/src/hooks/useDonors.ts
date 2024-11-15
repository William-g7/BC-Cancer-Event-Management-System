import { useState, useEffect } from 'react';
import { Donor } from '../types/donor.ts';
import { EventData } from '../types/event.ts';

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

export const useEventAndDonors = (fetchFunction: () => Promise<any>, refreshTrigger: number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, refreshTrigger]);

  return { data, loading, error };
};