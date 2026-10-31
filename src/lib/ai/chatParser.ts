export interface ParsedChatMessage {
  sender: string;
  timestamp: string;
  content: string;
  isAnnouncement: boolean;
}

export function parseWhatsAppExportText(fileContent: string): ParsedChatMessage[] {
  const lines = fileContent.split(/\r?\n/);
  const messages: ParsedChatMessage[] = [];
  
  // Regex formats common in WhatsApp exports:
  // [30/10/26, 8:45:10 PM] Prof. Mukherjee: Message
  // 10/30/26, 8:45 PM - Prof Mukherjee: Message
  // 30/10/2026, 20:45 - Prof Mukherjee: Message
  const bracketRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4},\s*[\d:]+\s*(?:[AP]M)?)\]\s*([^:]+):\s*(.+)$/i;
  const dashRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s*[\d:]+\s*(?:[AP]M)?)\s*-\s*([^:]+):\s*(.+)$/i;

  let currentMsg: ParsedChatMessage | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const bMatch = trimmed.match(bracketRegex);
    const dMatch = trimmed.match(dashRegex);
    const match = bMatch || dMatch;

    if (match) {
      if (currentMsg) {
        messages.push(currentMsg);
      }
      const timestamp = match[1];
      const sender = match[2].trim();
      const content = match[3].trim();

      const isAnnouncement =
        /workshop|exam|assignment|deadline|compulsory|registration|hall ticket|auditorium|last date|due|submit/i.test(
          content
        );

      currentMsg = {
        sender,
        timestamp,
        content,
        isAnnouncement,
      };
    } else if (currentMsg) {
      // Append multi-line message
      currentMsg.content += `\n${trimmed}`;
      if (/workshop|exam|assignment|deadline|compulsory|registration|due/i.test(trimmed)) {
        currentMsg.isAnnouncement = true;
      }
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  return messages;
}

