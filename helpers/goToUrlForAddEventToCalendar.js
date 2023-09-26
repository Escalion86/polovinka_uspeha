import formatAddress from './formatAddress'
import formatDateTime from './formatDateTime'
import DOMPurify from 'isomorphic-dompurify'

// function formatDate(date) {
//   const year = new Date(date).toLocaleString('default', { year: 'numeric' })
//   const month = new Date(date).toLocaleString('default', {
//     month: '2-digit',
//   })
//   const day = new Date(date).toLocaleString('default', { day: '2-digit' })
//   const hour = new Date(date).toLocaleString('default', { hour: '2-digit' })
//   const minute = new Date(date).toLocaleString('default', { minute: '2-digit' })

//   return [year, month, day, 'T', hour, minute, '00'].join('')
// }

const goToUrlForAddEventToCalendar = (event) => {
  const address = event.address
    ? `\n\n\u{1F4CD} Место проведения:\n${formatAddress(
        JSON.parse(JSON.stringify(event.address))
      )}`
    : ''
  const details = `${DOMPurify.sanitize(
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
  )}${address}`

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
  window.open(
    `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURI(
      event.title
    )}&location&details=${encodeURI(details)}&dates=${dateStart}/${dateEnd}`,
    '_ blank'
  )
}

export default goToUrlForAddEventToCalendar
