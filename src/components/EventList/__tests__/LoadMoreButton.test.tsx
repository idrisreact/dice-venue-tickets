import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { LoadMoreButton } from '../LoadMoreButton';

describe('LoadMoreButton', () => {
  it('should render button when hasMore is true', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    expect(screen.getByRole('button', { name: /load more events/i })).toBeInTheDocument();
  });

  it('should not render button when hasMore is false', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={false} />);

    expect(screen.queryByRole('button', { name: /load more events/i })).not.toBeInTheDocument();
  });

  it('should call onLoadMore when clicked', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    await user.click(button);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should display "Load More" text when not loading', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  it('should display "Loading..." text when loading', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={true} hasMore={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={true} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    expect(button).toBeDisabled();
  });

  it('should not be disabled when not loading', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    expect(button).not.toBeDisabled();
  });

  it('should not call onLoadMore when button is disabled', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={true} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    await user.click(button);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    expect(button).toHaveAttribute('aria-label', 'Load more events');
    expect(button).toHaveAttribute('aria-busy', 'false');
  });

  it('should have aria-busy true when loading', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={true} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should have correct button type', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should apply correct CSS classes', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore={true} />);

    const button = screen.getByRole('button', { name: /load more events/i });
    expect(button).toHaveClass('px-8', 'py-3', 'bg-blue-600', 'text-white', 'rounded-lg');
  });
});
