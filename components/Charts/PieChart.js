import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import { Pie } from '@nivo/pie'
import usersAtom from '@state/atoms/usersAtom'
import { H2, H3 } from '@components/tags'

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  let total = 0
  dataWithArc.forEach((datum) => {
    total += datum.value
  })
  // return <>{total}</>
  return (
    <text
      x={centerX}
      y={centerY}
      className="text-2xl tablet:text-4xl laptop:text-5xl"
      textAnchor="middle"
      dominantBaseline="central"
      // style={{
      //   fontSize: '36px',
      // }}
      // fill="black"
    >
      {total}
    </text>
  )
}

const PieChart = ({ title, data }) => {
  return (
    <div className="w-[340px]">
      {title && <H3>{title}</H3>}
      {/* <div className="h-80"> */}
      <Pie
        height={320 + 18 * data.length}
        width={340}
        data={data.sort((a, b) => (a.value > b.value ? -1 : 1))}
        margin={{ top: 0, right: 20, bottom: 18 * data.length, left: 20 }}
        innerRadius={0.6}
        enableArcLinkLabels={false}
        // enableRadialLabels={false}
        // enableSlicesLabels={false}
        // enableArcLabels={false}
        // arcLinkLabel={(d) => `${d.id} (${d.formattedValue})`}
        sortByValue={true}
        activeInnerRadiusOffset={4}
        layers={[
          'arcs',
          'arcLabels',
          'arcLinkLabels',
          'legends',
          CenteredMetric,
        ]}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={4}
        borderWidth={1}
        // borderColor={{
        //   from: 'color',
        //   modifiers: [['darker', 0.2]],
        // }}
        // arcLinkLabelsSkipAngle={10}
        // arcLinkLabelsTextColor="#333333"
        // arcLinkLabelsThickness={2}
        // arcLinkLabelsColor={{ from: 'color' }}
        // arcLabelsSkipAngle={10}
        colors={data[0].color ? { datum: 'data.color' } : { scheme: 'set3' }}
        // arcLabelsTextColor={{
        //   from: 'color',
        //   modifiers: [['darker', 2]],
        // }}
        // defs={[
        //   {
        //     id: 'dots',
        //     type: 'patternDots',
        //     background: 'inherit',
        //     color: 'rgba(255, 255, 255, 0.3)',
        //     size: 4,
        //     padding: 1,
        //     stagger: true,
        //   },
        //   {
        //     id: 'lines',
        //     type: 'patternLines',
        //     background: 'inherit',
        //     color: 'rgba(255, 255, 255, 0.3)',
        //     rotation: -45,
        //     lineWidth: 6,
        //     spacing: 10,
        //   },
        // ]}
        // fill={[
        //   {
        //     match: {
        //       id: 'ruby',
        //     },
        //     id: 'dots',
        //   },
        //   {
        //     match: {
        //       id: 'c',
        //     },
        //     id: 'dots',
        //   },
        //   {
        //     match: {
        //       id: 'go',
        //     },
        //     id: 'dots',
        //   },
        //   {
        //     match: {
        //       id: 'python',
        //     },
        //     id: 'dots',
        //   },
        //   {
        //     match: {
        //       id: 'scala',
        //     },
        //     id: 'lines',
        //   },
        //   {
        //     match: {
        //       id: 'lisp',
        //     },
        //     id: 'lines',
        //   },
        //   {
        //     match: {
        //       id: 'elixir',
        //     },
        //     id: 'lines',
        //   },
        //   {
        //     match: {
        //       id: 'javascript',
        //     },
        //     id: 'lines',
        //   },
        // ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'column',
            justify: false,
            translateX: 0,
            translateY: 18 * data.length,
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
        ]}
      />
      {/* </div> */}
    </div>
  )
}

export default PieChart
