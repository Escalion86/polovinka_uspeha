import React from 'react'

const ContentHeader = ({ children }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-1 text-black bg-white border-b border-gray-700">
      {children}
    </div>
  )
}

export default ContentHeader
