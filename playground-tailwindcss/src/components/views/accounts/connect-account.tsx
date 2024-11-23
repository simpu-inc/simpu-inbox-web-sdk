"use client";

import { PlatformAccount as Account } from "@simpu/inbox-sdk";
import React from "react";
import { BsInstagram, BsMessenger } from "react-icons/bs";

export const ConnectAccount = () => {
  const referer = window.location.href;

  return (
    <div className="flex flex-col gap-1 px-4">
      <p className="text-sm font-medium">
        Connect your Instagram & Messenger accounts
      </p>
      <Account.Connect
        size="sm"
        platform="instagram"
        connectSuccessUrl={referer ?? ""}
        connectFailureUrl={referer ?? ""}
      >
        <BsInstagram />
        Connect Instagram
      </Account.Connect>
      <Account.Connect
        size="sm"
        platform="messenger"
        connectSuccessUrl={referer ?? ""}
        connectFailureUrl={referer ?? ""}
      >
        <BsMessenger />
        Connect Messenger
      </Account.Connect>
    </div>
  );
};
