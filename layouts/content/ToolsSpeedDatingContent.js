import { SelectEvent } from '@components/SelectItem'
import SpeedDatingEditor from '@components/SpeedDatingEditor'
import { useRouter } from 'next/router'
import { useState } from 'react'

const ToolsSpeedDatingContent = (props) => {
  const router = useRouter()
  const [eventId, setEventId] = useState(router.query.eventId)
  return (
    <div className="flex flex-col flex-1 h-screen max-h-full px-2 my-2 overflow-y-auto gap-y-2">
      <div className="min-h-[64px]">
        <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={setEventId}
        />
      </div>
      {eventId && <SpeedDatingEditor eventId={eventId} />}
    </div>
  )
}

export default ToolsSpeedDatingContent
