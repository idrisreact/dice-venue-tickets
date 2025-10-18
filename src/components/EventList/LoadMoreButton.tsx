interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function LoadMoreButton({
  onLoadMore,
  isLoading,
  hasMore,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="text-center mt-8">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="px-8 py-3 bg-[#3C74FF] text-white  hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Load more events"
        aria-busy={isLoading}
        type="button"
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
