import Button from './Button'
import CheckBox from './CheckBox'
import FormWrapper from './FormWrapper'
import ImageCheckBox from './ImageCheckBox'
import Input from './Input'
import InputWrapper from './InputWrapper'
import Note from './Note'

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
      value={address}
      className={wrapperClassName}
      required={required}
      paddingY={false}
      paddingX="small"
    >
      <div className="flex-1 mt-0.5">
        <FormWrapper className="flex flex-wrap mt-3 mb-1 gap-x-1 gap-y-3">
          <Input
            label="Город"
            type="text"
            value={address.town}
            onChange={(town) => onChange({ ...address, town })}
            error={errors?.address?.town}
            noMargin
            className="flex-1 min-w-48"
          />
          <Input
            label="Улица"
            type="text"
            value={address.street}
            onChange={(street) => onChange({ ...address, street })}
            error={errors?.address?.street}
            noMargin
            className="flex-1 min-w-48"
          />
        </FormWrapper>
        <FormWrapper className="flex flex-wrap mt-3 mb-1 gap-x-1 gap-y-3">
          <Input
            label="Дом"
            type="text"
            value={address.house}
            onChange={(house) => onChange({ ...address, house })}
            error={errors?.address?.house}
            noMargin
            className="flex-1 min-w-48"
          />
          <Input
            label="Подъезд"
            type="text"
            value={address.entrance}
            onChange={(entrance) => onChange({ ...address, entrance })}
            error={errors?.address?.entrance}
            noMargin
            className="flex-1 min-w-48"
          />
        </FormWrapper>
        <FormWrapper className="flex flex-wrap mt-3 mb-1 gap-x-1 gap-y-3">
          <Input
            label="Этаж"
            type="text"
            value={address.floor}
            onChange={(floor) => onChange({ ...address, floor })}
            error={errors?.address?.floor}
            noMargin
            className="flex-1 min-w-48"
          />
          <Input
            label="Кв. / Офис"
            type="text"
            value={address.flat}
            onChange={(flat) => onChange({ ...address, flat })}
            error={errors?.address?.flat}
            noMargin
            className="flex-1 min-w-48"
          />
        </FormWrapper>
        <Input
          label="Уточнения по адресу"
          type="text"
          value={address.comment}
          onChange={(comment) => onChange({ ...address, comment })}
          error={errors?.address?.comment}
        />
        <div className="flex flex-wrap items-end justify-between gap-x-2">
          <ImageCheckBox
            checked={address.link2GisShow}
            onClick={() =>
              onChange({ ...address, link2GisShow: !address.link2GisShow })
            }
            label="Показывать ссылку 2ГИС"
            src="/img/navigators/2gis.png"
            big
          />
          {address.link2GisShow &&
            (address.link2Gis || (address?.town && address?.street)) && (
              <div className="flex justify-end flex-1">
                <a
                  data-tip="Открыть адрес в 2ГИС"
                  href={
                    address.link2Gis ||
                    `https://2gis.ru/search/${address.town},%20${
                      address.street
                    }%20${address.house.replaceAll('/', '%2F')}`
                  }
                  className="text-sm underline whitespace-nowrap"
                  target="_blank"
                >
                  Проверить ссылку
                </a>
              </div>
            )}
        </div>
        {address.link2GisShow && (
          <Input
            label="Ссылка 2ГИС"
            type="link"
            value={address.link2Gis}
            onChange={(link2Gis) => onChange({ ...address, link2Gis })}
            error={errors?.address?.link2Gis}
            noMargin
            className="mt-0.5"
          />
        )}
        <div className="flex flex-wrap items-end justify-between gap-x-2">
          <ImageCheckBox
            checked={address.linkYandexShow}
            onClick={() =>
              onChange({ ...address, linkYandexShow: !address.linkYandexShow })
            }
            label="Показывать ссылку Yandex Navigator"
            src="/img/navigators/yandex.png"
            big
          />
          {address.linkYandexShow &&
            (address.linkYandexNavigator ||
              (address?.town && address?.street)) && (
              <div className="flex justify-end flex-1">
                <a
                  data-tip="Открыть адрес в 2ГИС"
                  href={
                    address.linkYandexNavigator ||
                    `yandexnavi://map_search?text=${address.town},%20${
                      address.street
                    }%20${address.house.replaceAll('/', '%2F')}`
                  }
                  className="text-sm underline whitespace-nowrap"
                  target="_blank"
                >
                  Проверить ссылку
                </a>
              </div>
            )}
        </div>
        {address.linkYandexShow && (
          <Input
            label="Ссылка Yandex Navigator"
            type="link"
            value={address.linkYandexNavigator}
            onChange={(linkYandexNavigator) =>
              onChange({ ...address, linkYandexNavigator })
            }
            error={errors?.address?.linkYandexNavigator}
            noMargin
            className="mt-0.5"
          />
        )}
        {(address.linkYandexShow || address.link2GisShow) && (
          <Note>
            Если ссылка не указана, то будет сгенерирована автоматически исходя
            из данных адреса
          </Note>
        )}
      </div>
    </InputWrapper>
  )
}

export default AddressPicker
