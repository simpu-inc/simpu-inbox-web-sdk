"use client";

import { IconButton, IconButtonProps } from "@chakra-ui/react";
import React from "react";
import { LuChevronDown } from "react-icons/lu";

export const ConversationScrollToBottomButton = (props: IconButtonProps) => {
  return (
    <IconButton
      size="sm"
      zIndex={100}
      shadow="xs"
      right="20px"
      bottom="90px"
      rounded="full"
      position="absolute"
      {...props}
    >
      <LuChevronDown />
    </IconButton>
  );
};
