import Button from '@components/Button'
import EditableTextarea from '@components/EditableTextarea'
import Input from '@components/Input'
import { SelectEventList } from '@components/SelectItemList'
import SocialPicker from '@components/ValuePicker/SocialPicker'
import copyToClipboard from '@helpers/copyToClipboard'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import formatEventDateTime from '@helpers/formatEventDateTime'
import getMinutesBetween from '@helpers/getMinutesBetween'
import getNoun from '@helpers/getNoun'
import transliterate from '@helpers/transliterate'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import eventsAtom from '@state/atoms/eventsAtom'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { getRecoil } from 'recoil-nexus'
import sanitize from 'sanitize-html'
import sanitizeCustom from '@helpers/sanitize'

const getEventMaxParticipants = (event) => {
  if (!event) return

  const { maxMans, maxWomans, maxParticipants } = event
  return maxMans && maxWomans ? maxMans + maxWomans : maxParticipants
}

const ToolsTextEventsAnonsContent = () => {
  const [eventsId, setEventsId] = useState([])
  const [text, setText] = useState('')
  const events = useRecoilValue(eventsAtom)

  const [socialTag, setSocialTag] = useState(null)
  const [customTag, setCustomTag] = useState('')

  const { info } = useSnackbar()

  const copyToClipboardText = () => {
    console.log('text :>> ', text)
    const cleanedUpText = sanitize(text.replaceAll('<br>', '\n'), {
      allowedTags: [],
      allowedAttributes: {},
    })
    copyToClipboard(cleanedUpText)
    info('Текст скопирован в буфер обмена')
  }

  const tagsStringify = () => {
    const tags = []
    if (socialTag) tags.push('soctag=' + socialTag.toLocaleLowerCase())
    if (customTag && customTag !== '')
      tags.push(
        'custag=' +
          transliterate(customTag.trim().replace(/\//g, '').toLocaleLowerCase())
      )
    if (tags.length === 0) return ''
    return '?' + tags.join('&')
  }

  var textArray = []
  for (let i = 0; i < eventsId.length; i++) {
    const elementOfTextArray = []
    const eventId = eventsId[i]
    const event = events.find((event) => event._id === eventId)
    elementOfTextArray.push(
      `\u{1F4C5} ${formatEventDateTime(event, {
        fullWeek: true,
        weekInBrackets: true,
      }).toUpperCase()}`
    )
    elementOfTextArray.push(`"${event.title.toUpperCase()}"`)
    elementOfTextArray.push(`${event.description}`)
    elementOfTextArray.push(``)
    const address = formatAddress(event.address)
    if (address) {
      elementOfTextArray.push('\u{1F4CD} Место проведения:')
      elementOfTextArray.push(formatAddress(event.address))
    }
    elementOfTextArray.push(`\u{1F4B0} Стоимость: ${event.price / 100} руб`)
    const maxParticipants = getEventMaxParticipants(event)
    if (maxParticipants) {
      const assistants = getRecoil(eventAssistantsSelector(event._id))
      elementOfTextArray.push(
        `\u{1F465} Количество участников: ${maxParticipants} человек${
          assistants?.length > 0
            ? `+ ${getNoun(assistants.length, 'ведущий', 'ведущих', 'ведущих')}`
            : ''
        }`
      )
    }
    elementOfTextArray.push(``)
    elementOfTextArray.push(
      `\u{1F4DD} Можно записаться ответным сообщением или на сайте по ссылке:`
    )
    elementOfTextArray.push(
      `${window.location.origin}/event/${event._id}${tagsStringify()}`
    )
    textArray.push(elementOfTextArray.join('<br>'))
  }

  const tempText = textArray.join('<br><br><br>')

  useEffect(() => {
    setText(tempText)
  }, [tempText])

  // console.log('text :>> ', text)

  return (
    <div className="h-full max-h-full px-1 py-1 overflow-y-auto">
      <SelectEventList
        label="Мероприятия"
        eventsId={eventsId}
        onChange={setEventsId}
        canAddItem
      />
      <SocialPicker
        label="Тэг соц. сети в ссылке"
        social={socialTag}
        onChange={setSocialTag}
      />
      <Input
        label="Свой тэг в ссылке"
        type="text"
        value={customTag}
        onChange={(value) => {
          setCustomTag(value)
        }}
      />
      <Button name="Скопировать текст" onClick={copyToClipboardText} />
      {/* <EditableTextarea
        label="Текст"
        html={text}
        // uncontrolled={false}
        // onChange={(value) => {
        //   setText(value)
        // }}
        readOnly
      /> */}
      <div className="py-2 font-bold">Результат:</div>
      {text ? (
        <div
          className="w-full max-w-full pb-2 overflow-hidden text-sm list-disc ql textarea"
          dangerouslySetInnerHTML={{ __html: sanitizeCustom(text) }}
        />
      ) : (
        <div>{'[Выберите хотябы одно мероприятие]'}</div>
      )}
    </div>
  )
}

export default ToolsTextEventsAnonsContent
