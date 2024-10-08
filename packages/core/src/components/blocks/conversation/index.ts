import { ConversationContactInfo } from "./contact-info";
import { ConversationContent } from "./content";
import { ConversationFooter } from "./footer";
import { ConversationHeader } from "./header";
import { ConversationMedia } from "./media";

export * from "./media";
export * from "./footer";
export * from "./message";
export * from "./contact-info";
export * from "./quoted-message";
export * from "./attachment-item";

export const Conversation = {
  Media: ConversationMedia,
  Header: ConversationHeader,
  Footer: ConversationFooter,
  Content: ConversationContent,
  ContactInfo: ConversationContactInfo,
};
