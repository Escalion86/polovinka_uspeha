import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import ComboBox from '@components/ComboBox'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'

const directionDeleteFunc = (directionId) => {
  const DirectionDeleteModal = ({
    closeModal,
    setOnConfirmFunc,
    setDisableConfirm,
  }) => {
    const directions = useAtomValue(directionsAtom)
    const events = useAtomValue(eventsAtom)
    const itemsFunc = useAtomValue(itemsFuncAtom)

    const [selectedDirectionId, setSelectedDirectionId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const direction = useMemo(
      () => directions.find((item) => item._id === directionId),
      [directions, directionId]
    )

    const eventsToMove = useMemo(
      () =>
        (events ?? []).filter((event) => event.directionId === directionId),
      [events, directionId]
    )

    const directionOptions = useMemo(
      () =>
        directions
          .filter((item) => item._id !== directionId)
          .map((item) => ({ name: item.title, value: item._id })),
      [directions, directionId]
    )

    const canSelectDirection = eventsToMove.length > 0
    const canConfirm = !canSelectDirection || Boolean(selectedDirectionId)

    useEffect(() => {
      setDisableConfirm(!canConfirm)
      setOnConfirmFunc(
        canConfirm
          ? async () => {
              if (!directionId) return
              setIsDeleting(true)
              closeModal()

              if (eventsToMove.length > 0 && selectedDirectionId) {
                await Promise.all(
                  eventsToMove.map((event) =>
                    itemsFunc.event.set(
                      { _id: event._id, directionId: selectedDirectionId },
                      false,
                      true
                    )
                  )
                )
              }

              await itemsFunc.direction.delete(directionId)
            }
          : undefined
      )
    }, [
      canConfirm,
      directionId,
      eventsToMove,
      selectedDirectionId,
      itemsFunc,
      closeModal,
      setDisableConfirm,
      setOnConfirmFunc,
    ])

    if (isDeleting) return <div>Удаление Пространства...</div>

    if (!directionId || !direction)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пространство не найдено!
        </div>
      )

    return (
      <div className="flex flex-col gap-y-2">
        {eventsToMove.length === 0 ? (
          <div>Вы уверены, что хотите удалить Пространство?</div>
        ) : (
          <>
            <div className="text-red-500">
              У Пространства есть мероприятия ({eventsToMove.length}). Выберите
              Пространство, на которое нужно перенести эти мероприятия.
            </div>
            {directionOptions.length > 0 ? (
              <ComboBox
                label="Новое Пространство"
                value={selectedDirectionId}
                onChange={setSelectedDirectionId}
                items={directionOptions}
                placeholder="Выберите Пространство"
                activePlaceholder
                fullWidth
                required
                error={!selectedDirectionId}
              />
            ) : (
              <div className="text-red-500">
                Нет доступных Пространств для переноса. Сначала создайте новое
                Пространство.
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return {
    title: `Удаление Пространства`,
    confirmButtonName: 'Удалить Пространство',
    Children: DirectionDeleteModal,
  }
}

export default directionDeleteFunc

