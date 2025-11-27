'use client'

import Button from '@components/Button'
import ContentHeader from '@components/ContentHeader'
import EditableTextarea from '@components/EditableTextarea'
import Input from '@components/Input'
import TimePicker from '@components/TimePicker'
import AddButton from '@components/IconToggleButtons/AddButton'
import { useCallback, useMemo, useState } from 'react'

const ToolsScheduledMessagesContent = () => {
  const [taskName, setTaskName] = useState('')
  const [message, setMessage] = useState('')
  const [sendTime, setSendTime] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const handleTimeChange = useCallback((value) => {
    setSendTime(value)
  }, [])

  const plannedTimeLabel = useMemo(
    () => (sendTime ? sendTime.format('HH:mm') : 'не выбрано'),
    [sendTime]
  )

  const handleOpenModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <>
      <ContentHeader>
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold text-black">
              Сообщения по расписанию
            </div>
            <div className="text-sm text-general">
              Подготовьте текст и время отправки — форма использует тот же
              редактор, что и рассылки
            </div>
          </div>
        </div>
      </ContentHeader>
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-base font-semibold text-black">
            Черновики сообщений
          </div>
          <div className="text-sm text-general">
            Создавайте сообщения заранее и назначайте удобное время отправки
          </div>
        </div>
        <AddButton onClick={handleOpenModal} />
      </div>

      <div className="flex flex-col gap-4 p-4 mt-4 bg-white border rounded-lg shadow-sm">
        <div className="text-base font-semibold text-black">
          Настройка сообщения
        </div>
        <div className="text-sm text-general">
          Здесь можно собрать черновик сообщения для Telegram-группы. Позже мы
          добавим сохранение и автоматическую отправку по расписанию.
        </div>

        <Input
          label="Название задания"
          placeholder="Например, Утреннее напоминание"
          value={taskName}
          onChange={setTaskName}
        />

        <EditableTextarea
          label="Текст сообщения"
          html={message}
          onChange={setMessage}
          required
        />

        <TimePicker
          label="Время отправки"
          value={sendTime}
          onChange={handleTimeChange}
          fullWidth
        />

        <div className="flex flex-col gap-1 text-sm text-general">
          <span className="font-semibold text-black">Запланировано на</span>
          <span>{plannedTimeLabel}</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            name="Открыть форму создания"
            onClick={handleOpenModal}
            thin
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-black">
                  Новое сообщение
                </div>
                <div className="text-sm text-general">
                  Текст и время можно будет отредактировать перед публикацией
                </div>
              </div>
              <Button name="Закрыть" onClick={handleCloseModal} thin />
            </div>

            <Input
              label="Название задания"
              placeholder="Например, Утреннее напоминание"
              value={taskName}
              onChange={setTaskName}
            />

            <EditableTextarea
              label="Текст сообщения"
              html={message}
              onChange={setMessage}
              required
            />

            <TimePicker
              label="Время отправки"
              value={sendTime}
              onChange={handleTimeChange}
              fullWidth
            />

            <div className="flex flex-col gap-1 text-sm text-general">
              <span className="font-semibold text-black">Запланировано на</span>
              <span>{plannedTimeLabel}</span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button name="Отмена" onClick={handleCloseModal} thin />
              <Button name="Сохранить (скоро)" thin disabled />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ToolsScheduledMessagesContent
