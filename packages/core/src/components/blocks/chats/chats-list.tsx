"use client";

import { Thread, ThreadRequestParams } from "@/types";
import { useDebounce } from "@/utils/hooks";
import { useGetThreads } from "@/utils/queries";
import { BoxProps, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { InfiniteScroll } from "../infinite-scroll";
import { ChatsListItem } from "./chats-list-item";

export interface ChatsListProps extends BoxProps {
  params?: ThreadRequestParams;
  isChatItemActive?(chat: Thread): boolean;
  onChatListItemClick(chatItem: Thread): void;
}

export const ChatsList = ({
  params,
  isChatItemActive,
  onChatListItemClick,
  ...props
}: ChatsListProps) => {
  const debouncedSearchQuery = useDebounce(params?.q ?? "", 1500);

  const { data, fetchNextPage, hasNextPage } = useGetThreads({
    filter: "all",
    params: {
      ...params,
      q: debouncedSearchQuery || undefined,
    },
  });

  const chats = data?.pages.flatMap((t) => t.threads);

  if (!chats?.length) {
    return (
      <Flex py={20} align="center" justify="center" textAlign="center">
        <Heading>No chats</Heading>
      </Flex>
    );
  }

  return (
    <InfiniteScroll
      flex={1}
      overflowY="auto"
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      loader={
        <Flex align="center" justify="center" py={2}>
          <Spinner size="sm" />
        </Flex>
      }
      endMessage={
        <Text py={2} textAlign="center" textStyle="xs" color="fg.muted">
          Nothing more to load
        </Text>
      }
      {...props}
    >
      {chats.map((c) => (
        <ChatsListItem
          key={c.uuid}
          chatItem={c}
          isActive={isChatItemActive?.(c)}
          onChatListItemClick={onChatListItemClick}
        />
      ))}
    </InfiniteScroll>
  );
};
