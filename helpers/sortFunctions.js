const getTimestampFromDateTime = (date, time) => {
  if (!date) return 0
  const normalizedTime = time || '00:00'
  const dateString = `${date} ${normalizedTime}`.trim()
  const timestamp = new Date(dateString).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const getNewsletterSendTimestamp = (newsletter) => {
  if (!newsletter) return 0
  if (newsletter.sendMode === 'scheduled' && newsletter.plannedSendDate) {
    return getTimestampFromDateTime(
      newsletter.plannedSendDate,
      newsletter.plannedSendTime
    )
  }
  const createdTimestamp = newsletter.createdAt
    ? new Date(newsletter.createdAt).getTime()
    : 0
  return Number.isNaN(createdTimestamp) ? 0 : createdTimestamp
}

const sortFunctions = {
  genderAndFirstName: {
    asc: (a, b) =>
      a.gender === 'male'
        ? b.gender === 'male'
          ? a.firstName < b.firstName
            ? -1
            : 1
          : -1
        : b.gender === 'male'
          ? 1
          : a.firstName < b.firstName
            ? -1
            : 1,
    desc: (a, b) =>
      a.gender === 'male'
        ? b.gender === 'male'
          ? a.firstName > b.firstName
            ? -1
            : 1
          : -1
        : b.gender === 'male'
          ? 1
          : a.firstName > b.firstName
            ? -1
            : 1,
  },
  signedUpEventsCount: {
    asc: (a, b) => (a.signedUpEventsCount < b.signedUpEventsCount ? -1 : 1),
    desc: (a, b) => (a.signedUpEventsCount > b.signedUpEventsCount ? -1 : 1),
  },
  date: {
    asc: (a, b) =>
      new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1,
    desc: (a, b) =>
      new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1,
  },
  dateStart: {
    asc: (a, b) =>
      new Date(a.dateStart).getTime() < new Date(b.dateStart).getTime()
        ? -1
        : 1,
    desc: (a, b) =>
      new Date(a.dateStart).getTime() > new Date(b.dateStart).getTime()
        ? -1
        : 1,
  },
  dateEnd: {
    asc: (a, b) =>
      new Date(a.dateEnd).getTime() < new Date(b.dateEnd).getTime() ? -1 : 1,
    desc: (a, b) =>
      new Date(a.dateEnd).getTime() > new Date(b.dateEnd).getTime() ? -1 : 1,
  },
  payAt: {
    asc: (a, b) =>
      new Date(a.payAt).getTime() < new Date(b.payAt).getTime() ? -1 : 1,
    desc: (a, b) =>
      new Date(a.payAt).getTime() > new Date(b.payAt).getTime() ? -1 : 1,
  },
  name: {
    asc: (a, b) =>
      a.firstName.toLowerCase() < b.firstName.toLowerCase() ? -1 : 1,
    desc: (a, b) =>
      a.firstName.toLowerCase() > b.firstName.toLowerCase() ? -1 : 1,
  },
  birthday: {
    asc: (a, b) =>
      !a.birthday
        ? -1
        : new Date(a.birthday).getTime() > new Date(b.birthday).getTime()
          ? -1
          : 1,
    desc: (a, b) =>
      !a.birthday
        ? 1
        : new Date(a.birthday).getTime() < new Date(b.birthday).getTime()
          ? -1
          : 1,
  },
  eventUserCreatedAt: {
    asc: (a, b) =>
      !a.eventUserCreatedAt
        ? 1
        : !b.eventUserCreatedAt
          ? -1
          : new Date(a.eventUserCreatedAt).getTime() <
              new Date(b.eventUserCreatedAt).getTime()
            ? -1
            : 1,
    desc: (a, b) =>
      !a.createdAt
        ? -1
        : !b.createdAt
          ? 1
          : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
            ? -1
            : 1,
  },
  createdAt: {
    asc: (a, b) =>
      !a.createdAt
        ? 1
        : !b.createdAt
          ? -1
          : new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
            ? -1
            : 1,
    desc: (a, b) =>
      !a.createdAt
        ? -1
        : !b.createdAt
          ? 1
          : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
            ? -1
            : 1,
  },
  sendDate: {
    asc: (a, b) =>
      getTimestampFromDateTime(a.sendDate, a.sendTime) <
      getTimestampFromDateTime(b.sendDate, b.sendTime)
        ? -1
        : 1,
    desc: (a, b) =>
      getTimestampFromDateTime(a.sendDate, a.sendTime) >
      getTimestampFromDateTime(b.sendDate, b.sendTime)
        ? -1
        : 1,
  },
  newsletterSendDate: {
    asc: (a, b) =>
      getNewsletterSendTimestamp(a) < getNewsletterSendTimestamp(b) ? -1 : 1,
    desc: (a, b) =>
      getNewsletterSendTimestamp(a) > getNewsletterSendTimestamp(b) ? -1 : 1,
  },
}

export default sortFunctions
