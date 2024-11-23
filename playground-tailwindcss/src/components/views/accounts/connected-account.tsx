"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlatformAccount as Account,
  AccountPlatformIcon,
  Account as SimpuAccountType,
} from "@simpu/inbox-sdk";
import { BsTrash } from "react-icons/bs";

export const ConnectedAccount = (props: { account?: SimpuAccountType }) => {
  const { account } = props;

  return (
    <div className="py-2 flex px-3 shadow-sm rounded-sm items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative">
          <AccountPlatformIcon platform={account?.channel_name ?? ""} />
          <Avatar>
            <AvatarImage src={account?.user.image_url ?? ""} />
            <AvatarFallback>{account?.name ?? ""}</AvatarFallback>
          </Avatar>
        </div>
        <p className="text-sm font-medium">{account?.name}</p>
      </div>
      <div className="flex items-center">
        <Account.Disconnect
          size="sm"
          variant="ghost"
          account={account}
          colorPalette="red"
        >
          <BsTrash />
        </Account.Disconnect>
      </div>
    </div>
  );
};
