import { supabaseService } from './supabaseService';
import { AgendaEvent } from './dbSchema';

// Mock the entire module to control the createClient function
jest.mock('@supabase/supabase-js', () => {
  const mockSingle = jest.fn();
  const mockSelect = jest.fn(() => ({ single: mockSingle }));
  const mockInsert = jest.fn(() => ({ select: mockSelect }));
  const mockEq = jest.fn(() => ({ select: mockSelect }));
  const mockDeleteEq = jest.fn();
  const mockDelete = jest.fn(() => ({ eq: mockDeleteEq }));
  const mockUpdate = jest.fn(() => ({ eq: mockEq }));
  const mockFrom = jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
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
  const mockUpdate = mockFrom().update;
  const mockEq = mockFrom().update().eq;
  const mockSingle = mockFrom().select().single;
  const mockDelete = mockFrom().delete;
  const mockDeleteEq = mockFrom().delete().eq;

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

  describe('updateAgendaEvent', () => {
    it('should update an event and return the transformed response', async () => {
      const eventId = '1';
      // Partial event data to update
      const updateData: Partial<Omit<AgendaEvent, 'id'>> = {
        name: 'Updated Event Name',
        start: '2023-04-01T00:00:00.000Z',
        state: { current: 'mainfocus' },
      };

      // Expected database format for the update
      const expectedDbUpdate = {
        name: 'Updated Event Name',
        start_date: '2023-04-01T00:00:00.000Z',
        state: { current: 'mainfocus' },
      };

      // Mock response from Supabase after update
      const mockResponseData = {
        id: '1',
        name: 'Updated Event Name',
        start_date: '2023-04-01T00:00:00.000Z',
        end_date: '2023-04-30T00:00:00.000Z',
        state: { current: 'mainfocus' },
        tags: ['test'],
      };

      // Setup the mock chain
      mockSingle.mockResolvedValueOnce({ data: mockResponseData, error: null });

      // Call the service method
      const result = await supabaseService.updateAgendaEvent(
        eventId,
        updateData,
      );

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockUpdate).toHaveBeenCalledWith(expectedDbUpdate);
      expect(mockEq).toHaveBeenCalledWith('id', eventId);

      // Assert that the returned data is transformed correctly
      expect(result).toEqual({
        id: '1',
        name: 'Updated Event Name',
        start: '2023-04-01T00:00:00.000Z',
        end: '2023-04-30T00:00:00.000Z',
        state: { current: 'mainfocus' },
        tags: ['test'],
      } as AgendaEvent);
    });

    it('should update an event with end date and return the transformed response', async () => {
      const eventId = '2';
      // Partial event data to update - only updating end date
      const updateData: Partial<Omit<AgendaEvent, 'id'>> = {
        end: '2023-05-31T00:00:00.000Z',
      };

      // Expected database format for the update
      const expectedDbUpdate = {
        end_date: '2023-05-31T00:00:00.000Z',
      };

      // Mock response from Supabase after update
      const mockResponseData = {
        id: '2',
        name: 'Test Event 2',
        start_date: '2023-02-01T00:00:00.000Z',
        end_date: '2023-05-31T00:00:00.000Z',
        state: { exhibitions: 'candidate' },
        tags: null,
      };

      // Setup the mock chain
      mockSingle.mockResolvedValueOnce({ data: mockResponseData, error: null });

      // Call the service method
      const result = await supabaseService.updateAgendaEvent(
        eventId,
        updateData,
      );

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockUpdate).toHaveBeenCalledWith(expectedDbUpdate);
      expect(mockEq).toHaveBeenCalledWith('id', eventId);

      // Assert that the returned data is transformed correctly
      expect(result).toEqual({
        id: '2',
        name: 'Test Event 2',
        start: '2023-02-01T00:00:00.000Z',
        end: '2023-05-31T00:00:00.000Z',
        state: { exhibitions: 'candidate' },
        tags: null,
      } as AgendaEvent);
    });

    it('should throw an error when event update fails', async () => {
      const eventId = '3';
      const updateData: Partial<Omit<AgendaEvent, 'id'>> = {
        name: 'Updated Name',
      };

      // Mock a failed Supabase response
      const errorMessage = 'Record not found';
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: errorMessage },
      });

      // Verify that the promise rejects with the expected error
      await expect(
        supabaseService.updateAgendaEvent(eventId, updateData),
      ).rejects.toThrow(`Failed to update event: ${errorMessage}`);

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockUpdate).toHaveBeenCalledWith({
        name: 'Updated Name',
      });
      expect(mockEq).toHaveBeenCalledWith('id', eventId);
    });
  });

  describe('deleteAgendaEvent', () => {
    it('should delete an event and return the event id', async () => {
      const eventId = '1';

      // Mock a successful Supabase response
      mockDeleteEq.mockResolvedValueOnce({ error: null });

      // Call the service method
      const result = await supabaseService.deleteAgendaEvent(eventId);

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockDeleteEq).toHaveBeenCalledWith('id', eventId);

      // Assert that the event ID is returned
      expect(result).toEqual(eventId);
    });

    it('should throw an error when event deletion fails', async () => {
      const eventId = '999';

      // Mock a failed Supabase response
      const errorMessage = 'Record not found';
      mockDeleteEq.mockResolvedValueOnce({
        error: { message: errorMessage },
      });

      // Verify that the promise rejects with the expected error
      await expect(supabaseService.deleteAgendaEvent(eventId)).rejects.toThrow(
        `Failed to delete event: ${errorMessage}`,
      );

      // Verify Supabase client was called correctly
      expect(mockFrom).toHaveBeenCalledWith('agenda_events');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockDeleteEq).toHaveBeenCalledWith('id', eventId);
    });
  });
});
