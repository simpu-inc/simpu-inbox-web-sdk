"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoChatbubble } from "react-icons/io5";
import { Button, ButtonProps } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const Nav = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full py-2 px-3 w-16 bg-muted border-r flex-col justify-between">
      <div className="flex flex-col gap-1">
        <Link href="/">
          <NavButton
            tooltipContent="Chat"
            variant={pathname === "/" ? "default" : "ghost"}
          >
            <IoChatbubble size={20} />
          </NavButton>
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <Link href="/settings">
          <NavButton
            tooltipContent="Settings"
            variant={
              ["/settings", "/settings/notifications"].includes(pathname)
                ? "default"
                : "ghost"
            }
          >
            <FaGear size={20} />
          </NavButton>
        </Link>
        <Link href="/settings/profile">
          <NavButton
            tooltipContent="Profile"
            variant={pathname === "/settings/profile" ? "default" : "ghost"}
          >
            <FaUserCircle size={24} />
          </NavButton>
        </Link>
      </div>
    </div>
  );
};

export interface NavButtonProps extends ButtonProps {
  tooltipContent: string;
}

export const NavButton = (props: NavButtonProps) => {
  const { tooltipContent, ...rest } = props;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full"
            variant="ghost"
            size="icon"
            {...rest}
          />
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
