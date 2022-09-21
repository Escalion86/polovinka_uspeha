import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import React from 'react'

const UsersFilter = ({ value, onChange }) => {
  return (
    <>
      <GenderToggleButtons
        value={value.gender}
        onChange={(value) => onChange((state) => ({ ...state, gender: value }))}
      />
      <StatusUserToggleButtons
        value={value.status}
        onChange={(value) => onChange((state) => ({ ...state, status: value }))}
      />
    </>
  )
}

export default UsersFilter
