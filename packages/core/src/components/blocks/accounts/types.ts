import { ButtonProps } from "@/components/ui/button";
import { Account, InboxType } from "simpu-api-sdk";

export interface AccounButtonProps extends ButtonProps {
  account?: Account;
  inboxType?: InboxType;
  connectSuccessUrl?: string;
  connectFailureUrl?: string;
  platform?: "instagram" | "messenger" | "whatsapp-web-md";
  onSuccess?(): void;
  onError?(error: any): void;
}
