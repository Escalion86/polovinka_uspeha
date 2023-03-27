import React from 'react'
import FormWrapper from './FormWrapper'
import Input from './Input'
import InputWrapper from './InputWrapper'

const AddressPicker = ({
  address,
  onChange,
  label = 'Адрес',
  labelClassName,
  wrapperClassName,
  errors,
  required,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={false}
      value={address}
      className={wrapperClassName}
      required={required}
      paddingY={false}
      paddingX="small"
    >
      <div className="flex-1">
        {/* <FormWrapper twoColumns> */}
        <FormWrapper className="flex mt-3 mb-1 gap-x-1">
          <Input
            label="Город"
            type="text"
            value={address.town}
            onChange={(town) => onChange({ ...address, town })}
            error={errors?.address?.town}
            noMargin
          />
          <Input
            label="Улица"
            type="text"
            value={address.street}
            onChange={(street) => onChange({ ...address, street })}
            error={errors?.address?.street}
            noMargin
          />
        </FormWrapper>
        <FormWrapper className="flex mt-3 mb-1 gap-x-1">
          <Input
            label="Дом"
            type="text"
            value={address.house}
            onChange={(house) => onChange({ ...address, house })}
            error={errors?.address?.house}
            noMargin
          />
          <Input
            label="Подъезд"
            type="text"
            value={address.entrance}
            onChange={(entrance) => onChange({ ...address, entrance })}
            error={errors?.address?.entrance}
            noMargin
          />
        </FormWrapper>
        <FormWrapper className="flex mt-3 mb-1 gap-x-1">
          <Input
            label="Этаж"
            type="text"
            value={address.floor}
            onChange={(floor) => onChange({ ...address, floor })}
            error={errors?.address?.floor}
            noMargin
          />
          <Input
            label="Кв. / Офис"
            type="text"
            value={address.flat}
            onChange={(flat) => onChange({ ...address, flat })}
            error={errors?.address?.flat}
            noMargin
          />
        </FormWrapper>
        {/* </FormWrapper> */}
        {/* <FormWrapper> */}
        <Input
          // wrapperClassName="col-span-2"
          label="Уточнения по адресу"
          type="text"
          value={address.comment}
          onChange={(comment) => onChange({ ...address, comment })}
          error={errors?.address?.comment}
        />
        {/* </FormWrapper> */}
      </div>
    </InputWrapper>
  )
}

export default AddressPicker
