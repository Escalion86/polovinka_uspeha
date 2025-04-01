'use client'

import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import RadioBox from '@components/RadioBox'
import { SelectEventList } from '@components/SelectItemList'
import { getData } from '@helpers/CRUD'
import copyToClipboard from '@helpers/copyToClipboard'
import formatAddress from '@helpers/formatAddress'
import formatEventDateTime from '@helpers/formatEventDateTime'
import getNoun from '@helpers/getNoun'
import subEventsSummator from '@helpers/subEventsSummator'
import transliterate from '@helpers/transliterate'
import useSnackbar from '@helpers/useSnackbar'
import eventsAtom from '@state/atoms/eventsAtom'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import store from '@state/store'
import locationAtom from '@state/atoms/locationAtom'
import convertHtmlToText from '@helpers/convertHtmlToText'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faHtml5 } from '@fortawesome/free-brands-svg-icons/faHtml5'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import modalsFuncAtom from '@state/modalsFuncAtom'
import DropdownButton from '@components/DropdownButton'

const getEventMaxParticipants = (event) => {
  if (!event) return

  const { maxMans, maxWomans, maxParticipants } = event
  return maxMans && maxWomans ? maxMans + maxWomans : maxParticipants
}

const textForming = ({
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
  showTextSignUp,
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
  for (let i = 0; i < events.length; i++) {
    const elementOfTextArray = []
    const event = events[i]

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
        const formatedAddress = formatAddress(event.address)
        elementOfTextArray.push(
          `\u{1F4CD} <b>Место проведения</b>: ${formatedAddress}`
        )
      }
    }

    if (showPrice) {
      if (showPrice === 'formula') {
        event.subEvents.forEach(
          ({ price, usersStatusDiscount, title }, index) => {
            const eventPriceForNovice =
              ((price ?? 0) - (usersStatusDiscount.novice ?? 0)) / 100
            const eventPriceForMember =
              ((price ?? 0) - (usersStatusDiscount.member ?? 0)) / 100

            elementOfTextArray.push(
              `${index === 0 ? `\u{1F4B0} <b>Стоимость</b>:${event.subEvents.length > 1 ? '<br>' : ''}` : ''}${event.subEvents.length > 1 ? ` - ${title}: ` : ' '}${`<span style="color: white; background-color: rgb(122, 81, 81);">{клуб}{</span>${price / 100 > eventPriceForMember ? `<s>${price / 100}</s> ` : ''}${eventPriceForMember}<span style="color: white; background-color: rgb(122, 81, 81);">}{</span>${price / 100 > eventPriceForNovice ? `<s>${price / 100}</s> ` : ''}${eventPriceForNovice}<span style="color: white; background-color: rgb(122, 81, 81);">}</span>`} руб`
            )
          }
        )
        // <p>222<span style="color: white; background-color: rgb(122, 81, 81);">}{</span>333<span style="color: white; background-color: rgb(122, 81, 81);">}</span></p>
      } else {
        event.subEvents.forEach(
          ({ price, usersStatusDiscount, title }, index) => {
            const eventPriceForStatus =
              ((price ?? 0) - (usersStatusDiscount[showPrice] ?? 0)) / 100

            elementOfTextArray.push(
              `${index === 0 ? `\u{1F4B0} <b>Стоимость</b>:${event.subEvents.length > 1 ? '<br>' : ''}` : ''}${event.subEvents.length > 1 ? ` - ${title}: ` : ' '}${
                !noSlashedPrice && usersStatusDiscount[showPrice] > 0
                  ? `<s>${price / 100}</s> `
                  : ''
              }${eventPriceForStatus} руб`
            )
          }
        )
      }
    }

    if (showParticipantsCount) {
      const subEventSum = subEventsSummator(event.subEvents)
      const maxParticipants = getEventMaxParticipants(subEventSum)

      if (maxParticipants) {
        const assistants = store.get(eventAssistantsSelector(event._id))
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
        `\u{1F4DD} ${
          showTextSignUp ? 'Можно записаться ответным сообщением или' : 'Запись'
        } на сайте по ссылке:`
      )
      elementOfTextArray.push(
        `${window.location.origin}/event/${event._id}${tagsStringify()}`
      )
    } else if (showTextSignUp) {
      elementOfTextArray.push(``)
      elementOfTextArray.push(
        `\u{1F4DD} Для записи напишите сообщение о желании записаться тут`
      )
    }
    textArray.push(elementOfTextArray.join('<br>'))
  }

  return textArray.join('<br><br><br>')
}

const ToolsTextEventsAnonsContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)
  const [eventsId, setEventsId] = useState([])
  const [text, setText] = useState('')
  const [showTags, setShowTags] = useState(true)
  const [showDescription, setShowDescription] = useState(true)
  const [showAddress, setShowAddress] = useState(true)
  const [showPrice, setShowPrice] = useState('novice')
  const [showParticipantsCount, setShowParticipantsCount] = useState(true)
  const [showTextSignUp, setShowTextSignUp] = useState(true)
  const [showLink, setShowLink] = useState(true)
  const events = useAtomValue(eventsAtom)
  const [eventsFull, setEventsFull] = useState([])

  const [socialTag, setSocialTag] = useState(null)
  const [customTag, setCustomTag] = useState('')

  const { info } = useSnackbar()

  const getEvents = async (eventsId, location) => {
    const eventsFullRes = []
    // const filteredEvents = events.filter(({ _id }) => eventsId.includes(_id))
    const filteredEvents = eventsId.map((id) =>
      events.find(({ _id }) => id === _id)
    )
    for (let i = 0; i < filteredEvents.length; i++) {
      const eventId = filteredEvents[i]._id
      const res = await getData(
        `/api/${location}/events/${eventId}`,
        {},
        null,
        null,
        false
      )
      eventsFullRes.push(res)
    }
    setEventsFull(eventsFullRes)
  }

  const textFormatingProps = {
    events: eventsFull,
    socialTag,
    customTag,
    showTags,
    showDescription,
    showAddress,
    showPrice,
    showParticipantsCount,
    showLink,
    showTextSignUp,
  }

  const cleanedUpText = DOMPurify.sanitize(
    text
      .replaceAll('<p><br></p>', '<br>')
      .replaceAll('<blockquote>', '<br><blockquote>')
      .replaceAll('<li>', '<br>\u{2764} <li>')
      .replaceAll('<p>', '<br><p>'),
    {
      ALLOWED_TAGS: ['br', 'i', 'b', 's', 'strong', 'em', 'span'],
      // ALLOWED_ATTR: [],
    }
  )

  const copyToClipboardText = (type) => {
    const preparedToCopyText = DOMPurify.sanitize(
      convertHtmlToText(
        textForming({ ...textFormatingProps, noSlashedPrice: !type }),
        type
      ),
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
        onChange={(value) => {
          setEventsId(value)
          getEvents(value, location)
        }}
        canAddItem
        showCountNumber
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
        <RadioBox
          checked={showPrice === 'formula'}
          onClick={() => setShowPrice('formula')}
          label="Сделать формулой (для рассылки)"
        />
      </div>
      <CheckBox
        checked={showParticipantsCount}
        onClick={() => setShowParticipantsCount((checked) => !checked)}
        label="Показывать количество участников (если ограничено)"
      />
      <CheckBox
        checked={showTextSignUp}
        onClick={() => setShowTextSignUp((checked) => !checked)}
        label={`Текст в конце "записаться ответным сообщением"`}
      />
      <CheckBox
        checked={showLink}
        onClick={() => setShowLink((checked) => !checked)}
        label="Показывать ссылку на мероприятие"
      />
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {/* <Button
          icon={faTelegram}
          name="Скопировать текст для телеграм"
          onClick={() => copyToClipboardText('telegram')}
          disabled={!eventsId.length}
        />
        <Button
          icon={faWhatsapp}
          name="Скопировать текст для whatsapp"
          onClick={() => copyToClipboardText('whatsapp')}
          disabled={!eventsId.length}
        />
        <Button
          icon={faCopy}
          name="Скопировать текст без форматирования"
          onClick={copyToClipboardText}
          disabled={!eventsId.length}
        />
        <Button
          icon={faHtml5}
          name="Скопировать html"
          onClick={() => {
            copyToClipboard(tempText)
            info('Html скопирован в буфер обмена')
          }}
          disabled={!eventsId.length}
        /> */}
        <DropdownButton
          name="Копировать текст"
          icon={faCopy}
          items={[
            {
              name: 'Telegram',
              onClick: () => copyToClipboardText('telegram'),
              icon: faTelegram,
            },
            {
              name: 'Whatsapp',
              onClick: () => copyToClipboardText('whatsapp'),
              icon: faWhatsapp,
            },
            {
              name: 'Html',
              onClick: () => {
                copyToClipboard(tempText)
                info('Html скопирован в буфер обмена')
              },
              icon: faHtml5,
            },
            {
              name: 'Без форматирования',
              onClick: copyToClipboardText,
              icon: faCopy,
            },
          ]}
          disabled={!eventsId.length}
        />
        <Button
          icon={faWhatsapp}
          name="Создать рассылку"
          onClick={() =>
            modalsFunc.newsletter.add(undefined, { message: tempText })
          }
          disabled={!eventsId.length}
        />
      </div>
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
