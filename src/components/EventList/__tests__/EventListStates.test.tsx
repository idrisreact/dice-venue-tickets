import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import { LoadingState, ErrorState, EmptyState } from '../EventListStates';

describe('EventListStates', () => {
  describe('LoadingState', () => {
    it('should render default loading message', () => {
      render(<LoadingState />);

      expect(screen.getByText('Loading events...')).toBeInTheDocument();
    });

    it('should render custom loading message', () => {
      render(<LoadingState message="Please wait..." />);

      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<LoadingState />);

      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should apply correct CSS classes', () => {
      render(<LoadingState />);

      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toHaveClass('text-center', 'text-gray-500', 'mt-12');
    });
  });

  describe('ErrorState', () => {
    const mockError = new Error('Failed to fetch events');

    it('should render error message', () => {
      render(<ErrorState error={mockError} />);

      expect(screen.getByText('Error loading events')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch events')).toBeInTheDocument();
    });

    it('should render venue suggestion when venue is provided', () => {
      render(<ErrorState error={mockError} venue="Test Venue" />);

      expect(screen.getByText('Try searching for a different venue')).toBeInTheDocument();
    });

    it('should not render venue suggestion when venue is not provided', () => {
      render(<ErrorState error={mockError} />);

      expect(screen.queryByText('Try searching for a different venue')).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<ErrorState error={mockError} />);

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('should apply correct CSS classes', () => {
      render(<ErrorState error={mockError} />);

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveClass('text-center', 'text-red-500', 'mt-12');
    });
  });

  describe('EmptyState', () => {
    it('should render provided message', () => {
      const message = 'No events available';
      render(<EmptyState message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<EmptyState message="Empty" />);

      const emptyElement = screen.getByRole('status');
      expect(emptyElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should apply correct CSS classes', () => {
      render(<EmptyState message="Empty" />);

      const emptyElement = screen.getByRole('status');
      expect(emptyElement).toHaveClass('text-center', 'text-gray-500', 'mt-12');
    });
  });
});
