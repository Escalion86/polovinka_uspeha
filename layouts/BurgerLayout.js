import Burger from '@components/Burger'
import React from 'react'

function BurgerLayout() {
  return (
    <div
      className="flex items-center justify-center h-16 bg-general"
      style={{ gridArea: 'burger' }}
    >
      <Burger />
    </div>
  )
}

export default BurgerLayout
