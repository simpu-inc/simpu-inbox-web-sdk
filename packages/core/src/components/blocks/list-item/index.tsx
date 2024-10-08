"use client";

import { Flex, FlexProps, HStack, StackProps, VStack } from "@chakra-ui/react";
import React from "react";

export interface ListItemRootProps extends StackProps {
  isActive?: boolean;
}

const ListItemRoot = ({ isActive, ...props }: ListItemRootProps) => {
  return (
    <HStack
      w="full"
      gap={0}
      bg={isActive ? "bg.subtle" : undefined}
      _hover={{ bg: "bg.subtle", textDecoration: "none" }}
      {...props}
    />
  );
};

const ListItemLeft = (props: FlexProps) => (
  <Flex
    px="4"
    h="72px"
    mt="-1px"
    align="center"
    justify="center"
    flexBasis="auto"
    flexWrap="nowrap"
    {...props}
  />
);

const ListItemRight = (props: StackProps) => (
  <VStack
    w="full"
    gap={0}
    h="72px"
    flex={1}
    pr="15px"
    justify="center"
    borderBottomWidth={1}
    {...props}
  />
);

export const ListItem = {
  Root: ListItemRoot,
  Left: ListItemLeft,
  Right: ListItemRight,
};
