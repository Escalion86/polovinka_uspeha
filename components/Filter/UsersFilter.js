import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import CheckedUserToggleButtons from '@components/IconToggleButtons/CheckedUserToggleButtons'
import Slider from '@components/Slider'

const UsersFilter = ({ value, onChange, hideNullGender, hideBanned }) => {
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
      {value?.ages && (
        <Slider
          value={[value.ages.min || 18, value.ages.max || 70]}
          onChange={([min, max]) =>
            onChange((state) => ({ ...state, ages: { min, max } }))
          }
          min={18}
          max={70}
          label="Возраст"
          labelClassName="w-16 min-w-16"
        />
      )}
    </>
  )
}

export default UsersFilter
