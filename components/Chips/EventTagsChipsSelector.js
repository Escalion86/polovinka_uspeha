import React from 'react'
import ChipsSelector from './ChipsSelector'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useRecoilValue } from 'recoil'

const EventTagsChipsSelector = ({
  label = 'Тэги',
  tags,
  onChange,
  canEditChips,
  readOnly,
  className,
  required,
  error,
  placeholder,
}) => {
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const eventsTags = siteSettings.eventsTags ?? []
  return (
    <ChipsSelector
      label={label}
      items={eventsTags}
      onChange={onChange}
      value={tags}
      canEditChips={canEditChips}
      readOnly={readOnly}
      className={className}
      required={required}
      error={error}
      placeholder={placeholder}
    />
  )
}

export default EventTagsChipsSelector
