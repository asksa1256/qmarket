import { useRef, useEffect } from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";

interface UseInfinityScrollProps<TData, TError> {
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<TData>, TError>>; // 리액트 쿼리의 반환 타입 사용
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

/**
 * 무한 스크롤 감지 커스텀 훅 (리액트 쿼리 연동)
 * Intersection Observer를 사용하여 목록의 끝을 감지하고 다음 페이지 로드
 * @param {UseInfinityScrollProps} props
 * @returns {{ loadMoreRef: React.RefObject<HTMLDivElement> }} - 옵저버 대상이 될 DOM 요소의 Ref 객체
 */
const useInfiniteScroll = <TData = unknown, TError = unknown>({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseInfinityScrollProps<TData, TError>) => {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 엔트리가 뷰포트에 진입했고, 다음 페이지가 있으며, 현재 다음 페이지를 불러오는 중이 아닐 경우 다음 페이지 로드
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return { loadMoreRef };
};

export default useInfiniteScroll;
