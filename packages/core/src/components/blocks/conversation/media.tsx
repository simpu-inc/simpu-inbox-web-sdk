"use client";

import React from "react";
import { useGetThread } from "@/utils/queries";
import { Flex, Stack, StackProps, Text, TextProps } from "@chakra-ui/react";

export const ConversationMediaText = (props: TextProps) => <Text {...props} />;

export interface ConversationMediaProps extends StackProps {
  thread_id: string;
}

export const ConversationMedia = ({
  thread_id,
  ...props
}: ConversationMediaProps) => {
  const { data: thread } = useGetThread(thread_id);

  return (
    <Stack gap={6} p={6} bg="bg.subtle" {...props}>
      <Stack>
        <Flex align="center" justify="space-between">
          <ConversationMediaText
            textStyle="sm"
            color="fg.muted"
            fontWeight={500}
          >
            Media, links and documents
          </ConversationMediaText>
          <ConversationMediaText
            textStyle="sm"
            color="fg.muted"
            fontWeight={500}
          >
            25
          </ConversationMediaText>
        </Flex>
      </Stack>
    </Stack>
  );
};
