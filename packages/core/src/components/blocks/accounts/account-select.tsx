"use client";

import { AccountPlatformIcon } from "@/components/blocks/accounts/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Account } from "@/types";
import { Box, createListCollection, HStack } from "@chakra-ui/react";
import React from "react";

export const SelectValueItem = () => (
  <SelectValueText placeholder="Select account">
    {(
      items: Array<{
        name: string;
        avatar: string;
        platform: string;
        channel_id: string;
      }>
    ) => {
      const { name, avatar, platform } = items[0];
      return (
        <HStack>
          <Box position="relative">
            <Avatar name={name} size="xs" src={avatar} />
            <AccountPlatformIcon boxSize={2} bottom="4px" platform={platform} />
          </Box>
          {name}
        </HStack>
      );
    }}
  </SelectValueText>
);

export interface AccountSelectValue {
  id: string;
  name: string;
  channel_id: string;
  platform: string;
  avatar: string;
}

export const AccountSelect = ({
  accounts: userAccounts,
  onSelectAccount,
}: {
  accounts: Account[];
  onSelectAccount?(value: AccountSelectValue): void;
}) => {
  const accounts = createListCollection({
    items:
      userAccounts?.map((a) => ({
        id: a.uuid,
        name: a.name ?? "",
        channel_id: a.channel_id,
        platform: a.channel_name,
        avatar: a.user?.image_url ?? "",
      })) ?? [],
    itemToString: (item) => item.name,
    itemToValue: (item) => JSON.stringify(item),
  });

  return (
    <SelectRoot
      w="full"
      size="sm"
      variant="filled"
      collection={accounts}
      positioning={{ sameWidth: true }}
      onValueChange={({ value }) => onSelectAccount?.(JSON.parse(value[0]))}
    >
      <SelectTrigger>
        <SelectValueItem />
      </SelectTrigger>
      <SelectContent portalled={false}>
        {accounts.items.map((account) => (
          <SelectItem
            item={account}
            key={account.id}
            justifyContent="flex-start"
          >
            <Box position="relative">
              <Avatar size="xs" name={account.name} src={account.avatar} />
              <AccountPlatformIcon
                bottom="4px"
                boxSize={2}
                platform={account.platform}
              />
            </Box>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
