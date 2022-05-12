import React from 'react'

function ErrorsList({ errors }) {
  return (
    Object.values(errors).length > 0 && (
      <div className="flex flex-col col-span-2 text-red-500">
        {Object.values(errors).map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>
    )
  )
}

export default ErrorsList
