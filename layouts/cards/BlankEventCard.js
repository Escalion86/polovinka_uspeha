import { useAtomValue } from 'jotai'
import PropTypes from 'prop-types'

import EventCardButtons from '@components/cardButtons/EventCardButtons'
import modalsFuncAtom from '@state/modalsFuncAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import Venzel1 from '@svg/venzels/1'
import cn from 'classnames'

const BLANK_EVENT_BUTTON_KEYS = [
  'copy-id',
  'history',
  'edit',
  'clone',
  'delete',
]

const BlankEventCard = ({ event, noButtons, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const isLoggedUserAdmin = useAtomValue(isLoggedUserAdminSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const eventsRule = loggedUserActiveRole?.events
  const canEdit = eventsRule === true || eventsRule?.edit
  const canShowMenu = isLoggedUserAdmin || isLoggedUserDev

  return (
    <div
      style={style}
      className={cn(
        'relative flex w-full flex-col items-center justify-evenly',
        canEdit ? 'cursor-pointer' : ''
      )}
      onClick={canEdit ? () => modalsFunc.event.edit(event._id) : undefined}
    >
      {!noButtons && canShowMenu ? (
        <EventCardButtons
          item={event}
          alwaysCompact
          onlyButtonKeys={BLANK_EVENT_BUTTON_KEYS}
          className="absolute right-3 top-3 z-20"
        />
      ) : null}
      <Venzel1 className="h-10" />
      <div className="mx-4 flex items-center justify-center py-5 text-center text-xl font-bold leading-5 whitespace-pre-line text-black">
        {event.title}
      </div>
      <Venzel1 className="h-10 rotate-180" />
    </div>
  )
}

BlankEventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    title: PropTypes.string,
  }).isRequired,
  noButtons: PropTypes.bool,
  style: PropTypes.object,
}

export default BlankEventCard
