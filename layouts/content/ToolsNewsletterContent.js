'use client'

import Button from '@components/Button'
import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus'
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import UserStatusIcon from '@components/UserStatusIcon'
import SvgSigma from '@svg/SvgSigma'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import Note from '@components/Note'
import { postData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import EditableTextarea from '@components/EditableTextarea'
import convertHtmlToText from '@helpers/convertHtmlToText'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import { useCallback } from 'react'
import store from '@state/store'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import getNoun, { getNounUsers } from '@helpers/getNoun'

const ToolsNewsletterContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)

  const [selectedUsers, setSelectedUsers] = useState([])
  const [message, setMessage] = useState('')
  const [rerender, setRerender] = useState(false)

  const toggleRerender = () => setRerender((state) => !state)

  const selectedMans = selectedUsers.filter((user) => user.gender === 'male')
  const selectedWomans = selectedUsers.filter(
    (user) => user.gender === 'famale'
  )
  const selectedUnknownGender = selectedUsers.filter(
    (user) => user.gender !== 'male' && user.gender !== 'famale'
  )
  const selectedMansMemberCount = selectedMans.filter(
    (user) => user.status === 'member'
  ).length
  const selectedWomansMemberCount = selectedWomans.filter(
    (user) => user.status === 'member'
  ).length
  const selectedUnknownGenderMemberCount = selectedUnknownGender.filter(
    (user) => user.status === 'member'
  ).length
  const selectedMansNoviceCount = selectedMans.length - selectedMansMemberCount
  const selectedWomansNoviceCount =
    selectedWomans.length - selectedWomansMemberCount
  const selectedUnknownGenderNoviceCount =
    selectedUnknownGender.length - selectedUnknownGenderMemberCount

  const sendMessage = async (message) => {
    const result = []

    for (let i = 0; i < selectedUsers.length; i++) {
      const user = selectedUsers[i]
      const res = await postData(`/api/${location}/whatsapp/sendMessage`, {
        phone: user.whatsapp || user.phone,
        message,
      })
      result.push(res)
    }
    return result
  }

  const Component = useCallback(
    (props) => <EditableTextarea {...props} />,
    [rerender]
  )

  return (
    <div className="flex flex-col px-1 py-1 overflow-y-auto gap-y-1">
      <Note>
        Ниже представлена таблица выбранных пользователей.
        <br />
        Нажмите на таблицу для выбора пользователей
      </Note>
      <div className="flex flex-wrap items-center gap-1">
        <div
          onClick={() =>
            modalsFunc.selectUsers(
              selectedUsers,
              {},
              setSelectedUsers,
              [] //exceptedIds,
              //acceptedIds,
              // maxUsers,
              // canSelectNone,
              // modalTitle,
              // showCountNumber
            )
          }
          className="w-fit grid grid-cols-[30px_64px_64px_64px] grid-rows-[30px_30px_30px_30px_30px] items-stretch justify-center  overflow-hiddenduration-300 border cursor-pointer rounded-lg border-general hover:bg-general/20"
        >
          <div className="border-b border-r" />
          <div className="flex items-center justify-center border-b border-r gap-x-1">
            <UserStatusIcon size="xs" status="novice" />
          </div>
          <div className="flex items-center justify-center border-b border-r gap-x-1">
            <UserStatusIcon size="xs" status="member" />
          </div>
          <div className="flex items-center justify-center border-b">
            <div className="w-5 h-5 min-w-5">
              <SvgSigma className="fill-general" />
            </div>
          </div>
          <div className="flex items-center justify-center border-b border-r">
            <FontAwesomeIcon
              icon={faMars}
              className="w-5 h-5 text-blue-600 laptop:w-6 laptop:h-6"
            />
          </div>
          <div className="flex items-center justify-center text-center border-b border-r">
            {selectedMansNoviceCount}
          </div>
          <div className="flex items-center justify-center text-center border-b border-r">
            {selectedMansMemberCount}
          </div>
          <div className="flex items-center justify-center text-center border-b bg-general/10">
            {selectedMans.length}
          </div>
          <div className="flex items-center justify-center border-b border-r">
            <FontAwesomeIcon
              icon={faVenus}
              className="w-5 h-5 text-red-600 laptop:w-6 laptop:h-6"
            />
          </div>
          <div className="flex items-center justify-center text-center border-b border-r">
            {selectedWomansNoviceCount}
          </div>
          <div className="flex items-center justify-center text-center border-b border-r">
            {selectedWomansMemberCount}
          </div>
          <div className="flex items-center justify-center text-center border-b bg-general/10">
            {selectedWomans.length}
          </div>
          <div className="flex items-center justify-center border-b border-r">
            <FontAwesomeIcon
              icon={faGenderless}
              className="w-5 h-5 text-gray-400 laptop:w-6 laptop:h-6"
            />
          </div>

          <div className="flex items-center justify-center text-center border-b border-r">
            {selectedUnknownGenderNoviceCount}
          </div>
          <div className="flex items-center justify-center text-center border-b border-r">
            {selectedUnknownGenderMemberCount}
          </div>
          <div className="flex items-center justify-center text-center border-b bg-general/10">
            {selectedUnknownGender.length}
          </div>
          <div className="flex items-center justify-center border-r">
            <div className="w-5 h-5 min-w-5">
              <SvgSigma className="fill-general" />
            </div>
          </div>
          <div className="flex items-center justify-center text-center border-r bg-general/10">
            {selectedMansNoviceCount +
              selectedWomansNoviceCount +
              selectedUnknownGenderNoviceCount}
          </div>
          <div className="flex items-center justify-center text-center border-r bg-general/10">
            {selectedMansMemberCount +
              selectedWomansMemberCount +
              selectedUnknownGenderMemberCount}
          </div>
          <div className="flex items-center justify-center font-bold text-center bg-general/20">
            {selectedUsers.length}
          </div>
        </div>
        <div>
          <Button
            name="Выбрать пользователей из мероприятия"
            onClick={() =>
              modalsFunc.selectEvents(
                [],
                null,
                async (data) => {
                  const eventId = data[0]
                  const eventUsers = await store.get(
                    eventsUsersFullByEventIdSelector(eventId)
                  )
                  console.log('eventUsers :>> ', eventUsers)
                  const users = eventUsers.map(({ user }) => user)

                  setSelectedUsers(users)
                },
                [],
                null,
                1,
                true,
                'Выбрать пользователей из мероприятия...'
                // itemsId,
                // filterRules,
                // onChange,
                // exceptedIds,
                // acceptedIds,
                // maxEvents,
                // canSelectNone,
                // modalTitle,
                // showCountNumber
              )
            }
          />
        </div>
      </div>
      <div className="pt-1 border-t border-gray-400">
        <Button
          name="Вставить текст из буфера"
          onClick={async () => {
            await pasteFromClipboard(setMessage)
            toggleRerender()
          }}
        />
      </div>
      <div>
        <Component
          label="Сообщение"
          html={message}
          onChange={setMessage}
          // placeholder="Описание мероприятия..."
          required
        />
      </div>
      <div>
        <Button
          disabled={!message || !selectedUsers?.length}
          name="Отправить сообщение"
          onClick={() => {
            modalsFunc.confirm({
              title: 'Отправка сообщений на Whatsapp пользователям',
              text: `Вы уверены, что хотите сообщение ${getNoun(selectedUsers?.length, 'пользователю', 'пользователям', 'пользователям')}?`,
              onConfirm: () => {
                const prepearedText = DOMPurify.sanitize(
                  convertHtmlToText(message, 'whatsapp'),
                  {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  }
                )
                sendMessage(prepearedText)
              },
            })
          }}
        />
      </div>
    </div>
  )
}

export default ToolsNewsletterContent
