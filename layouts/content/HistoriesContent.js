import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun, { getNounAges } from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import reviewsAtom from '@state/atoms/reviewsAtom'
import reviewSelector from '@state/selectors/reviewSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { CardWrapper } from '@components/CardWrapper'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import historiesAtom from '@state/atoms/historiesAtom'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'

import { timelineClasses } from '@mui/lab/Timeline'
import { timelineContentClasses } from '@mui/lab/TimelineContent'
import { timelineConnectorClasses } from '@mui/lab/TimelineConnector'
import { timelineDotClasses } from '@mui/lab/TimelineDot'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import formatDateTime from '@helpers/formatDateTime'
import { UserItem, UserItemFromId } from '@components/ItemCards'
import { SelectEventList, SelectUserList } from '@components/SelectItemList'
import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import SortingButtonMenu from '@components/SortingButtonMenu'
import { useState } from 'react'
import ContentHeader from '@components/ContentHeader'
import getDaysBetween from '@helpers/getDaysBetween'

// const ReviewCard = ({ reviewId }) => {
//   const modalsFunc = useRecoilValue(modalsFuncAtom)
//   const review = useRecoilValue(reviewSelector(reviewId))
//   const loading = useRecoilValue(loadingAtom('review' + reviewId))
//   const itemFunc = useRecoilValue(itemsFuncAtom)

//   return (
//     <CardWrapper
//       loading={loading}
//       onClick={() => modalsFunc.review.edit(review._id)}
//       flex={false}
//       showOnSite={review.showOnSite}
//     >
//       <div className="flex">
//         <div className="flex-1 px-2 py-1 text-xl font-bold">
//           {review.author}
//           {review.authorAge ? ', ' + getNounAges(review.authorAge) : ''}
//         </div>
//         <CardButtons
//           item={review}
//           typeOfItem="review"
//           showOnSiteOnClick={() => {
//             itemFunc.review.set({
//               _id: review._id,
//               showOnSite: !review.showOnSite,
//             })
//           }}
//         />
//       </div>
//       <div className="px-2 py-1">{review.review}</div>
//     </CardWrapper>
//   )
// }

const dotColors = {
  add: 'success',
  delete: 'error',
}

const HistoriesOfEvent = ({ histories }) => (
  <Timeline
    // sx={{
    //   [`& .${timelineOppositeContentClasses.root}`]: {
    //     flex: 0.2,
    //   },
    // }}
    style={{ padding: 0 }}
    sx={{
      // [`& .${timelineClasses.root}`]: {
      //   padding: '0px !important',
      //   margin: 0,
      // },
      [`& .${timelineItemClasses.root}:before`]: {
        flex: 0,
        padding: 0,
        // paddingTop: 10,
      },
      // [`& .${timelineItemClasses.root}`]: {
      //   maxHeight: 8,
      // },
      // [`& .${timelineContentClasses.root}`]: {
      //   paddingRight: 0,
      // },
      // [`& .${timelineDotClasses.root}:before`]: {
      //   padding: 0,
      // },
      // [`& .${timelineConnectorClasses.root}`]: {
      //   marginBottom: -1.4,
      // },
    }}
  >
    {histories.map((history, index) => (
      <TimelineItem key={history._id}>
        {/* <TimelineOppositeContent color="text.secondary">
      {formatDateTime(history.createdAt, false, false, false, false)}
    </TimelineOppositeContent> */}
        <TimelineSeparator>
          <TimelineDot color={dotColors[history.action]}>
            <div className="flex items-center justify-center w-3 h-3 text-sm tablet:w-4 tablet:h-4 tablet:text-base">
              {history.data.length}
            </div>
          </TimelineDot>
          {index < histories.length - 1 && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent
          style={{
            paddingRight: 0,
            paddingLeft: 8,
          }}
        >
          <div className="">
            {formatDateTime(history.createdAt, false, false, false, false)}
          </div>
          <SelectUserList
            // label="Участники Мужчины"
            usersId={history.data.map((eventUser) => eventUser.userId)}
            showCounter={false}
            readOnly
          />
          {/* {history.data.map((eventUser) => {
        return (
          <>
            <div className="overflow-hidden bg-gray-200 border border-gray-400 rounded cursor-pointer">
              <UserItemFromId userId={eventUser.userId} />
            </div>
          </>
        )
      })} */}
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
)

const HistoriesOfEvents = ({ eventsHistories }) => {
  return (
    <Timeline
      style={{ paddingLeft: 8, paddingRight: 8 }}
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
        // [`& .${timelineContentClasses.root}`]: {
        //   paddingRight: 0,
        //   paddingLeft: 1.5,
        // },
      }}
    >
      {/* {Object.keys(eventsHistories).map((key, index) => {
        const {action, data, createdAt} = eventsHistories[key]
        return 
      })} */}
      {Object.keys(eventsHistories).map((eventId, index) => {
        const data = eventsHistories[eventId]
        const createdAt = data[0].createdAt

        let eventResult = 0
        for (let i = 0; i < data.length; i++) {
          eventResult =
            eventResult +
            (data[i].action === 'add' ? 1 : -1) * data[i].data.length
        }

        return (
          <TimelineItem key={eventId}>
            <TimelineSeparator>
              <TimelineDot
                // style={{ paddingLeft: 0, paddingRight: 0 }}
                color={
                  eventResult === 0
                    ? undefined
                    : dotColors[eventResult > 0 ? 'add' : 'delete']
                }
              >
                <div className="flex items-center justify-center w-3 h-3 text-sm tablet:w-4 tablet:h-4 tablet:text-base">
                  {Math.abs(eventResult)}
                </div>
              </TimelineDot>
              {index < Object.keys(eventsHistories).length - 1 && (
                <TimelineConnector />
              )}
            </TimelineSeparator>
            <TimelineContent
              style={{
                paddingRight: 0,
                paddingLeft: 8,
              }}
            >
              <div className="">
                {formatDateTime(createdAt, false, false, false, false)}
              </div>
              <SelectEventList eventsId={[eventId]} readOnly />
              <HistoriesOfEvent histories={data} />
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const HistoriesContent = () => {
  const histories = useRecoilValue(historiesAtom)
  const [periodDays, setPeriodDays] = useState(1)

  const eventsHistories = {}
  // const eventsResults = {}
  histories.forEach((history) => {
    if (getDaysBetween(new Date(), history.createdAt, false) > periodDays)
      return

    const eventId = history.data[0].eventId

    if (!eventsHistories[eventId]) eventsHistories[eventId] = []
    eventsHistories[eventId].push(history)
    // eventsResults[eventId] =
    //   (eventsResults[eventId] ?? 0) +
    //   (history.action === 'add' ? 1 : -1) * history.data.length
  })

  return (
    <>
      <ContentHeader>
        <FormControl sx={{ m: 1, width: 150 }} size="small" margin="none">
          <InputLabel id="demo-multiple-name-label">Период</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={periodDays}
            onChange={(e) => setPeriodDays(e.target.value)}
            input={<OutlinedInput label="Период" />}
            MenuProps={MenuProps}
          >
            <MenuItem value={1}>Сутки</MenuItem>
            <MenuItem value={3}>3 суток</MenuItem>
            <MenuItem value={7}>Неделю</MenuItem>
          </Select>
        </FormControl>
        <div className="flex-1" />
      </ContentHeader>
      <CardListWrapper>
        <HistoriesOfEvents eventsHistories={eventsHistories} />
      </CardListWrapper>
    </>
  )
}

export default HistoriesContent
