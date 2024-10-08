"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAccountConnectOptions } from "./hook";
import { AccounButtonProps } from "./types";

export const Connect = ({
  platform,
  connectSuccessUrl,
  connectFailureUrl,
  onError,
  ...props
}: AccounButtonProps) => {
  const { inbox, channels, handleCreateInbox, getOauth2IntegrationUrl } =
    useAccountConnectOptions();

  const handleConnectAccount = async () => {
    try {
      if (!inbox) {
        await handleCreateInbox();
      }

      const integration_id = channels[platform ?? ""].uuid;
      const url = await getOauth2IntegrationUrl({
        integration_id,
        inbox_id: inbox?.uuid,
        failure_url: connectFailureUrl,
        success_url: connectSuccessUrl,
      });
      window.open(url, "_blank");
    } catch (error: any) {
      onError?.(error);
    }
  };

  return <Button onClick={handleConnectAccount} {...props} />;
};
