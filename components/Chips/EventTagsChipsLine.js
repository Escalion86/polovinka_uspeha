import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useRecoilValue } from 'recoil'
import ChipsLine from './ChipsLine'

const EventTagsChipsLine = ({ tags, onTagClick, className, noWrap }) => {
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const eventsTags = siteSettings.eventsTags ?? []
  return (
    <ChipsLine
      items={eventsTags}
      onChipClick={onTagClick}
      value={tags}
      className={className}
      noWrap={noWrap}
    />
  )
}

export default EventTagsChipsLine
