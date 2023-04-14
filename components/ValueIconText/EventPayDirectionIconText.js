import { EVENT_PAY_DIRECTIONS } from '@helpers/constants'
import React from 'react'
import ValueIconText from './ValueIconText'

const EventPayDirectionIconText = ({ value }) => (
  <ValueIconText value={value} array={EVENT_PAY_DIRECTIONS} />
)

export default EventPayDirectionIconText
