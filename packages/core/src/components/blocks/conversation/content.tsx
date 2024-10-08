"use client";

import { Message } from "@/types";
import {
  useGetMessages,
  useGetThread,
  useMarkChatAsRead,
} from "@/utils/queries";
import {
  Box,
  Flex,
  IconButton,
  IconButtonProps,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { InfiniteScroll } from "../infinite-scroll";
import { ChatMessage } from "./message";

export const ConversationContent = ({
  thread_id,
  scrollToBottomButtonProps,
  setMessageToReply,
}: {
  thread_id: string;
  scrollToBottomButtonProps?: IconButtonProps;
  setMessageToReply?(message: Message): void;
}) => {
  const { data: thread } = useGetThread(thread_id);
  useMarkChatAsRead(thread_id, !!thread?.is_read);
  const {
    data: threadMessages,
    hasNextPage,
    fetchNextPage,
  } = useGetMessages({
    thread_id,
    type: "thread",
    params: { per_page: 25, type: "all" },
  });

  const messages = threadMessages?.pages.flatMap((tm) => tm.contents) ?? [];

  const groupedMessages = Object.groupBy(messages, (message: any) =>
    dayjs(new Date(message.created_datetime)).format("MMM DD, YYYY")
  );

  const infiniteScrollDiv = useRef<HTMLDivElement>(null);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = () => {
    if (infiniteScrollDiv.current) {
      if (infiniteScrollDiv.current.scrollTop >= 0) {
        setShowScrollToBottom(false);
      } else {
        setShowScrollToBottom(true);
      }
    }
  };

  const handleScrollToBottom = () => {
    if (infiniteScrollDiv.current) {
      infiniteScrollDiv.current.scrollTop = 1;
    }
  };

  useEffect(() => {
    if (infiniteScrollDiv.current) {
      infiniteScrollDiv.current.onscroll = handleScroll;
    }
  }, []);

  return (
    <InfiniteScroll
      py={4}
      gap={4}
      flex={1}
      w="full"
      reverse
      display="flex"
      overflowY="auto"
      hasMore={hasNextPage}
      ref={infiniteScrollDiv}
      scrollBehavior="smooth"
      flexDirection="column-reverse"
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
      loadMore={fetchNextPage}
    >
      {showScrollToBottom && (
        <IconButton
          size="sm"
          zIndex={100}
          shadow="xs"
          right="20px"
          bottom="112px"
          rounded="full"
          position="absolute"
          onClick={handleScrollToBottom}
          {...scrollToBottomButtonProps}
        >
          <LuChevronDown />
        </IconButton>
      )}

      {Object.keys(groupedMessages)?.map((date, index) => (
        <Fragment key={`${date}-${index}`}>
          <>
            {groupedMessages?.[date]?.map((m) => (
              <ChatMessage
                key={m.uuid}
                message={m}
                setMessageToReply={setMessageToReply}
              />
            ))}
          </>
          <Stack px={16} gap={4} py={2} direction="row" alignItems="center">
            <Box w="full" as="hr" h="1px" borderColor="border" />
            <Flex
              py={2}
              w="250px"
              rounded="sm"
              align="center"
              borderWidth={1}
              bg="transparent"
              justify="center"
            >
              <Text
                textStyle="xs"
                color="fg.muted"
                textAlign="center"
                fontWeight="medium"
              >
                {date}
              </Text>
            </Flex>
            <Box w="full" as="hr" h="1px" borderColor="border" />
          </Stack>
        </Fragment>
      ))}
    </InfiniteScroll>
  );
};
