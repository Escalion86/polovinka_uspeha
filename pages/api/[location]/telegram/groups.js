import checkLocationValid from '@server/checkLocationValid'
import getTelegramTokenByLocation from '@server/getTelegramTokenByLocation'
import telegramPost from '@server/telegramApi'

const ALLOWED_UPDATE_TYPES = [
  'message',
  'edited_message',
  'channel_post',
  'edited_channel_post',
  'chat_member',
  'my_chat_member',
  'callback_query',
  'chat_join_request',
]

const toMs = (value) =>
  typeof value === 'number' && !Number.isNaN(value) ? value * 1000 : null

const ensureChatEntry = (chatsMap, chat, activityDate) => {
  if (!chat?.id) return null

  const current = chatsMap.get(chat.id) || {
    id: chat.id,
    title: chat.title || null,
    type: chat.type || null,
    username: chat.username || null,
    firstName: chat.first_name || null,
    lastName: chat.last_name || null,
    isForum: chat.is_forum === true,
    lastActivityAt: null,
    topics: new Map(),
  }

  if (!current.title) {
    current.title =
      chat.title || chat.username || chat.first_name || chat.last_name || null
  }

  if (!current.type) current.type = chat.type || null
  if (!current.username && chat.username) current.username = chat.username
  if (!current.firstName && chat.first_name) current.firstName = chat.first_name
  if (!current.lastName && chat.last_name) current.lastName = chat.last_name
  current.isForum = current.isForum || chat.is_forum === true

  const normalizedDate = toMs(activityDate)
  if (
    normalizedDate &&
    (!current.lastActivityAt || normalizedDate > current.lastActivityAt)
  ) {
    current.lastActivityAt = normalizedDate
  }

  chatsMap.set(chat.id, current)

  return current
}

const ensureTopicEntry = (chatEntry, threadId) => {
  if (!chatEntry || !threadId) return null
  const current =
    chatEntry.topics.get(threadId) || {
      threadId,
      title: null,
      iconColor: null,
      iconCustomEmojiId: null,
      isClosed: false,
      createdAt: null,
      lastActivityAt: null,
      lastMessagePreview: null,
    }

  chatEntry.topics.set(threadId, current)
  return current
}

const updateTopicFromMessage = (chatEntry, message) => {
  if (!chatEntry?.isForum || !message?.message_thread_id) return
  const topic = ensureTopicEntry(chatEntry, message.message_thread_id)
  if (!topic) return

  const messageDate = toMs(message.date)
  if (!topic.createdAt || (messageDate && messageDate < topic.createdAt)) {
    topic.createdAt = messageDate
  }
  if (
    messageDate &&
    (!topic.lastActivityAt || messageDate > topic.lastActivityAt)
  ) {
    topic.lastActivityAt = messageDate
  }

  if (message.forum_topic_created) {
    topic.title = message.forum_topic_created.name || topic.title
    topic.iconColor =
      message.forum_topic_created.icon_color ?? topic.iconColor ?? null
    topic.iconCustomEmojiId =
      message.forum_topic_created.icon_custom_emoji_id ??
      topic.iconCustomEmojiId ??
      null
  }

  if (message.forum_topic_edited) {
    topic.title = message.forum_topic_edited.name || topic.title
    if (message.forum_topic_edited.icon_custom_emoji_id) {
      topic.iconCustomEmojiId = message.forum_topic_edited.icon_custom_emoji_id
    }
  }

  if (message.forum_topic_closed) {
    topic.isClosed = true
  }
  if (message.forum_topic_reopened) {
    topic.isClosed = false
  }

  const previewText =
    message.text ||
    message.caption ||
    message.via_bot?.first_name ||
    message.game?.title ||
    message.poll?.question

  if (previewText && messageDate) {
    const preparedPreview =
      previewText.length > 160
        ? `${previewText.slice(0, 157).trim()}...`
        : previewText
    topic.lastMessagePreview = preparedPreview
  }
}

const collectFromMessage = (chatsMap, message) => {
  if (!message?.chat) return
  const chatEntry = ensureChatEntry(chatsMap, message.chat, message.date)
  updateTopicFromMessage(chatEntry, message)
}

const collectFromChatMemberUpdate = (chatsMap, payload) => {
  if (!payload?.chat) return
  ensureChatEntry(chatsMap, payload.chat, payload.date)
}

const collectFromCallbackQuery = (chatsMap, callbackQuery) => {
  if (!callbackQuery?.message) return
  collectFromMessage(chatsMap, callbackQuery.message)
}

const collectFromJoinRequest = (chatsMap, joinRequest) => {
  if (!joinRequest?.chat) return
  ensureChatEntry(chatsMap, joinRequest.chat, joinRequest.date)
}

const mapToResponse = (chatsMap) =>
  Array.from(chatsMap.values())
    .map((chat) => ({
      id: chat.id,
      title: chat.title,
      type: chat.type,
      username: chat.username,
      firstName: chat.firstName,
      lastName: chat.lastName,
      isForum: chat.isForum,
      lastActivityAt: chat.lastActivityAt,
      topics: chat.isForum
        ? Array.from(chat.topics.values()).sort(
            (a, b) => (b.lastActivityAt || 0) - (a.lastActivityAt || 0)
          )
        : [],
    }))
    .sort((a, b) => (b.lastActivityAt || 0) - (a.lastActivityAt || 0))

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (!location)
    return res.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res.status(400).json({ success: false, error: 'Invalid location' })

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const telegramToken = getTelegramTokenByLocation(location)
  if (!telegramToken)
    return res
      .status(400)
      .json({ success: false, error: 'Telegram token is not configured' })

  const limitParam = Number(query?.limit)
  const limit =
    Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 100
      ? Math.floor(limitParam)
      : 50

  try {
    const telegramResponse = await telegramPost(
      `https://api.telegram.org/bot${telegramToken}/getUpdates`,
      {
        limit,
        allowed_updates: ALLOWED_UPDATE_TYPES,
      },
      null,
      null,
      true
    )

    if (!telegramResponse)
      throw new Error('Не удалось выполнить запрос к Telegram')

    if (telegramResponse.ok === false) {
      throw new Error(
        telegramResponse.description || 'Telegram вернул ошибку запроса'
      )
    }

    const updates = Array.isArray(telegramResponse.result)
      ? telegramResponse.result
      : []

    const chatsMap = new Map()

    for (const update of updates) {
      collectFromMessage(chatsMap, update.message)
      collectFromMessage(chatsMap, update.edited_message)
      collectFromMessage(chatsMap, update.channel_post)
      collectFromMessage(chatsMap, update.edited_channel_post)
      collectFromChatMemberUpdate(chatsMap, update.chat_member)
      collectFromChatMemberUpdate(chatsMap, update.my_chat_member)
      collectFromCallbackQuery(chatsMap, update.callback_query)
      collectFromJoinRequest(chatsMap, update.chat_join_request)
    }

    const chats = mapToResponse(chatsMap)

    return res.status(200).json({
      success: true,
      data: {
        chats,
        totalUpdates: updates.length,
        lastUpdateId:
          updates.length > 0
            ? updates[updates.length - 1]?.update_id ?? null
            : null,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Telegram request failed',
    })
  }
}
