import FormWrapper from '@components/FormWrapper'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LOCATIONS } from '@helpers/constants'
import locationAtom from '@state/atoms/locationAtom'
import cn from 'classnames'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

const Item = ({ towns = [], checked, location, isRegister }) => {
  return (
    <a
      href={`/${location}/login${isRegister ? '?registration=true' : ''}`}
      className={cn(
        checked
          ? 'border-success bg-green-300/50'
          : 'bg-gray-200/50 border-gray-500',
        'min-h-12 flex items-center px-3 py-2 border rounded-md gap-x-1 cursor-pointer hover:shadow-active'
      )}
    >
      <div className="flex flex-wrap gap-x-1 gap-y-1">
        {towns.map((town, index) => (
          <div
            key={town}
            className={cn(
              'flex gap-x-1 leading-4',
              index === 0 ? 'font-bold text-lg' : 'text-gray-600'
            )}
          >
            {index > 0 && <div>/</div>}
            {town}
          </div>
        ))}
      </div>

      <div className="ml-0.5 flex justify-end flex-1">
        {checked ? (
          <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-success" />
        ) : (
          <div className="w-5" />
        )}
      </div>
    </a>
  )
}

const browseLocationFunc = (props) => {
  const BrowseLocationModal = (
    {
      // closeModal,
      // setOnConfirmFunc,
      // setOnDeclineFunc,
      // setOnShowOnCloseConfirmDialog,
      // setDisableConfirm,
      // setDisableDecline,
    }
  ) => {
    const locationState = useAtomValue(locationAtom)
    const [selectedLocation, setSelectedLocation] = useState(locationState)

    const locationsList = useMemo(
      () =>
        Object.keys(LOCATIONS).filter(
          (location) => !LOCATIONS[location].hidden
        ),
      []
    )

    // const onClickConfirm = async () => {
    //   if (selectedLocation === locationState) {
    //     // localStorage.setItem('location', selectedLocation)
    //     closeModal()
    //   } else {
    //     // localStorage.removeItem('location')
    //     // if (selectedLocation === 'norilsk')
    //     router.push(
    //       { pathname: `/${selectedLocation}`, query: { u: 'true' } },
    //       '',
    //       {
    //         shallow: false,
    //       }
    //     )
    //     closeModal()
    //     // if (selectedLocation === 'krasnoyarsk')
    //     //   router.push('https://половинкауспеха.рф?location=krasnoyarsk', '', {
    //     //     shallow: false,
    //     //   })
    //   }
    // }

    // useEffect(() => {
    //   setOnConfirmFunc(onClickConfirm)
    //   // setOnShowOnCloseConfirmDialog(isFormChanged)
    //   setDisableConfirm(!locationsList.includes(selectedLocation))
    // }, [selectedLocation])

    return (
      <FormWrapper>
        <div className="flex flex-col gap-y-2">
          <div>
            Для того чтобы предложить Вам мероприятия из региона Вашего
            проживания, необходимо выбрать регион из предложенных вариантов:
          </div>
          <div className="flex flex-col gap-y-1">
            {locationsList.map((location) => (
              <Item
                key={location}
                checked={selectedLocation === location}
                towns={LOCATIONS[location].towns}
                location={location}
                // onClick={() => setSelectedLocation(location)}
                isRegister={props.isRegister}
              />
            ))}
            {/* <Item
              checked={selectedLocation === 'krasnoyarsk'}
              towns={['Красноярск', 'Сосновоборск', 'Дивногорск']}
              onClick={() => setSelectedLocation('krasnoyarsk')}
            />
            <Item
              checked={selectedLocation === 'norilsk'}
              towns={['Норильск', 'Оганер', 'Кайеркан', 'Талнах', 'Дудинка']}
              onClick={() => setSelectedLocation('norilsk')}
            /> */}
          </div>
          <div>
            Если Вашего региона нет в списке, значит наш проект пока еще не
            присутствует в вашем регионе
          </div>
        </div>
      </FormWrapper>
    )
  }

  return {
    title: `Выберите регион вашего проживания`,
    confirmButtonName: 'Выбрать',
    closeButtonShow: false,
    declineButtonShow: false,
    crossShow: false,
    // onDecline: onCancel,
    // declineButtonName: 'Закрыть',
    // declineButtonBgClassName: 'bg-general',
    Children: BrowseLocationModal,
  }
}

export default browseLocationFunc
