'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import Button from '@components/Button'
import Input from '@components/Input'
import { deleteData, postData, putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import scheduledChannelsAtomAsync from '@state/async/scheduledChannelsAtomAsync'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'

const scheduledChannelsManageFunc = () => {
  const ScheduledChannelsManageModal = ({
    closeModal,
    setOnConfirmFunc,
    setDisableConfirm,
    setOnShowOnCloseConfirmDialog,
  }) => {
    const location = useAtomValue(locationAtom)
    const loggedUser = useAtomValue(loggedUserActiveAtom)
    const channels = useAtomValue(scheduledChannelsAtomAsync) || []
    const setChannels = useSetAtom(scheduledChannelsAtomAsync)
    const { success: notifySuccess, error: notifyError } = useSnackbar()

    const [channelName, setChannelName] = useState('')
    const [channelTelegramId, setChannelTelegramId] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
      setDisableConfirm(false)
      setOnConfirmFunc(() => closeModal)
    }, [closeModal, setDisableConfirm, setOnConfirmFunc])

    useEffect(() => {
      setOnShowOnCloseConfirmDialog(
        Boolean(channelName || channelTelegramId || editingId)
      )
    }, [
      channelName,
      channelTelegramId,
      editingId,
      setOnShowOnCloseConfirmDialog,
    ])

    const resetForm = useCallback(() => {
      setChannelName('')
      setChannelTelegramId('')
      setEditingId(null)
    }, [])

    const handleSubmit = useCallback(async () => {
      const trimmedName = channelName.trim()
      const trimmedTelegramId = channelTelegramId.trim()
      if (!trimmedName || !trimmedTelegramId) {
        notifyError('Заполните название и ID канала')
        return
      }

      const payload = {
        name: trimmedName,
        telegramId: trimmedTelegramId,
      }

      try {
        setIsSaving(true)
        if (editingId) {
          const updated = await putData(
            `/api/${location}/scheduled-channels/${editingId}`,
            payload,
            null,
            null,
            false,
            loggedUser?._id
          )
          if (!updated) throw new Error('update')
          setChannels(
            channels.map((channel) =>
              channel._id === updated._id ? updated : channel
            )
          )
          notifySuccess('Канал обновлён')
        } else {
          const created = await postData(
            `/api/${location}/scheduled-channels`,
            payload,
            null,
            null,
            false,
            loggedUser?._id
          )
          if (!created) throw new Error('create')
          setChannels([created, ...channels])
          notifySuccess('Канал добавлен')
        }
        resetForm()
      } catch (error) {
        notifyError('Не удалось сохранить канал')
      } finally {
        setIsSaving(false)
      }
    }, [
      channelName,
      channelTelegramId,
      channels,
      editingId,
      location,
      loggedUser?._id,
      notifyError,
      notifySuccess,
      resetForm,
      setChannels,
    ])

    const handleEdit = useCallback((channel) => {
      setEditingId(channel._id)
      setChannelName(channel.name || '')
      setChannelTelegramId(channel.telegramId || '')
    }, [])

    const handleDelete = useCallback(
      async (channel) => {
        if (!channel?._id) return
        const confirmDelete = window.confirm(
          `Удалить канал «${channel.name || 'Без названия'}»?`
        )
        if (!confirmDelete) return
        try {
          setDeletingId(channel._id)
          const success = await deleteData(
            `/api/${location}/scheduled-channels/${channel._id}`,
            null,
            null,
            {},
            false,
            loggedUser?._id
          )
          if (success === undefined) throw new Error('delete')
          setChannels(channels.filter((item) => item._id !== channel._id))
          notifySuccess('Канал удалён')
          if (editingId === channel._id) resetForm()
        } catch (error) {
          notifyError('Не удалось удалить канал')
        } finally {
          setDeletingId(null)
        }
      },
      [
        channels,
        editingId,
        location,
        loggedUser?._id,
        notifyError,
        notifySuccess,
        resetForm,
        setChannels,
      ]
    )

    const isSubmitDisabled = useMemo(() => {
      return !channelName.trim() || !channelTelegramId.trim() || isSaving
    }, [channelName, channelTelegramId, isSaving])

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="text-base font-semibold text-black">
            {editingId ? 'Редактирование канала' : 'Добавление нового канала'}
          </div>
          <Input
            label="Название канала"
            placeholder="Например, Группа объявлений"
            value={channelName}
            onChange={setChannelName}
          />
          <Input
            label="ID канала или чата"
            placeholder="Например, -1001234567890"
            value={channelTelegramId}
            onChange={setChannelTelegramId}
          />
          <div className="flex flex-wrap gap-2">
            {editingId && (
              <Button name="Отмена" outline thin onClick={resetForm} />
            )}
            <Button
              name={editingId ? 'Сохранить' : 'Добавить'}
              thin
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              loading={isSaving}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-base font-semibold text-black">
            Сохранённые каналы
          </div>
          {channels.length === 0 ? (
            <div className="p-3 text-sm border rounded text-general">
              Пока нет ни одного канала. Добавьте первый, чтобы отправлять
              сообщения по расписанию.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {channels.map((channel) => (
                <div
                  key={channel._id}
                  className="flex flex-col gap-2 p-3 border rounded tablet:flex-row tablet:items-center tablet:justify-between"
                >
                  <div>
                    <div className="font-semibold text-black">
                      {channel.name || 'Без названия'}
                    </div>
                    <div className="text-sm break-all text-general">
                      <span className="font-semibold">id:</span>{' '}
                      {channel.telegramId || 'ID не задан'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      // name="Редактировать"
                      thin
                      outline
                      onClick={() => handleEdit(channel)}
                      icon={faPencil}
                    />
                    <Button
                      // name="Удалить"
                      thin
                      classBgColor="bg-red-500"
                      classHoverBgColor="hover:bg-red-600"
                      onClick={() => handleDelete(channel)}
                      loading={deletingId === channel._id}
                      icon={faTrash}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return {
    title: 'Управление каналами для расписания',
    confirmButtonName: 'Готово',
    declineButtonName: 'Отмена',
    Children: ScheduledChannelsManageModal,
  }
}

export default scheduledChannelsManageFunc
