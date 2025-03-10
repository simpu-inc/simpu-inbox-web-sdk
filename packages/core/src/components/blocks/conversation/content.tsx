"use client";

import { Message } from "simpu-api-sdk";
import {
  useGetMessages,
  useGetThread,
  useMarkChatAsRead,
} from "@/utils/queries";
import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { ForwardedRef, forwardRef, Fragment } from "react";
import { InfiniteScroll } from "../infinite-scroll";
import { ChatMessage } from "./message";

export const ConversationContent = forwardRef(
  (
    {
      thread_id,
      setMessageToReply,
    }: {
      thread_id: string;
      setMessageToReply?(message: Message): void;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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

    return (
      <InfiniteScroll
        py={4}
        gap={4}
        flex={1}
        w="full"
        reverse
        ref={ref}
        display="flex"
        overflowY="auto"
        position="relative"
        hasMore={hasNextPage}
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
  }
);
