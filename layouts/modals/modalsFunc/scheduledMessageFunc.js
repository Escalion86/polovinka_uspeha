'use client'

import dayjs from 'dayjs'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Button from '@components/Button'
import ComboBox from '@components/ComboBox'
import EditableTextarea from '@components/EditableTextarea'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import scheduledChannelsAtomAsync from '@state/async/scheduledChannelsAtomAsync'
import scheduledMessagesAtomAsync from '@state/async/scheduledMessagesAtomAsync'
import {
  SCHEDULED_MESSAGE_STATUSES,
  SCHEDULED_MESSAGE_STATUS_OPTIONS,
  SCHEDULED_MESSAGE_STATUS_OPTIONS_EDITABLE,
} from '@helpers/constantsScheduledMessages'

const TIME_OPTIONS = Array.from({ length: 48 }).map((_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, '0')
  const minutes = index % 2 === 0 ? '00' : '30'
  const value = `${hours}:${minutes}`
  return { value, name: value }
})

const scheduledMessageFunc = (message = null) => {
  const ScheduledMessageModal = ({
    closeModal,
    setOnConfirmFunc,
    setDisableConfirm,
    setOnShowOnCloseConfirmDialog,
  }) => {
    const location = useAtomValue(locationAtom)
    const loggedUser = useAtomValue(loggedUserActiveAtom)
    const scheduledMessages = useAtomValue(scheduledMessagesAtomAsync) || []
    const setScheduledMessages = useSetAtom(scheduledMessagesAtomAsync)
    const channels = useAtomValue(scheduledChannelsAtomAsync) || []
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const { success: notifySuccess, error: notifyError } = useSnackbar()

    const initialForm = useMemo(
      () => ({
        name: message?.name ?? '',
        text: message?.text ?? '',
        sendTime: message?.sendTime ?? '',
        sendDate: message?.sendDate || dayjs().format('YYYY-MM-DD'),
        status: message?.status ?? SCHEDULED_MESSAGE_STATUSES.READY,
        channelId: message?.channel?.channelId ?? '',
      }),
      [message]
    )

    const [formName, setFormName] = useState(initialForm.name)
    const [formText, setFormText] = useState(initialForm.text)
    const [formSendTime, setFormSendTime] = useState(initialForm.sendTime)
    const [formSendDate, setFormSendDate] = useState(initialForm.sendDate)
    const [formStatus, setFormStatus] = useState(initialForm.status)
    const [formChannelId, setFormChannelId] = useState(initialForm.channelId)
    const [isSaving, setIsSaving] = useState(false)

    const isSendDatePast = useMemo(() => {
      if (!formSendDate) return false
      return dayjs(formSendDate).isBefore(dayjs().startOf('day'))
    }, [formSendDate])

    const channelOptions = useMemo(
      () =>
        channels.map((channel) => ({
          value: channel._id,
          name: channel.name
            ? `${channel.name}${channel.telegramId ? ` (${channel.telegramId})` : ''}`
            : channel.telegramId || 'Без названия',
        })),
      [channels]
    )

    const selectedChannel = useMemo(
      () => channels.find((channel) => channel._id === formChannelId),
      [channels, formChannelId]
    )

    const formChanged = useMemo(() => {
      return (
        initialForm.name !== formName ||
        initialForm.text !== formText ||
        initialForm.sendTime !== formSendTime ||
        initialForm.sendDate !== formSendDate ||
        initialForm.status !== formStatus ||
        initialForm.channelId !== formChannelId
      )
    }, [
      formChannelId,
      formName,
      formSendDate,
      formSendTime,
      formStatus,
      formText,
      initialForm,
    ])

    const updateScheduledMessagesList = useCallback(
      (updatedMessage, shouldPrepend = false) => {
        const currentList = scheduledMessages || []
        const exists = currentList.some(({ _id }) => _id === updatedMessage._id)
        if (exists) {
          setScheduledMessages(
            currentList.map((item) =>
              item._id === updatedMessage._id ? updatedMessage : item
            )
          )
        } else if (shouldPrepend) {
          setScheduledMessages([updatedMessage, ...currentList])
        } else {
          setScheduledMessages([...currentList, updatedMessage])
        }
      },
      [scheduledMessages, setScheduledMessages]
    )

    const handleSave = useCallback(async () => {
      if (!formSendTime) {
        notifyError('Укажите время отправки')
        return
      }
      if (!formSendDate) {
        notifyError('Укажите дату отправки')
        return
      }
      if (!formText?.trim()) {
        notifyError('Заполните текст сообщения')
        return
      }
      if (!selectedChannel) {
        notifyError('Выберите канал, в который нужно отправить сообщение')
        return
      }
      if (isSendDatePast) {
        notifyError('Дата отправки уже прошла')
      }

      const payload = {
        name: formName?.trim() || '',
        text: formText,
        sendTime: formSendTime,
        sendDate: formSendDate,
        status: formStatus,
        channel: {
          channelId: selectedChannel._id,
          name: selectedChannel.name,
          telegramId: selectedChannel.telegramId,
        },
      }

      try {
        setIsSaving(true)
        if (message?._id) {
          const updated = await putData(
            `/api/${location}/scheduled-messages/${message._id}`,
            payload,
            null,
            null,
            false,
            loggedUser?._id
          )
          if (!updated) throw new Error('update')
          updateScheduledMessagesList(updated)
          notifySuccess('Сообщение обновлено')
        } else {
          const created = await postData(
            `/api/${location}/scheduled-messages`,
            payload,
            null,
            null,
            false,
            loggedUser?._id
          )
          if (!created) throw new Error('create')
          updateScheduledMessagesList(created, true)
          notifySuccess('Сообщение добавлено')
        }
        closeModal()
      } catch (error) {
        notifyError('Не удалось сохранить сообщение')
      } finally {
        setIsSaving(false)
      }
    }, [
      closeModal,
      formName,
      formSendDate,
      formSendTime,
      formStatus,
      formText,
      isSendDatePast,
      location,
      loggedUser?._id,
      message?._id,
      notifyError,
      notifySuccess,
      selectedChannel,
      updateScheduledMessagesList,
    ])

    const isFormValid = useMemo(() => {
      return (
        Boolean(
          formSendTime && formSendDate && formText?.trim() && selectedChannel
        ) && !isSaving
      )
    }, [formSendDate, formSendTime, formText, isSaving, selectedChannel])

    useEffect(() => {
      setDisableConfirm(!isFormValid)
      setOnConfirmFunc(isFormValid ? handleSave : undefined)
    }, [handleSave, isFormValid, setDisableConfirm, setOnConfirmFunc])

    useEffect(() => {
      setOnShowOnCloseConfirmDialog(formChanged)
    }, [formChanged, setOnShowOnCloseConfirmDialog])

    const handleManageChannelsClick = useCallback(() => {
      modalsFunc?.scheduledChannel?.manage?.()
    }, [modalsFunc])

    const isStatusReadOnly =
      message?.status === SCHEDULED_MESSAGE_STATUSES.SENT

    const statusOptions = useMemo(
      () =>
        isStatusReadOnly
          ? SCHEDULED_MESSAGE_STATUS_OPTIONS
          : SCHEDULED_MESSAGE_STATUS_OPTIONS_EDITABLE,
      [isStatusReadOnly]
    )

    return (
      <div className="flex flex-col gap-4">
        <Input
          label="Название сообщения"
          placeholder="Например, утреннее напоминание"
          value={formName}
          onChange={setFormName}
        />

        <EditableTextarea
          label="Текст сообщения"
          html={formText}
          onChange={setFormText}
          required
        />

        <div className="flex items-start gap-2">
          <div className="flex-1">
            <ComboBox
              label="Канал для отправки"
              value={formChannelId}
              onChange={(value) => setFormChannelId(value || '')}
              items={channelOptions}
              placeholder={
                channelOptions.length ? 'Выберите канал' : 'нет каналов'
              }
              activePlaceholder
              disabled={!channelOptions.length}
              required
            />
          </div>
          <Button
            name="Настроить"
            thin
            outline
            collapsing
            className="mt-3"
            onClick={handleManageChannelsClick}
          />
        </div>
        {!channelOptions.length && (
          <div className="-mt-3 text-sm text-danger">
            Добавьте канал, чтобы отправлять сообщения по расписанию.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Дата отправки"
            type="date"
            value={formSendDate}
            onChange={setFormSendDate}
            required
          />
          <ComboBox
            label="Время отправки"
            value={formSendTime}
            onChange={(value) => setFormSendTime(value || '')}
            items={TIME_OPTIONS}
            placeholder="Не выбрано"
            activePlaceholder
            required
          />
        </div>
        {isSendDatePast && (
          <div className="-mt-2 text-sm text-danger">
            Дата отправки уже прошла. Сообщение не будет отправлено, если не
            выбрать новую дату.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <ComboBox
            label="Статус"
            value={formStatus}
            onChange={(value) =>
              setFormStatus(value || SCHEDULED_MESSAGE_STATUSES.READY)
            }
            items={statusOptions}
            disabled={isStatusReadOnly}
          />
        </div>
      </div>
    )
  }

  return {
    title: message?._id ? 'Редактирование сообщения' : 'Новое сообщение',
    confirmButtonName: message?._id ? 'Сохранить' : 'Добавить',
    declineButtonName: 'Отмена',
    Children: ScheduledMessageModal,
  }
}

export default scheduledMessageFunc

