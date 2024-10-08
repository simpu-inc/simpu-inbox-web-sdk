"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAccountConnectOptions } from "./hook";
import { AccounButtonProps } from "./types";

export const Reconnect = ({
  account,
  connectSuccessUrl,
  connectFailureUrl,
  onError,
}: AccounButtonProps) => {
  const { getOauth2IntegrationUrl } = useAccountConnectOptions();

  const handleReauthAccount = async () => {
    try {
      const url = await getOauth2IntegrationUrl({
        account_id: account?.uuid,
        failure_url: connectFailureUrl,
        success_url: connectSuccessUrl,
      });
      window.open(url, "_blank");
    } catch (error: any) {
      onError?.(error);
    }
  };

  return <Button onClick={handleReauthAccount} />;
};
