'use client'

import Button from '@components/Button'
import { SelectUser } from '@components/SelectItem'
import { getData, postData } from '@helpers/CRUD'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
// import modalsFuncAtom from '@state/modalsFuncAtom'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import { useEffect, useState, useRef } from 'react'

var interval
const WhatsappMessagesContent = () => {
  // const modalsFunc = useAtomValue(modalsFuncAtom)
  const listRef = useRef(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [resp, setResp] = useState([])
  const [waAvatar, setWaAvatar] = useState(null)
  const [instanceState, setInstanceState] = useState(null)
  const [messageToSend, setMessageToSend] = useState('')
  const user = useAtomValue(userSelector(selectedUserId))

  useEffect(() => {
    const fetchResp = async () => {
      await getData('/api/whatsapp/getWaSettings', {}, (newResp) => {
        setWaAvatar(newResp.avatar)
        setInstanceState(newResp.stateInstance)
      })
    }
    fetchResp()
  }, [])

  const fetchChatHystory = useCallback(async (user) => {
    // setResp(null)
    // await getData('/api/whatsapp/lastIncomingMessages', {})
    await postData(
      '/api/whatsapp',
      {
        phone: user.whatsapp || user.phone,
        type: 'getChatHystory', //'lastIncomingMessages',
      },
      (newResp) => {
        if (JSON.stringify(newResp) === JSON.stringify(resp)) return
        console.log('newResp', newResp)
        setResp(newResp)
      }
    )
  }, [])

  useEffect(() => {
    if (user) {
      if (interval) clearInterval(interval)
      fetchChatHystory(user)
      interval = setInterval(() => {
        fetchChatHystory(user)
      }, 2000)
    }
  }, [user])

  const sendMessage = async (message) => {
    await postData('/api/whatsapp', {
      phone: user.whatsapp || user.phone,
      type: 'sendMessage', //'lastIncomingMessages',
      message,
    })
  }

  return (
    <div className="flex flex-col h-full max-h-full p-1 gap-y-1">
      <div className="flex flex-col h-fit gap-y-1">
        <SelectUser selectedId={selectedUserId} onChange={setSelectedUserId} />
        {selectedUserId && (
          <Button
            name="Обновить список сообщений"
            onClick={() => {
              fetchChatHystory(user)
            }}
          />
        )}
      </div>
      {selectedUserId && (
        <div
          className="flex flex-col-reverse h-[calc(100%-88px)] max-h-[calc(100%-88px)] gap-y-1"
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
                  const dateTime = dateToDateTimeStr(Date(timestamp))
                  var start = new Date(timestamp)
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
                            ? 'rounded-tl-lg bg-general/20'
                            : 'rounded-tr-lg bg-blue-600/20'
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
