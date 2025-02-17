'use client'

import Button from '@components/Button'
import { SelectUser } from '@components/SelectItem'
import { getData, postData } from '@helpers/CRUD'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import locationAtom from '@state/atoms/locationAtom'
// import modalsFuncAtom from '@state/modalsFuncAtom'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useCallback } from 'react'
import { useEffect, useState, useRef } from 'react'

var interval
const WhatsappMessagesContent = () => {
  // const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)
  const listRef = useRef(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [resp, setResp] = useState([])
  const [waSettings, setWaSettings] = useState(null)
  const [messageToSend, setMessageToSend] = useState('')
  const user = useAtomValue(userSelector(selectedUserId))

  useEffect(() => {
    const fetchResp = async () => {
      await getData(
        `/api/${location}/whatsapp/getWaSettings`,
        {},
        setWaSettings,
        (error) => console.error('fetchResp error', error)
      )
    }
    fetchResp()
  }, [])

  const fetchChatHystory = useCallback(async (user) => {
    await postData(
      `/api/${location}/whatsapp/getChatHystory`,
      {
        phone: user.whatsapp || user.phone,
      },
      (newResp) => {
        if (JSON.stringify(newResp) === JSON.stringify(resp)) return
        setResp(newResp)
      }
    )
  }, [])

  useEffect(() => {
    if (interval) clearInterval(interval)
    if (user) {
      fetchChatHystory(user)
      interval = setInterval(() => {
        fetchChatHystory(user)
      }, 2000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [user])

  const sendMessage = async (message) => {
    await postData(`/api/${location}/whatsapp/sendMessage`, {
      phone: user.whatsapp || user.phone,
      message,
    })
  }

  return (
    <div className="flex flex-col h-full max-h-full p-1 gap-y-1">
      <div className="flex items-center gap-x-1">
        <Image
          src={waSettings?.avatar || '/img/whatsapp_default_avatar.jpg'}
          width={40}
          height={40}
        />
        <div>+{waSettings?.phone}</div>
        {waSettings?.stateInstance === 'authorized' ? (
          <div className="text-success">Авторизован</div>
        ) : (
          <div className="text-danger">Не авторизован</div>
        )}
      </div>
      <div className="flex flex-col h-fit gap-y-1">
        <SelectUser selectedId={selectedUserId} onChange={setSelectedUserId} />
        {/* {selectedUserId && (
          <Button
            name="Обновить список сообщений"
            onClick={() => {
              fetchChatHystory(user)
            }}
          />
        )} */}
      </div>
      {selectedUserId && (
        <div
          className="flex flex-col-reverse h-[calc(100%-90px)] max-h-[calc(100%-90px)] gap-y-1"
          ref={listRef}
        >
          <div className="flex items-center gap-x-1">
            <input
              className="w-full px-2 flex items-center h-[32px] border border-gray-400 rounded"
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
            />
            <Button
              name="Отправить"
              thin
              onClick={() => {
                sendMessage(messageToSend)
                setMessageToSend('')
              }}
              disabled={!messageToSend}
            />
          </div>
          {resp?.length > 0 && (
            <div className="flex py-0.5 flex-col-reverse overflow-y-scroll gap-y-1">
              {resp?.map(
                ({
                  type,
                  idMessage,
                  timestamp,
                  typeMessage,
                  chatId,
                  textMessage,
                  extendedTextMessage,
                  statusMessage,
                  sendByApi,
                  deletedMessageId,
                  editedMessageId,
                  isEdited,
                  isDeleted,
                }) => {
                  // {
                  //   type: 'outgoing',
                  //   idMessage: 'BAE5BE9B11EE6E2E',
                  //   timestamp: 1739548633,
                  //   typeMessage: 'extendedTextMessage',
                  //   chatId: '79138370020@c.us',
                  //   textMessage: '123123123',
                  //   extendedTextMessage: {
                  //     text: '123123123',
                  //     description: '',
                  //     title: '',
                  //     previewType: 'None',
                  //     jpegThumbnail: '',
                  //     forwardingScore: 0,
                  //     isForwarded: false
                  //   },
                  //   statusMessage: '',
                  //   sendByApi: true,
                  //   deletedMessageId: '',
                  //   editedMessageId: '',
                  //   isEdited: false,
                  //   isDeleted: false
                  // },
                  const dateTimeStamp = new Date(timestamp * 1000)
                  const dateTime = dateToDateTimeStr(dateTimeStamp)
                  var start = dateTimeStamp
                  var today = new Date()

                  return (
                    <div
                      key={idMessage}
                      className={cn(
                        'flex w-full',
                        type === 'outgoing' ? '' : 'flex-row-reverse'
                      )}
                    >
                      <div
                        className={cn(
                          'relative flex flex-col pt-1 px-1 pb-2.5 border border-gray-400 rounded-b-lg w-fit min-w-[70%]',
                          type === 'outgoing'
                            ? 'rounded-tr-lg bg-general/20'
                            : 'rounded-tl-lg bg-blue-600/20'
                        )}
                      >
                        {/* <div className="flex items-center text-sm text-gray-600 gap-x-1"> */}
                        {/* {type === 'outgoing' ? (
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="w-3 h-3 text-success"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="w-3 h-3 text-blue-600"
                    />
                  )} */}
                        {/* <div>{idMessage}</div> */}

                        {/* </div> */}
                        {/* <div>{typeMessage}</div> */}
                        {/* <div>{chatId}</div> */}
                        <div>{textMessage}</div>
                        {/* <div>{JSON.stringify(extendedTextMessage)}</div> */}
                        {/* <div>{statusMessage}</div> */}
                        {/* <div>{sendByApi}</div> */}
                        {/* <div>{deletedMessageId}</div> */}
                        {/* <div>{editedMessageId}</div> */}
                        {/* <div>{isEdited}</div> */}
                        {/* <div>{isDeleted}</div> */}
                        <div className="text-xs text-gray-600 absolute bottom-0 right-0.5">
                          {(start.toDateString() === today.toDateString()
                            ? dateTime[0] + ' '
                            : '') + dateTime[1]}
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WhatsappMessagesContent
