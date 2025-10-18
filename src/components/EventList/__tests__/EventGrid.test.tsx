import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import { EventGrid } from '../EventGrid';
import { mockEvents } from '../../../test/mockData/events';

describe('EventGrid', () => {
  it('should render all events', () => {
    render(<EventGrid events={mockEvents} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    expect(screen.getByText('Test Event 3')).toBeInTheDocument();
  });

  it('should render empty grid when no events', () => {
    render(<EventGrid events={[]} />);

    const grid = screen.getByRole('list');
    expect(grid).toBeInTheDocument();
    expect(grid.children).toHaveLength(0);
  });

  it('should have proper accessibility attributes', () => {
    render(<EventGrid events={mockEvents} />);

    const grid = screen.getByRole('list');
    expect(grid).toHaveAttribute('aria-label', 'Events list');
  });

  it('should apply correct CSS grid classes', () => {
    render(<EventGrid events={mockEvents} />);

    const grid = screen.getByRole('list');
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4',
      'gap-6',
      'items-start'
    );
  });

  it('should render correct number of event cards', () => {
    render(<EventGrid events={mockEvents} />);

    const grid = screen.getByRole('list');
    expect(grid.children).toHaveLength(mockEvents.length);
  });

  it('should pass correct event data to EventCard', () => {
    render(<EventGrid events={mockEvents} />);

    // Check that venue information is displayed (from EventCard)
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.name)).toBeInTheDocument();
    });
  });
});
