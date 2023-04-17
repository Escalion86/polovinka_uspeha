import ComboBox from '@components/ComboBox'
import React from 'react'

const MonthSelector = ({ onChange, month }) => {
  return (
    <ComboBox
      className="max-w-40"
      label="Месяц"
      items={[
        { value: 0, name: 'Январь' },
        { value: 1, name: 'Февраль' },
        { value: 2, name: 'Март' },
        { value: 3, name: 'Апрель' },
        { value: 4, name: 'Май' },
        { value: 5, name: 'Июнь' },
        { value: 6, name: 'Июль' },
        { value: 7, name: 'Август' },
        { value: 8, name: 'Сентябрь' },
        { value: 9, name: 'Октябрь' },
        { value: 10, name: 'Ноябрь' },
        { value: 11, name: 'Декабрь' },
      ]}
      value={month}
      onChange={(value) => onChange(Number(value))}
    />
  )
}

export default MonthSelector
