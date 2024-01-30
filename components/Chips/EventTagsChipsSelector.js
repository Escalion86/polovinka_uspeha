import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useRecoilValue } from 'recoil'
import ChipsSelector from './ChipsSelector'

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
  fullWidth,
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
      fullWidth={fullWidth}
    />
  )
}

export default EventTagsChipsSelector
