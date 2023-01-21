import { ResponsiveStream } from '@nivo/stream'
import { H3 } from '@components/tags'

const GridX = ({ slices, linesOnX }) => {
  return linesOnX.map((line) => (
    <g key={'line' + line.index}>
      {(line.index === 0 || !!line.index) && (
        <line
          x1={slices[line.index].x}
          y1="300"
          x2={slices[line.index].x}
          y2="0"
          stroke="#7a5151"
        />
      )}
      {!!line?.text && (line.index === 0 || !!line.index) && (
        <text
          x={slices[line.index].x}
          y="310"
          // className="text-2xl tablet:text-4xl laptop:text-5xl"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="smaller"
          // font-weight="lighter"
          fill="#7a5151"
          // style={{
          //   fontSize: '36px',
          // }}
          // fill="black"
        >
          {line.text}
        </text>
      )}
    </g>
  ))
}

const StreamChart = ({
  title,
  data,
  colors,
  labels,
  axisBottom = true,
  axisLeft = true,
  legend = true,
  linesOnX,
  tooltipCaptions,
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
        order="reverse"
        enableGridX={true}
        enableGridY={false}
        offsetType="none"
        colors={(e) => colors[e.id]}
        fillOpacity={0.85}
        borderColor={{ theme: 'background' }}
        label={(e) => labels[e.id]}
        layers={[
          'grid',
          'axes',
          'layers',
          'dots',
          'slices',
          'legends',
          ({ slices }) => GridX({ slices, linesOnX }),
        ]}
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
        // enableStackTooltip={false}
        stackTooltip={(props) => {
          // console.log('props', props)
          const { stack, index } = props.slice
          // const labelsKeys = Object.keys(labels)
          return (
            <div
              style={{
                backgroundColor: 'white',
                color: 'inherit',
                fontSize: 'inherit',
                borderRadius: 2,
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 2px',
                padding: '5px 9px',
              }}
            >
              <div className="w-full italic font-bold text-center">
                {tooltipCaptions[index]}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {stack
                    // .sort((a, b) => {
                    //   // console.log('a', a)
                    //   // console.log('labelsKeys', labelsKeys)
                    //   return labelsKeys.indexOf(a.layerId) >
                    //     labelsKeys.indexOf(b.layerId)
                    //     ? 1
                    //     : -1
                    // })
                    .map((item, index) => {
                      // console.log('item', item)
                      return (
                        <tr key={item.layerLabel + item.index + index}>
                          <td style={{ padding: '3px 5px' }}>
                            <span
                              style={{
                                display: 'block',
                                width: 12,
                                height: 12,
                                backgroundColor: item.color,
                              }}
                            ></span>
                          </td>
                          <td style={{ padding: '3px 5px' }}>
                            {item.layerLabel}
                          </td>
                          <td style={{ padding: '3px 5px' }}>{item.value}</td>
                        </tr>
                      )
                    })}
                  <tr>
                    <td style={{ padding: '3px 5px' }}>
                      <span
                        style={{
                          display: 'block',
                          width: 12,
                          height: 12,
                          // backgroundColor: item.color,
                        }}
                      ></span>
                    </td>
                    <td style={{ padding: '3px 5px', fontWeight: 'bold' }}>
                      ВСЕГО
                    </td>
                    <td style={{ padding: '3px 5px', fontWeight: 'bold' }}>
                      {stack.reduce((acc, obj) => acc + obj.value, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        }}
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
