import DOMPurify from 'isomorphic-dompurify'
import formatAddress from './formatAddress'
import formatEventDateTime from './formatEventDateTime'

const getTimeZoneByLocation = (location) => {
  if (location === 'ekb') return 'Asia/Yekaterinburg'
  if (location === 'krsk') return 'Asia/Krasnoyarsk'
  if (location === 'nrsk') return 'Asia/Krasnoyarsk'
  return undefined
}

const getEventUrl = (event, location) => {
  if (!location || !event?._id) return undefined
  const baseUrl =
    process.env.DOMAIN ??
    (typeof window !== 'undefined' ? window.location.origin : '')

  const normalizedBaseUrl = baseUrl ? baseUrl.replace(/\/$/, '') : ''
  return `${normalizedBaseUrl}/${location}/event/${String(event._id)}`
}

const sanitizeDescription = (description) =>
  DOMPurify.sanitize(
    (description || '')
      .replaceAll('<p><br></p>', '\n')
      .replaceAll('<blockquote>', '\n<blockquote>')
      .replaceAll('<li>', '\n\u{2764} <li>')
      .replaceAll('<p>', '\n<p>')
      .replaceAll('<strong>', '<b>')
      .replaceAll('</strong>', '</b>')
      .replaceAll('<br>', '\n')
      .replaceAll('&nbsp;', ' ')
      .trim('\n'),
    {
      ALLOWED_TAGS: ['b', 'i', 's'],
      ALLOWED_ATTR: [],
    }
  )

const getPriceText = (event) => {
  if (!event?.subEvents?.length) return ''

  const formatPrice = (price = 0, discount = 0) => {
    const basePrice = price / 100
    const finalPrice = (price - discount) / 100
    const hasDiscount = discount > 0

    return hasDiscount ? `<s>${basePrice}</s> ${finalPrice}` : `${finalPrice}`
  }

  return event.subEvents
    .map(({ price = 0, usersStatusDiscount = {}, title }, index) => {
      const novicePrice = formatPrice(price, usersStatusDiscount.novice ?? 0)
      const memberPrice = formatPrice(price, usersStatusDiscount.member ?? 0)
      const prefix =
        index === 0
          ? `\n\u{1F4B0} <b>Стоимость</b>:` +
            `${event.subEvents.length > 1 ? '\n' : ' '}`
          : ''
      const subEventTitle =
        event.subEvents.length > 1 ? ` - ${title}: ` : ' '

      return `${prefix}${subEventTitle}{клуб}{${memberPrice}}{${novicePrice}} руб`
    })
    .join('\n')
}

const formatEventNotificationText = (
  event,
  { location, userStatus = 'novice', withEventLink = false } = {}
) => {
  if (!event) return ''

  const timeZone = getTimeZoneByLocation(location)
  const description = sanitizeDescription(event.description)
  const dateTime = formatEventDateTime(event, {
    fullWeek: true,
    weekInBrackets: true,
    timeZone,
  })

  const address = event.address
    ? `\n\n\u{1F4CD} <b>Место проведения</b>:\n${formatAddress(
        JSON.parse(JSON.stringify(event.address))
      )}`
    : ''

  const textStart = `\u{1F4C5} ${dateTime?.toUpperCase?.() ?? ''}\n<b>${
    event.title
  }</b>\n${description}${address}`

  const priceText = getPriceText(event)

  const eventTags =
    typeof event.tags === 'object' && event.tags?.length > 0
      ? event.tags.filter((tag) => tag)
      : []
  const textEnd = eventTags.length > 0 ? `\n\n#${eventTags.join(' #')}` : ''

  const eventUrl = withEventLink ? getEventUrl(event, location) : undefined
  const linkText = eventUrl ? `\n\n\u{1F4CE} Подробнее: ${eventUrl}` : ''

  return `${textStart}${priceText}${textEnd}${linkText}`
}

export default formatEventNotificationText
