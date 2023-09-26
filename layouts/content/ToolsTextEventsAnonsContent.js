import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import RadioBox from '@components/RadioBox'
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
import DOMPurify from 'isomorphic-dompurify'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { getRecoil } from 'recoil-nexus'

const getEventMaxParticipants = (event) => {
  if (!event) return

  const { maxMans, maxWomans, maxParticipants } = event
  return maxMans && maxWomans ? maxMans + maxWomans : maxParticipants
}

const formatTextConverter = (text, type) => {
  if (type === 'telegram')
    return text
      .replaceAll('<b>', '**')
      .replaceAll('</b>', '**')
      .replaceAll('<i>', '__')
      .replaceAll('</i>', '__')
      .replaceAll('<s>', '~~')
      .replaceAll('</s>', '~~')
  if (type === 'whatsapp')
    return text
      .replaceAll('<b>', '*')
      .replaceAll('</b>', '*')
      .replaceAll('<i>', '_')
      .replaceAll('</i>', '_')
      .replaceAll('<s>', '~')
      .replaceAll('</s>', '~')
  return text
    .replaceAll('<b>', '')
    .replaceAll('</b>', '')
    .replaceAll('<i>', '')
    .replaceAll('</i>', '')
    .replaceAll('<s>', '')
    .replaceAll('</s>', '')
}

const textForming = ({
  eventsId,
  events,
  socialTag,
  customTag,
  showTags,
  showDescription,
  showAddress,
  showPrice,
  showParticipantsCount,
  showLink,
  noSlashedPrice,
}) => {
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
    elementOfTextArray.push(`<b>"${event.title.toUpperCase()}"</b>`)
    const eventTags =
      typeof event.tags === 'object' && event.tags?.length > 0
        ? event.tags.filter((tag) => tag)
        : []
    if (showTags && eventTags.length > 0) {
      elementOfTextArray.push(`#${eventTags.join(' #')}`)
    }

    if (showDescription) {
      elementOfTextArray.push(`${event.description}`)
      elementOfTextArray.push(``)
    }

    if (showAddress) {
      const address = formatAddress(event.address)
      if (address) {
        elementOfTextArray.push('\u{1F4CD} <b>Место проведения</b>:')
        elementOfTextArray.push(formatAddress(event.address))
      }
    }

    if (showPrice) {
      const eventPrice = event.price / 100
      if (showPrice === 'member') {
        const eventPriceForMember =
          (event.price -
            (event.usersStatusDiscount
              ? event.usersStatusDiscount['member']
              : 0)) /
          100
        elementOfTextArray.push(
          `\u{1F4B0} <b>Стоимость</b>: ${
            !noSlashedPrice && eventPriceForMember !== eventPrice
              ? `<s>${eventPrice}</s> `
              : ''
          }${eventPriceForMember} руб`
        )
      }
      if (showPrice === 'novice') {
        const eventPriceForNovice =
          (event.price -
            (event.usersStatusDiscount
              ? event.usersStatusDiscount['novice']
              : 0)) /
          100
        elementOfTextArray.push(
          `\u{1F4B0} <b>Стоимость</b>: ${
            !noSlashedPrice && eventPriceForNovice !== eventPrice
              ? `<s>${eventPrice}</s> `
              : ''
          }${eventPriceForNovice} руб`
        )
      }
    }

    if (showParticipantsCount) {
      const maxParticipants = getEventMaxParticipants(event)
      if (maxParticipants) {
        const assistants = getRecoil(eventAssistantsSelector(event._id))
        elementOfTextArray.push(
          `\u{1F465} <b>Количество участников</b>: ${getNoun(
            maxParticipants,
            'человек',
            'человека',
            'человек'
          )}${
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

  return textArray.join('<br><br><br>')
}

const ToolsTextEventsAnonsContent = () => {
  const [eventsId, setEventsId] = useState([])
  const [text, setText] = useState('')
  const [showTags, setShowTags] = useState(true)
  const [showDescription, setShowDescription] = useState(true)
  const [showAddress, setShowAddress] = useState(true)
  const [showPrice, setShowPrice] = useState('novice')
  const [showParticipantsCount, setShowParticipantsCount] = useState(true)
  const [showLink, setShowLink] = useState(true)
  const events = useRecoilValue(eventsAtom)

  const [socialTag, setSocialTag] = useState(null)
  const [customTag, setCustomTag] = useState('')

  const { info } = useSnackbar()

  const textFormatingProps = {
    eventsId,
    events,
    socialTag,
    customTag,
    showTags,
    showDescription,
    showAddress,
    showPrice,
    showParticipantsCount,
    showLink,
  }

  const cleanedUpText = DOMPurify.sanitize(
    text
      .replaceAll('<p><br></p>', '<br>')
      .replaceAll('<blockquote>', '<br><blockquote>')
      .replaceAll('<li>', '<br>\u{2764} <li>')
      .replaceAll('<p>', '<br><p>'),
    {
      ALLOWED_TAGS: ['br', 'i', 'b', 's'],
      ALLOWED_ATTR: [],
    }
  )

  const copyToClipboardText = (type) => {
    const preparedToCopyText = DOMPurify.sanitize(
      formatTextConverter(
        textForming({ ...textFormatingProps, noSlashedPrice: !type }),
        type
      )
        .replaceAll('<p><br></p>', '\n')
        .replaceAll('<blockquote>', '\n<blockquote>')
        .replaceAll('<li>', '\n\u{2764} <li>')
        .replaceAll('<p>', '\n<p>')
        .replaceAll('<br>', '\n')
        .replaceAll('&nbsp;', ' ')
        .trim('\n'),
      {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      }
    )
    copyToClipboard(preparedToCopyText)
    info('Текст скопирован в буфер обмена')
  }

  const tempText = textForming(textFormatingProps)

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
        checked={showTags}
        onClick={() => setShowTags((checked) => !checked)}
        label="Показывать тэги мероприятия"
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
      <div>
        <RadioBox
          checked={!showPrice}
          onClick={() => setShowPrice(false)}
          label="Не показывать"
        />
        <RadioBox
          checked={showPrice === 'novice'}
          onClick={() => setShowPrice('novice')}
          label="Показывать цену центра"
        />
        <RadioBox
          checked={showPrice === 'member'}
          onClick={() => setShowPrice('member')}
          label="Показывать цену члена клуба"
        />
      </div>
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
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        <Button
          name="Скопировать текст для телеграм"
          onClick={() => copyToClipboardText('telegram')}
        />
        <Button
          name="Скопировать текст для whatsapp"
          onClick={() => copyToClipboardText('whatsapp')}
        />
        <Button
          name="Скопировать текст без форматирования"
          onClick={copyToClipboardText}
        />
      </div>
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
