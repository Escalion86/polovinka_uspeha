'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import ToggleButtons from '@components/IconToggleButtons/ToggleButtons'
import SortingButtonMenu from '@components/SortingButtonMenu'
import { deleteData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import scheduledMessagesAtomAsync from '@state/async/scheduledMessagesAtomAsync'
import scheduledChannelsAtomAsync from '@state/async/scheduledChannelsAtomAsync'
import useSnackbar from '@helpers/useSnackbar'
import modalsFuncAtom from '@state/modalsFuncAtom'
import {
  SCHEDULED_MESSAGE_STATUSES,
  SCHEDULED_MESSAGE_STATUS_NAME,
} from '@helpers/constantsScheduledMessages'
import { getNounMessages } from '@helpers/getNoun'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import ScheduledMessageCard from '@layouts/cards/ScheduledMessageCard'
import sortFuncGenerator from '@helpers/sortFuncGenerator'

const ToolsScheduledMessagesContent = () => {
  const location = useAtomValue(locationAtom)
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const scheduledMessages = useAtomValue(scheduledMessagesAtomAsync) || []
  const scheduledChannels = useAtomValue(scheduledChannelsAtomAsync) || []
  const setScheduledMessages = useSetAtom(scheduledMessagesAtomAsync)
  const { success: notifySuccess, error: notifyError } = useSnackbar()

  const [deletingId, setDeletingId] = useState(null)
  const shouldShowChannel = scheduledChannels.length > 1
  const statusButtonsConfig = useMemo(
    () => [
      {
        value: SCHEDULED_MESSAGE_STATUSES.DRAFT,
        name: SCHEDULED_MESSAGE_STATUS_NAME[SCHEDULED_MESSAGE_STATUSES.DRAFT],
        color: 'warning',
      },
      {
        value: SCHEDULED_MESSAGE_STATUSES.READY,
        name: SCHEDULED_MESSAGE_STATUS_NAME[SCHEDULED_MESSAGE_STATUSES.READY],
        color: 'primary',
      },
      {
        value: SCHEDULED_MESSAGE_STATUSES.SENT,
        name: SCHEDULED_MESSAGE_STATUS_NAME[SCHEDULED_MESSAGE_STATUSES.SENT],
        color: 'success',
      },
    ],
    []
  )
  const [statusFilter, setStatusFilter] = useState(() =>
    statusButtonsConfig.reduce(
      (acc, cfg) => ({ ...acc, [cfg.value]: true }),
      {}
    )
  )
  const [sort, setSort] = useState({ sendDate: 'desc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const filteredScheduledMessages = useMemo(
    () =>
      scheduledMessages.filter((message) => {
        if (!message?.status) return true
        return statusFilter[message.status] ?? true
      }),
    [scheduledMessages, statusFilter]
  )

  const sortedScheduledMessages = useMemo(() => {
    const list = [...filteredScheduledMessages]
    if (!sortFunc) return list
    return list.sort(sortFunc)
  }, [filteredScheduledMessages, sortFunc])

  const handleOpenModal = useCallback(
    (message = null) => {
      modalsFunc?.scheduledMessage?.edit(message)
    },
    [modalsFunc]
  )
  const handleClone = useCallback(
    (message) => {
      if (!message) return
      const clonedMessage = {
        ...message,
        _id: undefined,
        status: SCHEDULED_MESSAGE_STATUSES.DRAFT,
      }
      modalsFunc?.scheduledMessage?.edit(clonedMessage)
    },
    [modalsFunc]
  )

  // const updateScheduledMessagesList = useCallback(
  //   (updatedMessage, shouldPrepend = false) => {
  //     const currentList = scheduledMessages || []
  //     const exists = currentList.some(({ _id }) => _id === updatedMessage._id)
  //     if (exists) {
  //       setScheduledMessages(
  //         currentList.map((item) =>
  //           item._id === updatedMessage._id ? updatedMessage : item
  //         )
  //       )
  //     } else if (shouldPrepend) {
  //       setScheduledMessages([updatedMessage, ...currentList])
  //     } else {
  //       setScheduledMessages([...currentList, updatedMessage])
  //     }
  //   },
  //   [scheduledMessages, setScheduledMessages]
  // )

  const handleDelete = useCallback(
    (message) => {
      if (!message) return
      const confirmDelete = async () => {
        try {
          setDeletingId(message._id)
          const success = await deleteData(
            `/api/${location}/scheduled-messages/${message._id}`,
            null,
            null,
            {},
            false,
            loggedUser?._id
          )
          if (success !== undefined) {
            const filtered = scheduledMessages.filter(
              (item) => item._id !== message._id
            )
            setScheduledMessages(filtered)
            notifySuccess('Сообщение удалено')
          } else {
            throw new Error('delete')
          }
        } catch (error) {
          notifyError('Не удалось удалить сообщение')
        } finally {
          setDeletingId(null)
        }
      }

      if (modalsFunc?.confirm) {
        modalsFunc.confirm({
          title: 'Удалить сообщение?',
          text: `Сообщение <${message.name || 'Без названия'}> будет удалено.`,
          onConfirm: confirmDelete,
        })
      } else {
        confirmDelete()
      }
    },
    [
      location,
      loggedUser?._id,
      modalsFunc,
      notifyError,
      notifySuccess,
      scheduledMessages,
      setScheduledMessages,
    ]
  )

  return (
    <>
      <ContentHeader>
        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ToggleButtons
              value={statusFilter}
              onChange={setStatusFilter}
              buttonsConfig={statusButtonsConfig}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-lg font-bold whitespace-nowrap">
                {getNounMessages(sortedScheduledMessages.length)}
              </div>
              <SortingButtonMenu
                sort={sort}
                onChange={setSort}
                sortKeys={['sendDate', 'createdAt']}
              />
              <AddButton onClick={() => handleOpenModal()} />
            </div>
          </div>
        </div>
      </ContentHeader>
      {/* <div className="flex flex-col gap-4"> */}
      {sortedScheduledMessages.length === 0 ? (
        <div className="p-6 text-center bg-white border rounded-lg shadow-sm text-general">
          Пока нет сообщений. Создайте первое, чтобы автоматизировать
          коммуникацию.
        </div>
      ) : (
        <CardListWrapper>
          {sortedScheduledMessages.map((message) => (
            <ScheduledMessageCard
              key={message._id}
              message={message}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              isDeleting={deletingId === message._id}
              showChannelName={shouldShowChannel}
              onClone={handleClone}
            />
          ))}
        </CardListWrapper>
      )}
      {/* </div> */}
    </>
  )
}

export default ToolsScheduledMessagesContent
