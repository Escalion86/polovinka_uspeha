import LineChart from '@components/Charts/LineChart'
import MonthSelector from '@components/ComboBox/MonthSelector'
import YearSelector from '@components/ComboBox/YearSelector'
import { MONTHS } from '@helpers/constants'
import upperCaseFirst from '@helpers/upperCaseFirst'
import allClosedEventsSelector from '@state/selectors/allClosedEventsSelector'
import arrayOfSumOfPaymentsForClosedEventsByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForClosedEventsByDateSelector'
import arrayOfSumOfPaymentsForInternalByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForInternalByDateSelector'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const monthsObj = {
  янв: { name: 'Январь', index: 0 },
  фев: { name: 'Февраль', index: 1 },
  мар: { name: 'Март', index: 2 },
  апр: { name: 'Апрель', index: 3 },
  май: { name: 'Май', index: 4 },
  июн: { name: 'Июнь', index: 5 },
  июл: { name: 'Июль', index: 6 },
  авг: { name: 'Август', index: 7 },
  сен: { name: 'Сентябрь', index: 8 },
  окт: { name: 'Октябрь', index: 9 },
  ноя: { name: 'Ноябрь', index: 10 },
  дек: { name: 'Декабрь', index: 11 },
}

const nivoColors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
]

const incomeCalc = (incomeOfEventsByDate, incomeOfInternalByDate) => {
  const incomeByDate = JSON.parse(JSON.stringify(incomeOfEventsByDate))
  for (const year in incomeOfInternalByDate) {
    if (!incomeByDate[year]) incomeByDate[year] = new Array(12).fill(0)
    for (let i = 0; i < 12; i++) {
      incomeByDate[year][i] += incomeOfInternalByDate[year][i]
    }
  }

  const todayYear = new Date().getFullYear()
  const todayMonth = new Date().getMonth()

  const incomeAverageByYears = {}
  const dataOfIncomeByDate = []
  for (const year in incomeByDate) {
    const incomeYear = incomeByDate[year]

    var sum, incomeArray
    if (todayYear == year) {
      incomeArray = incomeYear.filter(
        (income, index) => index < todayMonth && income > 0
      )
      sum = incomeArray.reduce((a, b) => a + b, 0)
    } else {
      incomeArray = incomeYear.filter((income, index) => income > 0)
      sum = incomeYear.reduce((a, b) => a + b, 0)
    }
    const average = incomeArray.length > 0 ? sum / incomeArray.length : 0

    if (average > 0) {
      const data = incomeYear.map((income, index) => ({
        x: MONTHS[index],
        y: income === 0 ? null : income,
        year,
      }))
      dataOfIncomeByDate.push({ id: year, data })
      incomeAverageByYears[year] = average
    }
  }
  return { incomeAverageByYears, dataOfIncomeByDate }
}

