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
      const response = await api.post<{ success: boolean }>(
        `/event/${eventId}/selections/save`,
        { donorIds }
      );

      if (!response.success) {
        throw new Error('Failed to save selections');
      }
    } catch (error) {
      console.error('Error saving selections:', error);
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

  async unselectDonors(eventId: number, donorIds: number[]): Promise<void> {
    try {
      if (donorIds.length === 0) return;
      
      const response = await api.post<{ success: boolean }>(
        `/event/${eventId}/selections/unselect`,
        { donorIds }
      );

      if (!response.success) {
        throw new Error('Failed to unselect donors');
      }
    } catch (error) {
      console.error('Error unselecting donors:', error);
      throw error;
    }
  }

  async getDonorsByEventFundraiser(eventId: number): Promise<Donor[]> {
    try {
      const response = await api.get<{
        success: boolean,
        data: Donor[]
      }>(`/event/${eventId}/selections`);

      if (!response.success) {
        throw new Error('Failed to fetch donors');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching donors:', error);
      throw error;
    }
  }

  async getConfirmedDonorsByEvent(eventId: number, timeout: number = 10000): Promise<Donor[]> {
    try {
        console.log('DonorService: Fetching confirmed donors for event ID:', eventId);

        // Create the API request promise
        const response = await api.get<{ success: boolean, data: Donor[] }>(
            `/event/${eventId}/review`,
            { timeout } // Pass timeout to axios config
        );

        console.log('DonorService: Confirmed donors response:', response);
        
        if (!response.success) {
            throw new Error('Failed to fetch confirmed donors');
        }

        return response.data || [];
    } catch (error) {
        console.error('Error fetching confirmed donors:', error);
        throw error;
    }
  }

}


