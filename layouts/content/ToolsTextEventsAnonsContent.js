import Button from '@components/Button'
import EditableTextarea from '@components/EditableTextarea'
import Input from '@components/Input'
import { SelectEventList } from '@components/SelectItemList'
import SocialPicker from '@components/ValuePicker/SocialPicker'
import copyToClipboard from '@helpers/copyToClipboard'
import formatAddress from '@helpers/formatAddress'
import formatEventDateTime from '@helpers/formatEventDateTime'
import getNoun from '@helpers/getNoun'
import transliterate from '@helpers/transliterate'
import useSnackbar from '@helpers/useSnackbar'
import eventsAtom from '@state/atoms/eventsAtom'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { getRecoil } from 'recoil-nexus'
import sanitize from 'sanitize-html'
import sanitizeCustom from '@helpers/sanitize'
import CheckBox from '@components/CheckBox'

const getEventMaxParticipants = (event) => {
  if (!event) return

  const { maxMans, maxWomans, maxParticipants } = event
  return maxMans && maxWomans ? maxMans + maxWomans : maxParticipants
}

const ToolsTextEventsAnonsContent = () => {
  const [eventsId, setEventsId] = useState([])
  const [text, setText] = useState('')
  const [showDescription, setShowDescription] = useState(true)
  const [showAddress, setShowAddress] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [showParticipantsCount, setShowParticipantsCount] = useState(true)
  const [showLink, setShowLink] = useState(true)
  const events = useRecoilValue(eventsAtom)

  const [socialTag, setSocialTag] = useState(null)
  const [customTag, setCustomTag] = useState('')

  const { info } = useSnackbar()

  const cleanedUpText = sanitize(
    text
      .replaceAll('<p><br></p>', '<br>')
      .replaceAll('<blockquote>', '<br><blockquote>')
      .replaceAll('<li>', '<br>\u{2764} <li>')
      .replaceAll('<p>', '<br><p>'),
    {
      allowedTags: ['br'],
      allowedAttributes: {},
    }
  )

  const copyToClipboardText = () => {
    const preparedToCopyText = sanitize(
      text
        .replaceAll('<p><br></p>', '\n')
        .replaceAll('<blockquote>', '\n<blockquote>')
        .replaceAll('<li>', '\n\u{2764} <li>')
        .replaceAll('<p>', '\n<p>')
        .replaceAll('<br>', '\n'),
      {
        allowedTags: [],
        allowedAttributes: {},
      }
    )
    copyToClipboard(preparedToCopyText)
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

    if (showDescription) {
      elementOfTextArray.push(`${event.description}`)
      elementOfTextArray.push(``)
    }

    if (showAddress) {
      const address = formatAddress(event.address)
      if (address) {
        elementOfTextArray.push('\u{1F4CD} Место проведения:')
        elementOfTextArray.push(formatAddress(event.address))
      }
    }

    if (showPrice)
      elementOfTextArray.push(`\u{1F4B0} Стоимость: ${event.price / 100} руб`)

    if (showParticipantsCount) {
      const maxParticipants = getEventMaxParticipants(event)
      if (maxParticipants) {
        const assistants = getRecoil(eventAssistantsSelector(event._id))
        elementOfTextArray.push(
          `\u{1F465} Количество участников: ${maxParticipants} человек${
            assistants?.length > 0
              ? ` + ${getNoun(
                  assistants.length,
                  'ведущий',
                  'ведущих',
                  'ведущих'
                )}`
              : ''
          }`
        )
      }
    }

    if (showLink) {
      elementOfTextArray.push(``)
      elementOfTextArray.push(
        `\u{1F4DD} Можно записаться ответным сообщением или на сайте по ссылке:`
      )
      elementOfTextArray.push(
        `${window.location.origin}/event/${event._id}${tagsStringify()}`
      )
    }
    textArray.push(elementOfTextArray.join('<br>'))
  }

  const tempText = textArray.join('<br><br><br>')

  useEffect(() => {
    setText(tempText)
  }, [tempText])

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
      <CheckBox
        checked={showDescription}
        onClick={() => setShowDescription((checked) => !checked)}
        label="Показывать описание"
      />
      <CheckBox
        checked={showAddress}
        onClick={() => setShowAddress((checked) => !checked)}
        label="Показывать адрес"
      />
      <CheckBox
        checked={showPrice}
        onClick={() => setShowPrice((checked) => !checked)}
        label="Показывать цену"
      />
      <CheckBox
        checked={showParticipantsCount}
        onClick={() => setShowParticipantsCount((checked) => !checked)}
        label="Показывать количество участников"
      />
      <CheckBox
        checked={showLink}
        onClick={() => setShowLink((checked) => !checked)}
        label="Показывать ссылку"
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
          dangerouslySetInnerHTML={{ __html: cleanedUpText }}
        />
      ) : (
        <div>{'[Выберите хотябы одно мероприятие]'}</div>
      )}
    </div>
  )
}

export default ToolsTextEventsAnonsContent
