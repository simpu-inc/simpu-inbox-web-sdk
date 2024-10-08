"use client";

import { AccountPlatformIcon } from "@/components/blocks/accounts";
import { Avatar } from "@/components/ui/avatar";
import { Thread } from "@/types";
import { formatMessageDateTime } from "@/utils/functions";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LuImage } from "react-icons/lu";
import { ListItem } from "../list-item";

export const ChatsListItem = (props: {
  chatItem: Thread;
  isActive?: boolean;
  onChatListItemClick?(chatItem: Thread): void;
}) => {
  const { isActive, chatItem, onChatListItemClick } = props;

  const { is_read, sender, last_message, updated_datetime, channel_name } =
    chatItem;
  const { entity } = last_message ?? {};
  const { content, attachments } = entity ?? {};

  return (
    <ListItem.Root
      cursor="pointer"
      isActive={isActive}
      onClick={() => onChatListItemClick?.(chatItem)}
    >
      <ListItem.Left position="relative">
        <Avatar
          size="xl"
          src={sender?.image_url ?? undefined}
          name={sender?.name ?? sender?.platform_name ?? sender?.platform_nick}
        />
        <AccountPlatformIcon
          right="16px"
          bottom="8px"
          platform={channel_name ?? ""}
        />
      </ListItem.Left>
      <ListItem.Right>
        <Flex w="full" align="center" justify="space-between">
          <Text
            maxW="250px"
            flexGrow={1}
            textStyle="sm"
            overflow="hidden"
            fontWeight="medium"
            whiteSpace="nowrap"
            position="relative"
            display="inline-block"
            textOverflow="ellipsis"
          >
            {sender?.name ?? sender?.platform_name ?? sender?.platform_nick}
          </Text>
          <Text textStyle="xs" color="fg.muted">
            {formatMessageDateTime(new Date(updated_datetime))}
          </Text>
        </Flex>
        <Flex w="full" align="center" justify="space-between">
          <Flex direction="column" flex={1}>
            {content?.body && (
              <Text
                maxW="250px"
                textStyle="xs"
                color="fg.muted"
                overflow="hidden"
                fontWeight="normal"
                whiteSpace="nowrap"
                position="relative"
                display="inline-block"
                textOverflow="ellipsis"
              >
                {content.body}
              </Text>
            )}
            {!!attachments?.length && (
              <Box pt={1}>
                <LuImage />
              </Box>
            )}
          </Flex>
          {!is_read && (
            <Box shadow="xs" boxSize={2} rounded="full" bg="green.fg" />
          )}
        </Flex>
      </ListItem.Right>
    </ListItem.Root>
  );
};
