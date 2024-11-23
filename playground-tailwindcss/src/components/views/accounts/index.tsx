"use client";

import {
  useAccountConnectOptions,
  useGetInboxAccounts,
} from "@simpu/inbox-sdk";
import { ConnectedAccount } from "./connected-account";

export const ConnectedAccounts = () => {
  const { inbox } = useAccountConnectOptions();

  const { data } = useGetInboxAccounts(inbox?.uuid ?? "", { enabled: !!inbox });

  return (
    <div className="flex flex-col gap-1">
      {!!data?.length ? (
        data?.map((account) => (
          <ConnectedAccount key={account.uuid} account={account} />
        ))
      ) : (
        <p className="text-xs text-muted">
          You have no connected accounts. Use the buttons above to connect an
          account.
        </p>
      )}
    </div>
  );
};
