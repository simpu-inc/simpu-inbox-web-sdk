"use client";

import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Customer } from "@/types";
import { Stack, Text } from "@chakra-ui/react";
import { ListItem } from "../list-item";

export const ContactListItem = ({
  contact,
  isActive,
  onSelectContact,
}: {
  contact: Customer;
  isActive?: boolean;
  onSelectContact?(contact: Customer): void;
}) => {
  return (
    <ListItem.Root
      cursor="pointer"
      isActive={isActive}
      onClick={() => onSelectContact?.(contact)}
    >
      <ListItem.Left>
        <Avatar size="xl" name={contact.name} src={contact.image_url ?? ""} />
      </ListItem.Left>
      <ListItem.Right align="flex-start">
        <Stack gap={0} align="flex-start">
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
            {contact.name}
          </Text>
          <Text textStyle="xs" color="fg.muted">
            {contact.platform_nick}
          </Text>
        </Stack>
      </ListItem.Right>
    </ListItem.Root>
  );
};
