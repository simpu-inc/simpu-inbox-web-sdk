import type { ButtonProps, MenuRootProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./menu";
import {
  HiMiniEllipsisHorizontal,
  HiMiniEllipsisVertical,
} from "react-icons/hi2";

export const OverflowMenuRoot = (props: MenuRootProps) => {
  return (
    <MenuRoot
      {...props}
      positioning={{ placement: "bottom-end", ...props.positioning }}
    />
  );
};

export interface OverflowMenuTriggerProps extends ButtonProps {
  vertical?: boolean;
}

export const OverflowMenuTrigger = (props: OverflowMenuTriggerProps) => {
  const { vertical, ...rest } = props;
  return (
    <MenuTrigger asChild>
      <IconButton variant="plain" size="sm" {...rest}>
        {vertical ? <HiMiniEllipsisVertical /> : <HiMiniEllipsisHorizontal />}
      </IconButton>
    </MenuTrigger>
  );
};

export const OverflowMenuItem = MenuItem;
export const OverflowMenuContent = MenuContent;
