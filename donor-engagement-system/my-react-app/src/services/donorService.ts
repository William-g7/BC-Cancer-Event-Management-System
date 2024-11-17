import { api } from '../utils/api.ts';
import { Donor } from '../types/donor.ts';

export class DonorService {
    
  async getDonorsByEvent(eventId: number): Promise<Donor[]> {
    try {
      console.log(`Fetching donors for event ${eventId}`);
      console.log(`Request URL: /event/${eventId}/selections`);
      
      const response = await api.get<{
        success: boolean, 
        data: Donor[]
      }>(`/event/${eventId}/selections`);
      
      if (!response.success) {
        console.error('API returned unsuccessful response:', response);
        throw new Error('API returned unsuccessful response');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error,
        eventId
      });
      throw new Error(`Donor service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}