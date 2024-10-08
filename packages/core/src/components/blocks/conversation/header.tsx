"use client";

import React, { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Thread } from "@/types";
import { useGetThread } from "@/utils/queries";
import { Flex, FlexProps, HStack, Text } from "@chakra-ui/react";

export interface ConversationHeaderProps extends Omit<FlexProps, "children"> {
  thread_id: string;
  children: (thread?: Thread) => ReactNode;
}

export const ConversationHeader = ({
  thread_id,
  onClick,
  children,
  ...props
}: ConversationHeaderProps) => {
  const { data: thread } = useGetThread(thread_id);

  const { sender } = thread ?? {};

  const name = sender?.name ?? sender?.platform_name ?? sender?.platform_nick;

  return (
    <Flex
      px={6}
      w="full"
      h="60px"
      bg="bg.subtle"
      align="center"
      borderBottomWidth={1}
      justifyContent="space-between"
      {...props}
    >
      <HStack align="center" flex={1} onClick={onClick}>
        <Avatar name={name} src={sender?.image_url ?? ""} />
        <Text fontWeight="medium">{name}</Text>
      </HStack>
      {children(thread)}
    </Flex>
  );
};
