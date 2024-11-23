"use client";

import { mergeRefs } from "@/lib/merge-refs";
import { DetailedHTMLProps } from "react";
import { HTMLAttributes } from "react";
import {
  ForwardedRef,
  PropsWithChildren,
  ReactNode,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface InfiniteScrollProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  reverse?: boolean;
  hasMore?: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
  additionalRef?: RefObject<HTMLDivElement>;
  loadMore?: (() => Promise<void>) | (() => void);
}

export const InfiniteScroll = forwardRef(
  (props: InfiniteScrollProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
    const {
      loader,
      hasMore,
      children,
      endMessage,
      reverse = false,
      loadMore,
      ...rest
    } = props;

    const [isFetching, setIsFetching] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const finalRef = mergeRefs(containerRef, forwardedRef);

    const handleScroll = useCallback(() => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (reverse) {
        if (scrollTop <= clientHeight * 0.5 && !isFetching && hasMore) {
          setIsFetching(true);
        }
      } else {
        if (
          scrollHeight - scrollTop <= clientHeight * 1.5 &&
          !isFetching &&
          hasMore
        ) {
          setIsFetching(true);
        }
      }
    }, [isFetching, reverse, hasMore]);

    useEffect(() => {
      const ref = containerRef.current;

      if (ref) {
        ref?.addEventListener("scroll", handleScroll);
        return () => ref?.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    useEffect(() => {
      if (!isFetching) return;
      loadMoreItems();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching]);

    const loadMoreItems = async () => {
      const previousScrollHeight = containerRef.current?.scrollHeight ?? 0;

      await loadMore?.();
      setIsFetching(false);

      if (reverse && containerRef.current) {
        const newScrollHeight = containerRef.current.scrollHeight;
        const additionalHeight = newScrollHeight - previousScrollHeight;
        containerRef.current.scrollTop += additionalHeight;
      }
    };

    return (
      <div ref={finalRef} {...rest}>
        {children}
        {isFetching && loader}
        {!hasMore && endMessage}
      </div>
    );
  }
);

InfiniteScroll.displayName = "InfiniteScroll";
