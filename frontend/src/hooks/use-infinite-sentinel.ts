import { useEffect, type RefObject } from "react";

const useInfiniteSentinel = (fetchNextPage: () => {}, hasNextPage: boolean, isFetchingNextPage: boolean, sentinelRef: RefObject<HTMLDivElement | null>) => {
	useEffect(() => {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage)
						fetchNextPage();
				},
				{ threshold: 0.1, rootMargin: "100px" }
			);
	
			if (sentinelRef.current) observer.observe(sentinelRef.current);
	
			return () => observer.disconnect();
		}, [fetchNextPage, hasNextPage, isFetchingNextPage]);
}

export default useInfiniteSentinel