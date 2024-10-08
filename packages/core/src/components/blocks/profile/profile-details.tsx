"use client";

import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { useGetProfile } from "@/utils/queries";
import { HStack, Text, VStack } from "@chakra-ui/react";

export const ProfileDetails = () => {
  const { data } = useGetProfile();

  return (
    <HStack w="full" py={6} px={4} gap={4} alignItems="center">
      <Avatar
        size="xl"
        src={data?.profile.image}
        name={data?.profile.first_name}
      />
      <VStack gap={0} alignItems="flex-start">
        <Text fontWeight="medium">
          {data?.profile.first_name} {data?.profile.last_name}
        </Text>
        <Text textStyle="sm" color="fg.muted">
          {data?.user.email}
        </Text>
      </VStack>
    </HStack>
  );
};
