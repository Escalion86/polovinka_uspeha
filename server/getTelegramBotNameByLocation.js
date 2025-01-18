const getTelegramBotNameByLocation = (location) => {
  if (location === 'ekb') return process.env.TELEGRAM_BOT_NAME_EKB
  if (location === 'krsk') return process.env.TELEGRAM_BOT_NAME_KRSK
  if (location === 'nrsk') return process.env.TELEGRAM_BOT_NAME_NRSK
  else return
}

export default getTelegramBotNameByLocation
