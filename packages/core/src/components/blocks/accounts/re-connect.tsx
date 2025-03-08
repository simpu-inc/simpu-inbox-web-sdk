"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useSimpuProvider } from "../provider";
import { useAccountConnectOptions } from "./hook";
import { QRCodeSetupDialog } from "./qr-code-setup-dialog";
import { AccounButtonProps } from "./types";

export const Reconnect = ({
  account,
  platform,
  connectSuccessUrl,
  connectFailureUrl,
  inboxType = "personal",
  onError,
  onSuccess,
}: AccounButtonProps) => {
  const { apiClient } = useSimpuProvider();
  const { getOauth2IntegrationUrl } = useAccountConnectOptions({ inboxType });

  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [sessionId, setSessionCode] = useState<string | undefined>();
  const [isGeneratingSessionId, setIsGeneratingSessionId] = useState(false);

  const handleOpenQRCodeModal = async () => {
    try {
      setIsGeneratingSessionId(true);
      const { session_id } = await apiClient.inbox.integrations.addSession({
        account_id: account?.uuid,
      });
      setIsGeneratingSessionId(false);
      setSessionCode(session_id);
      setIsQRCodeModalOpen(true);
    } catch (error: any) {
      setIsGeneratingSessionId(false);
      onError?.(error.message ?? error);
    }
  };

  const handleReauthAccount = async () => {
    try {
      if (platform === "whatsapp-web-md") {
        await handleOpenQRCodeModal();
      } else {
        const url = await getOauth2IntegrationUrl({
          account_id: account?.uuid,
          failure_url: connectFailureUrl,
          success_url: connectSuccessUrl,
        });
        window.open(url, "_blank");
      }
    } catch (error: any) {
      onError?.(error);
    }
  };

  return (
    <>
      <Button loading={isGeneratingSessionId} onClick={handleReauthAccount} />
      {isQRCodeModalOpen && (
        <QRCodeSetupDialog
          inboxType={inboxType}
          sessionId={sessionId}
          open={isQRCodeModalOpen}
          onScanSuccess={onSuccess}
          onOpenChange={({ open }) => setIsQRCodeModalOpen(open)}
        />
      )}
    </>
  );
};
