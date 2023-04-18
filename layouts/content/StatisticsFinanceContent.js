import { useRecoilValue } from 'recoil'
import LineChart from '@components/Charts/LineChart'
import { MONTHS, MONTHS_FULL_1 } from '@helpers/constants'
import upperCaseFirst from '@helpers/upperCaseFirst'
import MonthSelector from '@components/ComboBox/MonthSelector'
import YearSelector from '@components/ComboBox/YearSelector'
import { useState } from 'react'
import allClosedEventsSelector from '@state/selectors/allClosedEventsSelector'
import arrayOfSumOfPaymentsForInternalByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForInternalByDateSelector'
import arrayOfSumOfPaymentsForClosedEventsByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForClosedEventsByDateSelector'

const StatisticsFinanceContent = () => {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const allClosedEvents = useRecoilValue(allClosedEventsSelector)
  const filteredEvents = allClosedEvents.filter(({ dateStart }) => {
    const yearOfEvent = new Date(dateStart).getFullYear()
    const monthOfEvent = new Date(dateStart).getMonth()
    return monthOfEvent === month && yearOfEvent === year
  })

  const incomeOfEventsByDate = useRecoilValue(
    arrayOfSumOfPaymentsForClosedEventsByDateSelector
  )

  const incomeOfInternalByDate = useRecoilValue(
    arrayOfSumOfPaymentsForInternalByDateSelector
  )

  const incomeByDate = JSON.parse(JSON.stringify(incomeOfEventsByDate))
  for (const year in incomeOfInternalByDate) {
    if (!incomeByDate[year])
      incomeByDate[year] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < 12; i++) {
      incomeByDate[year][i] += incomeOfInternalByDate[year][i]
    }
  }

  const dataOfIncomeByDate = []
  for (const year in incomeByDate) {
    const data = incomeByDate[year].map((income, index) => ({
      x: MONTHS[index],
      y: income,
    }))
    dataOfIncomeByDate.push({ id: year, data })
  }

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto">
      <LineChart
        onClick={(point, event) => {
          console.log({ point, event })
          setMonth(point.index % 12)
          setYear(Number(point.serieId))
        }}
        data={dataOfIncomeByDate}
        // xAxisLegend="Месяц"
        yAxisLegend="Прибыль, ₽"
        // enableSlices="x"
        tooltip={(data) => {
          return (
            <div
              style={{
                background: 'white',
                padding: '9px 12px',
                border: '1px solid #ccc',
              }}
            >
              <div>{upperCaseFirst(MONTHS_FULL_1[data.point.index])}</div>
              {/* {slice.points.map((point) => ( */}
              <div
                key={data.point.id}
                style={{
                  color: data.point.serieColor,
                  padding: '3px 0',
                }}
              >
                <strong>{data.point.serieId}</strong>
                <span className="pl-2 text-black">{`${data.point.data.yFormatted} ₽`}</span>
              </div>
              {/* ))} */}
            </div>
          )
        }}
        // sliceTooltip={({ slice }) => {
        //   return (
        //     <div
        //       style={{
        //         background: 'white',
        //         padding: '9px 12px',
        //         border: '1px solid #ccc',
        //       }}
        //     >
        //       <div>
        //         {upperCaseFirst(
        //           MONTHS_FULL_1[slice.points[slice.points.length - 1].index]
        //         )}
        //       </div>
        //       {slice.points.map((point) => (
        //         <div
        //           key={point.id}
        //           style={{
        //             color: point.serieColor,
        //             padding: '3px 0',
        //           }}
        //         >
        //           <strong>{point.serieId}</strong>
        //           <span className="pl-2 text-black">{`${point.data.yFormatted} ₽`}</span>
        //         </div>
        //       ))}
        //     </div>
        //   )
        // }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 20,
            translateY: 60,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        // yScale={{
        //   type: 'linear',
        //   stacked: true,
        // }}
        // xScale={{
        //   type: 'linear',
        //   min: 0,
        //   max: 'auto',
        // }}
        // axisLeft={{
        //   legend: 'Прибыль',
        //   legendOffset: -60,
        // }}
        // axisBottom={{
        //   legend: 'Месяц',
        //   legendOffset: 30,
        // }}
        // curve={select('curve', curveOptions, 'linear')}
      />
      <div className="flex gap-x-1">
        <MonthSelector month={month} onChange={setMonth} />
        <YearSelector year={year} onChange={setYear} />
      </div>
      <div className="w-full">
        <div>Кол-во мероприятий: {filteredEvents.length}</div>
        <div>
          Доход с мероприятий:{' '}
          {incomeOfEventsByDate[year] ? incomeOfEventsByDate[year][month] : 0}{' '}
          руб.
        </div>
        <div>
          Внутренние:{' '}
          {incomeOfInternalByDate[year]
            ? incomeOfInternalByDate[year][month]
            : 0}{' '}
          руб.
        </div>
        <div>
          ИТОГО:{' '}
          {(incomeOfInternalByDate[year]
            ? incomeOfInternalByDate[year][month]
            : 0) +
            (incomeOfEventsByDate[year]
              ? incomeOfEventsByDate[year][month]
              : 0)}{' '}
          руб.
        </div>
      </div>
    </div>
  )
}

export default StatisticsFinanceContent
