import { Link as NextLink } from "next-view-transitions";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "../ui/button";
import { DetailedHTMLProps } from "react";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const ViewContent = ({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex h-[full] min-w-[400px] max-w-[400px] bg-white border-r flex-col",
        className
      )}
      {...props}
    />
  );
};

export const MainContent = ({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      className={cn("h-full flex-1 bg-white w-[calc(100%-464px)]", className)}
      {...props}
    />
  );
};

interface ViewHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  href: string;
}

export const ViewHeader = ({
  href,
  children,
  className,
  ...rest
}: ViewHeaderProps) => {
  return (
    <div
      className={cn("flex w-full px-6 h-[60px] gap-2 items-center", className)}
      {...rest}
    >
      <NextLink href={href}>
        <Button size="sm" className="rounded-full" variant="ghost">
          <LuArrowLeft />
        </Button>
      </NextLink>
      <p className="font-medium">{children}</p>
    </div>
  );
};
