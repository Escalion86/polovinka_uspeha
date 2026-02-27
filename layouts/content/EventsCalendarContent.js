'use client'

import EventsContent from './EventsContent'

const EventsCalendarContent = (props) => (
  <EventsContent {...props} mode="upcoming" calendarOnly />
)

export default EventsCalendarContent

