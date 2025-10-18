interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading events..." }: LoadingStateProps) {
  return (
    <div
      className="text-center text-gray-500 mt-12"
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
    </div>
  );
}

interface ErrorStateProps {
  error: Error;
  venue?: string;
}

export function ErrorState({ error, venue }: ErrorStateProps) {
  return (
    <div
      className="text-center text-red-500 mt-12"
      role="alert"
      aria-live="assertive"
    >
      <p className="font-semibold mb-2">Error loading events</p>
      <p className="text-sm text-red-400">{error.message}</p>
      {venue && (
        <p className="text-sm text-gray-500 mt-2">
          Try searching for a different venue
        </p>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div
      className="text-center text-gray-500 mt-12"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
