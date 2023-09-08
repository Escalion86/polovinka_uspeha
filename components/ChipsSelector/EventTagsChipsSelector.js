import React from 'react'
import ChipsSelector from './ChipsSelector'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useRecoilValue } from 'recoil'

const EventTagsChipsSelector = ({
  tags,
  onChange,
  canEditChips,
  readOnly,
  noWrapper,
  className,
  required,
}) => {
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const eventsTags = siteSettings.eventsTags ?? []
  return (
    <ChipsSelector
      label="Тэги"
      items={eventsTags}
      onChange={onChange}
      value={tags}
      canEditChips={canEditChips}
      readOnly={readOnly}
      noWrapper={noWrapper}
      className={className}
      required={required}
    />
  )
}

export default EventTagsChipsSelector
