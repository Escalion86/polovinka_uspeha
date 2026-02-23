'use client'

import PropTypes from 'prop-types'

export default function CityManagementBlockedBanner({ cityTitle }) {
  return (
    <div className="mx-2 mb-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      В городе <b>{cityTitle || 'текущем городе'}</b> отключено управление
      данными. Создание, редактирование и удаление мероприятий, пользователей,
      услуг, товаров и транзакций недоступно.
    </div>
  )
}

CityManagementBlockedBanner.propTypes = {
  cityTitle: PropTypes.string,
}
