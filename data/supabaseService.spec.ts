import { supabaseService } from './supabaseService';
import { AgendaEvent } from './dbSchema';

// Mock the entire module to control the createClient function
jest.mock('@supabase/supabase-js', () => {
  const mockSingle = jest.fn();
  const mockSelect = jest.fn(() => ({ single: mockSingle }));
  const mockInsert = jest.fn(() => ({ select: mockSelect }));
  const mockFrom = jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
  }));
  const mockClient = { from: mockFrom };

  return {
    createClient: jest.fn(() => mockClient),
  };
});

// Get direct access to the mocked module
const mockedSupabase = jest.requireMock('@supabase/supabase-js');

describe('supabaseService', () => {
  // Get references to mock functions
  const mockClient = mockedSupabase.createClient();
  const mockFrom = mockClient.from;
  const mockSelect = mockFrom().select;
  const mockInsert = mockFrom().insert;
  const mockSingle = mockFrom().select().single;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAgendaEvents', () => {
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

  describe('createNewAgendaEvent', () => {
    it('should create a new event and return the transformed response', async () => {
      // Input event to create
      const newEvent: Omit<AgendaEvent, 'id'> = {
        name: 'New Test Event',
        start: '2023-03-01T00:00:00.000Z',
        end: '2023-03-31T00:00:00.000Z',
        state: { music: 'highlight' },
        tags: ['test', 'new'],
      };

      // Expected database format for the insert
      const expectedDbEvent = {
        name: 'New Test Event',
        start_date: '2023-03-01T00:00:00.000Z',
        end_date: '2023-03-31T00:00:00.000Z',
        state: { music: 'highlight' },
        tags: ['test', 'new'],
      };

      // Mock response from Supabase after insert
      const mockResponseData = {
        id: '3',
        name: 'New Test Event',
        start_date: '2023-03-01T00:00:00.000Z',
        end_date: '2023-03-31T00:00:00.000Z',
        state: { music: 'highlight' },
        tags: ['test', 'new'],
      };

      // Setup the mock chain
      mockSingle.mockResolvedValueOnce({ data: mockResponseData, error: null });

      // Call the service method
      const result = await supabaseService.createNewAgendaEvent(newEvent);

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockInsert).toHaveBeenCalledWith(expectedDbEvent);

      // Assert that the returned data is transformed correctly
      expect(result).toEqual({
        id: '3',
        name: 'New Test Event',
        start: '2023-03-01T00:00:00.000Z',
        end: '2023-03-31T00:00:00.000Z',
        state: { music: 'highlight' },
        tags: ['test', 'new'],
      } as AgendaEvent);
    });

    it('should throw an error when event creation fails', async () => {
      // Input event to create
      const newEvent: Omit<AgendaEvent, 'id'> = {
        name: 'New Test Event',
        start: '2023-03-01T00:00:00.000Z',
        end: '2023-03-31T00:00:00.000Z',
        state: { music: 'highlight' },
      };

      // Mock a failed Supabase response
      const errorMessage = 'Validation error';
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: errorMessage },
      });

      // Verify that the promise rejects with the expected error
      await expect(
        supabaseService.createNewAgendaEvent(newEvent),
      ).rejects.toThrow(`Failed to create event: ${errorMessage}`);

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
    });
  });
});
