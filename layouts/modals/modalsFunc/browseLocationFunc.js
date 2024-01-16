import FormWrapper from '@components/FormWrapper'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LOCATIONS } from '@helpers/constants'
import locationAtom from '@state/atoms/locationAtom'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const Item = ({ towns = [], checked, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      checked ? 'border-success bg-green-300' : 'bg-gray-200 border-gray-500',
      'bg-opacity-50 min-h-[3rem] flex items-center px-3 py-2 border rounded-md gap-x-1 cursor-pointer'
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
  </div>
)

const browseLocationFunc = () => {
  const BrowseLocationModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const location = useRecoilValue(locationAtom)
    const [selectedLocation, setSelectedLocation] = useState(location)
    const router = useRouter()

    const onClickConfirm = async () => {
      if (selectedLocation === location) {
        localStorage.setItem('location', selectedLocation)
        closeModal()
      } else {
        localStorage.removeItem('location')
        // if (selectedLocation === 'norilsk')
        router.push(
          `${LOCATIONS[selectedLocation].domen}?location=${selectedLocation}`,
          '',
          {
            shallow: false,
          }
        )
        // if (selectedLocation === 'krasnoyarsk')
        //   router.push('https://половинкауспеха.рф?location=krasnoyarsk', '', {
        //     shallow: false,
        //   })
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!['krasnoyarsk', 'norilsk'].includes(selectedLocation))
    }, [selectedLocation])

    return (
      <FormWrapper>
        <div className="flex flex-col gap-y-2">
          <div>
            Для того чтобы предложить Вам мероприятия из региона Вашего
            проживания, необходимо выбрать регион из предложенных вариантов:
          </div>
          <div className="flex flex-col gap-y-1">
            <Item
              checked={selectedLocation === 'krasnoyarsk'}
              towns={['Красноярск', 'Сосновоборск', 'Дивногорск']}
              onClick={() => setSelectedLocation('krasnoyarsk')}
            />
            <Item
              checked={selectedLocation === 'norilsk'}
              towns={['Норильск', 'Оганер', 'Кайеркан', 'Талнах', 'Дудинка']}
              onClick={() => setSelectedLocation('norilsk')}
            />
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
