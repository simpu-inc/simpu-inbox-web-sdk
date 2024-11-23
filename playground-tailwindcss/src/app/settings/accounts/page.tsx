import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { ConnectedAccounts } from "@/components/views/accounts";
import dynamic from "next/dynamic";

const ConnectAccount = dynamic(
  () =>
    import("@/components/views/accounts/connect-account").then(
      (mod) => mod.ConnectAccount
    ),
  { ssr: false }
);

export default function AccountsPage() {
  return (
    <>
      <ViewContent>
        <div className="flex flex-col gap-6">
          <ViewHeader href="/settings">Accounts</ViewHeader>
          <ConnectAccount />
          <div className="flex flex-col px-4 gap-1">
            <p className="text-sm font-medium">Your connected accounts</p>
            <ConnectedAccounts />
          </div>
        </div>
      </ViewContent>
      <MainContent />
    </>
  );
}
