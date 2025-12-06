import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import CheckedUserToggleButtons from '@components/IconToggleButtons/CheckedUserToggleButtons'
import ConsentUserToggleButtons from '@components/IconToggleButtons/ConsentUserToggleButtons'
import ToggleButtons from '@components/IconToggleButtons/ToggleButtons'
import Slider from '@components/Slider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'

const UsersFilter = ({
  value,
  onChange,
  hideNullGender,
  hideBanned,
  minMaxAges,
}) => {
  return (
    <>
      {value?.gender && (
        <GenderToggleButtons
          value={value.gender}
          onChange={(value) =>
            onChange((state) => ({ ...state, gender: value }))
          }
          hideNullGender={hideNullGender}
        />
      )}
      {value?.status && (
        <StatusUserToggleButtons
          value={value.status}
          onChange={(value) =>
            onChange((state) => ({ ...state, status: value }))
          }
          hideBanned={hideBanned}
        />
      )}
      {value?.relationship && (
        <RelationshipUserToggleButtons
          value={value.relationship}
          onChange={(value) =>
            onChange((state) => ({ ...state, relationship: value }))
          }
        />
      )}
      {value?.checked && (
        <CheckedUserToggleButtons
          value={value.checked}
          onChange={(value) =>
            onChange((state) => ({ ...state, checked: value }))
          }
        />
      )}
      {value?.consent && (
        <ConsentUserToggleButtons
          value={value.consent}
          onChange={(value) =>
            onChange((state) => ({ ...state, consent: value }))
          }
        />
      )}
      {value?.telegram && (
        <ToggleButtons
          value={value.telegram}
          onChange={(value) =>
            onChange((state) => ({ ...state, telegram: value }))
          }
          buttonsConfig={[
            { value: 'withId', color: 'green' },
            { value: 'withoutId', color: 'secondary' },
          ]}
          names={{
            withId: (
              <FontAwesomeIcon icon={faTelegram} className="w-6 h-6 min-h-6" />
            ),
            withoutId: (
              <span className="relative flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTelegram}
                  className="w-6 h-6 text-gray-500 min-h-6"
                />
                <span className="absolute w-8 h-[2px] bg-red-500 rotate-45" />
              </span>
            ),
          }}
          iconsOnly
        />
      )}
      {value?.ages && (
        <Slider
          value={[value.ages.min || 18, value.ages.max || 70]}
          onChange={([min, max]) =>
            onChange((state) => ({ ...state, ages: { min, max } }))
          }
          min={minMaxAges?.min ? minMaxAges.min : 18}
          max={minMaxAges?.max ? minMaxAges.max : 70}
          label="Возраст"
          labelClassName="w-16 min-w-16"
          wrapperClassName="w-full min-w-[300px] max-w-[500px]"
          paddingY="small"
          smallMargin
        />
      )}
    </>
  )
}

export default UsersFilter
