"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccountConnectOptions } from "./hook";
import { AccounButtonProps } from "./types";
import { QRCodeSetupDialog } from "./qr-code-setup-dialog";
import { useSimpuProvider } from "../provider";

export const Connect = ({
  platform,
  connectSuccessUrl,
  connectFailureUrl,
  onError,
  onSuccess,
  ...props
}: AccounButtonProps) => {
  const { apiClient } = useSimpuProvider();
  const { inbox, channels, handleCreateInbox, getOauth2IntegrationUrl } =
    useAccountConnectOptions();

  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [credential_id, setCredentialId] = useState<string | undefined>();
  const [isGeneratingSessionId, setIsGeneratingSessionId] = useState(false);

  const handleOpenQRCodeModal = async () => {
    const integration_id = channels[platform ?? ""].uuid;

    try {
      setIsGeneratingSessionId(true);
      const { session_id } = await apiClient.inbox.integrations.addSession({
        integration_id,
        inbox_id: inbox?.uuid,
      });
      setIsGeneratingSessionId(false);
      setSessionId(session_id);
      setIsQRCodeModalOpen(true);
    } catch (error: any) {
      setIsGeneratingSessionId(false);
      onError?.(error);
    }
  };

  const handleConnectAccount = async () => {
    try {
      if (!inbox) {
        await handleCreateInbox();
      }

      if (platform === "whatsapp-web-md") {
        await handleOpenQRCodeModal();
      } else {
        const integration_id = channels[platform ?? ""].uuid;
        const url = await getOauth2IntegrationUrl({
          integration_id,
          inbox_id: inbox?.uuid,
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
      <Button
        loading={isGeneratingSessionId}
        onClick={handleConnectAccount}
        {...props}
      />
      {isQRCodeModalOpen && (
        <QRCodeSetupDialog
          sessionId={sessionId}
          open={isQRCodeModalOpen}
          onScanSuccess={onSuccess}
          setCredentialId={setCredentialId}
          onOpenChange={({ open }) => setIsQRCodeModalOpen(open)}
        />
      )}
    </>
  );
};
