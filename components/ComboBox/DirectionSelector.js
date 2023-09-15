import ComboBox from '@components/ComboBox'
import directionsAtom from '@state/atoms/directionsAtom'
import React from 'react'
import { useRecoilValue } from 'recoil'

const DirectionSelector = ({
  value,
  onChange,
  placeholder = 'Не выбрано',
  required,
  error,
  activePlaceholder,
}) => {
  const directions = useRecoilValue(directionsAtom)
  const items = directions.map((item, index) => ({
    name: item.title,
    value: item._id,
  }))
  return (
    <ComboBox
      label="Направление"
      value={value}
      onChange={onChange}
      items={items}
      placeholder={placeholder}
      activePlaceholder={activePlaceholder}
      smallMargin
      required={required}
      error={error}
    />
  )
}

export default DirectionSelector
