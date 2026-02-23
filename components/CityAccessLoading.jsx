'use client'

import PropTypes from 'prop-types'

export default function CityAccessLoading({ message, className = '' }) {
  return (
    <div
      className={`w-full max-w-[520px] rounded-[28px] border border-[rgba(107,31,42,0.12)] bg-white/70 p-8 text-center shadow-[0_24px_48px_rgba(15,23,42,0.12)] ${className}`.trim()}
    >
      {message}
    </div>
  )
}

CityAccessLoading.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
}
