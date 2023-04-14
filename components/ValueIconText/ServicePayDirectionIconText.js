import { SERVICE_PAY_DIRECTIONS } from '@helpers/constants'
import React from 'react'
import ValueIconText from './ValueIconText'

const ServicePayDirectionIconText = ({ value }) => (
  <ValueIconText value={value} array={SERVICE_PAY_DIRECTIONS} />
)

export default ServicePayDirectionIconText
