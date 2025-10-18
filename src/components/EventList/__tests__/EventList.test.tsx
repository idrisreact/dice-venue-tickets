import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import EventList from '../../EventList';
import * as api from '../../../services/api';
import { mockApiResponse, mockEmptyApiResponse } from '../../../test/mockData/events';

// Mock the API
vi.mock('../../../services/api');

describe('EventList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should show empty state when no venue is provided', () => {
      render(<EventList />);

      expect(screen.getByText('Enter a venue name to search for events')).toBeInTheDocument();
    });

    it('should show loading state initially when venue is provided', async () => {
      vi.mocked(api.fetchEvents).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<EventList venue="Test Venue" />);

      expect(screen.getByText('Loading events...')).toBeInTheDocument();
    });
  });

  describe('Successful Data Fetching', () => {
    it('should display events when data is successfully fetched', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
      expect(screen.getByText('Test Event 3')).toBeInTheDocument();
    });

    it('should display Load More button when there are more pages', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /load more events/i })).toBeInTheDocument();
      });
    });

    it('should not display Load More button when no more pages', async () => {
      const lastPageResponse = {
        ...mockApiResponse,
        data: mockApiResponse.data.slice(0, 5), // Less than page size
      };
      vi.mocked(api.fetchEvents).mockResolvedValue(lastPageResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      expect(screen.queryByRole('button', { name: /load more events/i })).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should load more events when Load More button is clicked', async () => {
      const user = userEvent.setup();
      const page2Response = {
        ...mockApiResponse,
        data: [
          { ...mockApiResponse.data[0], id: '13', name: 'Test Event Page 2-1' },
          { ...mockApiResponse.data[0], id: '14', name: 'Test Event Page 2-2' },
        ],
      };

      vi.mocked(api.fetchEvents)
        .mockResolvedValueOnce(mockApiResponse)
        .mockResolvedValueOnce(page2Response);

      render(<EventList venue="Test Venue" />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByRole('button', { name: /load more events/i });
      await user.click(loadMoreButton);

      // Wait for new events to appear
      await waitFor(() => {
        expect(screen.getByText('Test Event Page 2-1')).toBeInTheDocument();
      });

      expect(screen.getByText('Test Event Page 2-2')).toBeInTheDocument();
      expect(api.fetchEvents).toHaveBeenCalledTimes(2);
    });

    it('should disable Load More button while loading', async () => {
      const user = userEvent.setup();
      vi.mocked(api.fetchEvents).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockApiResponse), 100);
          })
      );

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByRole('button', { name: /load more events/i });
      await user.click(loadMoreButton);

      // Button should be disabled while loading
      expect(loadMoreButton).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error state when API call fails', async () => {
      const errorMessage = 'Network error';
      vi.mocked(api.fetchEvents).mockRejectedValue(new Error(errorMessage));

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByText('Error loading events')).toBeInTheDocument();
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('Try searching for a different venue')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes in error state', async () => {
      vi.mocked(api.fetchEvents).mockRejectedValue(new Error('Test error'));

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no events are found', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockEmptyApiResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByText('No events found for "Test Venue"')).toBeInTheDocument();
      });
    });

    it('should have proper accessibility attributes in empty state', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockEmptyApiResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        const emptyState = screen.getByRole('status');
        expect(emptyState).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on event grid', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        const eventList = screen.getByRole('list', { name: /events list/i });
        expect(eventList).toBeInTheDocument();
      });
    });

    it('should have proper aria-busy attribute on Load More button', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /load more events/i });
        expect(button).toHaveAttribute('aria-busy', 'false');
      });
    });
  });

  describe('Venue Changes', () => {
    it('should refetch data when venue prop changes', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { rerender } = render(<EventList venue="Venue 1" />);

      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      expect(api.fetchEvents).toHaveBeenCalledWith(
        expect.objectContaining({ venue: 'Venue 1' })
      );

      rerender(<EventList venue="Venue 2" />);

      await waitFor(() => {
        expect(api.fetchEvents).toHaveBeenCalledWith(
          expect.objectContaining({ venue: 'Venue 2' })
        );
      });

      expect(api.fetchEvents).toHaveBeenCalledTimes(2);
    });

    it('should show empty state when venue is removed', async () => {
      vi.mocked(api.fetchEvents).mockResolvedValue(mockApiResponse);

      const { rerender } = render(<EventList venue="Test Venue" />);

      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      rerender(<EventList />);

      expect(screen.getByText('Enter a venue name to search for events')).toBeInTheDocument();
    });
  });
});
