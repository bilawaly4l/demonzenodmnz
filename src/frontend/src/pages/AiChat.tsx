import { AiChatInterface } from "../components/AiChatInterface";
import { AiPasswordGuard } from "../components/AiPasswordGuard";

export function AiChat() {
  return (
    <AiPasswordGuard>
      <AiChatInterface />
    </AiPasswordGuard>
  );
}
