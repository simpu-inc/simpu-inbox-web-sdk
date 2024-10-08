import { Connect } from "./connect";
import { Disconnect } from "./disconnect";
import { Reconnect } from "./re-connect";

export * from "./hook";
export * from "./platform-icon";
export * from "./account-select";

export const PlatformAccount = {
  Connect,
  Disconnect,
  Reconnect,
};
