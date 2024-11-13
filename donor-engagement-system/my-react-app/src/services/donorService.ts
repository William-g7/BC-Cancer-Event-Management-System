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

  async saveSelections(eventId: number, donorIds: number[]): Promise<void> {
    try {
        console.log('DonorService: Attempting to save selections:', {
            eventId,
            donorIds,
            url: `/event/${eventId}/selections/save`
        });
        
        const response = await api.post<{ success: boolean }>(
            `/event/${eventId}/selections/save`,
            { donorIds }
        );
        
        console.log('DonorService: Save response:', response);
        
        if (!response.success) {
            throw new Error('Failed to save selections');
        }
    } catch (error) {
        console.error('DonorService: Error saving selections:', error);
        throw error;
    }
}

async confirmSelections(eventId: number, donorIds: number[]): Promise<void> {
  try {
      console.log('DonorService: Attempting to confirm selections:', {
          eventId,
          donorIds,
          url: `/event/${eventId}/selections/confirm`
      });
      
      const response = await api.post<{ success: boolean }>(
          `/event/${eventId}/selections/confirm`,
          { donorIds }
      );
      
      console.log('DonorService: Confirm response:', response);
      
      if (!response.success) {
          throw new Error('Failed to confirm selections');
      }
  } catch (error) {
      console.error('DonorService: Error confirming selections:', error);
      throw error;
  }
}

async getOtherFundraisersSelections(eventId: number): Promise<any[]> {
  try {
    const response = await api.get<{
      success: boolean,
      data: any[]
    }>(`/event/${eventId}/other-selections`);

    if (!response.success) {
      throw new Error('Failed to fetch other selections');
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching other selections:', error);
    throw error;
  }
}

}

export default new DonorService();

