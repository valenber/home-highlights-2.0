import { supabaseService } from './supabaseService';
import { AgendaEvent } from './dbSchema';

// Mock the entire module to control the createClient function
jest.mock('@supabase/supabase-js', () => {
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect }));
  const mockClient = { from: mockFrom };

  return {
    createClient: jest.fn(() => mockClient),
  };
});

// Get direct access to the mocked module
const mockedSupabase = jest.requireMock('@supabase/supabase-js');

describe('supabaseService', () => {
  describe('getAllAgendaEvents', () => {
    // Get references to mock functions
    const mockClient = mockedSupabase.createClient();
    const mockFrom = mockClient.from;
    const mockSelect = mockFrom().select;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return transformed agenda events on successful fetch', async () => {
      // Setup mock response data with start_date and end_date properties
      const mockData = [
        {
          id: '1',
          name: 'Test Event 1',
          start_date: '2023-01-01T00:00:00.000Z',
          end_date: '2023-01-31T00:00:00.000Z',
          state: { current: 'highlight' },
          tags: ['test'],
        },
        {
          id: '2',
          name: 'Test Event 2',
          start_date: '2023-02-01T00:00:00.000Z',
          end_date: '2023-02-28T00:00:00.000Z',
          state: { exhibitions: 'candidate' },
          tags: null,
        },
      ];

      // Mock the Supabase response
      mockSelect.mockResolvedValueOnce({ data: mockData, error: null });

      // Call the service method
      const result = await supabaseService.getAllAgendaEvents();

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockSelect).toHaveBeenCalledWith('*');

      // Assert that the data is transformed correctly
      expect(result).toEqual([
        {
          id: '1',
          name: 'Test Event 1',
          start: '2023-01-01T00:00:00.000Z',
          end: '2023-01-31T00:00:00.000Z',
          state: { current: 'highlight' },
          tags: ['test'],
        },
        {
          id: '2',
          name: 'Test Event 2',
          start: '2023-02-01T00:00:00.000Z',
          end: '2023-02-28T00:00:00.000Z',
          state: { exhibitions: 'candidate' },
          tags: null,
        },
      ] as AgendaEvent[]);
    });

    it('should throw an error when Supabase query fails', async () => {
      // Mock a failed Supabase response
      const errorMessage = 'Database connection error';
      mockSelect.mockResolvedValueOnce({
        data: null,
        error: { message: errorMessage },
      });

      // Verify that the promise rejects with the expected error
      await expect(supabaseService.getAllAgendaEvents()).rejects.toThrow(
        `Failed to fetch events: ${errorMessage}`,
      );

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });
  });
});

