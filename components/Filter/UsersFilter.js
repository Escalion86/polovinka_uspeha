import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'

const UsersFilter = ({ value, onChange, hideNullGender }) => {
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
    </>
  )
}

export default UsersFilter
