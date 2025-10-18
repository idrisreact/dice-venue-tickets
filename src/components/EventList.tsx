import { useEventList } from "../hooks/useEventList";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "./EventList/EventListStates";
import { EventGrid } from "./EventList/EventGrid";
import { LoadMoreButton } from "./EventList/LoadMoreButton";

interface EventListProps {
  venue?: string;
}

export default function EventList({ venue }: EventListProps) {
  if (!venue) {
    return <EmptyState message="Enter a venue name to search for events" />;
  }

  const {
    allEvents,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useEventList({ venue });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} venue={venue} />;
  }

  if (allEvents.length === 0) {
    return <EmptyState message={`No events found for "${venue}"`} />;
  }

  return (
    <div>
      <EventGrid events={allEvents} />
      <LoadMoreButton
        onLoadMore={fetchNextPage}
        isLoading={isFetchingNextPage}
        hasMore={!!hasNextPage}
      />
    </div>
  );
}
