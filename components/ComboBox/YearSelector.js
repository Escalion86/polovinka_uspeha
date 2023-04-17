import ComboBox from '@components/ComboBox'
import React from 'react'

const YearSelector = ({ onChange, year }) => {
  return (
    <ComboBox
      label="Год"
      className="max-w-30"
      items={[
        { value: 2022, name: '2022' },
        { value: 2023, name: '2023' },
      ]}
      value={year}
      onChange={(value) => onChange(Number(value))}
    />
  )
}

export default YearSelector
