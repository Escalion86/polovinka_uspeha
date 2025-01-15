const getTelegramTokenByLocation = (location) => {
  if (location === 'ekb') return process.env.TELEGRAM_TOKEN_EKB
  if (location === 'krsk') return process.env.TELEGRAM_TOKEN_KRSK
  if (location === 'nrsk') return process.env.TELEGRAM_TOKEN_NRSK
  else return
}

export default getTelegramTokenByLocation
