import { ConversationContactInfo } from "./contact-info";
import { ConversationContent } from "./content";
import { ConversationFooter } from "./footer";
import { ConversationHeader } from "./header";
import { ConversationMedia } from "./media";
import { ConversationScrollToBottomButton } from "./scroll-to-bottom-button";

export * from "./attachment-item";
export * from "./contact-info";
export * from "./footer";
export * from "./media";
export * from "./message";
export * from "./quoted-message";

export const Conversation = {
  Media: ConversationMedia,
  Header: ConversationHeader,
  Footer: ConversationFooter,
  Content: ConversationContent,
  ContactInfo: ConversationContactInfo,
  ScrollToBottom: ConversationScrollToBottomButton,
};
