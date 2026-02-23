'use client'

import PropTypes from 'prop-types'

export default function AuthField({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#6b1f2a]">
      {label}
      {children}
    </label>
  )
}

AuthField.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
}
