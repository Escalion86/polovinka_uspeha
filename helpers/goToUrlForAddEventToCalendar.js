import formatAddress from './formatAddress'
import formatDateTime from './formatDateTime'
import DOMPurify from 'isomorphic-dompurify'

const goToUrlForAddEventToCalendar = (event) => {
  const address = event.address
    ? `\n\n\u{1F4CD} Место проведения:\n${formatAddress(
        JSON.parse(JSON.stringify(event.address))
      )}`
    : ''
  const description = DOMPurify.sanitize(
    event.description
      .replaceAll('<p><br></p>', '\n')
      .replaceAll('<blockquote>', '\n<blockquote>')
      .replaceAll('<li>', '\n\u{2764} <li>')
      .replaceAll('<p>', '\n<p>')
      .replaceAll('<br>', '\n')
      .replaceAll('&nbsp;', ' ')
      .trim('\n'),
    {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }
  )

  const dateStart = formatDateTime(
    event.dateStart,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true
  )
  const dateEnd = formatDateTime(
    event.dateEnd,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true
  )

  const details = `${
    description.length > 3000
      ? `${description.substring(0, 3000)}...`
      : description
  }${address}\n\nСсылка на мероприятие: ${
    window.location.origin + '/event/' + event._id
  }`

  const encodedDetails = encodeURI(details)

  window.open(
    `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURI(
      event.title
    )}&location&details=${encodedDetails}&dates=${dateStart}/${dateEnd}`,
    '_ blank'
  )
}

export default goToUrlForAddEventToCalendar
