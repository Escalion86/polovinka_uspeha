'use client'

import PropTypes from 'prop-types'

export const AUTH_INPUT_CLASS =
  'placeholder:text-gray-400 h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 text-base text-[#2b1b21] shadow-[0_10px_18px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,207,242,0.7)]'

export default function AuthInput({ className, ...props }) {
  return <input {...props} className={`${AUTH_INPUT_CLASS} ${className}`.trim()} />
}

AuthInput.propTypes = {
  className: PropTypes.string,
}

AuthInput.defaultProps = {
  className: '',
}
