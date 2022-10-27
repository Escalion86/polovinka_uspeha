import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import { ResponsiveStream } from '@nivo/stream'
import usersAtom from '@state/atoms/usersAtom'
import { H3 } from '@components/tags'

const StreamChart = ({
  title,
  data,
  colors,
  labels,
  axisBottom = true,
  axisLeft = true,
  legend = true,
}) => {
  if (!data || data.length === 0) return null
  const keys = Object.keys(data[0])
  return (
    <div className="w-full h-[340px]">
      {title && <H3>{title}</H3>}
      <ResponsiveStream
        data={data}
        // height={340}
        // width={340}
        keys={keys}
        margin={{
          top: 20,
          right: 25,
          bottom: legend ? 12 + 18 * keys.length : 20,
          left: 35 + (axisLeft ? 20 : 0),
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={
          axisBottom
            ? {
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisBottom ?? '',
                legendOffset: 36,
              }
            : null
        }
        axisLeft={
          axisLeft
            ? {
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisLeft ?? '',
                legendOffset: -40,
              }
            : null
        }
        enableGridX={false}
        enableGridY={false}
        offsetType="none"
        colors={(e) => colors[e.id]}
        fillOpacity={0.85}
        borderColor={{ theme: 'background' }}
        label={(e) => labels[e.id]}
        // dotSize={8}
        // dotColor={{ from: 'color' }}
        // dotBorderWidth={2}
        // dotBorderColor={{
        //   from: 'color',
        //   modifiers: [['darker', 0.7]],
        // }}
        // tooltip={(e) => (
        //   <div
        //     style={{
        //       padding: 12,
        //       // color,
        //       background: '#222222',
        //     }}
        //   >
        //     <span>Look, I'm custom :)</span>
        //     <br />
        //     <strong>
        //       {id}: {value}
        //     </strong>
        //   </div>
        // )}
        legends={
          legend
            ? [
                {
                  anchor: 'bottom',
                  direction: 'column',
                  justify: false,
                  translateX: -5,
                  translateY: 65,
                  itemsSpacing: 0,
                  itemWidth: 150,
                  itemHeight: 18,
                  itemTextColor: '#333',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  // symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]
            : []
        }
      />
    </div>
  )
}

export default StreamChart
