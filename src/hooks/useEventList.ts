import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { DiceApiResponse } from "../types/event";
import { fetchEvents } from "../services/api";

interface UseEventListOptions {
  venue?: string;
  pageSize?: number;
  staleTime?: number;
}

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_STALE_TIME = 1000 * 30;

export function useEventList({
  venue,
  pageSize = DEFAULT_PAGE_SIZE,
  staleTime = DEFAULT_STALE_TIME,
}: UseEventListOptions) {
  const queryResult = useInfiniteQuery({
    queryKey: ["events", venue, pageSize],
    queryFn: async ({ pageParam }) => {
      return await fetchEvents({
        venue,
        pageSize,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage: DiceApiResponse, allPages) => {
      const hasMore = lastPage.data.length === pageSize;
      return hasMore ? allPages.length + 1 : undefined;
    },
    enabled: !!venue,
    initialPageParam: 1,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    staleTime,
  });

  const allEvents = useMemo(
    () => queryResult.data?.pages.flatMap((page) => page.data) ?? [],
    [queryResult.data]
  );

  return {
    ...queryResult,
    allEvents,
  };
}