const StatisticsFinanceContent = () => {
  const [month, setMonth] = useState()
  const [year, setYear] = useState()

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

  const { incomeAverageByYears, dataOfIncomeByDate } = useMemo(
    () => incomeCalc(incomeOfEventsByDate, incomeOfInternalByDate),
    [incomeOfEventsByDate, incomeOfInternalByDate]
  )

  const years = useMemo(
    () => Object.keys(incomeAverageByYears).sort((a, b) => a - b),
    [incomeAverageByYears]
  )

  useEffect(() => {
    if (years.length > 0) {
      const lastIncomeYearData =
        dataOfIncomeByDate[dataOfIncomeByDate.length - 1].data
      const afterLastIncomeIndex = lastIncomeYearData.findIndex(
        ({ y }) => y === null
      )
      const lastIncomeData =
        lastIncomeYearData[
          afterLastIncomeIndex > 0
            ? afterLastIncomeIndex - 1
            : afterLastIncomeIndex === -1
            ? 11
            : 0
        ]
      setMonth(monthsObj[lastIncomeData.x].index)
      setYear(Number(lastIncomeData.year))
    }
  }, [years, dataOfIncomeByDate])

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto">
      {years.length > 0 ? (
        <>
          <LineChart
            title="Чистая прибыль по месяцам"
            onClick={(point, event) => {
              // console.log({ point, event })
              setMonth(monthsObj[point.data.x].index)
              setYear(Number(point.serieId))
            }}
            colors={{ scheme: 'category10' }}
            pointSymbol={({ borderColor, borderWidth, color, datum, size }) => (
              <circle
                r={
                  datum.year == year && datum?.x === MONTHS[month]
                    ? size
                    : size / 2
                }
                fill={color}
                stroke={borderColor}
                strokeWidth={borderWidth}
                style={{ pointerEvents: 'none' }}
              />
            )}
            data={dataOfIncomeByDate}
            // xAxisLegend="Месяц"
            yAxisLegend="Прибыль, ₽"
            // enableSlices="x"
            markers={dataOfIncomeByDate.map(({ id }, index) => ({
              axis: 'y',
              legend: `${incomeAverageByYears[id]?.toFixed(0)} ₽`,
              // position: 'left',
              legendOffsetX: -8,
              legendOffsetY: 0,
              // legendOrientation: 'vertical',
              textStyle: {
                fill: nivoColors[index],
                fontSize: 12,
                textAnchor: 'start',
                // margin: '20 0 0 0',
              },
              lineStyle: {
                stroke: nivoColors[index],
                strokeWidth: 1,
                strokeDasharray: '8 6',
              },
              value: incomeAverageByYears[id],
            }))}
            tooltip={(data) => {
              // console.log('data :>> ', data)
              return (
                <div
                  className="flex flex-col"
                  style={{
                    background: 'white',
                    padding: '5px 10px',
                    border: '1px solid',
                    borderColor: data.point.serieColor,
                  }}
                >
                  <strong>
                    <span>
                      {upperCaseFirst(monthsObj[data.point.data.x].name)}{' '}
                    </span>
                    <span
                      style={{
                        color: data.point.serieColor,
                        padding: '3px 0',
                      }}
                    >
                      {data.point.serieId}
                    </span>
                  </strong>
                  <div className="text-center text-black">{`${data.point.data.yFormatted} ₽`}</div>
                  {/* {slice.points.map((point) => ( */}
                  {/* <div
                key={data.point.id}
                style={{
                  color: data.point.serieColor,
                  padding: '3px 0',
                }}
              >
                <strong>{data.point.serieId}</strong>
                <span className="pl-2 text-black">{`${data.point.data.yFormatted} ₽`}</span>
              </div> */}
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

          <div className="flex w-full gap-x-1">
            <MonthSelector month={month} onChange={setMonth} />
            <YearSelector year={year} onChange={setYear} years={years} />
          </div>
          <div className="w-full">
            <div>Кол-во мероприятий: {filteredEvents.length}</div>
            <div>
              Доход с мероприятий:{' '}
              {incomeOfEventsByDate[year]
                ? incomeOfEventsByDate[year][month]
                : 0}{' '}
              ₽
            </div>
            <div>
              Внутренние:{' '}
              {incomeOfInternalByDate[year]
                ? incomeOfInternalByDate[year][month]
                : 0}{' '}
              ₽
            </div>
            <div>
              ИТОГО:{' '}
              {(incomeOfInternalByDate[year]
                ? incomeOfInternalByDate[year][month]
                : 0) +
                (incomeOfEventsByDate[year]
                  ? incomeOfEventsByDate[year][month]
                  : 0)}{' '}
              ₽
            </div>
            <div className="mt-5">
              Средний доход в месяц в {year} году:{' '}
              {incomeAverageByYears[year]?.toFixed(2)} ₽
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          Для формирования финансовой статистики необходимо завершить и закрыть
          хотябы одно мероприятие
        </div>
      )}
    </div>
  )
}

export default StatisticsFinanceContent
