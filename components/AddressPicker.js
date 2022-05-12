import cn from 'classnames'
import React from 'react'
import FormWrapper from './FormWrapper'
import Input from './Input'

const AddressPicker = ({
  address,
  onChange,
  label = 'Адрес',
  labelClassName,
  errors,
}) => {
  return (
    <>
      <label
        className={cn(
          'flex items-center justify-end text-text leading-4 text-right',
          labelClassName
        )}
      >
        {label}
      </label>
      <div className="flex flex-col gap-2 p-1 border border-gray-400 rounded">
        <FormWrapper twoColumns>
          <Input
            label="Город"
            type="text"
            value={address.town}
            onChange={(town) => onChange({ ...address, town })}
            error={errors?.address?.town}
          />
          <Input
            label="Улица"
            type="text"
            value={address.street}
            onChange={(street) => onChange({ ...address, street })}
            error={errors?.address?.street}
          />
          <Input
            label="Дом"
            type="text"
            value={address.house}
            onChange={(house) => onChange({ ...address, house })}
            error={errors?.address?.house}
          />
          <Input
            label="Подъезд"
            type="text"
            value={address.entrance}
            onChange={(entrance) => onChange({ ...address, entrance })}
            error={errors?.address?.entrance}
          />
          <Input
            label="Этаж"
            type="text"
            value={address.floor}
            onChange={(floor) => onChange({ ...address, floor })}
            error={errors?.address?.floor}
          />
          <Input
            label="Кв. / Офис"
            type="text"
            value={address.flat}
            onChange={(flat) => onChange({ ...address, flat })}
            error={errors?.address?.flat}
          />
          {/* <Input
            label="Квартира / Офис"
            type="text"
            value={address.flat}
            onChange={(flat) => onChange({ ...address, flat })}
            error={errors?.address?.flat}
          /> */}
        </FormWrapper>
        <FormWrapper>
          <Input
            label="Уточнения по адресу"
            type="text"
            value={address.comment}
            onChange={(comment) => onChange({ ...address, comment })}
            error={errors?.address?.comment}
          />
        </FormWrapper>
      </div>
    </>
  )
}

export default AddressPicker
