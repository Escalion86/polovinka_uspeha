import Button from '@components/Button'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventParticipantsFullByEventIdSelector from '@state/selectors/eventParticipantsFullByEventIdSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import UserLikesItem from './UserLikesItem'

const getLikesObject = (eventUsers) =>
  eventUsers.reduce((a, { userId, likes }) => ({ ...a, [userId]: likes }), {})

const LikesEditor = ({ eventId, readOnly }) => {
  const eventUsers = useRecoilValue(
    eventParticipantsFullByEventIdSelector(eventId)
  )

  const eventMans = useMemo(
    () =>
      eventUsers.filter(
        ({ user }) => !user.relationship && user.gender === 'male'
      ),
    [eventUsers]
  )
  const eventWomans = useMemo(
    () =>
      eventUsers.filter(
        ({ user }) => !user.relationship && user.gender === 'famale'
      ),
    [eventUsers]
  )

  const defaultMansSelections = useMemo(
    () => getLikesObject(eventMans),
    [eventMans]
  )
  const defaultWomansSelections = useMemo(
    () => getLikesObject(eventWomans),
    [eventWomans]
  )

  const [mansSelections, setMansSelections] = useState(defaultMansSelections)
  const [womansSelections, setWomansSelections] = useState(
    defaultWomansSelections
  )

  const setEventLikes = useRecoilValue(itemsFuncAtom).event.setLikes
  const [isResultSaved, setIsResultSaved] = useState(false)

  const setManState = (key) => (value) => {
    setMansSelections((state) => ({ ...state, [key]: value }))
    setIsResultSaved(false)
  }
  const setWomanState = (key) => (value) => {
    setWomansSelections((state) => ({ ...state, [key]: value }))
    setIsResultSaved(false)
  }

  const mans = useMemo(() => eventMans.map(({ user }) => user), [eventUsers])

  const womans = useMemo(
    () => eventWomans.map(({ user }) => user),
    [eventUsers]
  )

  const mansResult = {}
  const womansResult = {}
  for (const [manId, value] of Object.entries(mansSelections)) {
    if (value !== null && typeof value === 'object') {
      value.forEach((womanId) => {
        if (
          womansSelections[womanId] &&
          womansSelections[womanId].includes(manId)
        ) {
          if (!mansResult[manId]) {
            mansResult[manId] = [womanId]
          } else {
            mansResult[manId].push(womanId)
          }
          if (!womansResult[womanId]) {
            womansResult[womanId] = [manId]
          } else {
            womansResult[womanId].push(manId)
          }
        }
      })
    }
  }

  const saveResult = () => {
    const convertKeyUserIdToEventUserId = (object) => {
      const result = {}
      for (const [userId, likes] of Object.entries(object)) {
        const eventUserId = eventUsers.find(
          ({ user }) => user._id === userId
        )._id
        result[eventUserId] = likes
      }
      return result
    }
    const convertedMans = convertKeyUserIdToEventUserId(mansSelections)
    const convertedWomans = convertKeyUserIdToEventUserId(womansSelections)
    setEventLikes(eventId, {
      ...convertedMans,
      ...convertedWomans,
    })
    setIsResultSaved(true)
  }

  if (mans.length === 0 || womans.length === 0)
    return <div>Похоже что в мероприятии недостаточно участников</div>

  const mansIds = mans.map(({ _id }) => _id)
  const womansIds = womans.map(({ _id }) => _id)

  return (
    <div className="flex flex-col gap-y-2">
      {mans.map((user) => (
        <UserLikesItem
          key={eventId + user._id}
          user={user}
          acceptedIds={womansIds}
          onChange={setManState(user._id)}
          activeIds={mansResult[user._id]}
          selectedIds={mansSelections[user._id]}
          showContacts={isResultSaved}
          otherUsersData={womans}
          readOnly={readOnly}
        />
      ))}
      {womans.map((user) => (
        <UserLikesItem
          key={eventId + user._id}
          user={user}
          acceptedIds={mansIds}
          onChange={setWomanState(user._id)}
          activeIds={womansResult[user._id]}
          selectedIds={womansSelections[user._id]}
          showContacts={isResultSaved}
          otherUsersData={mans}
          readOnly={readOnly}
        />
      ))}
      {/* {!isResultSaved && (
        <Note>
          Для возможности отправки результатов участникам (отображения быстрых
          кнопок контактов), необходимо сохранить результат
        </Note>
      )} */}
      {!readOnly && (
        <Button
          disabled={isResultSaved}
          name="Сохранить результат"
          onClick={saveResult}
        />
      )}
    </div>
  )
}

export default LikesEditor
