const getTelegramScheduledChatIdByLocation = (location) => {
  if (location === 'ekb') return process.env.TELEGRAM_SCHEDULED_CHAT_ID_EKB
  if (location === 'krsk') return process.env.TELEGRAM_SCHEDULED_CHAT_ID_KRSK
  if (location === 'nrsk') return process.env.TELEGRAM_SCHEDULED_CHAT_ID_NRSK
  return null
}

export default getTelegramScheduledChatIdByLocation
