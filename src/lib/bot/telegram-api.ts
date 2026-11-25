export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type?: string;
  title?: string;
}

export interface TelegramMessage {
  message_id: number;
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
  date?: number;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatTelegramUserName(from?: TelegramUser | null): string {
  if (!from) return 'Менеджер';
  const full = [from.first_name, from.last_name]
    .filter((part): part is string => Boolean(part && part.trim()))
    .map(part => part.trim())
    .join(' ');
  if (full) return full;
  if (from.username) return `@${from.username}`;
  return `ID ${from.id}`;
}

async function callTelegramMethod<T = unknown>(
  botToken: string,
  method: string,
  payload: Record<string, unknown>,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<TelegramApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let result: TelegramApiResponse<T>;
    try {
      result = (await response.json()) as TelegramApiResponse<T>;
    } catch {
      throw new Error(`Failed to parse Telegram ${method} response (status ${response.status})`);
    }
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function tgSendMessage(
  botToken: string,
  params: {
    chatId: string | number;
    text: string;
    replyMarkup?: InlineKeyboardMarkup;
    replyToMessageId?: number | null;
    disableWebPagePreview?: boolean;
  },
): Promise<{ messageId: number | null }> {
  const body: Record<string, unknown> = {
    chat_id: params.chatId,
    text: params.text,
    parse_mode: 'HTML',
    disable_web_page_preview: params.disableWebPagePreview ?? true,
  };
  if (params.replyMarkup) {
    body.reply_markup = params.replyMarkup;
  }
  if (params.replyToMessageId) {
    body.reply_parameters = {
      message_id: params.replyToMessageId,
      allow_sending_without_reply: true,
    };
  }

  const res = await callTelegramMethod<TelegramMessage>(botToken, 'sendMessage', body);
  if (!res.ok) {
    throw new Error(`Telegram sendMessage error: ${JSON.stringify(res)}`);
  }
  return {
    messageId: typeof res.result?.message_id === 'number' ? res.result.message_id : null,
  };
}

export async function tgEditMessageText(
  botToken: string,
  params: {
    chatId: string | number;
    messageId: number;
    text: string;
    replyMarkup?: InlineKeyboardMarkup;
    disableWebPagePreview?: boolean;
  },
): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: params.chatId,
    message_id: params.messageId,
    text: params.text,
    parse_mode: 'HTML',
    disable_web_page_preview: params.disableWebPagePreview ?? true,
  };
  if (params.replyMarkup) {
    body.reply_markup = params.replyMarkup;
  }

  const res = await callTelegramMethod<TelegramMessage | boolean>(botToken, 'editMessageText', body);
  if (!res.ok) {
    if (typeof res.description === 'string' && res.description.includes('message is not modified')) {
      return;
    }
    throw new Error(`Telegram editMessageText error: ${JSON.stringify(res)}`);
  }
}

export async function tgEditMessageReplyMarkup(
  botToken: string,
  params: {
    chatId: string | number;
    messageId: number;
    replyMarkup?: InlineKeyboardMarkup;
  },
): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: params.chatId,
    message_id: params.messageId,
    reply_markup: params.replyMarkup ?? { inline_keyboard: [] },
  };
  const res = await callTelegramMethod(botToken, 'editMessageReplyMarkup', body);
  if (!res.ok) {
    if (typeof res.description === 'string' && res.description.includes('message is not modified')) {
      return;
    }
    throw new Error(`Telegram editMessageReplyMarkup error: ${JSON.stringify(res)}`);
  }
}

export async function tgAnswerCallbackQuery(
  botToken: string,
  params: {
    callbackQueryId: string;
    text?: string;
    showAlert?: boolean;
  },
): Promise<void> {
  const body: Record<string, unknown> = {
    callback_query_id: params.callbackQueryId,
  };
  if (params.text !== undefined) body.text = params.text;
  if (params.showAlert !== undefined) body.show_alert = params.showAlert;

  const res = await callTelegramMethod<boolean>(botToken, 'answerCallbackQuery', body);
  if (!res.ok) {
    // Non-fatal if query expired (>60s)
    console.warn('answerCallbackQuery failed:', res.description ?? res);
  }
}

interface ChatMemberResult {
  status?: string;
  is_member?: boolean;
}

const CHAT_MEMBER_CACHE_TTL_MS = 5 * 60 * 1000;
const chatMemberCache = new Map<string, { allowed: boolean; expiresAt: number }>();

export async function tgGetChatMember(
  botToken: string,
  chatId: string | number,
  userId: number,
): Promise<boolean> {
  if (!botToken || !chatId || !Number.isSafeInteger(userId) || userId <= 0) {
    return false;
  }
  const key = `${chatId}:${userId}`;
  const now = Date.now();
  const cached = chatMemberCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.allowed;
  }

  try {
    const res = await callTelegramMethod<ChatMemberResult>(botToken, 'getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
    if (!res.ok || !res.result) {
      return false;
    }
    const status = res.result.status;
    const allowed = status === 'creator'
      || status === 'administrator'
      || status === 'member'
      || (status === 'restricted' && res.result.is_member === true);
    chatMemberCache.set(key, { allowed, expiresAt: now + CHAT_MEMBER_CACHE_TTL_MS });
    return allowed;
  } catch (error) {
    console.warn('getChatMember failed:', error);
    return false;
  }
}

export async function notifyOwnersDm(
  botToken: string,
  ownerUserIds: number[],
  text: string,
): Promise<number> {
  if (!botToken || ownerUserIds.length === 0) return 0;
  let delivered = 0;
  for (const ownerId of ownerUserIds) {
    try {
      await tgSendMessage(botToken, { chatId: ownerId, text });
      delivered += 1;
    } catch (error) {
      console.error(`Failed to send DM to owner ${ownerId}:`, error);
    }
  }
  return delivered;
}
