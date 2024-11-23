import { cn } from "@/lib/utils";
import { Link as NextLink } from "next-view-transitions";
import { LinkProps } from "next/link";
import { DetailedHTMLProps } from "react";
import { HTMLAttributes } from "react";

export const SettingsItemIcon = ({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex px-4 py-2 h-[60px] items-center justify-center basis-auto flex-nowrap",
        className
      )}
      {...props}
    />
  );
};

export const SettingsItemContent = ({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex flex-1 py-2 h-[60px] text-sm justify-center flex-col font-medium border-b",
        className
      )}
      {...props}
    />
  );
};

export const SettingsItemRoot = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    href: LinkProps["href"];
  }
) => {
  const { href, className, ...rest } = props;

  return (
    <NextLink href={href} className="w-full hover:bg-muted hover:no-underline">
      <div className={cn("flex w-full", className)} {...rest} />
    </NextLink>
  );
};

export const SettingsItem = {
  Icon: SettingsItemIcon,
  Root: SettingsItemRoot,
  Content: SettingsItemContent,
};
