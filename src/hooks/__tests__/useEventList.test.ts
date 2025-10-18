import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useEventList } from '../useEventList';
import * as api from '../../services/api';
import { mockApiResponse, mockEmptyApiResponse } from '../../test/mockData/events';

// Mock the API
vi.mock('../../services/api');

// Create wrapper for hook testing
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useEventList Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return initial state with empty events', () => {
      const { result } = renderHook(() => useEventList({ venue: undefined }), {
        wrapper: createWrapper(),
      });

      expect(result.current.allEvents).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should not fetch when venue is not provided', () => {
      renderHook(() => useEventList({ venue: undefined }), {
        wrapper: createWrapper(),
      });

      expect(api.fetchEvents).not.toHaveBeenCalled();
    });

    it('should start loading when venue is provided', () => {
      vi.mocked(api.fetchEvents).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Successful Data Fetching', () => {
    it('should fetch and return events successfully', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.allEvents).toHaveLength(12);
      expect(result.current.allEvents[0].name).toBe('Test Event');
      expect(result.current.error).toBe(null);
    });

    it('should flatten pages correctly', async () => {
      const page1 = mockApiResponse;
      const page2 = {
        ...mockApiResponse,
        data: [{ ...mockApiResponse.data[0], id: '4', name: 'Test Event 4' }],
      };

      vi.mocked(api.fetchEvents)
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Fetch next page
      result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.allEvents).toHaveLength(13);
      });

      expect(result.current.allEvents[12].name).toBe('Test Event 4');
    });

    it('should call API with correct parameters', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      renderHook(() => useEventList({ venue: 'Test Venue', pageSize: 20 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(api.fetchEvents).toHaveBeenCalledWith({
          venue: 'Test Venue',
          pageSize: 20,
          page: 1,
        });
      });
    });

    it('should use default page size when not provided', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(api.fetchEvents).toHaveBeenCalledWith({
          venue: 'Test Venue',
          pageSize: 12,
          page: 1,
        });
      });
    });
  });

  describe('Pagination', () => {
    it('should have next page when data length equals page size', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue', pageSize: 12 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should not have next page when data length is less than page size', async () => {
      const smallResponse = {
        ...mockApiResponse,
        data: mockApiResponse.data.slice(0, 2),
      };
      vi.mocked(api.fetchEvents).mockResolvedValue(smallResponse);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue', pageSize: 12 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('should fetch next page with incremented page number', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.fetchNextPage();

      await waitFor(() => {
        expect(api.fetchEvents).toHaveBeenCalledWith({
          venue: 'Test Venue',
          pageSize: 12,
          page: 2,
        });
      });
    });

    it('should handle isFetchingNextPage state correctly', async () => {
      vi.mocked(api.fetchEvents).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockApiResponse), 100))
      );

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.isFetchingNextPage).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isFetchingNextPage).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('Network error');
      vi.mocked(api.fetchEvents).mockRejectedValue(error);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe('Network error');
      expect(result.current.allEvents).toEqual([]);
    });
  });

  describe('Empty Results', () => {
    it('should handle empty results', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockEmptyApiResponse);

      const { result } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.allEvents).toEqual([]);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Query Configuration', () => {
    it('should use custom staleTime when provided', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const customStaleTime = 1000 * 60 * 10; // 10 minutes
      const { result } = renderHook(
        () => useEventList({ venue: 'Test Venue', staleTime: customStaleTime }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.allEvents).toHaveLength(12);
    });

    it('should update query key when venue changes', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { result, rerender } = renderHook(
        ({ venue }) => useEventList({ venue }),
        {
          wrapper: createWrapper(),
          initialProps: { venue: 'Venue 1' },
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(api.fetchEvents).toHaveBeenCalledWith(
        expect.objectContaining({ venue: 'Venue 1' })
      );

      rerender({ venue: 'Venue 2' });

      await waitFor(() => {
        expect(api.fetchEvents).toHaveBeenCalledWith(
          expect.objectContaining({ venue: 'Venue 2' })
        );
      });

      expect(api.fetchEvents).toHaveBeenCalledTimes(2);
    });
  });

  describe('Memoization', () => {
    it('should memoize allEvents array', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { result, rerender } = renderHook(() => useEventList({ venue: 'Test Venue' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstAllEvents = result.current.allEvents;

      // Rerender without changing data
      rerender();

      expect(result.current.allEvents).toBe(firstAllEvents);
    });
  });
});
