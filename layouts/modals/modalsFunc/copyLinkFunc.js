import React, { useEffect, useState } from 'react'

import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import SocialPicker from '@components/ValuePicker/SocialPicker'
import LinkTypePicker from '@components/ValuePicker/LinkTypePicker'
import copyToClipboard from '@helpers/copyToClipboard'
import Button from '@components/Button'
import { SelectEvent, SelectService, SelectUser } from '@components/SelectItem'
import useSnackbar from '@helpers/useSnackbar'
import transliterate from '@helpers/transliterate'

const copyLinkFunc = (props) => {
  const CopyLinkModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const [linkType, setLinkType] = useState(
      props.eventId
        ? 'event'
        : props.userId
        ? 'user'
        : props.serviceId
        ? 'service'
        : 'home'
    )
    const [eventId, setEventId] = useState(props.eventId)
    const [userId, setUserId] = useState(props.userId)
    const [serviceId, setServiceId] = useState(props.serviceId)

    const [social, setSocial] = useState(null)
    const [custom, setCustom] = useState('')

    const { info } = useSnackbar()

    const tagsStringify = () => {
      const tags = []
      if (social) tags.push('soctag=' + social.toLocaleLowerCase())
      if (custom && custom !== '')
        tags.push(
          'custag=' +
            transliterate(custom.trim().replace(/\//g, '').toLocaleLowerCase())
        )
      if (tags.length === 0) return ''
      return '?' + tags.join('&')
    }

    const link = encodeURI(
      linkType === 'event'
        ? `${window.location.origin}/event/${props.eventId}${tagsStringify()}`
        : linkType === 'user'
        ? `${window.location.origin}/user/${props.userId}${tagsStringify()}`
        : linkType === 'service'
        ? `${window.location.origin}/service/${
            props.serviceId
          }${tagsStringify()}`
        : `${window.location.origin}${tagsStringify()}`
    )

    const copyToClipboardHome = () => {
      copyToClipboard(link)
      info('Ссылка скопирована в буфер обмена')
    }

    const copyToClipboardEvent = () => {
      copyToClipboard(link)
      info('Ссылка на мероприятие скопирована в буфер обмена')
    }

    const copyToClipboardUser = () => {
      copyToClipboard(link)
      info('Ссылка на пользователя скопирована в буфер обмена')
    }

    const copyToClipboardService = () => {
      copyToClipboard(link)
      info('Ссылка на услугу скопирована в буфер обмена')
    }

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    return (
      <FormWrapper>
        <LinkTypePicker linkType={linkType} onChange={setLinkType} />
        {linkType === 'event' && (
          <SelectEvent
            selectedId={eventId}
            onChange={setEventId}
            label="Мероприятие"
          />
        )}
        {linkType === 'user' && (
          <SelectUser
            selectedId={userId}
            onChange={setUserId}
            label="Пользователь"
          />
        )}
        {linkType === 'service' && (
          <SelectService
            selectedId={serviceId}
            onChange={setServiceId}
            label="Услуга"
          />
        )}
        <SocialPicker social={social} onChange={setSocial} />
        <Input
          label="Свой тэг"
          type="text"
          value={custom}
          onChange={(value) => {
            setCustom(value)
          }}
        />
        <div className="flex flex-col flex-wrap w-full max-w-full phoneH:flex-row gap-x-1">
          <span>Ссылка:</span>
          <a
            style={{ wordBreak: 'break-all' }}
            target="_blank"
            className="flex-1 text-general hover:text-success"
            href={link}
          >
            {link}
          </a>
        </div>
        <Button
          className="mt-2"
          name="Скопировать ссылку"
          onClick={() => {
            if (linkType === 'home') return copyToClipboardHome()
            if (linkType === 'event') return copyToClipboardEvent()
            if (linkType === 'user') return copyToClipboardUser()
            if (linkType === 'service') return copyToClipboardService()
            return
          }}
        />

        {/* <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Формирование ссылки`,
    // confirmButtonName: directionId && !clone ? 'Применить' : 'Создать',
    Children: CopyLinkModal,
  }
}

export default copyLinkFunc
