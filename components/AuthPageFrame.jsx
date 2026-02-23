'use client'

import PropTypes from 'prop-types'

export default function AuthPageFrame({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7fb] text-[#1d1b1f]">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 py-12">
        {children}
      </div>
    </div>
  )
}

AuthPageFrame.propTypes = {
  children: PropTypes.node.isRequired,
}
